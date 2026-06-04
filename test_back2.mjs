import { chromium } from 'playwright';
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(700);
const drill=async()=>p.evaluate(()=>({open:document.getElementById('menuField').classList.contains('is-open'),active:[...document.querySelectorAll('.menu-level.is-active')].map(l=>l.dataset.id||l.dataset.level)}));

// SENARYO 1: home → İşleri Gör (works) → Geri  → ana menü (level 0) beklenir
await p.click('a.hero__cta--ghost'); await s(1500);
await p.click('#navBack'); await s(1000);
console.log('Works → Geri:', JSON.stringify(await drill()));
// menüyü kapat
await p.click('#menuCtl'); await s(900);

// SENARYO 2: menü → Yetenekler → Shopify → Geri → Yetenekler alt menü beklenir
await p.click('#menuTrigger'); await s(700);
await p.click('[data-open="yetenekler"]'); await s(700);
await p.click('.menu-link[href="#skill-shopify"]'); await s(1500);
await p.click('#navBack'); await s(1000);
console.log('Shopify → Geri:', JSON.stringify(await drill()));
console.log('errors:', errs.length?errs:'none');
await b.close();
