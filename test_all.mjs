import { chromium } from 'playwright';
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(700);
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('[data-page]')].filter(e=>getComputedStyle(e).display!=='none').map(e=>e.id));
const links=['#skill-shopify','#skill-web','#skill-tema','#skill-seo','#skill-pazarlama'];
for(const l of links){
  await p.click('.nav__mark'); await s(1100);          // home'a dön
  await p.click('#menuTrigger'); await s(650);
  await p.click('[data-open="yetenekler"]'); await s(650);
  await p.click(`.menu-link[href="${l}"]`); await s(1400);
  const v=await vis();
  const proj=await p.evaluate(()=>{const c=document.querySelector('.lp .lp__cta--solid');return c?c.getAttribute('data-project'):null;});
  console.log(l,'→',JSON.stringify(v),'| CTA:',proj);
}
// back test (shopify)
await p.click('#navBack'); await s(900);
const d=await p.evaluate(()=>[...document.querySelectorAll('.menu-level.is-active')].map(x=>x.dataset.id||x.dataset.level));
console.log('Geri →', JSON.stringify(d));
await p.goto('http://localhost:5173/#about',{waitUntil:'networkidle'}); await s(800);
console.log('Hakkımda meta:', JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.about__meta dt')].map(d=>d.textContent.trim()))));
console.log('Yetenek kartı:', await p.evaluate(()=>document.querySelectorAll('#skills .skill').length));
console.log('errors:', errs.length?errs:'none');
await b.close();
