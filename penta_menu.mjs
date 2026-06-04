// Penta menü açılışı + kategori geçişi — canlı yakalama
import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'penta-capture/menu';
fs.mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://www.pentayazilim.com/', { waitUntil: 'networkidle', timeout: 60000 });
await sleep(1500);

// menü kapalı durum
await page.screenshot({ path: `${OUT}/00-closed.png` });

// tetikleyiciye tıkla + açılışı kare kare yakala
const trig = await page.$('.menu-trigger');
console.log('trigger bulundu:', !!trig);
await trig.click({ force: true });
for (let i = 1; i <= 8; i++) { await sleep(110); await page.screenshot({ path: `${OUT}/open-${String(i).padStart(2,'0')}.png` }); }
await sleep(400);
await page.screenshot({ path: `${OUT}/01-open-full.png` });

// menü yapısını + o an çalışan animasyonları dök
const data = await page.evaluate(() => {
  const field = document.querySelector('.menu-field');
  const cats = [...document.querySelectorAll('.main-menu > .item, .main-menu .item')].slice(0, 40).map((it) => {
    const a = it.querySelector('a');
    return { text: (a?.textContent || it.textContent || '').trim().slice(0, 40), href: a?.getAttribute('href') || '', hasChild: it.classList.contains('has-child') };
  });
  const anims = document.getAnimations().map((a) => ({
    type: a.constructor.name, name: a.animationName || a.transitionProperty,
    dur: a.effect?.getTiming?.().duration, easing: a.effect?.getTiming?.().easing,
    target: (a.effect?.target?.getAttribute('class') || '').split(' ').slice(0,2).join('.').slice(0,50),
  })).slice(0, 25);
  return { fieldActive: field?.className.includes('active'), cats, anims };
});
fs.writeFileSync(`${OUT}/menu-structure.json`, JSON.stringify(data, null, 2));
console.log('Kategoriler:', data.cats.map((c) => c.text + (c.hasChild ? '▸' : '')).join('  |  '));

// alt menüsü olan ilk kategoriye tıkla → kategori geçişini yakala
const child = await page.$('.main-menu .item.has-child');
if (child) {
  await child.click({ force: true });
  for (let i = 1; i <= 7; i++) { await sleep(110); await page.screenshot({ path: `${OUT}/cat-${String(i).padStart(2,'0')}.png` }); }
  await sleep(400);
  await page.screenshot({ path: `${OUT}/02-category-open.png` });
}

await browser.close();
console.log('✅ menü yakalandı →', OUT);
