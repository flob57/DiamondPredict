'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const LOCAL_TZ = 'Europe/Paris';
let TODAY = localDateKey(new Date());
let matches = [];
let usingFallback = false;

const store = {
  favorites: JSON.parse(localStorage.getItem('dp05-favorites') || '[]'),
  compact: JSON.parse(localStorage.getItem('dp05-compact') ?? 'false'),
  remoteLogos: JSON.parse(localStorage.getItem('dp05-remote-logos') ?? 'true')
};

const weights = [['Bilan saison', 70], ['Avantage domicile', 20], ['Lanceur annoncé', 10]];
const alerts = [{ icon: '⚾', title: 'Données MLB réelles', text: 'Calendrier, horaires, scores, statuts et lanceurs annoncés proviennent maintenant de la MLB.', time: 'actif' }];

function localDateKey(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: LOCAL_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
function parseDate(value) { return new Date(`${value}T12:00:00`); }
function formatDate(value) { return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(parseDate(value)); }
function formatGameTime(iso) { return new Intl.DateTimeFormat('fr-FR', { timeZone: LOCAL_TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso)); }
function fmt(v) { return Number(v).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function safeNumber(v, fallback = 0) { const n = Number(v); return Number.isFinite(n) ? n : fallback; }

function logoRemote(code) {
  const aliases = { SD: 'sd', SF: 'sf', KC: 'kc', TB: 'tb', CWS: 'chw', WSH: 'wsh', AZ: 'ari' };
  return `https://a.espncdn.com/i/teamlogos/mlb/500/${aliases[code] || code.toLowerCase()}.png`;
}
function localLogo(code) { return `assets/logos/${code.toLowerCase()}.png`; }
function logo(team, size = 'small') {
  const src = store.remoteLogos ? logoRemote(team.code) : localLogo(team.code);
  return `<img class="team-logo ${size}" src="${src}" alt="Logo ${team.name}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="team-fallback ${size}" hidden>${team.code}</span>`;
}

function teamFromSide(side, probability) {
  const t = side.team || {};
  const record = side.leagueRecord || {};
  const p = side.probablePitcher || {};
  return {
    id: t.id,
    code: t.abbreviation || (t.name || 'MLB').slice(0, 3).toUpperCase(),
    name: t.name || 'Équipe MLB',
    record: record.wins != null ? `${record.wins}-${record.losses}` : 'Bilan indisponible',
    pct: safeNumber(record.pct, 0.5),
    pitcher: p.fullName || 'Lanceur non annoncé',
    hand: '—', probability,
    era: '—', whip: '—', fip: '—', k9: '—', bb9: '—', wl: '—', last5: '—',
    score: side.score ?? null,
    winner: Boolean(side.isWinner)
  };
}

function preliminaryProbabilities(awaySide, homeSide) {
  const awayPct = safeNumber(awaySide.leagueRecord?.pct, 0.5);
  const homePct = safeNumber(homeSide.leagueRecord?.pct, 0.5);
  const delta = (homePct - awayPct) * 70 + 3;
  const home = Math.max(30, Math.min(70, Math.round(50 + delta)));
  return { away: 100 - home, home };
}

function mapGame(game) {
  const probs = preliminaryProbabilities(game.teams.away, game.teams.home);
  const away = teamFromSide(game.teams.away, probs.away);
  const home = teamFromSide(game.teams.home, probs.home);
  const detailed = game.status?.detailedState || 'Programmé';
  const isFinal = ['Final', 'Game Over', 'Completed Early'].includes(detailed);
  const isLive = ['In Progress', 'Manager challenge', 'Delayed'].includes(detailed) || game.status?.abstractGameState === 'Live';
  const score = away.score != null && home.score != null ? `${away.score}–${home.score}` : '—';
  const date = localDateKey(new Date(game.gameDate));
  const fav = probs.home >= probs.away ? home : away;
  const edge = Math.abs(probs.home - probs.away);
  return {
    id: game.gamePk,
    date,
    iso: game.gameDate,
    time: formatGameTime(game.gameDate),
    venue: game.venue?.name || 'Stade à confirmer',
    weather: 'Météo non connectée',
    away, home,
    status: detailed,
    isFinal, isLive,
    inning: game.linescore?.currentInningOrdinal || '',
    market: null,
    confidence: edge >= 18 ? 'forte' : edge >= 8 ? 'moyenne' : 'faible',
    rating: Math.min(8.5, Math.round((5.5 + edge / 10) * 10) / 10),
    edge: 0,
    predictedScore: isFinal || isLive ? score : 'Non calculé',
    total: away.score != null && home.score != null ? away.score + home.score : null,
    bookmakers: [], trend: [],
    factors: [['Bilan réel des équipes', `${fav.probability} %`], ['Avantage domicile', '+3 pts'], ['Lanceurs annoncés', away.pitcher !== 'Lanceur non annoncé' && home.pitcher !== 'Lanceur non annoncé' ? 'Confirmés' : 'Partiels']],
    form: 'À connecter dans la prochaine étape', bullpen: 'À connecter', h2h: 'À connecter', homeAway: 'À connecter', streak: 'À connecter'
  };
}

async function loadRealSchedule() {
  const start = TODAY;
  const endDate = new Date(`${TODAY}T12:00:00`); endDate.setDate(endDate.getDate() + 6);
  const end = localDateKey(endDate);
  const response = await fetch(`/api/mlb?start=${start}&end=${end}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const games = (data.dates || []).flatMap(d => d.games || []);
  matches = games.map(mapGame).sort((a, b) => new Date(a.iso) - new Date(b.iso));
  if (!matches.length) throw new Error('Aucun match MLB trouvé pour cette période.');
  $('#dataStatus').innerHTML = '<i></i>Données MLB réelles';
  $('#dataStatus').title = `Actualisé : ${new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(data.fetchedAt))}`;
}

function favoriteTeam(m) { return m.home.probability >= m.away.probability ? m.home : m.away; }
function underdogTeam(m) { return favoriteTeam(m) === m.home ? m.away : m.home; }
function confidenceLabel(v) { return v.charAt(0).toUpperCase() + v.slice(1); }
function statusLabel(m) {
  if (m.isFinal) return `Terminé • ${m.away.score}–${m.home.score}`;
  if (m.isLive) return `EN DIRECT${m.inning ? ` • ${m.inning}` : ''} • ${m.away.score ?? 0}–${m.home.score ?? 0}`;
  return m.status;
}
function teamRow(team, fav) {
  return `<div class="team-row"><div class="team-name">${logo(team)}<div class="team-copy"><strong>${team.name}</strong><small>${team.record} • ${team.pitcher}</small></div></div><div class="probability ${team.code === fav.code ? 'favorite-prob' : ''}">${team.probability} %</div></div>`;
}

function matchCard(m) {
  const fav = favoriteTeam(m), saved = store.favorites.includes(m.id);
  return `<article class="match-card"><div class="match-card-header"><div><p class="eyebrow">${formatDate(m.date)}</p><div class="match-time">${m.time} • ${m.venue}</div></div><span class="confidence ${m.isLive ? 'forte' : m.confidence}">${statusLabel(m)}</span></div><div class="teams">${teamRow(m.away, fav)}${teamRow(m.home, fav)}</div><div class="victory-labels"><span>${m.away.code} ${m.away.probability}%</span><span>${m.home.probability}% ${m.home.code}</span></div><div class="victory-bar"><span style="width:${m.away.probability}%"></span><span style="width:${m.home.probability}%"></span></div><div class="quick-stats"><div><span>${m.isFinal || m.isLive ? 'Score réel' : 'Score'}</span><strong>${m.predictedScore}</strong></div><div><span>Marché</span><strong>—</strong></div><div><span>Value</span><strong>—</strong></div><div><span>Note prélim.</span><strong>${m.rating}/10</strong></div></div><div class="value-callout no-value"><span>Estimation préliminaire sans cotes</span><strong>MLB réel</strong></div><div class="card-actions"><button class="primary-button" data-analysis="${m.id}" type="button">Voir le match</button><button class="secondary-button" data-save="${m.id}" type="button">${saved ? '★' : '☆'}</button></div></article>`;
}

function renderDashboard() {
  const today = matches.filter(m => m.date === TODAY);
  const upcoming = matches.filter(m => !m.isFinal);
  const featured = upcoming[0] || matches[0];
  $('#todayCount').textContent = today.length;
  $('#valueCount').textContent = matches.filter(m => m.isLive).length;
  $('#bestProbability').textContent = matches.length ? `${Math.max(...matches.map(m => favoriteTeam(m).probability))} %` : '—';
  if (!featured) return;
  $('#featuredTitle').textContent = `${featured.away.name} – ${featured.home.name}`;
  $('#featuredOpen').dataset.analysis = featured.id;
  $('#featuredMatch').innerHTML = `<div class="featured-match"><div class="featured-team">${logo(featured.away, '')}<div><strong>${featured.away.name}</strong><small>${featured.away.record} • ${featured.away.pitcher}</small></div></div><div class="versus-center"><span>${statusLabel(featured)}</span><strong>${featured.time}</strong><small>${featured.venue}</small></div><div class="featured-team right"><div><strong>${featured.home.name}</strong><small>${featured.home.record} • ${featured.home.pitcher}</small></div>${logo(featured.home, '')}</div></div><div class="featured-probabilities"><strong>${featured.away.probability}%</strong><div class="split-bar"><span style="width:${featured.away.probability}%"></span><span style="width:${featured.home.probability}%"></span></div><strong>${featured.home.probability}%</strong></div><div class="featured-stats"><div><span>Source</span><strong>MLB</strong></div><div><span>Statut</span><strong>${featured.status}</strong></div><div><span>Score</span><strong>${featured.predictedScore}</strong></div><div><span>Modèle</span><strong>Préliminaire</strong></div></div>`;
  const list = upcoming.slice(0, 5);
  $('#topValueStrip').innerHTML = list.map((m, i) => `<button class="value-chip" data-analysis="${m.id}" type="button"><div class="value-chip-head"><span class="rank-dot">${i + 1}</span><span class="value-number">${m.time}</span></div><strong>${m.away.code} – ${m.home.code}</strong><small>${formatDate(m.date)} • ${m.status}</small></button>`).join('');
  const strongest = [...matches].sort((a,b)=>favoriteTeam(b).probability-favoriteTeam(a).probability).slice(0,4);
  const balanced = [...matches].sort((a,b)=>Math.abs(a.home.probability-a.away.probability)-Math.abs(b.home.probability-b.away.probability)).slice(0,4);
  $('#strongestList').innerHTML = strongest.map(rankingRow).join('');
  $('#balancedList').innerHTML = balanced.map(rankingRow).join('');
  renderAlerts();
}
function rankingRow(m) { const fav = favoriteTeam(m); return `<button class="ranking-row" data-analysis="${m.id}" type="button">${logo(fav,'tiny')}<span><strong>${fav.name}</strong><small>vs ${underdogTeam(m).name} • ${m.time}</small></span><span class="ranking-value"><strong>${fav.probability} %</strong><small>${statusLabel(m)}</small></span></button>`; }
function renderAlerts() { const markup = alerts.map(a=>`<div class="alert-item"><span class="alert-icon">${a.icon}</span><div><strong>${a.title}</strong><p>${a.text}</p></div><time>${a.time}</time></div>`).join(''); $('#alertsList').innerHTML=markup; $('#notificationPanelList').innerHTML=markup; $('#notificationCount').hidden=true; }

function renderMatches() {
  const df=$('#dateFilter').value, conf=$('#confidenceFilter').value, q=$('#teamSearch').value.toLowerCase().trim(), sort=$('#sortFilter').value;
  const tomorrow=new Date(`${TODAY}T12:00:00`); tomorrow.setDate(tomorrow.getDate()+1); const tomorrowKey=localDateKey(tomorrow);
  const end3=new Date(`${TODAY}T12:00:00`); end3.setDate(end3.getDate()+3); const end3Key=localDateKey(end3);
  let list=matches.filter(m=>(df==='all'||df==='today'&&m.date===TODAY||df==='tomorrow'&&m.date===tomorrowKey||df==='3days'&&m.date>=TODAY&&m.date<=end3Key)&&(conf==='all'||m.confidence===conf)&&(!q||`${m.away.name} ${m.home.name}`.toLowerCase().includes(q)));
  const sorters={time:(a,b)=>new Date(a.iso)-new Date(b.iso),probability:(a,b)=>favoriteTeam(b).probability-favoriteTeam(a).probability,value:(a,b)=>Number(b.isLive)-Number(a.isLive),rating:(a,b)=>b.rating-a.rating};
  list.sort(sorters[sort]); $('#matchesGrid').innerHTML=list.length?list.map(matchCard).join(''):'<div class="empty-state">Aucun match ne correspond aux filtres.</div>';
}
function renderOdds() { $('#oddsList').innerHTML = `<div class="empty-state">Le calendrier et les résultats sont réels. Les cotes des bookmakers seront connectées dans la prochaine version avec une API dédiée.</div>`; }
function renderAnalysisList() { $('#modelWeights').innerHTML=weights.map(w=>`<div class="weight-item"><span>${w[0]}</span><strong>${w[1]} %</strong></div>`).join(''); $('#valueList').innerHTML=matches.filter(m=>!m.isFinal).map(m=>`<article class="value-card"><div class="odds-head"><div><p class="eyebrow">${m.away.code} – ${m.home.code}</p><h3>${m.away.name} / ${m.home.name}</h3></div><span class="value-badge negative">Sans cotes</span></div><div class="scoreline"><div><small>${m.away.code}</small><strong>${m.away.probability} %</strong></div><div class="rating">${m.rating}/10</div><div><small>${m.home.code}</small><strong>${m.home.probability} %</strong></div></div><div class="factor-mini">${m.factors.map(f=>`<div><span>${f[0]}</span><strong>${f[1]}</strong></div>`).join('')}</div><div class="card-actions"><button class="primary-button" data-analysis="${m.id}" type="button">Ouvrir</button></div></article>`).join(''); }
function renderFavorites() { const list=matches.filter(m=>store.favorites.includes(m.id)); $('#favoritesGrid').innerHTML=list.length?list.map(matchCard).join(''):'<div class="empty-state">Aucun match enregistré.</div>'; }
function renderHistory() { const finals=matches.filter(m=>m.isFinal); $('#historyMetrics').innerHTML=[['Matchs chargés',matches.length,'source MLB'],['Terminés',finals.length,'période affichée'],['En direct',matches.filter(m=>m.isLive).length,'actualisation manuelle'],['Cotes','Non connectées','prochaine étape']].map(x=>`<article class="metric-card"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join(''); $('#calibrationChart').innerHTML='<div class="empty-state">La calibration commencera lorsque les probabilités auront été enregistrées avant les matchs.</div>'; $('#historyRows').innerHTML=finals.map(m=>`<tr><td>${m.away.code} – ${m.home.code}</td><td>—</td><td>${m.away.score}–${m.home.score}</td><td>—</td><td><span class="value-badge positive">Terminé</span></td></tr>`).join('')||'<tr><td colspan="5">Aucun résultat final sur la période.</td></tr>'; }

function pitcherCard(t) { return `<article class="pitcher-card"><div class="pitcher-head"><div class="pitcher-avatar">⚾</div><div><strong>${t.pitcher}</strong><small>${t.hand}</small></div></div><div class="pitcher-stats"><div><span>ERA</span><strong>—</strong></div><div><span>WHIP</span><strong>—</strong></div><div><span>FIP</span><strong>—</strong></div></div><small>Les statistiques détaillées du lanceur seront ajoutées ensuite.</small></article>`; }
function showAnalysis(m) { $('#dialogTitle').textContent=`${m.away.name} – ${m.home.name}`; $('#dialogContent').innerHTML=`<section class="analysis-hero"><div class="analysis-team">${logo(m.away,'')}<div><strong>${m.away.name}</strong><small>${m.away.record} • ${m.away.pitcher}</small></div></div><div class="versus-center"><span>${formatDate(m.date)}</span><strong>${m.time}</strong><small>${m.venue} • ${statusLabel(m)}</small></div><div class="analysis-team right"><div><strong>${m.home.name}</strong><small>${m.home.record} • ${m.home.pitcher}</small></div>${logo(m.home,'')}</div></section><div class="featured-probabilities"><strong class="analysis-prob red">${m.away.probability}%</strong><div class="split-bar"><span style="width:${m.away.probability}%"></span><span style="width:${m.home.probability}%"></span></div><strong class="analysis-prob blue">${m.home.probability}%</strong></div><div class="featured-stats"><div><span>Statut</span><strong>${m.status}</strong></div><div><span>Score réel</span><strong>${m.isFinal||m.isLive?m.predictedScore:'—'}</strong></div><div><span>Cotes</span><strong>Non connectées</strong></div><div><span>Source</span><strong>MLB</strong></div></div><div class="analysis-grid"><section class="analysis-block"><h3>Estimation préliminaire</h3><div class="factor-list">${m.factors.map(f=>`<div class="factor"><span>${f[0]}</span><strong>${f[1]}</strong></div>`).join('')}</div></section><section class="analysis-block"><h3>Pitcher Center</h3><div class="pitcher-grid">${pitcherCard(m.away)}${pitcherCard(m.home)}</div></section></div><section class="analysis-block full"><h3>Ce qui est déjà réel</h3><p class="summary-callout">La date, l’heure française, le stade, le statut du match, le score, le bilan des équipes et les lanceurs probables annoncés proviennent du flux MLB. La probabilité affichée reste une estimation simple basée sur les bilans et l’avantage du terrain ; elle ne doit pas encore être considérée comme un pronostic complet.</p></section>`; $('#analysisDialog').showModal(); }

function refreshAll(){renderDashboard();renderMatches();renderOdds();renderAnalysisList();renderFavorites();renderHistory();}
function switchView(view){$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));window.scrollTo({top:0,behavior:'smooth'});}
function toast(message){const n=$('#toast');n.textContent=message;n.classList.add('visible');setTimeout(()=>n.classList.remove('visible'),1800);}

