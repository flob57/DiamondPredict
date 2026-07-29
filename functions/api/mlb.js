const MLB_BASE = 'https://statsapi.mlb.com/api/v1';

function json(body, status = 200, cache = 'public, max-age=120') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': cache,
      'access-control-allow-origin': '*'
    }
  });
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || '');
}

function shiftDate(date, days) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

async function fetchMlb(path, ttl = 300) {
  const response = await fetch(`${MLB_BASE}${path}`, {
    headers: { 'user-agent': 'DiamondPredict/1.1 personal non-commercial project' },
    cf: { cacheTtl: ttl, cacheEverything: true }
  });
  if (!response.ok) throw new Error(`MLB Stats API ${response.status} sur ${path.split('?')[0]}`);
  return response.json();
}

function collectRecent(schedule, start, end) {
  const teams = {};
  for (const date of schedule.dates || []) {
    for (const game of date.games || []) {
      const state = game.status?.abstractGameState;
      if (state !== 'Final') continue;
      const away = game.teams?.away;
      const home = game.teams?.home;
      if (!away?.team?.id || !home?.team?.id) continue;
      const awayScore = Number(away.score ?? 0);
      const homeScore = Number(home.score ?? 0);
      const entries = [
        { side: away, opponent: home, score: awayScore, allowed: homeScore, isHome: false },
        { side: home, opponent: away, score: homeScore, allowed: awayScore, isHome: true }
      ];
      for (const entry of entries) {
        const id = String(entry.side.team.id);
        const row = teams[id] ||= { games: [], home: { wins: 0, losses: 0 }, away: { wins: 0, losses: 0 } };
        const win = entry.score > entry.allowed;
        row.games.push({ date: game.gameDate, win, runsFor: entry.score, runsAgainst: entry.allowed, isHome: entry.isHome });
        const split = entry.isHome ? row.home : row.away;
        split[win ? 'wins' : 'losses'] += 1;
      }
    }
  }
  for (const row of Object.values(teams)) {
    row.games.sort((a, b) => new Date(b.date) - new Date(a.date));
    const last10 = row.games.slice(0, 10);
    const last5 = row.games.slice(0, 5);
    const summarize = games => ({
      games: games.length,
      wins: games.filter(g => g.win).length,
      losses: games.filter(g => !g.win).length,
      winPct: games.length ? games.filter(g => g.win).length / games.length : null,
      runsFor: games.reduce((s, g) => s + g.runsFor, 0),
      runsAgainst: games.reduce((s, g) => s + g.runsAgainst, 0),
      runDiffPerGame: games.length ? games.reduce((s, g) => s + g.runsFor - g.runsAgainst, 0) / games.length : null
    });
    row.last5 = summarize(last5);
    row.last10 = summarize(last10);
    row.home.pct = row.home.wins + row.home.losses ? row.home.wins / (row.home.wins + row.home.losses) : null;
    row.away.pct = row.away.wins + row.away.losses ? row.away.wins / (row.away.wins + row.away.losses) : null;
    row.lastGameDate = row.games[0]?.date || null;
    delete row.games;
  }
  return { period: { start, end }, teams };
}

function parseTeamStats(data) {
  const out = {};
  for (const block of data.stats || []) {
    const group = block.group?.displayName?.toLowerCase() || block.group?.displayName || '';
    for (const split of block.splits || []) {
      const id = split.team?.id;
      if (!id) continue;
      const row = out[String(id)] ||= {};
      const stat = split.stat || {};
      if (group.includes('hitting')) {
        row.hitting = {
          runs: stat.runs ?? null,
          homeRuns: stat.homeRuns ?? null,
          avg: stat.avg ?? null,
          obp: stat.obp ?? null,
          slg: stat.slg ?? null,
          ops: stat.ops ?? null,
          plateAppearances: stat.plateAppearances ?? null
        };
      }
      if (group.includes('pitching')) {
        row.pitching = {
          era: stat.era ?? null,
          whip: stat.whip ?? null,
          strikeoutsPer9Inn: stat.strikeoutsPer9Inn ?? null,
          walksPer9Inn: stat.walksPer9Inn ?? null,
          homeRunsPer9: stat.homeRunsPer9 ?? null,
          saveOpportunities: stat.saveOpportunities ?? null,
          saves: stat.saves ?? null
        };
      }
    }
  }
  return out;
}

