import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'penta-capture/motionsites';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TARGETS = ['Dreamcore Landing', 'Web3 EOS Hero', 'Pulse 3D', 'Scroll Landing Page'];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36' });
const page = await ctx.newPage();
await page.goto('https://motionsites.ai/', { waitUntil: 'networkidle', timeout: 60000 });
await sleep(2500);
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(300); }
await sleep(600);

for (const name of TARGETS) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  // başlık yaprağından yukarı çık → İÇİNDE video olan EN KÜÇÜK ata = kart
  const card = await page.evaluateHandle((nm) => {
    const leaf = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && e.textContent.trim().toLowerCase() === nm.toLowerCase());
    if (!leaf) return null;
    let el = leaf;
    while (el.parentElement && !el.querySelector('video')) el = el.parentElement;
    el.scrollIntoView({ block: 'center' });
    return el;
  }, name);
  const ok = card && (await card.evaluate((n) => !!n));
  if (!ok) { console.log('! yok:', name); continue; }
  await sleep(800);
  // videoları zorla oynat
  const meta = await card.evaluate((el) => {
    const vids = [...el.querySelectorAll('video')];
    vids.forEach((v) => { v.muted = true; v.loop = true; v.play().catch(() => {}); });
    return vids.map((v) => ({ src: (v.currentSrc || '').slice(0, 32), w: v.videoWidth, h: v.videoHeight }));
  });
  console.log(`${name}:`, JSON.stringify(meta));
  // animasyon kareleri (oynarken)
  for (let i = 1; i <= 6; i++) {
    await sleep(550);
    try { await card.asElement().screenshot({ path: `${OUT}/${slug}-play-${i}.png` }); } catch (e) { console.log('  shot err', e.message); }
  }
}
await browser.close();
console.log('bitti');
