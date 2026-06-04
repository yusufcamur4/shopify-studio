import { chromium } from 'playwright';
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(500);
// her landing'in CTA data-project'ini doğrudan DOM'dan oku
const map=await p.evaluate(()=>{
  const out={};
  document.querySelectorAll('section.lp[data-page]').forEach(sec=>{
    const btn=sec.querySelector('.lp__cta--solid[data-project]');
    out[sec.id]=btn?btn.getAttribute('data-project'):null;
  });
  return out;
});
console.log(JSON.stringify(map,null,0));
// görünür sayfanın CTA'sıyla modal önseçimini test et (pazarlama)
await p.goto('http://localhost:5173/#skill-pazarlama',{waitUntil:'networkidle'}); await s(800);
await p.click('.lp[data-page="skill-pazarlama"] .lp__cta--solid'); await s(600);
console.log('pazarlama modal önseçim:', await p.evaluate(()=>document.getElementById('f-type').value));
await b.close();
