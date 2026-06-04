import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'penta-capture/motionsites';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TARGETS = ['Dreamcore Landing', 'Web3 EOS Hero', 'Pulse 3D', 'Scroll Landing Page'];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36' });
const page = await ctx.newPage();
await page.goto('https://motionsites.ai/', { waitUntil: 'networkidle', timeout: 60000 });
await sleep(2500);
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(300); }
await page.evaluate(() => window.scrollTo(0, 0)); await sleep(600);

// her hedef kart için: hover (video tetikle) + href bul
for (const name of TARGETS) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const info = await page.evaluate((nm) => {
    const leaf = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && e.textContent.trim().toLowerCase() === nm.toLowerCase());
    if (!leaf) return null;
    let card = leaf;
    for (let i = 0; i < 6 && card.parentElement; i++) { card = card.parentElement; if (card.querySelector('a[href]') || card.tagName === 'A') break; }
    const a = card.tagName === 'A' ? card : card.querySelector('a[href]') || card.closest('a[href]');
    card.scrollIntoView({ block: 'center' });
    const r = card.getBoundingClientRect();
    return { href: a ? a.href : null, x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, name);
  if (!info) { console.log('! yok:', name); continue; }
  console.log(`${name} → href: ${info.href}`);

  // hover ile önizleme videosu tetikle
  await page.mouse.move(info.x, info.y); await sleep(1500);
  const hov = await page.evaluate((nm) => {
    const leaf = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && e.textContent.trim().toLowerCase() === nm.toLowerCase());
    let card = leaf; for (let i = 0; i < 6 && card.parentElement; i++) card = card.parentElement;
    const vids = [...card.querySelectorAll('video')];
    return vids.map((v) => ({ src: v.currentSrc || v.src || v.querySelector('source')?.src || '', playing: !v.paused, w: v.videoWidth }));
  }, name);
  console.log('  hover video:', JSON.stringify(hov));
  for (let i = 1; i <= 4; i++) { await page.screenshot({ path: `${OUT}/${slug}-hover-${i}.png`, clip: undefined }); await sleep(350); }
}
fs.writeFileSync(`${OUT}/hrefs.txt`, '');
await browser.close();
console.log('bitti');
