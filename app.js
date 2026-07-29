'use strict';

const TODAY = '2026-07-29';
const matches = [
  {
    id: 1, date: '2026-07-29', time: '19:05', venue: 'Yankee Stadium', weather: '28°C • vent 8 km/h',
    away: team('BOS','Boston Red Sox','58-48','Bryan Bello','RHP',42,3.42,1.21,3.65,8.7,2.1,'9-5','W W L W W'),
    home: team('NYY','New York Yankees','61-44','Carlos Rodón','LHP',58,2.91,1.05,2.83,10.8,2.5,'10-6','W W W L W'),
    market: 55, confidence: 'forte', rating: 8.2, edge: 3, predictedScore: '4–6', total: 9.3,
    bookmakers: [['Winamax',2.20,1.72],['Unibet',2.18,1.74],['Betclic',2.24,1.73]], trend:[1.85,1.83,1.84,1.81,1.79,1.76,1.72,1.74],
    factors:[['Lanceur partant','+8 %'],['Attaque à domicile','+5 %'],['Bullpen plus reposé','+4 %'],['Avantage du terrain','+2 %'],['Forme récente adverse','−3 %']],
    form:'NYY 7–3 • BOS 5–5', bullpen:'NYY 3,42 ERA • BOS 4,18 ERA', h2h:'NYY mène 6–4 sur les 10 derniers', homeAway:'NYY 34–20 à domicile • BOS 28–26 extérieur', streak:'NYY W2 • BOS L1'
  },
  {
    id: 2, date:'2026-07-29', time:'22:10', venue:'Dodger Stadium', weather:'24°C • ciel clair',
    away:team('SD','San Diego Padres','55-50','Michael King','RHP',35,3.71,1.19,3.62,9.5,2.8,'7-6','L W W L W'),
    home:team('LAD','Los Angeles Dodgers','67-39','Yoshinobu Yamamoto','RHP',65,2.97,1.03,2.88,10.2,2.2,'8-7','W W W W L'),
    market:62,confidence:'forte',rating:8.6,edge:3,predictedScore:'3–5',total:8.1,
    bookmakers:[['Winamax',2.70,1.51],['Unibet',2.74,1.50],['Betclic',2.66,1.52]],trend:[1.57,1.56,1.55,1.53,1.52,1.50],
    factors:[['Différentiel offensif','+7 %'],['Yamamoto','+6 %'],['Domicile','+3 %'],['Bullpen Dodgers','+2 %'],['Padres en progrès','−2 %']],
    form:'LAD 8–2 • SD 6–4',bullpen:'LAD 3,28 ERA • SD 3,74 ERA',h2h:'LAD mène 7–3',homeAway:'LAD 38–16 domicile • SD 27–27 extérieur',streak:'LAD W4 • SD W1'
  },
  {
    id:3,date:'2026-07-30',time:'01:35',venue:'Globe Life Field',weather:'31°C • toit fermé',
    away:team('HOU','Houston Astros','52-55','Framber Valdez','LHP',53,3.45,1.18,3.39,8.9,2.6,'7-6','W L W W L'),
    home:team('TEX','Texas Rangers','53-53','Nathan Eovaldi','RHP',47,3.25,1.16,3.31,9.1,2.3,'8-6','L W L W W'),
    market:51,confidence:'moyenne',rating:6.9,edge:2,predictedScore:'5–4',total:8.8,
    bookmakers:[['Winamax',1.87,1.95],['Unibet',1.88,1.94],['Betclic',1.86,1.96]],trend:[1.92,1.91,1.89,1.88,1.87],
    factors:[['Avantage lanceur','+3 %'],['Forme offensive','+2 %'],['Terrain','−1 %'],['Bullpen Rangers','−1 %']],
    form:'HOU 6–4 • TEX 5–5',bullpen:'HOU 3,88 ERA • TEX 3,76 ERA',h2h:'Égalité 5–5',homeAway:'TEX 29–24 domicile • HOU 24–29 extérieur',streak:'HOU L1 • TEX W2'
  },
  {
    id:4,date:'2026-07-30',time:'01:40',venue:'Citizens Bank Park',weather:'27°C • humide',
    away:team('MIA','Miami Marlins','42-64','Edward Cabrera','RHP',31,4.12,1.38,4.05,9.3,4.1,'4-9','L L W L L'),
    home:team('PHI','Philadelphia Phillies','65-41','Zack Wheeler','RHP',69,2.66,0.99,2.72,10.1,1.8,'11-4','W W L W W'),
    market:66,confidence:'forte',rating:9.1,edge:3,predictedScore:'2–6',total:7.9,
    bookmakers:[['Winamax',3.05,1.39],['Unibet',3.10,1.38],['Betclic',3.00,1.40]],trend:[1.43,1.42,1.41,1.39,1.38],
    factors:[['Wheeler élite','+9 %'],['Attaque Phillies','+7 %'],['Marlins extérieur','+3 %'],['Bullpen','+2 %']],
    form:'PHI 8–2 • MIA 3–7',bullpen:'PHI 3,31 ERA • MIA 4,46 ERA',h2h:'PHI mène 8–2',homeAway:'PHI 36–17 domicile • MIA 18–34 extérieur',streak:'PHI W2 • MIA L2'
  },
  {
    id:5,date:'2026-07-30',time:'02:10',venue:'Wrigley Field',weather:'22°C • vent sortant',
    away:team('ATL','Atlanta Braves','57-48','Spencer Schwellenbach','RHP',61,3.12,1.08,3.19,9.8,2.0,'9-5','W W W L W'),
    home:team('CHC','Chicago Cubs','56-50','Justin Steele','LHP',39,3.88,1.27,3.75,8.5,2.7,'6-8','L W L L W'),
    market:57,confidence:'forte',rating:8.0,edge:4,predictedScore:'5–3',total:8.6,
    bookmakers:[['Winamax',1.66,2.25],['Unibet',1.68,2.22],['Betclic',1.67,2.24]],trend:[1.72,1.71,1.69,1.68,1.66],
    factors:[['Lanceur Braves','+6 %'],['Puissance offensive','+5 %'],['Forme récente','+3 %'],['Vent favorable','+1 %']],
    form:'ATL 7–3 • CHC 4–6',bullpen:'ATL 3,44 ERA • CHC 3,92 ERA',h2h:'ATL mène 6–4',homeAway:'CHC 31–24 domicile • ATL 28–24 extérieur',streak:'ATL W1 • CHC W1'
  },
  {
    id:6,date:'2026-07-30',time:'03:40',venue:'T-Mobile Park',weather:'19°C • toit ouvert',
    away:team('TOR','Toronto Blue Jays','54-52','Kevin Gausman','RHP',57,3.44,1.15,3.33,10.0,2.4,'8-7','W L W W W'),
    home:team('SEA','Seattle Mariners','58-49','Luis Castillo','RHP',43,3.61,1.20,3.49,9.2,2.5,'7-7','L W L W L'),
    market:54,confidence:'moyenne',rating:7.5,edge:3,predictedScore:'4–3',total:7.4,
    bookmakers:[['Winamax',1.76,2.08],['Unibet',1.78,2.05],['Betclic',1.77,2.07]],trend:[1.82,1.81,1.80,1.78,1.76],
    factors:[['Gausman','+4 %'],['Forme Blue Jays','+3 %'],['Attaque Mariners','+1 %'],['Terrain Seattle','−2 %']],
    form:'TOR 7–3 • SEA 5–5',bullpen:'TOR 3,72 ERA • SEA 3,15 ERA',h2h:'TOR mène 6–4',homeAway:'SEA 34–21 domicile • TOR 25–27 extérieur',streak:'TOR W3 • SEA L1'
  },
  {
    id:7,date:'2026-07-31',time:'00:40',venue:'Rogers Centre',weather:'climatisé',
    away:team('TB','Tampa Bay Rays','50-56','Ryan Pepiot','RHP',40,3.76,1.22,3.69,9.0,2.9,'6-8','L L W W L'),
    home:team('TOR','Toronto Blue Jays','54-52','José Berríos','RHP',60,3.22,1.12,3.40,8.3,2.1,'9-6','W W L W W'),
    market:56,confidence:'forte',rating:8.1,edge:4,predictedScore:'3–5',total:8.2,
    bookmakers:[['Winamax',2.30,1.62],['Unibet',2.34,1.60],['Betclic',2.28,1.63]],trend:[1.68,1.67,1.65,1.62,1.60],
    factors:[['Berríos à domicile','+5 %'],['Attaque récente','+4 %'],['Bullpen','+2 %'],['Rays irréguliers','+1 %']],
    form:'TOR 7–3 • TB 4–6',bullpen:'TOR 3,72 ERA • TB 4,02 ERA',h2h:'TOR mène 7–3',homeAway:'TOR 31–22 domicile • TB 23–31 extérieur',streak:'TOR W2 • TB L1'
  },
  {
    id:8,date:'2026-07-31',time:'01:10',venue:'Citi Field',weather:'25°C • faible vent',
    away:team('MIL','Milwaukee Brewers','59-47','Freddy Peralta','RHP',49,3.18,1.09,3.26,11.0,3.1,'10-5','W L W L W'),
    home:team('NYM','New York Mets','60-46','Kodai Senga','RHP',51,3.21,1.17,3.38,9.7,3.0,'8-5','W W L W L'),
    market:50,confidence:'faible',rating:6.4,edge:1,predictedScore:'4–4',total:7.6,
    bookmakers:[['Winamax',1.92,1.90],['Unibet',1.93,1.89],['Betclic',1.91,1.91]],trend:[1.91,1.90,1.92,1.90,1.89],
    factors:[['Match très équilibré','0 %'],['Bullpen Brewers','+1 %'],['Domicile Mets','+1 %'],['Incertain offensivement','−1 %']],
    form:'MIL 6–4 • NYM 6–4',bullpen:'MIL 3,08 ERA • NYM 3,51 ERA',h2h:'Égalité 5–5',homeAway:'NYM 34–20 domicile • MIL 27–24 extérieur',streak:'MIL W1 • NYM L1'
  }
];

