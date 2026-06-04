import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'penta-capture/ob-menu';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const URL = process.env.URL || 'http://localhost:5173/';

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });

await p.goto(URL, { waitUntil: 'networkidle' });
await sleep(800);
await p.screenshot({ path: `${OUT}/0-closed.png` });

await p.click('#menuTrigger');
for (let i = 1; i <= 6; i++) { await sleep(120); await p.screenshot({ path: `${OUT}/open-${i}.png` }); }
await sleep(400);
await p.screenshot({ path: `${OUT}/1-open.png` });

// drill: Yetenekler
await p.click('[data-open="yetenekler"]');
for (let i = 1; i <= 5; i++) { await sleep(120); await p.screenshot({ path: `${OUT}/cat-${i}.png` }); }
await sleep(400);
await p.screenshot({ path: `${OUT}/2-drilled.png` });

// geri
await p.click('#menuCtl');
await sleep(800);
await p.screenshot({ path: `${OUT}/3-back.png` });

const state = await p.evaluate(() => ({
  open: document.getElementById('menuField').classList.contains('is-open'),
  drilled: document.getElementById('menuField').classList.contains('is-drilled'),
  activeLevels: [...document.querySelectorAll('.menu-level.is-active')].map((l) => l.dataset.level || l.dataset.id),
}));
console.log('state:', JSON.stringify(state), 'errors:', errs.length ? errs : 'none');
await b.close();
