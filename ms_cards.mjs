import { chromium } from 'playwright';
const OUT = 'penta-capture/motionsites';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TARGETS = ['Dreamcore Landing', 'Web3 EOS Hero', 'Pulse 3D', 'Scroll Landing Page'];
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36' });
const page = await ctx.newPage();
await page.goto('https://motionsites.ai/', { waitUntil: 'networkidle', timeout: 60000 });
await sleep(2500);
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(280); }
await sleep(500);

for (const name of TARGETS) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  // ızgara öğesine (kardeşleri çok olan ata) çık
  const box = await page.evaluate((nm) => {
    const leaf = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && e.textContent.trim().toLowerCase() === nm.toLowerCase());
    if (!leaf) return null;
    let el = leaf;
    while (el.parentElement && el.parentElement.children.length < 4) el = el.parentElement;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, ht: r.height };
  }, name);
  if (!box) { console.log('! yok:', name); continue; }
  await sleep(700);
  // kartın ortasına hover (video tetikle) + zorla oynat
  await page.mouse.move(box.x + box.w / 2, box.y + box.ht / 2);
  await sleep(1600);
  const meta = await page.evaluate((nm) => {
    const leaf = [...document.querySelectorAll('*')].find((e) => e.childElementCount === 0 && e.textContent.trim().toLowerCase() === nm.toLowerCase());
    let el = leaf; while (el.parentElement && el.parentElement.children.length < 4) el = el.parentElement;
    const v = [...el.querySelectorAll('video')];
    v.forEach((x) => { x.muted = true; x.play().catch(() => {}); });
    return { vids: v.length, playing: v.map((x) => !x.paused), sz: v.map((x) => x.videoWidth + 'x' + x.videoHeight) };
  }, name);
  console.log(`${name}:`, JSON.stringify(meta), `box=${Math.round(box.w)}x${Math.round(box.ht)}`);
  const clip = { x: Math.max(0, box.x), y: Math.max(0, box.y), width: Math.min(box.w, 1440 - box.x), height: Math.min(box.ht, 1000 - Math.max(0, box.y)) };
  for (let i = 1; i <= 5; i++) { await sleep(500); try { await page.screenshot({ path: `${OUT}/${slug}-card-${i}.png`, clip }); } catch (e) { console.log('  err', e.message); } }
}
await browser.close();
console.log('bitti');