function team(code,name,record,pitcher,hand,probability,era,whip,fip,k9,bb9,wl,last5){return{code,name,record,pitcher,hand,probability,era,whip,fip,k9,bb9,wl,last5}}

const alerts = [
  {id:1,icon:'📉',title:'Cote Yankees en baisse',text:'La meilleure cote passe de 1,82 à 1,74.',time:'il y a 12 min',read:false},
  {id:2,icon:'⚾',title:'Lanceur confirmé',text:'Zack Wheeler est annoncé partant pour Philadelphie.',time:'il y a 28 min',read:false},
  {id:3,icon:'✦',title:'Nouvelle value détectée',text:'Atlanta atteint désormais +4 points contre Chicago.',time:'il y a 41 min',read:false},
  {id:4,icon:'🌦',title:'Météo favorable aux frappeurs',text:'Vent sortant prévu à Wrigley Field.',time:'il y a 1 h',read:true}
];

const history = [
  ['LAD – SF','LAD 63 %','LAD 5–2','Forte','Correct'],['NYY – BAL','NYY 57 %','BAL 4–3','Moyenne','Incorrect'],['PHI – MIA','PHI 71 %','PHI 6–1','Forte','Correct'],['SEA – OAK','SEA 59 %','SEA 3–1','Moyenne','Correct'],['CHC – CIN','CHC 52 %','CHC 7–6','Faible','Correct'],['ATL – STL','ATL 66 %','STL 5–4','Forte','Incorrect']
];
const weights=[['Bookmakers',38],['Lanceur',24],['Bullpen',11],['Attaque',10],['Défense',6],['Repos',4],['Terrain',3],['Blessures',2],['Météo',2]];
const calibration=[['50–55 %',52,51],['56–60 %',58,57],['61–65 %',63,62],['66–70 %',68,67],['71 %+ ',75,73]];

