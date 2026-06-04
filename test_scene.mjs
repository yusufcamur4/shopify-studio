import { chromium } from 'playwright';
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true,args:['--use-gl=swiftshader','--ignore-gpu-blocklist']});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:5173/',{waitUntil:'networkidle'});
await s(400); await p.screenshot({path:'penta-capture/ob-land-1.png'}); // giriş (düşüş)
await s(700); await p.screenshot({path:'penta-capture/ob-land-2.png'}); // iniş/kalkış
await s(1500);
await p.mouse.move(200,250); await s(900); await p.screenshot({path:'penta-capture/ob-land-headL.png'});
await p.mouse.move(1300,700); await s(900); await p.screenshot({path:'penta-capture/ob-land-headR.png'});
console.log('errors:',errs.length?errs.slice(0,5):'none');
await b.close();
