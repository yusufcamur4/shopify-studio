import { chromium } from 'playwright';
import fs from 'fs';
const OUT='penta-capture/ob-pages'; fs.mkdirSync(OUT,{recursive:true});
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(800);

const visible = ()=>p.evaluate(()=>[...document.querySelectorAll('[data-page]')].filter(e=>e.offsetParent!==null||getComputedStyle(e).display!=='none').map(e=>e.id||e.className.split(' ')[0]));
console.log('AÇILIŞ görünür:', JSON.stringify(await visible()));
await p.screenshot({path:`${OUT}/home.png`});

// menüden About'a git
await p.click('#menuTrigger'); await s(900);
await p.click('.menu-link[href="#about"]'); await s(1600);
console.log('ABOUT sonrası görünür:', JSON.stringify(await visible()));
await p.screenshot({path:`${OUT}/about.png`});

// menüden Works
await p.click('#menuTrigger'); await s(900);
await p.click('.menu-link[href="#works"]'); await s(1600);
console.log('WORKS sonrası görünür:', JSON.stringify(await visible()));
await p.screenshot({path:`${OUT}/works.png`});

// logo ile home'a dön
await p.click('.nav__mark'); await s(1500);
console.log('HOME dönüş görünür:', JSON.stringify(await visible()));

console.log('errors:', errs.length?errs:'none');
await b.close();
