const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json;charset=UTF-8','cache-control':'public, max-age=900',...headers}});
export async function onRequestGet({env,request}){
  if(!env.ODDS_API_KEY)return json({configured:false,events:[],error:'Secret ODDS_API_KEY absent'},200);
  const incoming=new URL(request.url),region=incoming.searchParams.get('region')||'eu';
  const cache=await caches.open('diamondpredict-odds-v1'),cacheKey=new Request(`${incoming.origin}/api/odds-cache?region=${region}`);
  const hit=await cache.match(cacheKey);if(hit)return hit;
  const u=new URL('https://api.the-odds-api.com/v4/sports/baseball_mlb/odds');
  u.searchParams.set('apiKey',env.ODDS_API_KEY);u.searchParams.set('regions',region);u.searchParams.set('markets','h2h');u.searchParams.set('oddsFormat','decimal');u.searchParams.set('dateFormat','iso');
  const r=await fetch(u);const payload=await r.json().catch(()=>[]);
  if(!r.ok)return json({configured:true,events:[],error:payload?.message||`Odds API HTTP ${r.status}`},r.status);
  const response=json({configured:true,fetchedAt:new Date().toISOString(),region,remaining:r.headers.get('x-requests-remaining'),used:r.headers.get('x-requests-used'),events:payload});
  await cache.put(cacheKey,response.clone());return response;
}
