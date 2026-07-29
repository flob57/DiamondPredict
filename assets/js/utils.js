import {TZ} from './config.js';
export const $=s=>document.querySelector(s);export const $$=s=>document.querySelectorAll(s);export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));export const num=(v,f=null)=>{const n=Number(v);return Number.isFinite(n)?n:f};
export const dateKey=d=>new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
export const fmtTime=v=>new Intl.DateTimeFormat('fr-FR',{timeZone:TZ,hour:'2-digit',minute:'2-digit'}).format(new Date(v));
export const fmtDate=v=>new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long'}).format(new Date(v+'T12:00:00'));
