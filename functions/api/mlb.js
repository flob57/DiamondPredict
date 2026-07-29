const MLB_BASE = 'https://statsapi.mlb.com/api/v1';

function json(body, status = 200, cache = 'public, max-age=60') {
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

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url);
    const today = new Date().toISOString().slice(0, 10);
    const start = validDate(url.searchParams.get('start')) ? url.searchParams.get('start') : today;
    const fallbackEnd = new Date(`${start}T12:00:00Z`);
    fallbackEnd.setUTCDate(fallbackEnd.getUTCDate() + 6);
    const end = validDate(url.searchParams.get('end')) ? url.searchParams.get('end') : fallbackEnd.toISOString().slice(0, 10);

    const span = (new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000;
    if (span < 0 || span > 14) return json({ error: 'La période doit être comprise entre 0 et 14 jours.' }, 400, 'no-store');

    const params = new URLSearchParams({
      sportId: '1',
      startDate: start,
      endDate: end,
      hydrate: 'team,probablePitcher,linescore,venue'
    });
    const response = await fetch(`${MLB_BASE}/schedule?${params}`, {
      headers: { 'user-agent': 'DiamondPredict/0.5 personal project' },
      cf: { cacheTtl: 60, cacheEverything: true }
    });
    if (!response.ok) return json({ error: `MLB Stats API: ${response.status}` }, 502, 'no-store');
    const data = await response.json();
    return json({ source: 'MLB Stats API', fetchedAt: new Date().toISOString(), ...data });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Erreur inconnue' }, 500, 'no-store');
  }
}
