import { chromium } from 'playwright';
const s=ms=>new Promise(r=>setTimeout(r,ms));
const b=await chromium.launch({headless:true});
const p=await(await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.goto('http://localhost:5173/#skill-pazarlama',{waitUntil:'networkidle'}); await s(900);
await p.screenshot({path:'penta-capture/ob-lp/pazarlama-top.png'});
await b.close();
