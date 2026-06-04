import { chromium } from 'playwright';
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--ignore-gpu-blocklist']});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'}); await s(2200);
await p.screenshot({path:'penta-capture/ob-code-hero.png'});
const footerHome=await p.evaluate(()=>{const f=document.querySelector('.footer');return f?getComputedStyle(f).display:'yok';});
console.log('home footer display:',footerHome);
// inner sayfada footer görünür mü
await p.goto('http://localhost:5173/#works',{waitUntil:'networkidle'}); await s(800);
console.log('works footer display:',await p.evaluate(()=>getComputedStyle(document.querySelector('.footer')).display));
console.log('errors:',errs.length?errs.slice(0,4):'none');
await b.close();
