import { chromium } from 'playwright';
import fs from 'fs';
const OUT='penta-capture/ob-sections'; fs.mkdirSync(OUT,{recursive:true});
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(700);
async function shot(sel,name){const el=await p.$(sel); if(el){await el.scrollIntoViewIfNeeded(); await s(900); await el.screenshot({path:`${OUT}/${name}.png`});}}
await shot('#works','works'); await shot('#skills','skills'); await shot('#stats','stats');
// EN hero başlık
await p.evaluate(()=>window.scrollTo(0,0)); await s(400);
await p.click('.lang button[data-lang="en"]'); await s(900);
await p.screenshot({path:`${OUT}/hero-en.png`});
const t=await p.evaluate(()=>document.getElementById('heroTitle').textContent.replace(/\s+/g,' ').trim());
console.log('hero EN title:', t);
console.log('errors:', errs.length?errs:'none');
await b.close();
