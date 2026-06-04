import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'penta-capture/ob-system';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await chromium.launch({ headless: true });
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(String(e)));
p.on('console', (m) => { if (m.type() === 'error') errs.push('con: ' + m.text()); });

await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await sleep(800);

// 1) Dil EN
await p.click('.lang button[data-lang="en"]');
await sleep(250);
const enState = await p.evaluate(() => ({
  lang: document.documentElement.getAttribute('data-lang'),
  menu: document.querySelector('[data-i18n="menu"]').textContent,
  worksTitle: document.querySelector('[data-i18n="works_title"]').textContent,
  logoAnim: document.documentElement.classList.contains('lang-anim'),
}));
await p.screenshot({ path: `${OUT}/lang-en.png` });

// 2) Perde geçişi (İşleri Gör → #works)
await p.click('a.hero__cta--ghost');
await sleep(280); // perde yükselirken
await p.screenshot({ path: `${OUT}/curtain-mid.png` });
const curtainUp = await p.evaluate(() => document.getElementById('curtain').classList.contains('is-rising') || document.getElementById('curtain').classList.contains('is-falling'));
await sleep(900);
await p.screenshot({ path: `${OUT}/curtain-done.png` });
const scrolled = await p.evaluate(() => Math.round(window.scrollY));

console.log('EN:', JSON.stringify(enState));
console.log('curtainSeen:', curtainUp, 'scrolledY:', scrolled);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
