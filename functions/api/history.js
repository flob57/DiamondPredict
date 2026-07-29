const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{'content-type':'application/json;charset=UTF-8','cache-control':'public,max-age=1800'}});
const scoreOf=t=>{const n=Number(t?.score);return Number.isFinite(n)?n:null};
export async function onRequestGet({request}){
  const u=new URL(request.url),days=Math.min(180,Math.max(7,Number(u.searchParams.get('days')||90)));
  const end=new Date(),start=new Date();start.setDate(start.getDate()-days);
  const today=end.toISOString().slice(0,10);
  const q=new URL('https://statsapi.mlb.com/api/v1/schedule');
  q.searchParams.set('sportId','1');q.searchParams.set('startDate',start.toISOString().slice(0,10));q.searchParams.set('endDate',today);
  q.searchParams.set('hydrate','team,linescore');
  const r=await fetch(q);if(!r.ok)return json({error:`MLB HTTP ${r.status}`},r.status);
  const d=await r.json();
  const games=(d.dates||[]).flatMap(x=>x.games||[]).filter(g=>{
    const date=g.officialDate||g.gameDate?.slice(0,10),a=scoreOf(g.teams?.away),h=scoreOf(g.teams?.home);
    return date&&date<=today&&(g.status?.abstractGameState==='Final'||g.status?.detailedState==='Final')&&a!==null&&h!==null;
  }).map(g=>{
    const awayScore=scoreOf(g.teams.away),homeScore=scoreOf(g.teams.home);
    return {id:g.gamePk,date:g.officialDate||g.gameDate.slice(0,10),status:g.status?.detailedState||'Final',
      away:{id:g.teams.away.team.id,name:g.teams.away.team.name,code:g.teams.away.team.abbreviation||'',score:awayScore},
      home:{id:g.teams.home.team.id,name:g.teams.home.team.name,code:g.teams.home.team.abbreviation||'',score:homeScore},
      winnerId:awayScore>homeScore?g.teams.away.team.id:g.teams.home.team.id};
  }).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
  return json({source:'MLB Stats API',generatedAt:new Date().toISOString(),games});
}
