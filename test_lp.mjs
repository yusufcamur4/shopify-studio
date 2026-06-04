import { chromium } from 'playwright';
import fs from 'fs';
const OUT='penta-capture/ob-lp'; fs.mkdirSync(OUT,{recursive:true});
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(700);
// menü → Yetenekler → Shopify
await p.click('#menuTrigger'); await s(900);
await p.click('[data-open="yetenekler"]'); await s(900);
await p.click('.menu-link[href="#skill-shopify"]'); await s(1600);
const vis=await p.evaluate(()=>[...document.querySelectorAll('[data-page]')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.id));
console.log('Shopify sayfası görünür:', JSON.stringify(vis));
await p.screenshot({path:`${OUT}/shopify-top.png`});
await p.evaluate(()=>window.scrollTo(0,1200)); await s(600);
await p.screenshot({path:`${OUT}/shopify-mid.png`});
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await s(600);
await p.screenshot({path:`${OUT}/shopify-bottom.png`});
// CTA modal + proje önseçimi
await p.evaluate(()=>window.scrollTo(0,0)); await s(400);
await p.click('.lp__cta--solid'); await s(700);
const proj=await p.evaluate(()=>document.getElementById('f-type').value);
console.log('modal proje önseçim:', proj);
console.log('errors:', errs.length?errs:'none');
await b.close();
