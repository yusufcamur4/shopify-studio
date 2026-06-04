import { chromium } from 'playwright';
import fs from 'fs';
const OUT='penta-capture/ob-en'; fs.mkdirSync(OUT,{recursive:true});
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(700);
await p.click('.lang button[data-lang="en"]'); await s(700);
async function shot(sel,name){const el=await p.$(sel); if(el){await el.scrollIntoViewIfNeeded(); await s(700); await el.screenshot({path:`${OUT}/${name}.png`});}}
await shot('#about','about'); await shot('#process','process'); await shot('#contact','contact'); await shot('.footer','footer');
// kalan Türkçe metin taraması (yaygın TR kelimeleri)
const tr = await p.evaluate(()=>{
  const words=['Hakkımda','İşler','Yetenekler','Süreç','İletişim','Görsel','Mağaza','Konum','Gönder','Projeyi','Keşif','Tasarım','Yayın','Bakım','rezervasyon','deneyim','güncel','Ad Soyad','Projen'];
  const hits=[]; const walk=document.createElement('div');
  document.querySelectorAll('section,footer,nav,.menu-field,.modal').forEach(()=>{});
  const all=document.body.innerText;
  words.forEach(w=>{ if(all.includes(w)) hits.push(w); });
  return hits;
});
console.log('EN sonrası kalan TR kelimeler:', tr.length?tr:'YOK');
console.log('errors:', errs.length?errs:'none');
await b.close();
