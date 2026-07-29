import {dateKey} from './utils.js';
async function getJSON(url){const r=await fetch(url,{cache:'no-store'});const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.error||`HTTP ${r.status}`);return body}
export async function fetchMLB(){const start=dateKey(new Date()),e=new Date(start+'T12:00:00');e.setDate(e.getDate()+6);const url=new URL('/api/mlb',location.origin);url.searchParams.set('start',start);url.searchParams.set('end',dateKey(e));return getJSON(url)}
export async function fetchOdds(){return getJSON(new URL('/api/odds',location.origin))}
export async function fetchH2H(awayId,homeId){const u=new URL('/api/h2h',location.origin);u.searchParams.set('away',awayId);u.searchParams.set('home',homeId);return getJSON(u)}
export async function fetchHistory(days=60){const u=new URL('/api/history',location.origin);u.searchParams.set('days',days);return getJSON(u)}