async function bootstrap(){
  try { await loadRealSchedule(); }
  catch (error) { usingFallback=true; $('#dataStatus').innerHTML='<i></i>Connexion MLB impossible'; $('#matchesGrid').innerHTML=`<div class="empty-state">Impossible de charger le calendrier réel : ${error.message}. Vérifie que le dossier functions a bien été déployé sur Cloudflare Pages.</div>`; }
  refreshAll();
}

$('#compactToggle').checked=store.compact; $('#remoteLogosToggle').checked=store.remoteLogos; document.body.classList.toggle('compact',store.compact);
document.addEventListener('click',e=>{const a=e.target.closest('[data-analysis]');if(a){const m=matches.find(x=>x.id===Number(a.dataset.analysis));if(m)showAnalysis(m);}const s=e.target.closest('[data-save]');if(s){const id=Number(s.dataset.save);store.favorites=store.favorites.includes(id)?store.favorites.filter(x=>x!==id):[...store.favorites,id];localStorage.setItem('dp05-favorites',JSON.stringify(store.favorites));renderMatches();renderFavorites();toast(store.favorites.includes(id)?'Match ajouté aux favoris':'Match retiré');}const nav=e.target.closest('[data-view]');if(nav&&!a)switchView(nav.dataset.view);});
['dateFilter','confidenceFilter','sortFilter'].forEach(id=>$('#'+id).addEventListener('change',renderMatches)); $('#teamSearch').addEventListener('input',renderMatches);
$('#closeDialog').addEventListener('click',()=>$('#analysisDialog').close()); $('#analysisDialog').addEventListener('click',e=>{if(e.target===$('#analysisDialog'))$('#analysisDialog').close();});
$('#themeToggle').addEventListener('click',()=>{document.documentElement.classList.toggle('light');$('#themeToggle').textContent=document.documentElement.classList.contains('light')?'☀':'☾';});
$('#notificationButton').addEventListener('click',()=>$('#notificationPanel').classList.add('open')); $('#closeNotifications').addEventListener('click',()=>$('#notificationPanel').classList.remove('open'));
$('#compactToggle').addEventListener('change',e=>{store.compact=e.target.checked;document.body.classList.toggle('compact',store.compact);localStorage.setItem('dp05-compact',JSON.stringify(store.compact));});
$('#remoteLogosToggle').addEventListener('change',e=>{store.remoteLogos=e.target.checked;localStorage.setItem('dp05-remote-logos',JSON.stringify(store.remoteLogos));refreshAll();});
$('#clearFavorites').addEventListener('click',()=>{store.favorites=[];localStorage.setItem('dp05-favorites','[]');renderFavorites();renderMatches();});
$('#valueToggle').disabled=true; $('#alertsToggle').disabled=true; $('#markAlertsRead').hidden=true;
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
bootstrap();
