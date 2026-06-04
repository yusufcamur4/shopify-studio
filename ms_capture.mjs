// motionsites.ai — hedef tasarımların animasyonlarını yakala
import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'penta-capture/motionsites';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TARGETS = ['Dreamcore Landing', 'Web3 EOS Hero', 'Pulse 3D', 'Scroll Landing Page'];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
});
const page = await ctx.newPage();
await page.goto('https://motionsites.ai/', { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => console.log('goto:', e.message));
await sleep(2500);

// tüm sayfayı kaydırıp lazy içerikleri yükle
const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(350); }
await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800);

// sayfadaki tüm başlık benzeri metinleri dök (yapıyı anlamak için)
const titles = await page.evaluate(() => {
  const set = new Set();
  document.querySelectorAll('h1,h2,h3,h4,a,span,p,div').forEach((el) => {
    const t = (el.childElementCount === 0 ? el.textContent : '').trim();
    if (t && t.length < 40) set.add(t);
  });
  return [...set];
});
fs.writeFileSync(`${OUT}/all-titles.txt`, titles.join('\n'));
console.log('toplam metin:', titles.length);
TARGETS.forEach((t) => console.log(`hedef "${t}" sayfada:`, titles.some((x) => x.toLowerCase().includes(t.toLowerCase().slice(0, 8)))));

// her hedef için: kartı bul, görünür yap, animasyon karelerini + medya tipini yakala
for (const name of TARGETS) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const handle = await page.evaluateHandle((nm) => {
    const els = [...document.querySelectorAll('*')].filter((e) => e.childElementCount === 0 && e.textContent.trim().toLowerCase() === nm.toLowerCase());
    let el = els[0];
    if (!el) { // kısmi eşleşme
      const p = [...document.querySelectorAll('*')].filter((e) => e.textContent.trim().toLowerCase().includes(nm.toLowerCase()) && e.childElementCount < 5);
      el = p[p.length - 1];
    }
    if (!el) return null;
    // kartı bul (yukarı doğru en yakın büyük konteyner)
    let card = el;
    for (let i = 0; i < 5 && card.parentElement; i++) { card = card.parentElement; if (card.querySelector('video,canvas,img,iframe')) break; }
    card.scrollIntoView({ block: 'center' });
    return card;
  }, name);

  if (!handle || !(await handle.evaluate((n) => !!n))) { console.log(`! bulunamadı: ${name}`); continue; }
  await sleep(1200);

  const media = await handle.evaluate((card) => ({
    video: [...card.querySelectorAll('video')].map((v) => ({ src: v.currentSrc || v.src || v.querySelector('source')?.src || '', playing: !v.paused })),
    canvas: card.querySelectorAll('canvas').length,
    iframe: [...card.querySelectorAll('iframe')].map((f) => f.src),
    img: card.querySelectorAll('img').length,
  }));
  fs.writeFileSync(`${OUT}/${slug}.json`, JSON.stringify(media, null, 2));
  console.log(`\n${name}:`, JSON.stringify(media));

  // animasyon kareleri
  const el = handle.asElement();
  for (let i = 1; i <= 5; i++) {
    try { await el.screenshot({ path: `${OUT}/${slug}-${i}.png` }); } catch (e) { /* */ }
    await sleep(400);
  }
}

await browser.close();
console.log('\n✅ bitti →', OUT);