function parsePitchers(data) {
  const out = {};
  for (const person of data.people || []) {
    const split = person.stats?.flatMap(s => s.splits || [])[0];
    const stat = split?.stat || {};
    out[String(person.id)] = {
      id: person.id,
      name: person.fullName,
      era: stat.era ?? null,
      whip: stat.whip ?? null,
      wins: stat.wins ?? null,
      losses: stat.losses ?? null,
      inningsPitched: stat.inningsPitched ?? null,
      strikeOuts: stat.strikeOuts ?? null,
      baseOnBalls: stat.baseOnBalls ?? null,
      homeRuns: stat.homeRuns ?? null,
      strikeoutsPer9Inn: stat.strikeoutsPer9Inn ?? null,
      walksPer9Inn: stat.walksPer9Inn ?? null,
      gamesStarted: stat.gamesStarted ?? null
    };
  }
  return out;
}

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url);
    const today = new Date().toISOString().slice(0, 10);
    const start = validDate(url.searchParams.get('start')) ? url.searchParams.get('start') : today;
    const end = validDate(url.searchParams.get('end')) ? url.searchParams.get('end') : shiftDate(start, 6);
    const span = (new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000;
    if (span < 0 || span > 14) return json({ error: 'La période doit être comprise entre 0 et 14 jours.' }, 400, 'no-store');

    const season = Number(start.slice(0, 4));
    const scheduleParams = new URLSearchParams({
      sportId: '1', startDate: start, endDate: end,
      hydrate: 'team,probablePitcher,linescore,venue'
    });
    const schedule = await fetchMlb(`/schedule?${scheduleParams}`, 90);
    const games = (schedule.dates || []).flatMap(d => d.games || []);
    const pitcherIds = [...new Set(games.flatMap(g => [g.teams?.away?.probablePitcher?.id, g.teams?.home?.probablePitcher?.id]).filter(Boolean))];

    const recentStart = shiftDate(start, -35);
    const recentEnd = shiftDate(start, -1);
    const recentParams = new URLSearchParams({ sportId: '1', startDate: recentStart, endDate: recentEnd, hydrate: 'team,linescore' });

    const teamStatsPath = `/teams/stats?stats=season&group=hitting,pitching&sportIds=1&season=${season}`;
    const pitcherPath = pitcherIds.length
      ? `/people?personIds=${pitcherIds.join(',')}&hydrate=${encodeURIComponent(`stats(group=[pitching],type=[season],season=${season})`)}`
      : null;

    const [recentResult, teamStatsResult, pitcherResult] = await Promise.allSettled([
      fetchMlb(`/schedule?${recentParams}`, 600),
      fetchMlb(teamStatsPath, 21600),
      pitcherPath ? fetchMlb(pitcherPath, 21600) : Promise.resolve({ people: [] })
    ]);

    const warnings = [];
    const recent = recentResult.status === 'fulfilled'
      ? collectRecent(recentResult.value, recentStart, recentEnd)
      : { period: { start: recentStart, end: recentEnd }, teams: {} };
    if (recentResult.status === 'rejected') warnings.push('Forme récente indisponible');

    const teamStats = teamStatsResult.status === 'fulfilled' ? parseTeamStats(teamStatsResult.value) : {};
    if (teamStatsResult.status === 'rejected') warnings.push('Statistiques collectives indisponibles');

    const pitchers = pitcherResult.status === 'fulfilled' ? parsePitchers(pitcherResult.value) : {};
    if (pitcherResult.status === 'rejected') warnings.push('Statistiques des lanceurs indisponibles');

    return json({
      source: 'MLB Stats API', fetchedAt: new Date().toISOString(), season,
      freeData: true,
      advanced: { recent, teamStats, pitchers, warnings },
      ...schedule
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Erreur inconnue' }, 500, 'no-store');
  }
}
