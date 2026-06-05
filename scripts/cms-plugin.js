// ============================================================
//  Vite eklentisi — CMS icerigini (content/) derleme aninda
//  index.html'e basar. Kaynak TinaCMS panelinden yonetilir.
//  Tasarim sabit: orijinal markup, siniflar, data-en iki dil korunur.
//
//  Calisma mantigi: index.html'deki <!-- CMS:xxx --> isaretcileri,
//  asagidaki RENDERERS tablosundan uretilen HTML ile degistirilir.
// ============================================================
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content');

// ---- yardimcilar --------------------------------------------------
const esc = (s = '') =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s = '') => esc(s).replace(/"/g, '&quot;');

function readJson(rel) {
  const p = path.join(CONTENT, rel);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
}
function readFolder(rel) {
  const dir = path.join(CONTENT, rel);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => matter(fs.readFileSync(path.join(dir, f), 'utf8')).data);
}

// Iki dilli metin span'i: TR govde + data-en EN
const bi = (tr, en, tag = 'span', cls = '') => {
  const c = cls ? ` class="${cls}"` : '';
  return `<${tag}${c} data-en="${escAttr(en)}">${esc(tr)}</${tag}>`;
};

// ---- SEO (head) ---------------------------------------------------
function renderSeo() {
  const s = readJson('seo/home.json');
  const kw = Array.isArray(s.keywords) ? s.keywords.join(', ') : '';
  return [
    `<title>${esc(s.title)}</title>`,
    `<meta name="description" content="${escAttr(s.description)}" />`,
    kw ? `<meta name="keywords" content="${escAttr(kw)}" />` : '',
    `<meta property="og:title" content="${escAttr(s.title)}" />`,
    `<meta property="og:description" content="${escAttr(s.description)}" />`,
    s.og_image ? `<meta property="og:image" content="${escAttr(s.og_image)}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].filter(Boolean).join('\n  ');
}

// ---- PROJELER (works) --------------------------------------------
const WORK_TONES = [
  '--c1:#1a1410;--c2:#0e0c0b',
  '--c1:#101618;--c2:#0b0d0e',
  '--c1:#181016;--c2:#0d0b0c',
  '--c1:#15140e;--c2:#0c0b08',
];
function renderWorks() {
  const items = readFolder('projects').sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  if (!items.length) return '';
  return items
    .map((p, i) => {
      const tone = WORK_TONES[i % WORK_TONES.length];
      const num = `/ ${String(i + 1).padStart(2, '0')}`;
      const alt = `${p.title || 'Proje'} — proje gorseli`;
      return `      <article class="work" data-tilt data-reveal style="${tone}">
        <span class="work__sheen"></span>
        <div class="work__shot">
          <span class="work__bar"><i></i><i></i><i></i><span class="work__url">${esc(p.url)}</span></span>
          <img src="${escAttr(p.cover)}" alt="${escAttr(alt)}" loading="lazy" width="1200" height="800" />
        </div>
        <div class="work__body">
          <div class="work__top">
            <span class="work__badge" data-en="${escAttr(p.badge_en)}">${esc(p.badge)}</span>
            <span class="work__num">${num}</span>
          </div>
          <span class="work__arrow" aria-hidden="true">↗</span>
          <h3 class="work__title" data-en="${escAttr(p.title_en)}">${esc(p.title)}</h3>
          <div class="work__metric"><span data-en="${escAttr(p.metric_en)}">${esc(p.metric)}</span></div>
        </div>
      </article>`;
    })
    .join('\n\n');
}

// ---- HERO ---------------------------------------------------------
// "*kelime*" -> <em>kelime</em> (vurgu), satir/kelime yapisi animasyon icin korunur
const emph = (l) => esc(l).replace(/\*(.+?)\*/g, '<em>$1</em>');
const heroTitleInner = (lines = []) =>
  lines.map((l) => `<span class="line"><span class="word">${emph(l)}</span></span>`).join('');

function renderHero() {
  const h = readJson('sections/hero.json');
  const chips = (h.chips || []).map((c) => `<span class="chip">${esc(c)}</span>`).join('');
  return `      <p class="hero__eyebrow mono">
        <span class="hero__rec"><span class="dot"></span> REC</span>
        <span data-en="${escAttr(h.eyebrow_en)}">${esc(h.eyebrow)}</span>
      </p>
      <h1 class="hero__title" id="heroTitle">${heroTitleInner(h.title_tr)}</h1>
      <p class="hero__lede" data-en="${escAttr(h.lede_en)}">${esc(h.lede)}</p>
      <div class="hero__credits" aria-label="Çalışılan markalar">
        <span class="mono" data-en="${escAttr(h.credits_label_en)}">${esc(h.credits_label)}</span>
        ${chips}<span class="chip" data-en="${escAttr(h.chip_last_en)}">${esc(h.chip_last)}</span>
      </div>
      <div class="hero__actions">
        <a class="hero__cta hero__cta--solid fx-gradient" href="mailto:okanbayraktarr@gmail.com" data-modal-open><span data-en="${escAttr(h.cta_primary_en)}">${esc(h.cta_primary)}</span> <span aria-hidden="true">→</span></a>
        <a class="hero__cta hero__cta--ghost" href="#works" data-en="${escAttr(h.cta_secondary_en)}">${esc(h.cta_secondary)}</a>
      </div>`;
}

const renderMarquee = (key) => {
  const h = readJson('sections/hero.json');
  return (h[key] || [])
    .map((m) => {
      const en = m.en && m.en !== m.tr ? ` data-en="${escAttr(m.en)}"` : '';
      return `<span class="marquee__item"${en}>${esc(m.tr)}</span>`;
    })
    .join('');
};

// Hero basligi JS sabiti (dil gecisinde main.js kullanir).
// DUZ METIN dizileri gonderilir (HTML degil) — inline script guvenli kalir,
// HTML yapisini main.js kurar. *kelime* vurgusu orada <em>'e cevrilir.
function renderHeroJs() {
  const h = readJson('sections/hero.json');
  const data = { tr: h.title_tr || [], en: h.title_en || [] };
  return `<script>window.__HERO_TITLE=${JSON.stringify(data)}</script>`;
}

// ---- HAKKINDA (about) --------------------------------------------
function renderAbout() {
  const a = readJson('sections/about.json');
  // data-en-html: veri parcalari escAttr'lanir, <span class='whisper'> DUZ kalir (kacirmiyoruz)
  const enHeading = `${escAttr(a.heading_pre_en)} <span class='whisper'>${escAttr(a.heading_whisper_en)}</span> ${escAttr(a.heading_post_en)}`;
  return `      <div class="about__l">
        <span class="mono" style="color:var(--accent)" data-en="${escAttr(a.eyebrow_en)}">${esc(a.eyebrow)}</span>
        <h2 class="display" style="margin-top:1.4rem" data-en-html="${enHeading}">
          ${esc(a.heading_pre)}
          <span class="whisper">${esc(a.heading_whisper)}</span>
          ${esc(a.heading_post)}
        </h2>
      </div>
      <div class="about__r">
        <p class="lede" data-en="${escAttr(a.p1_en)}">${esc(a.p1)}</p>
        <p data-en="${escAttr(a.p2_en)}">${esc(a.p2)}</p>
        <dl class="about__meta">
          <dt data-en="${escAttr(a.expertise_label_en)}">${esc(a.expertise_label)}</dt><dd data-en="${escAttr(a.expertise_en)}">${esc(a.expertise)}</dd>
          <dt data-en="${escAttr(a.signature_label_en)}">${esc(a.signature_label)}</dt><dd>${esc(a.signature)}</dd>
        </dl>
      </div>`;
}

// ---- YETENEKLER (skills) -----------------------------------------
const liItem = (m) => {
  const en = m.en && m.en !== m.tr ? ` data-en="${escAttr(m.en)}"` : '';
  return `<li${en}>${esc(m.tr)}</li>`;
};
function renderSkills() {
  const s = readJson('sections/skills.json');
  return (s.skills || [])
    .map((k, i) => {
      const idx = String(i + 1).padStart(2, '0');
      const items = (k.items || []).map(liItem).join('\n          ');
      const tags = (k.tags || []).map((t) => `<span>${esc(t)}</span>`).join('');
      return `      <div class="skill" data-reveal>
        <div class="skill__head">
          <span class="skill__idx">${idx}</span>
          <span class="skill__tag-pill" data-en="${escAttr(k.tag_en)}">${esc(k.tag)}</span>
        </div>
        <h3 class="skill__title" data-en="${escAttr(k.title_en)}">${esc(k.title)}</h3>
        <p class="skill__lead" data-en="${escAttr(k.lead_en)}">${esc(k.lead)}</p>
        <p class="skill__body" data-en="${escAttr(k.body_en)}">${esc(k.body)}</p>
        <ul class="skill__list">
          ${items}
        </ul>
        <div class="skill__tags">${tags}</div>
      </div>`;
    })
    .join('\n');
}
const renderSkillsLede = () => {
  const s = readJson('sections/skills.json');
  return `<p class="skills-lede" data-reveal data-en="${escAttr(s.lede_en)}">${esc(s.lede)}</p>`;
};
const renderTechstack = () => {
  const s = readJson('sections/skills.json');
  const label = `<span class="techstack__label mono" data-en="${escAttr(s.techstack_label_en)}">${esc(s.techstack_label)}</span>`;
  const row = `<div class="techstack__row">\n        ${(s.techstack || []).map((t) => `<span>${esc(t)}</span>`).join('')}\n      </div>`;
  return `${label}\n      ${row}`;
};

// ---- HIZMET DETAY SAYFALARI (landing) ----------------------------
// Tum landing sayfalari ayni iskelet; tek generic renderer.
// Bolum etiketleri ("Neden ise yarar" vb.) tum sayfalarda ayni -> sabit.
const LP_LABELS = {
  why: { tr: 'Neden işe yarar', en: 'Why it works' },
  inc: { tr: 'Neler dahil', en: 'What’s included' },
  how: { tr: 'Nasıl çalışıyoruz', en: 'How we work' },
  faq: { tr: 'Sık sorulanlar', en: 'FAQ' },
};
const lpLabel = (k) => `<div class="lp__label"><span data-en="${escAttr(LP_LABELS[k].en)}">${esc(LP_LABELS[k].tr)}</span></div>`;
// *vurgu* destekli, oznitelik-guvenli (data-en-html ve innerHTML icin)
const emphEsc = (s = '') => escAttr(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

function renderLanding(slug) {
  const d = readJson(`landings/${slug}.json`);
  const nn = (i) => String(i + 1).padStart(2, '0');
  const trust = (d.trust || [])
    .map((t) => `<span><b>${esc(t.value)}</b>${t.label ? ` <span data-en="${escAttr(t.label_en)}">${esc(t.label)}</span>` : ''}</span>`)
    .join('');
  const benefits = (d.benefits || [])
    .map((b, i) => `      <div class="lp__benefit glass" data-reveal><span class="n">${nn(i)}</span><h4 data-en="${escAttr(b.title_en)}">${esc(b.title)}</h4><p data-en="${escAttr(b.body_en)}">${esc(b.body)}</p></div>`)
    .join('\n');
  const includes = (d.includes || []).map(liItem).join('\n      ');
  const steps = (d.steps || [])
    .map((s, i) => `      <div class="lp__step"><span class="n">${nn(i)}</span><h4 data-en="${escAttr(s.title_en)}">${esc(s.title)}</h4><p data-en="${escAttr(s.body_en)}">${esc(s.body)}</p></div>`)
    .join('\n');
  const faq = (d.faq || [])
    .map((f) => `      <details><summary data-en="${escAttr(f.q_en)}">${esc(f.q)}</summary><p data-en="${escAttr(f.a_en)}">${esc(f.a)}</p></details>`)
    .join('\n');
  return `    <div class="crumbs" data-reveal><span data-i18n="crumb_home">Anasayfa</span><span class="sep">/</span><span data-i18n="m_skills">Yetenekler</span><span class="sep">/</span><span data-en="${escAttr(d.crumb_en)}">${esc(d.crumb)}</span></div>

    <div class="lp__hero">
      <div class="lp__hero-l" data-reveal>
        <span class="lp__eyebrow mono" data-en="${escAttr(d.eyebrow_en)}">${esc(d.eyebrow)}</span>
        <h1 class="lp__title" data-en-html="${emphEsc(d.title_en)}">${emphEsc(d.title)}</h1>
        <p class="lp__lede" data-en="${escAttr(d.lede_en)}">${esc(d.lede)}</p>
        <div class="lp__cta-row">
          <button class="lp__cta lp__cta--solid fx-gradient" type="button" data-modal-open data-project="${escAttr(d.project)}" data-en="${escAttr(d.cta_en)}">${esc(d.cta)}</button>
          <a class="lp__cta lp__cta--ghost" href="#works" data-en="${escAttr(d.cta2_en)}">${esc(d.cta2)}</a>
        </div>
        <div class="lp__trust">${trust}</div>
      </div>
      <div class="lp__hero-r" data-reveal="scale"><div class="device"><div class="device__bar"><i></i><i></i><i></i></div><div class="device__screen"><img src="${escAttr(d.image)}" alt="${escAttr(d.image_alt)}" loading="lazy" /></div></div></div>
    </div>

    ${lpLabel('why')}
    <div class="lp__grid">
${benefits}
    </div>

    ${lpLabel('inc')}
    <ul class="lp__includes" data-reveal>
      ${includes}
    </ul>

    ${lpLabel('how')}
    <div class="lp__steps" data-reveal>
${steps}
    </div>

    ${lpLabel('faq')}
    <div class="lp__faq" data-reveal>
${faq}
    </div>

    <div class="lp__band" data-reveal>
      <h3 data-en="${escAttr(d.band_h_en)}">${esc(d.band_h)}</h3>
      <p data-en="${escAttr(d.band_p_en)}">${esc(d.band_p)}</p>
      <button class="lp__cta lp__cta--solid fx-gradient" type="button" data-modal-open data-project="${escAttr(d.project)}" data-en="${escAttr(d.band_cta_en)}">${esc(d.band_cta)}</button>
    </div>`;
}

// ---- SUREC (process) ---------------------------------------------
function renderProcessHead() {
  const d = readJson('sections/process.json');
  return `<span class="mono" style="color:var(--accent)" data-en="${escAttr(d.eyebrow_en)}">${esc(d.eyebrow)}</span>
        <h2 class="process__intro" data-scrub data-en="${escAttr(d.intro_en)}">${esc(d.intro)}</h2>`;
}
function renderProcess() {
  const d = readJson('sections/process.json');
  return (d.steps || [])
    .map((s, i) => {
      const ghost = String(i + 1).padStart(2, '0');
      const nEn = s.n_label_en && s.n_label_en !== s.n_label ? ` data-en="${escAttr(s.n_label_en)}"` : '';
      return `        <article class="step" data-step><span class="step__ghost">${ghost}</span><span class="step__n"${nEn}>${esc(s.n_label)}</span><h3 class="step__title" data-en="${escAttr(s.title_en)}">${esc(s.title)}</h3><p class="step__body" data-en="${escAttr(s.body_en)}">${esc(s.body)}</p></article>`;
    })
    .join('\n');
}

// ---- ILETISIM (contact) ------------------------------------------
function renderContact() {
  const c = readJson('sections/contact.json');
  const s = readJson('settings/contact.json');
  const enTitle = `${escAttr(c.title_pre_en)} <span class='w'>${escAttr(c.title_whisper_en)}</span> ${escAttr(c.title_post_en)}`;
  return `      <div data-reveal>
        <span class="mono" style="color:var(--accent)" data-en="${escAttr(c.eyebrow_en)}">${esc(c.eyebrow)}</span>
        <h2 class="contact__title" style="margin-top:1.4rem" data-en-html="${enTitle}">${esc(c.title_pre)} <span class="w">${esc(c.title_whisper)}</span> ${esc(c.title_post)}</h2>
        <p class="contact__lede" data-en="${escAttr(c.lede_en)}">${esc(c.lede)}</p>
        <a class="contact__cta" href="mailto:${escAttr(s.email)}" data-magnetic data-modal-open>
          <span data-en="${escAttr(c.cta_en)}">${esc(c.cta)}</span>
          <span class="g" aria-hidden="true">→</span>
        </a>
        <div class="contact__meta">
          <a class="mono" href="tel:${escAttr(s.phone)}">${esc(s.phone_display)}</a>
          <a class="mono" href="mailto:${escAttr(s.email)}">${esc(s.email)}</a>
          <span class="mono" data-en="${escAttr(s.location_en)}">${esc(s.location)}</span>
        </div>
        <p class="contact__tag mono"><span class="status-dot" style="display:inline-block;vertical-align:middle;margin-right:.5rem"></span> <span data-en="${escAttr(c.tag_en)}">${esc(c.tag)}</span></p>
      </div>`;
}

// ---- FORM (modal) — girdi nitelikleri BIREBIR korunur ------------
function renderForm() {
  const f = readJson('form/settings.json');
  const s = readJson('settings/contact.json');
  const options = (f.options || [])
    .map((o) => `              <option value="${escAttr(o.value)}" data-en="${escAttr(o.label_en)}">${esc(o.label)}</option>`)
    .join('\n');
  return `        <aside class="modal__aside">
          <span class="mono" style="color:var(--accent)" data-en="${escAttr(f.aside_eyebrow_en)}">${esc(f.aside_eyebrow)}</span>
          <h2 class="modal__title" id="modalTitle" data-en-html="${emphEsc(f.aside_title_en)}">${emphEsc(f.aside_title)}</h2>
          <p class="modal__lede" data-en="${escAttr(f.aside_lede_en)}">${esc(f.aside_lede)}</p>
          <ul class="modal__contact">
            <li><span class="mono" data-en="${escAttr(f.phone_label_en)}">${esc(f.phone_label)}</span><a href="tel:${escAttr(s.phone)}">${esc(s.phone_display)}</a></li>
            <li><span class="mono">E-posta</span><a href="mailto:${escAttr(s.email)}">${esc(s.email)}</a></li>
            <li><span class="mono" data-en="Location">Konum</span><span data-en="${escAttr(s.location_en)}">${esc(s.location)}</span></li>
          </ul>
        </aside>

        <form class="modal__form" id="contactForm" novalidate>
          <div class="field">
            <label for="f-name" data-en="${escAttr(f.name_label_en)}">${esc(f.name_label)}</label>
            <input id="f-name" name="name" type="text" autocomplete="name" required pattern="[^0-9]+" title="Ad soyad rakam içeremez" placeholder="${escAttr(f.name_ph)}" data-en-ph="${escAttr(f.name_ph_en)}" />
          </div>
          <div class="field-row">
            <div class="field">
              <label for="f-email">E-posta</label>
              <input id="f-email" name="email" type="email" autocomplete="email" required placeholder="${escAttr(f.email_ph)}" data-en-ph="${escAttr(f.email_ph_en)}" />
            </div>
            <div class="field">
              <label for="f-phone" data-en="${escAttr(f.phone_label_en)}">${esc(f.phone_label)}</label>
              <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+()\\s-]{10,}" title="Geçerli bir telefon numarası girin (en az 10 rakam)" placeholder="${escAttr(f.phone_ph)}" data-en-ph="${escAttr(f.phone_ph_en)}" />
            </div>
          </div>
          <div class="field">
            <label for="f-type" data-en="${escAttr(f.type_label_en)}">${esc(f.type_label)}</label>
            <select id="f-type" name="project_type">
${options}
            </select>
          </div>
          <div class="field">
            <label for="f-msg" data-en="${escAttr(f.msg_label_en)}">${esc(f.msg_label)}</label>
            <textarea id="f-msg" name="message" rows="4" required placeholder="${escAttr(f.msg_ph)}" data-en-ph="${escAttr(f.msg_ph_en)}"></textarea>
          </div>
          <!-- FormSubmit ayarları + bot tuzağı -->
          <input type="hidden" name="_subject" value="${escAttr(f.subject)}" />
          <input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <button class="modal__submit" type="submit">
            <span data-en="${escAttr(f.submit_en)}">${esc(f.submit)}</span><span class="g" aria-hidden="true">→</span>
          </button>
          <p class="modal__status" id="formStatus" role="status" aria-live="polite"></p>
        </form>`;
}

// ---- FOOTER -------------------------------------------------------
function renderFooter() {
  const f = readJson('sections/footer.json');
  const s = readJson('settings/contact.json');
  const link = (it) => {
    let href = it.href;
    if (href === 'mailto') href = `mailto:${s.email}`;
    else if (href === 'tel') href = `tel:${s.phone}`;
    const en = it.label_en ? ` data-en="${escAttr(it.label_en)}"` : '';
    return `<a href="${escAttr(href)}"${en}>${esc(it.label)}</a>`;
  };
  const col = (title, title_en, items) => {
    const h = title_en ? `<h4 data-en="${escAttr(title_en)}">${esc(title)}</h4>` : `<h4>${esc(title)}</h4>`;
    return `        <div class="footer__col">\n          ${h}\n          ${(items || []).map(link).join('\n          ')}\n        </div>`;
  };
  return `      <div class="footer__top">
        <span class="footer__brand">OB°</span>
        <span class="footer__tag" data-en="${escAttr(f.tag_en)}">${esc(f.tag)}</span>
      </div>
      <div class="footer__cols">
${col(f.col1_title, f.col1_title_en, f.col1)}
${col(f.col2_title, f.col2_title_en, f.col2)}
        <div class="footer__col">
          <h4 data-en="${escAttr(f.col3_title_en)}">${esc(f.col3_title)}</h4>
          <a href="mailto:${escAttr(s.email)}">${esc(s.email)}</a>
          <a href="tel:${escAttr(s.phone)}">${esc(s.phone_display)}</a>
          <span data-en="${escAttr(s.location_en)}">${esc(s.location)}</span>
        </div>
        <div class="footer__col">
          <h4>${esc(f.col4_title)}</h4>
          <span>${esc(f.copyright)}</span>
          <span data-en="${escAttr(f.studio_en)}">${esc(f.studio)}</span>
          <span data-en="${escAttr(f.rights_en)}">${esc(f.rights)}</span>
        </div>
      </div>
      <div class="footer__lockup">OB°</div>`;
}

// ---- MENÜ (alt seviye + meta + caption) --------------------------
function renderMenuSub() {
  const m = readJson('sections/menu.json');
  const items = (m.submenu || [])
    .map((it) => `        <li class="menu-item"><a class="menu-link" href="${escAttr(it.href)}" data-link data-en="${escAttr(it.label_en)}">${esc(it.label)}</a></li>`)
    .join('\n');
  return `<ul class="menu-level" data-level="1" data-id="yetenekler" data-title="${escAttr(m.submenu_title)}" data-title-en="${escAttr(m.submenu_title_en)}">
${items}
      </ul>`;
}
function renderMenuMeta() {
  const m = readJson('sections/menu.json');
  const s = readJson('settings/contact.json');
  return `<span class="mono">${esc(m.meta1)}</span>
      <span class="mono" data-en="${escAttr(s.location_en)}">${esc(s.location)}</span>`;
}
const renderCaption = () => {
  const m = readJson('sections/menu.json');
  return `<figcaption class="menu-testimonial__cap mono" data-en="${escAttr(m.caption_en)}">${esc(m.caption)}</figcaption>`;
};
const renderNavBack = () => {
  const m = readJson('sections/menu.json');
  return `<span data-en="${escAttr(m.back_en)}">${esc(m.back)}</span>`;
};

// ---- I18N sozlugu (main.js window.__I18N) ------------------------
function renderI18nJs() {
  const d = readJson('settings/labels.json');
  const obj = {};
  (d.items || []).forEach((i) => { if (i.key) obj[i.key] = { tr: i.tr, en: i.en }; });
  return `<script>window.__I18N=${JSON.stringify(obj)}</script>`;
}

// ---- isaretci -> renderer tablosu --------------------------------
const RENDERERS = {
  'CMS:SEO': renderSeo,
  'CMS:ABOUT': renderAbout,
  'CMS:FOOTER': renderFooter,
  'CMS:MENUSUB': renderMenuSub,
  'CMS:MENUMETA': renderMenuMeta,
  'CMS:MENUCAPTION': renderCaption,
  'CMS:NAVBACK': renderNavBack,
  'CMS:I18NJS': renderI18nJs,
  'CMS:PROCESSHEAD': renderProcessHead,
  'CMS:PROCESS': renderProcess,
  'CMS:CONTACT': renderContact,
  'CMS:FORM': renderForm,
  'CMS:LP_SHOPIFY': () => renderLanding('shopify'),
  'CMS:LP_WEB': () => renderLanding('web'),
  'CMS:LP_TEMA': () => renderLanding('tema'),
  'CMS:LP_SEO': () => renderLanding('seo'),
  'CMS:LP_PAZARLAMA': () => renderLanding('pazarlama'),
  'CMS:SKILLSLEDE': renderSkillsLede,
  'CMS:SKILLS': renderSkills,
  'CMS:TECHSTACK': renderTechstack,
  'CMS:WORKS': renderWorks,
  'CMS:HERO': renderHero,
  'CMS:MARQUEE1': () => renderMarquee('marquee1'),
  'CMS:MARQUEE2': () => renderMarquee('marquee2'),
  'CMS:HEROJS': renderHeroJs,
  'CMS:HEROSCROLL': () => {
    const h = readJson('sections/hero.json');
    return `<span data-en="${escAttr(h.scroll_en)}">${esc(h.scroll)}</span>`;
  },
};

function injectAll(html) {
  let out = html;
  for (const [marker, render] of Object.entries(RENDERERS)) {
    // (?![A-Z0-9_]) -> isaretci adindan sonra harf/rakam gelmesin:
    // "CMS:HERO" artik "CMS:HEROJS"/"CMS:HEROSCROLL" ile cakismaz.
    const re = new RegExp(`<!--\\s*${marker}(?![A-Z0-9_])[\\s\\S]*?-->`, 'g');
    out = out.replace(re, () => render());
  }
  return out;
}

export default function cmsPlugin() {
  return {
    name: 'ob-cms-injector',
    transformIndexHtml(html) {
      return injectAll(html);
    },
    configureServer(server) {
      server.watcher.add(CONTENT);
      server.watcher.on('all', (_e, file) => {
        if (file && file.includes(`${path.sep}content${path.sep}`)) {
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export { esc, escAttr, bi };