const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const store={
  favorites:JSON.parse(localStorage.getItem('dp04-favorites')||'[]'),
  showValue:JSON.parse(localStorage.getItem('dp04-show-value')??'true'),
  compact:JSON.parse(localStorage.getItem('dp04-compact')??'false'),
  remoteLogos:JSON.parse(localStorage.getItem('dp04-remote-logos')??'true'),
  showAlerts:JSON.parse(localStorage.getItem('dp04-alerts')??'true')
};

function parseDate(value){return new Date(`${value}T12:00:00`)}
function formatDate(value){return new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long'}).format(parseDate(value))}
function fmt(value){return new Intl.NumberFormat('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value)}
function favoriteTeam(match){return match.home.probability>=match.away.probability?match.home:match.away}
function underdogTeam(match){return match.home.probability<match.away.probability?match.home:match.away}
function logoRemote(code){const aliases={SD:'sd',SF:'sf',KC:'kc',TB:'tb',CWS:'chw',WSH:'wsh'};return `https://a.espncdn.com/i/teamlogos/mlb/500/${aliases[code]||code.toLowerCase()}.png`}
function localLogo(code){return `assets/logos/${code.toLowerCase()}.png`}
function logo(team,size='small'){
  const src=store.remoteLogos?logoRemote(team.code):localLogo(team.code);
  return `<img class="team-logo ${size}" src="${src}" alt="Logo ${team.name}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="team-fallback ${size}" hidden>${team.code}</span>`;
}
function teamRow(team,fav){return `<div class="team-row"><div class="team-name">${logo(team)}<div class="team-copy"><strong>${team.name}</strong><small>${team.record} • ${team.pitcher} (${team.hand})</small></div></div><div class="probability ${team.code===fav.code?'favorite-prob':''}">${team.probability} %</div></div>`}
function valueLabel(match){return match.edge>=3?`+${match.edge} pts`:'—'}
function confidenceLabel(value){return value.charAt(0).toUpperCase()+value.slice(1)}

function matchCard(match){
  const fav=favoriteTeam(match),saved=store.favorites.includes(match.id),hasValue=match.edge>=3;
  return `<article class="match-card"><div class="match-card-header"><div><p class="eyebrow">${formatDate(match.date)}</p><div class="match-time">${match.time} • ${match.venue}</div></div><span class="confidence ${match.confidence}">${confidenceLabel(match.confidence)}</span></div><div class="teams">${teamRow(match.away,fav)}${teamRow(match.home,fav)}</div><div class="victory-labels"><span>${match.away.code} ${match.away.probability}%</span><span>${match.home.probability}% ${match.home.code}</span></div><div class="victory-bar"><span style="width:${match.away.probability}%"></span><span style="width:${match.home.probability}%"></span></div><div class="quick-stats"><div><span>Score</span><strong>${match.predictedScore}</strong></div><div><span>Marché</span><strong>${match.market} %</strong></div><div><span>Value</span><strong class="${hasValue?'positive':''}">${valueLabel(match)}</strong></div><div><span>Note</span><strong>${match.rating}/10</strong></div></div>${store.showValue?`<div class="value-callout ${hasValue?'':'no-value'}"><span>${hasValue?'Value statistique détectée':'Marché proche du modèle'}</span><strong>${valueLabel(match)}</strong></div>`:''}<div class="card-actions"><button class="primary-button" data-analysis="${match.id}" type="button">Voir l’analyse</button><button class="secondary-button" data-save="${match.id}" type="button" aria-label="Favori">${saved?'★':'☆'}</button></div></article>`;
}

function renderDashboard(){
  const today=matches.filter(m=>m.date===TODAY), ranked=[...matches].sort((a,b)=>b.edge-a.edge), featured=ranked[0], strongest=[...matches].sort((a,b)=>favoriteTeam(b).probability-favoriteTeam(a).probability).slice(0,4), balanced=[...matches].sort((a,b)=>Math.abs(a.home.probability-a.away.probability)-Math.abs(b.home.probability-b.away.probability)).slice(0,4);
  $('#todayCount').textContent=today.length; $('#valueCount').textContent=matches.filter(m=>m.edge>=3).length; $('#bestProbability').textContent=`${Math.max(...matches.map(m=>favoriteTeam(m).probability))} %`;
  $('#featuredTitle').textContent=`${featured.away.name} – ${featured.home.name}`; $('#featuredOpen').dataset.analysis=featured.id;
  $('#featuredMatch').innerHTML=featuredMarkup(featured);
  $('#topValueStrip').innerHTML=ranked.slice(0,5).map((m,i)=>`<button class="value-chip" data-analysis="${m.id}" type="button"><div class="value-chip-head"><span class="rank-dot">${i+1}</span><span class="value-number">+${m.edge} pts</span></div><strong>${favoriteTeam(m).name}</strong><small>contre ${underdogTeam(m).name} • ${m.time}</small></button>`).join('');
  $('#strongestList').innerHTML=strongest.map(m=>rankingRow(m,`${favoriteTeam(m).probability} %`)).join('');
  $('#balancedList').innerHTML=balanced.map(m=>rankingRow(m,`${Math.abs(m.home.probability-m.away.probability)} pts`)).join('');
  renderAlerts();
}
function featuredMarkup(m){const fav=favoriteTeam(m);return `<div class="featured-match"><div class="featured-team">${logo(m.away,'')}<div><strong>${m.away.name}</strong><small>${m.away.record} • ${m.away.pitcher}</small></div></div><div class="versus-center"><span>VS</span><strong>${m.time}</strong><small>${m.venue}</small></div><div class="featured-team right"><div><strong>${m.home.name}</strong><small>${m.home.record} • ${m.home.pitcher}</small></div>${logo(m.home,'')}</div></div><div class="featured-probabilities"><strong>${m.away.probability}%</strong><div class="split-bar"><span style="width:${m.away.probability}%"></span><span style="width:${m.home.probability}%"></span></div><strong>${m.home.probability}%</strong></div><div class="featured-stats"><div><span>Marché</span><strong>${m.market} %</strong></div><div><span>Notre modèle</span><strong>${fav.probability} %</strong></div><div><span>Différence</span><strong class="positive">+${m.edge} pts</strong></div><div><span>Note Diamond</span><strong>${m.rating}/10</strong></div></div>`}
function rankingRow(m,value){const fav=favoriteTeam(m);return `<button class="ranking-row" data-analysis="${m.id}" type="button">${logo(fav,'tiny')}<span><strong>${fav.name}</strong><small>vs ${underdogTeam(m).name} • ${m.time}</small></span><span class="ranking-value"><strong>${value}</strong><small>${m.rating}/10</small></span></button>`}

function renderAlerts(){
  const list=store.showAlerts?alerts:[];
  const markup=list.length?list.map(a=>`<div class="alert-item"><span class="alert-icon">${a.icon}</span><div><strong>${a.title}</strong><p>${a.text}</p></div><time>${a.time}</time></div>`).join(''):'<div class="empty-state">Les alertes sont désactivées.</div>';
  $('#alertsList').innerHTML=markup; $('#notificationPanelList').innerHTML=markup;
  const unread=list.filter(a=>!a.read).length; $('#notificationCount').textContent=unread; $('#notificationCount').hidden=unread===0;
}

function renderMatches(){
  const dateFilter=$('#dateFilter').value,conf=$('#confidenceFilter').value,q=$('#teamSearch').value.toLowerCase().trim(),sort=$('#sortFilter').value;
  const today=parseDate(TODAY),tomorrow=new Date(today);tomorrow.setDate(today.getDate()+1),threeDays=new Date(today);threeDays.setDate(today.getDate()+3);
  let list=matches.filter(m=>{
    const d=parseDate(m.date); let dateOk=true;
    if(dateFilter==='today')dateOk=m.date===TODAY;
    if(dateFilter==='tomorrow')dateOk=d.toDateString()===tomorrow.toDateString();
    if(dateFilter==='3days')dateOk=d>=today&&d<=threeDays;
    return dateOk&&(conf==='all'||m.confidence===conf)&&(!q||`${m.away.name} ${m.home.name}`.toLowerCase().includes(q));
  });
  const sorters={time:(a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`),probability:(a,b)=>favoriteTeam(b).probability-favoriteTeam(a).probability,value:(a,b)=>b.edge-a.edge,rating:(a,b)=>b.rating-a.rating};
  list.sort(sorters[sort]); $('#matchesGrid').innerHTML=list.length?list.map(matchCard).join(''):'<div class="empty-state">Aucun match ne correspond aux filtres.</div>';
}

function spark(values){const min=Math.min(...values),max=Math.max(...values),points=values.map((v,i)=>`${i*(100/(values.length-1))},${60-((v-min)/(max-min||1))*45}`).join(' ');return `<svg class="sparkline" viewBox="0 0 100 65" preserveAspectRatio="none" role="img" aria-label="Évolution simulée de la cote"><polyline fill="none" stroke="var(--blue)" stroke-width="3" points="${points}"/><line x1="0" y1="60" x2="100" y2="60" stroke="var(--line)"/></svg>`}
function renderOdds(){
  $('#oddsList').innerHTML=matches.map(m=>{const fav=favoriteTeam(m),bestAway=Math.max(...m.bookmakers.map(b=>b[1])),bestHome=Math.max(...m.bookmakers.map(b=>b[2]));return `<article class="odds-card"><div class="odds-head"><div><p class="eyebrow">${m.away.code} – ${m.home.code}</p><h3>${m.away.name} contre ${m.home.name}</h3><small>${formatDate(m.date)} • ${m.time}</small></div><span class="rating-badge">${m.rating}/10</span></div><table class="odds-table"><thead><tr><th>Bookmaker</th><th>${m.away.code}</th><th>${m.home.code}</th></tr></thead><tbody>${m.bookmakers.map(b=>`<tr><td>${b[0]}</td><td class="${b[1]===bestAway?'best-odd':''}">${fmt(b[1])}</td><td class="${b[2]===bestHome?'best-odd':''}">${fmt(b[2])}</td></tr>`).join('')}</tbody></table>${spark(m.trend)}<small>Évolution simulée de la cote de ${fav.name}.</small></article>`}).join('');
}
function renderAnalysisList(){
  $('#modelWeights').innerHTML=weights.map(w=>`<div class="weight-item"><span>${w[0]}</span><strong>${w[1]} %</strong></div>`).join('');
  $('#valueList').innerHTML=[...matches].sort((a,b)=>b.edge-a.edge).map(m=>`<article class="value-card"><div class="odds-head"><div><p class="eyebrow">${m.away.code} – ${m.home.code}</p><h3>${m.away.name} / ${m.home.name}</h3></div><span class="value-badge ${m.edge>=3?'positive':'negative'}">${m.edge>=3?'Value détectée':'Écart faible'}</span></div><div class="scoreline"><div><small>Marché</small><strong>${m.market} %</strong></div><div class="rating">${m.rating}/10</div><div><small>Modèle</small><strong>${favoriteTeam(m).probability} %</strong></div></div><div class="factor-mini">${m.factors.slice(0,4).map(f=>`<div><span>${f[0]}</span><strong>${f[1]}</strong></div>`).join('')}</div><div class="card-actions"><button class="primary-button" data-analysis="${m.id}" type="button">Ouvrir l’analyse</button></div></article>`).join('');
}
function renderFavorites(){const list=matches.filter(m=>store.favorites.includes(m.id));$('#favoritesGrid').innerHTML=list.length?list.map(matchCard).join(''):'<div class="empty-state">Aucun match enregistré pour le moment.</div>'}
function renderHistory(){
  const metrics=[['Prévisions','742','simulation'],['Bon vainqueur','68,7 %','510 matchs'],['Value gagnantes','61 %','sur 142 détections'],['ROI simulé','+8,3 %','mise fixe fictive'],['Brier Score','0,198','plus bas = meilleur']];
  $('#historyMetrics').innerHTML=metrics.map(m=>`<article class="metric-card"><span>${m[0]}</span><strong>${m[1]}</strong><small>${m[2]}</small></article>`).join('');
  $('#historyRows').innerHTML=history.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td><span class="value-badge ${r[4]==='Correct'?'positive':'negative'}">${r[4]}</span></td></tr>`).join('');
  $('#calibrationChart').innerHTML=calibration.map(c=>`<div class="calibration-column"><div class="calibration-bars"><i style="height:${c[1]}%" title="Prévu ${c[1]} %"></i><i style="height:${c[2]}%" title="Réel ${c[2]} %"></i></div><strong>${c[0]}</strong><small>Prévu ${c[1]} • Réel ${c[2]}</small></div>`).join('');
}

function showAnalysis(m){
  const fav=favoriteTeam(m),dog=underdogTeam(m),favIsHome=fav===m.home;
  $('#dialogTitle').textContent=`${m.away.name} – ${m.home.name}`;
  $('#dialogContent').innerHTML=`<section class="analysis-hero"><div class="analysis-team">${logo(m.away,'')}<div><strong>${m.away.name}</strong><small>${m.away.record} • ${m.away.pitcher}</small></div></div><div class="versus-center"><span>${formatDate(m.date)}</span><strong>${m.time}</strong><small>${m.venue} • ${m.weather}</small></div><div class="analysis-team right"><div><strong>${m.home.name}</strong><small>${m.home.record} • ${m.home.pitcher}</small></div>${logo(m.home,'')}</div></section><div class="featured-probabilities"><strong class="analysis-prob red">${m.away.probability}%</strong><div class="split-bar"><span style="width:${m.away.probability}%"></span><span style="width:${m.home.probability}%"></span></div><strong class="analysis-prob blue">${m.home.probability}%</strong></div><div class="featured-stats"><div><span>Probabilité marché</span><strong>${m.market} %</strong></div><div><span>Notre modèle</span><strong>${fav.probability} %</strong></div><div><span>Value</span><strong class="positive">${m.edge>=3?`+${m.edge} pts`:'Faible'}</strong></div><div><span>Note Diamond</span><strong>${m.rating}/10</strong></div></div><div class="analysis-grid"><section class="analysis-block"><h3>Pourquoi ce pronostic ?</h3><div class="factor-list">${m.factors.map(f=>`<div class="factor"><span>${f[0]}</span><strong class="${f[1].includes('−')?'negative':'positive'}">${f[1]}</strong></div>`).join('')}</div></section><section class="analysis-block"><h3>Contexte du match</h3><div class="factor-list"><div class="factor"><span>Forme</span><strong>${m.form}</strong></div><div class="factor"><span>Bullpen</span><strong>${m.bullpen}</strong></div><div class="factor"><span>Confrontations</span><strong>${m.h2h}</strong></div><div class="factor"><span>Domicile / extérieur</span><strong>${m.homeAway}</strong></div><div class="factor"><span>Série</span><strong>${m.streak}</strong></div></div></section></div><div class="analysis-grid"><section class="analysis-block"><h3>Pitcher Center</h3><div class="pitcher-grid">${pitcherCard(m.away)}${pitcherCard(m.home)}</div></section><section class="analysis-block"><h3>Score probable</h3><div class="scoreline"><div><small>${m.away.code}</small><strong>${m.predictedScore.split('–')[0].trim()}</strong></div><div class="rating">⚾</div><div><small>${m.home.code}</small><strong>${m.predictedScore.split('–')[1].trim()}</strong></div></div><div class="factor"><span>Total probable</span><strong>${m.total} points</strong></div></section></div><section class="analysis-block full"><h3>Synthèse automatique</h3><p class="summary-callout">${fav.name} est favori avec ${fav.probability} % de probabilité estimée. L’avantage repose principalement sur ${m.factors[0][0].toLowerCase()} et ${m.factors[1][0].toLowerCase()}. Le marché lui accorde ${m.market} %, soit un écart de ${m.edge} point${m.edge>1?'s':''}. La confiance est ${m.confidence}, avec un score probable de ${m.predictedScore}. ${dog.name} conserve néanmoins une chance réelle, surtout si son lanceur dépasse les attentes.</p></section>`;
  $('#analysisDialog').showModal();
}
function pitcherCard(t){return `<article class="pitcher-card"><div class="pitcher-head"><div class="pitcher-avatar">⚾</div><div><strong>${t.pitcher}</strong><small>${t.hand} • ${t.wl}</small></div></div><div class="pitcher-stats"><div><span>ERA</span><strong>${t.era}</strong></div><div><span>WHIP</span><strong>${t.whip}</strong></div><div><span>FIP</span><strong>${t.fip}</strong></div><div><span>K/9</span><strong>${t.k9}</strong></div><div><span>BB/9</span><strong>${t.bb9}</strong></div></div><small>5 dernières sorties : ${t.last5}</small></article>`}

function switchView(view){$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));window.scrollTo({top:0,behavior:'smooth'})}
function savePreferences(){localStorage.setItem('dp04-show-value',JSON.stringify(store.showValue));localStorage.setItem('dp04-compact',JSON.stringify(store.compact));localStorage.setItem('dp04-remote-logos',JSON.stringify(store.remoteLogos));localStorage.setItem('dp04-alerts',JSON.stringify(store.showAlerts))}
function toast(message){const node=$('#toast');node.textContent=message;node.classList.add('visible');setTimeout(()=>node.classList.remove('visible'),1800)}
function refreshAll(){renderDashboard();renderMatches();renderOdds();renderAnalysisList();renderFavorites();renderHistory()}

refreshAll();
$('#valueToggle').checked=store.showValue; $('#compactToggle').checked=store.compact; $('#remoteLogosToggle').checked=store.remoteLogos; $('#alertsToggle').checked=store.showAlerts; document.body.classList.toggle('compact',store.compact);

document.addEventListener('click',event=>{
  const analysis=event.target.closest('[data-analysis]'); if(analysis){const m=matches.find(x=>x.id===Number(analysis.dataset.analysis));if(m)showAnalysis(m)}
  const save=event.target.closest('[data-save]'); if(save){const id=Number(save.dataset.save);store.favorites=store.favorites.includes(id)?store.favorites.filter(x=>x!==id):[...store.favorites,id];localStorage.setItem('dp04-favorites',JSON.stringify(store.favorites));renderMatches();renderFavorites();toast(store.favorites.includes(id)?'Match ajouté aux favoris':'Match retiré des favoris')}
  const nav=event.target.closest('[data-view]'); if(nav&&!analysis)switchView(nav.dataset.view);
});
['dateFilter','confidenceFilter','sortFilter'].forEach(id=>$('#'+id).addEventListener('change',renderMatches)); $('#teamSearch').addEventListener('input',renderMatches);
$('#closeDialog').addEventListener('click',()=>$('#analysisDialog').close()); $('#analysisDialog').addEventListener('click',e=>{if(e.target===$('#analysisDialog'))$('#analysisDialog').close()});
$('#themeToggle').addEventListener('click',()=>{document.documentElement.classList.toggle('light');$('#themeToggle').textContent=document.documentElement.classList.contains('light')?'☀':'☾'});
$('#notificationButton').addEventListener('click',()=>{$('#notificationPanel').classList.add('open');$('#notificationPanel').setAttribute('aria-hidden','false')}); $('#closeNotifications').addEventListener('click',()=>{$('#notificationPanel').classList.remove('open');$('#notificationPanel').setAttribute('aria-hidden','true')});
$('#markAlertsRead').addEventListener('click',()=>{alerts.forEach(a=>a.read=true);renderAlerts();toast('Alertes marquées comme lues')});
$('#valueToggle').addEventListener('change',e=>{store.showValue=e.target.checked;savePreferences();renderMatches();renderFavorites()});
$('#compactToggle').addEventListener('change',e=>{store.compact=e.target.checked;document.body.classList.toggle('compact',store.compact);savePreferences()});
$('#remoteLogosToggle').addEventListener('change',e=>{store.remoteLogos=e.target.checked;savePreferences();refreshAll();toast('Source des logos modifiée')});
$('#alertsToggle').addEventListener('change',e=>{store.showAlerts=e.target.checked;savePreferences();renderAlerts()});
$('#clearFavorites').addEventListener('click',()=>{store.favorites=[];localStorage.setItem('dp04-favorites','[]');renderFavorites();renderMatches();toast('Favoris effacés')});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
