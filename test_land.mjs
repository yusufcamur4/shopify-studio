import { chromium } from 'playwright';
const s = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch({ headless: true, args: ['--use-gl=swiftshader', '--ignore-gpu-blocklist'] });
const p = await (await b.newContext({ viewport: { width: 1100, height: 900 } })).newPage();
const logs = [], errs = [];
p.on('console', m => { const t = m.text(); if (t.includes('[char]')) logs.push(t); if (m.type() === 'error') errs.push(t); });
p.on('pageerror', e => errs.push(String(e)));
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
const clip = { x: 560, y: 60, width: 540, height: 820 };
const shots = [['fall', 200], ['impact', 700], ['rise', 1300], ['idle1', 3000], ['idle2', 3700]];
let prev = 0;
for (const [name, t] of shots) {
  await s(t - prev); prev = t;
  await p.screenshot({ path: `penta-capture/land-${name}.png`, clip });
}
console.log(logs.join('\n'));
console.log('errors:', errs.length ? errs.slice(0, 5) : 'none');
await b.close();
