// pentayazilim.com — canlı animasyon yakalama (Playwright)
// Çalıştır: node penta_capture.mjs
import { chromium } from 'playwright';
import fs from 'fs';

const OUT = 'penta-capture';
fs.mkdirSync(`${OUT}/shots`, { recursive: true });
fs.mkdirSync(`${OUT}/video`, { recursive: true });

const PAGES = [
  { name: 'home', url: 'https://www.pentayazilim.com/' },
  { name: 'hakkimizda', url: 'https://www.pentayazilim.com/hakkimizda/' },
  { name: 'e-ticaret', url: 'https://www.pentayazilim.com/e-ticaret/' },
  { name: 'referans-sahibinden', url: 'https://www.pentayazilim.com/referanslar/sahibinden/' },
];

// Sayfadaki o an aktif animasyon/transition'ları döker (Web Animations API)
const SNIFF = () => {
  const anims = document.getAnimations().map((a) => {
    const eff = a.effect;
    const t = eff && eff.getTiming ? eff.getTiming() : {};
    const el = eff && eff.target;
    let sel = '';
    if (el) {
      const cls = (el.getAttribute && el.getAttribute('class')) || '';
      sel = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${cls.split(' ').slice(0, 3).join('.')}`.slice(0, 90);
    }
    return {
      type: a.constructor.name,          // CSSAnimation | CSSTransition | Animation
      name: a.animationName || a.transitionProperty || '',
      duration: t.duration,
      easing: t.easing,
      delay: t.delay,
      state: a.playState,
      target: sel,
    };
  });
  // benzersizleştir
  const seen = new Set();
  return anims.filter((x) => {
    const k = x.type + '|' + x.name + '|' + x.target;
    if (seen.has(k)) return false; seen.add(k); return true;
  });
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const report = { generatedAt: new Date().toISOString(), pages: [] };

const browser = await chromium.launch({ headless: true });

for (const P of PAGES) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: `${OUT}/video`, size: { width: 1440, height: 900 } },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
  });
  const page = await context.newPage();

  const media = new Set();
  page.on('response', (res) => {
    const u = res.url();
    if (/\.(mp4|webm|webp|gif|svg|woff2?)(\?|$)/i.test(u)) media.add(u.split('?')[0]);
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  const pageRep = { name: P.name, url: P.url, scrollSteps: [], langLogoAnimations: [], videos: [], mediaCount: 0, errors };

  console.log(`\n▶ ${P.name} — ${P.url}`);
  await page.goto(P.url, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => errors.push('goto: ' + e.message));
  await sleep(1200);

  // İlk ekran + yüklenme animasyonları
  await page.screenshot({ path: `${OUT}/shots/${P.name}-00-top.png` });
  pageRep.scrollSteps.push({ step: 0, scrollY: 0, animations: await page.evaluate(SNIFF) });

  // Sayfa boyu + adım adım scroll (reveal tetikle)
  const height = await page.evaluate(() => document.body.scrollHeight);
  const STEPS = 8;
  for (let i = 1; i <= STEPS; i++) {
    const y = Math.round((height - 900) * (i / STEPS));
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'smooth' }), y);
    await sleep(700); // animasyonların ortasını yakala
    const anims = await page.evaluate(SNIFF);
    if (i <= 4 || anims.length) {
      await page.screenshot({ path: `${OUT}/shots/${P.name}-${String(i).padStart(2, '0')}-y${y}.png` });
    }
    pageRep.scrollSteps.push({ step: i, scrollY: y, animations: anims });
  }

  // Çalışan/poster videoları
  pageRep.videos = await page.evaluate(() =>
    [...document.querySelectorAll('video')].map((v) => ({
      src: v.currentSrc || v.getAttribute('data-src') || v.querySelector('source')?.src || '',
      preview: v.getAttribute('data-preview-src') || '',
      poster: v.poster || '',
      autoplay: v.autoplay, loop: v.loop, muted: v.muted,
      playing: !v.paused, w: v.videoWidth, h: v.videoHeight,
    }))
  );

  // Ana sayfada dil geçişi → logo 3B animasyonunu yakala
  if (P.name === 'home') {
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(400);
    const before = await page.evaluate(SNIFF);
    // EN/dil tetikleyicisini bul ve tıkla
    const clicked = await page.evaluate(() => {
      const cand = [...document.querySelectorAll('a,button')].find((e) =>
        /\/en(\/|$)|lang|dil|english/i.test((e.getAttribute('href') || '') + ' ' + (e.getAttribute('class') || '') + ' ' + e.textContent)
      );
      if (cand) { cand.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })); return cand.outerHTML.slice(0, 120); }
      return null;
    });
    await sleep(300);
    const during = await page.evaluate(SNIFF);
    pageRep.langLogoAnimations = { trigger: clicked, before, during };
  }

  pageRep.mediaCount = media.size;
  pageRep.mediaSample = [...media].slice(0, 30);
  report.pages.push(pageRep);

  await page.close();
  await context.close();
  // video dosyasını anlamlı adla taşı
  const vids = fs.readdirSync(`${OUT}/video`).filter((f) => f.endsWith('.webm'));
  const latest = vids.map((f) => ({ f, t: fs.statSync(`${OUT}/video/${f}`).mtimeMs })).sort((a, b) => b.t - a.t)[0];
  if (latest && !fs.existsSync(`${OUT}/video/${P.name}.webm`)) {
    fs.renameSync(`${OUT}/video/${latest.f}`, `${OUT}/video/${P.name}.webm`);
  }
}

await browser.close();
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(`\n✅ Bitti. Çıktılar: ${OUT}/ (shots/, video/, report.json)`);
