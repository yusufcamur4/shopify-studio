const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const root = document.documentElement;

// menü ↔ geri butonu köprüsü
let lastMenuCat = null;
let openMenuFn = null;
let drillToFn = null;

/* ============================================================
   HERO — arka plan videosu (HLS)
   ============================================================ */
initHeroVideo();
function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video || reduce) return; // reduced-motion'da statik arka plan kalsın
  const SRC = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
  video.addEventListener('playing', () => video.classList.add('is-ready'), { once: true });

  const useNative = () => { video.src = SRC; };

  // hls.js'i CDN'den dinamik yükle (npm bağımlılığı eklemeden).
  // Önce hls.js: seviye kontrolü verir, en yüksek rendition'ı zorlayabiliriz.
  import('https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.mjs')
    .then(({ default: Hls }) => {
      if (Hls && Hls.isSupported()) {
        // arka plan kalitesinden ödün verme: çözünürlüğü oynatıcı boyutuna kısma
        const hls = new Hls({ capLevelToPlayerSize: false });
        hls.loadSource(SRC);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // en yüksek rendition'ı zorla (akışkan doku net görünsün)
          hls.currentLevel = hls.levels.length - 1;
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        useNative(); // Safari/iOS yerel HLS
      }
    })
    .catch(() => {
      // CDN'e erişilemezse yerel HLS'e düş (Safari/iOS)
      if (video.canPlayType('application/vnd.apple.mpegurl')) useNative();
    });
}

/* ============================================================
   PENTA-STİLİ OVERLAY MENÜ — aç/kapa + drill-down kategori geçişi
   ============================================================ */
const menuTrigger = document.getElementById('menuTrigger');
const menuField = document.getElementById('menuField');
const menuCtl = document.getElementById('menuCtl');

if (menuTrigger && menuField) {
  const levels = [...menuField.querySelectorAll('.menu-level')];
  const level0 = menuField.querySelector('.menu-level[data-level="0"]');
  // breadcrumb öğesini oluştur
  const crumb = document.createElement('span');
  crumb.className = 'menu-crumb';
  menuField.appendChild(crumb);

  const stack = []; // drill yığını (parent seviyeler)
  let current = level0;

  // müşteri deneyim videosu — menü açılınca oynar, kapanınca durur/susar
  const menuVideo = document.getElementById('menuVideo');
  const menuTestimonial = document.getElementById('menuTestimonial');
  const menuVideoSound = document.getElementById('menuVideoSound');
  if (menuVideo && menuTestimonial) {
    // dosya geçerli bir videoysa görünür yap (yoksa boş kara kutu göstermeyiz)
    const revealTestimonial = () => {
      menuTestimonial.classList.add('has-video');
      if (menuField.classList.contains('is-open')) playMenuVideo(); // menü zaten açıksa hemen başlat
    };
    // metadata <video> etiketi main.js'ten önce parse edildiği için zaten yüklenmiş olabilir
    if (menuVideo.readyState >= 1) revealTestimonial();
    else menuVideo.addEventListener('loadedmetadata', revealTestimonial, { once: true });
    if (menuVideoSound) {
      menuVideoSound.addEventListener('click', (e) => {
        e.stopPropagation(); // tıklama menüyü kapatmasın
        menuVideo.muted = !menuVideo.muted;
        menuVideoSound.firstElementChild.textContent = menuVideo.muted ? '🔇' : '🔊';
        if (!menuVideo.muted) menuVideo.play().catch(() => {});
      });
    }
  }
  function playMenuVideo() {
    if (!menuVideo || !menuTestimonial.classList.contains('has-video') || reduce) return;
    menuVideo.currentTime = 0;
    menuVideo.play().catch(() => {});
  }
  function stopMenuVideo() {
    if (!menuVideo) return;
    menuVideo.pause();
    menuVideo.currentTime = 0;
    menuVideo.muted = true; // bir sonraki açılış yine sessiz başlasın
    if (menuVideoSound) menuVideoSound.firstElementChild.textContent = '🔇';
  }

  function showLevel(next, parentTitle) {
    if (next === current) return;
    current.classList.add('is-leaving');
    current.classList.remove('is-active');
    const leaving = current;
    setTimeout(() => leaving.classList.remove('is-leaving'), 500);
    next.classList.add('is-active');
    current = next;
    const drilled = next !== level0;
    menuField.classList.toggle('is-drilled', drilled);
    crumb.textContent = drilled ? (parentTitle || '') : '';
  }

  function openMenu() {
    root.classList.add('menu-open');
    menuField.classList.add('is-open');
    current.classList.add('is-active'); // seviye-0 öğeleri stagger ile gelsin
    menuTrigger.setAttribute('aria-expanded', 'true');
    menuField.setAttribute('aria-hidden', 'false');
    playMenuVideo();
  }
  function closeMenu() {
    root.classList.remove('menu-open');
    menuField.classList.remove('is-open');
    menuTrigger.setAttribute('aria-expanded', 'false');
    menuField.setAttribute('aria-hidden', 'true');
    stopMenuVideo();
    // kapanınca seviyeyi sıfırla (panel inerken görünmez)
    setTimeout(() => {
      stack.length = 0;
      levels.forEach((l) => l.classList.remove('is-active', 'is-leaving'));
      current = level0; // is-active bir sonraki açılışta eklenecek
      menuField.classList.remove('is-drilled');
      crumb.textContent = '';
    }, 650);
  }

  menuTrigger.addEventListener('click', () =>
    menuField.classList.contains('is-open') ? closeMenu() : openMenu()
  );

  // kapat / geri butonu
  menuCtl.addEventListener('click', () => {
    if (current !== level0) {
      const popped = stack.pop();
      const prevLevel = popped ? popped.level : level0;
      const parentTitle = stack.length ? stack[stack.length - 1].title : '';
      showLevel(prevLevel, parentTitle);
    } else {
      closeMenu();
    }
  });

  // drill (alt kategori aç) — yeniden kullanılabilir
  function drillTo(id) {
    const target = menuField.querySelector(`.menu-level[data-id="${id}"]`);
    if (!target || target === current) return;
    const title = (root.getAttribute('data-lang') === 'en' && target.getAttribute('data-title-en'))
      ? target.getAttribute('data-title-en') : target.getAttribute('data-title');
    stack.push({ level: current, title });
    showLevel(target, title);
  }
  menuField.querySelectorAll('[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => drillTo(btn.getAttribute('data-open')));
  });

  // menü linkleri → sayfa yönlendirme (menüyü kapat + ilgili sayfaya geç)
  menuField.querySelectorAll('.menu-link[data-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      closeMenu();
      navigate(pageFromHash(href)); // navigate: aşağıda tanımlı (hoisted)
    });
  });

  // geri butonu için dışa aç
  openMenuFn = openMenu;
  drillToFn = drillTo;

  // ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuField.classList.contains('is-open')) {
      current !== level0 ? menuCtl.click() : closeMenu();
    }
  });

  // tetikleyici: fareye TERS yönde manyetik (Penta fx-move-opposite-mouse)
  if (fine && !reduce) {
    menuTrigger.addEventListener('mousemove', (e) => {
      const r = menuTrigger.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      menuTrigger.style.transform = `translate(${-x * 0.25}px, ${-y * 0.4}px)`;
    });
    menuTrigger.addEventListener('mouseleave', () => { menuTrigger.style.transform = ''; });
  }
}

/* ============================================================
   GERİ BUTONU — iç sayfadan menüye dön (geldiğin kategoride)
   ============================================================ */
const navBack = document.getElementById('navBack');
if (navBack) {
  navBack.addEventListener('click', () => {
    if (!openMenuFn) return;
    openMenuFn();
    // geldiğin alt kategoriye geri aç (ör. Yetenekler)
    if (lastMenuCat && drillToFn) setTimeout(() => drillToFn(lastMenuCat), 80);
  });
}

/* ============================================================
   MARQUEE — track içeriğini iki kez kopyala (kesintisiz loop)
   ============================================================ */
document.querySelectorAll('[data-marquee]').forEach((track) => {
  track.innerHTML += track.innerHTML;
});

/* ============================================================
   DATA-REVEAL — IntersectionObserver
   ============================================================ */
if (reduce) {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
} else {
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => revealIO.observe(el));
}

/* ============================================================
   02 WORK — 3D TILT + SHEEN
   ============================================================ */
if (fine && !reduce) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const MAX = 12;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (0.5 - py) * MAX * 2;
      const ry = (px - 0.5) * MAX * 2;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ============================================================
   04 SÜREÇ — PINNED YATAY RAIL + scrub başlık
   ============================================================ */
const process = document.getElementById('process');
const rail = document.querySelector('[data-rail]');
const progressBar = document.querySelector('[data-progress]');
const scrub = document.querySelector('[data-scrub]');
const steps = [...document.querySelectorAll('[data-step]')];
const pinActive = () => window.innerWidth > 900 && !reduce;

let railTicking = false;
function updateRail() {
  railTicking = false;
  if (!process || !rail) return;
  if (!pinActive()) { rail.style.transform = ''; return; }

  const rect = process.getBoundingClientRect();
  const total = process.offsetHeight - window.innerHeight;
  const scrolled = Math.min(Math.max(-rect.top, 0), total);
  const prog = total > 0 ? scrolled / total : 0;

  const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
  rail.style.transform = `translateX(${-prog * maxScroll}px)`;
  if (progressBar) progressBar.style.width = `${prog * 100}%`;

  // aktif adım
  const active = Math.round(prog * (steps.length - 1));
  steps.forEach((s, i) => s.classList.toggle('is-active', i === active));

  // scrub başlık gri → beyaz
  if (scrub) {
    const c = Math.round(107 + (244 - 107) * prog);
    scrub.style.color = `rgb(${c},${Math.round(105 + (242 - 105) * prog)},${Math.round(100 + (237 - 100) * prog)})`;
  }
}
function onScroll() {
  if (!railTicking) { requestAnimationFrame(updateRail); railTicking = true; }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateRail);
updateRail();
// mobil/reduced: ilk adımı aktif göster
if (!pinActive() && steps[0]) steps[0].classList.add('is-active');

/* ============================================================
   STATS — sayaç (IO tetikli, stagger)
   ============================================================ */
const statsWrap = document.querySelectorAll('[data-stat]');
function runCounter(el) {
  const node = el.querySelector('[data-count]');
  if (!node) return;
  const target = parseInt(node.dataset.count, 10);
  if (reduce) { node.textContent = target; return; }
  const dur = 1600;
  const start = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const i = [...statsWrap].indexOf(el);
      setTimeout(() => { el.classList.add('is-visible'); runCounter(el); }, i * 130);
      statIO.unobserve(el);
    }
  });
}, { threshold: 0.4 });
statsWrap.forEach((s) => statIO.observe(s));

/* ============================================================
   MANYETİK BUTONLAR
   ============================================================ */
if (fine && !reduce) {
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ============================================================
   CUSTOM DUAL CURSOR
   ============================================================ */
if (fine && !reduce) {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });
  function ringLoop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ringLoop);
  }
  requestAnimationFrame(ringLoop);

  const hoverSel = 'a, button, [data-tilt], [data-magnetic]';
  document.querySelectorAll(hoverSel).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   EN ÜSTE DÖN
   ============================================================ */
const toTop = document.getElementById('toTop');
if (toTop) {
  const SHOW_AT = 600; // px scroll sonrası görünür
  let topTicking = false;
  function updateToTop() {
    topTicking = false;
    toTop.classList.toggle('is-visible', window.scrollY > SHOW_AT);
  }
  window.addEventListener('scroll', () => {
    if (!topTicking) { requestAnimationFrame(updateToTop); topTicking = true; }
  }, { passive: true });
  updateToTop();
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
}

/* ============================================================
   İLETİŞİM MODAL — aç/kapa + form gönderimi
   ============================================================ */
const modal = document.getElementById('contactModal');
if (modal) {
  // FormSubmit.co: backend gerektirmeden e-postaya iletir.
  // İlk gönderimde bu adrese bir aktivasyon maili gelir; onaylanınca canlı olur.
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/okanbayraktarr@gmail.com';
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = form.querySelector('.modal__submit');
  let lastFocus = null;

  function openModal(project) {
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    root.classList.add('modal-open');
    // landing CTA'sından gelen proje türünü önseç
    if (project) {
      const sel = form.querySelector('#f-type');
      if (sel && [...sel.options].some((o) => o.value === project)) sel.value = project;
    }
    const first = form.querySelector('input, textarea, select');
    if (first) setTimeout(() => first.focus(), 60);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    root.classList.remove('modal-open');
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-modal-open]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); openModal(el.getAttribute('data-project')); });
  });
  modal.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  const isEN = () => root.getAttribute('data-lang') === 'en';
  const FORM_MSG = {
    required: { tr: 'Lütfen zorunlu alanları doldur.', en: 'Please fill in the required fields.' },
    thanks:   { tr: 'Teşekkürler!', en: 'Thank you!' },
    sending:  { tr: 'Gönderiliyor…', en: 'Sending…' },
    sent:     { tr: 'Teşekkürler! Mesajın ulaştı, 24 saat içinde dönüş yapacağım.', en: 'Thank you! Your message is in — I’ll reply within 24 hours.' },
    failed:   { tr: 'Bağlantı kurulamadı. E-posta uygulaman açılıyor…', en: 'Connection failed. Opening your email app…' },
  };
  const t = (k) => FORM_MSG[k][isEN() ? 'en' : 'tr'];
  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = 'modal__status' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // basit doğrulama
    let valid = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const ok = f.checkValidity();
      f.closest('.field')?.classList.toggle('invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) { setStatus(t('required'), 'err'); return; }
    // bot tuzağı dolmuşsa sessizce başarı göster
    if (form.querySelector('[name="_honey"]').value) { setStatus(t('thanks'), 'ok'); return; }

    submitBtn.disabled = true;
    setStatus(t('sending'));
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error('network');
      form.reset();
      setStatus(t('sent'), 'ok');
      setTimeout(closeModal, 2600);
    } catch (err) {
      // ağ/servis hatası → mailto'ya düş
      const d = Object.fromEntries(new FormData(form));
      const body = encodeURIComponent(
        `Ad: ${d.name}\nE-posta: ${d.email}\nTelefon: ${d.phone || '-'}\nProje: ${d.project_type}\n\n${d.message}`
      );
      setStatus(t('failed'), 'err');
      window.location.href = `mailto:okanbayraktarr@gmail.com?subject=${encodeURIComponent('OB° Stüdyo — Yeni proje talebi')}&body=${body}`;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   SAYFA YÖNLENDİRME (ana sayfa = sadece hero) + perde geçişi
   ============================================================ */
const curtain = document.getElementById('curtain');

function pageFromHash(hash) {
  const el = hash && hash.length > 1 ? document.querySelector(hash) : null;
  if (!el) return 'home';
  const holder = el.closest('[data-page]') || el;
  return holder.getAttribute('data-page') || 'home';
}

function showPage(name) {
  document.querySelectorAll('[data-page]').forEach((p) => {
    p.classList.toggle('page-hidden', p.getAttribute('data-page') !== name);
  });
  // görünür sayfanın reveal içeriğini anında göster
  document.querySelectorAll(`[data-page="${name}"] [data-reveal]`).forEach((el) => el.classList.add('is-visible'));
  root.setAttribute('data-route', name);
  // geri butonu: bu sayfa hangi kategoriden açılır? (skill-* → Yetenekler, diğerleri → ana menü)
  lastMenuCat = name.startsWith('skill-') ? 'yetenekler' : null;
  // aktif menü öğesi
  document.querySelectorAll('.menu-link[data-link]').forEach((a) => {
    a.classList.toggle('is-current', pageFromHash(a.getAttribute('href')) === name);
  });
  window.scrollTo(0, 0);
  // süreç rail'i ve sayaçları yeniden hesapla
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
  const id = name === 'home' ? '' : '#' + name;
  if (('#' + (name === 'home' ? '' : name)) !== location.hash) {
    history.replaceState(null, '', id || location.pathname);
  }
}

function navigate(name) {
  if (reduce || !curtain) { showPage(name); return; }
  curtain.classList.remove('is-falling');
  curtain.classList.add('is-rising');
  setTimeout(() => {
    showPage(name);
    curtain.classList.remove('is-rising');
    curtain.classList.add('is-falling');
    setTimeout(() => curtain.classList.remove('is-falling'), 650);
  }, 560);
}

// menü dışı tüm iç linkler (logo, footer, hero CTA) → sayfa yönlendirme
document.querySelectorAll('a[href^="#"]:not(.menu-link)').forEach((a) => {
  a.addEventListener('click', (e) => {
    const hash = a.getAttribute('href');
    if (!hash || hash.length < 2) return;
    e.preventDefault();
    navigate(pageFromHash(hash));
  });
});

// geri/ileri tuşu
window.addEventListener('popstate', () => showPage(pageFromHash(location.hash)));

// ilk yükleme: hash varsa o sayfa, yoksa sadece hero
showPage(pageFromHash(location.hash));

/* ============================================================
   DİL GEÇİŞİ (TR/EN) + 3B logo animasyonu + i18n
   ============================================================ */
const I18N = {
  menu:        { tr: 'Menü', en: 'Menu' },
  m_about:     { tr: 'Hakkımda', en: 'About' },
  m_skills:    { tr: 'Yetenekler', en: 'Capabilities' },
  m_works:     { tr: 'İşler', en: 'Work' },
  m_process:   { tr: 'Süreç', en: 'Process' },
  m_contact:   { tr: 'İletişim', en: 'Contact' },
  hero_lede:   {
    tr: 'Sinema setlerinden gelen ışık, ritim ve hikâye disiplinini; markaların web sitesine, görsel kimliğine ve dijital vitrinine taşıyoruz.',
    en: 'We bring the light, rhythm and storytelling discipline of film sets to brands — through their website, visual identity and digital storefront.',
  },
  hero_works:  { tr: 'İşleri Gör', en: 'See Work' },
  works_title: { tr: 'Daha Önce Yapılan İşler', en: 'Selected Work' },
  skills_title:{ tr: 'Yetenekler', en: 'Capabilities' },
  crumb_home:  { tr: 'Anasayfa', en: 'Home' },
  stats_eyebrow:{ tr: 'Gerçek rakamlar · sürekli güncel', en: 'Real numbers · always current' },
};
const HERO_TITLE = {
  tr: '<span class="line"><span class="word">Markanı</span></span><span class="line"><span class="word"><em>sinematik</em> bir</span></span><span class="line"><span class="word">dünyaya taşıyoruz.</span></span>',
  en: '<span class="line"><span class="word">We bring your brand</span></span><span class="line"><span class="word">into a <em>cinematic</em></span></span><span class="line"><span class="word">world.</span></span>',
};
const langWrap = document.getElementById('lang');
function setLang(lang) {
  if (root.getAttribute('data-lang') === lang) return;
  if (!reduce) { root.classList.add('lang-anim'); setTimeout(() => root.classList.remove('lang-anim'), 720); }
  root.setAttribute('data-lang', lang);
  root.lang = lang;
  if (langWrap) langWrap.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.lang === lang));
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const dict = I18N[el.getAttribute('data-i18n')];
    if (dict && dict[lang]) el.textContent = dict[lang];
  });
  // genel çeviri: data-en (metin) · data-en-html (markup) · data-en-ph (placeholder)
  document.querySelectorAll('[data-en]').forEach((el) => {
    if (el.__tr === undefined) el.__tr = el.textContent;
    el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.__tr;
  });
  document.querySelectorAll('[data-en-html]').forEach((el) => {
    if (el.__trh === undefined) el.__trh = el.innerHTML;
    el.innerHTML = lang === 'en' ? el.getAttribute('data-en-html') : el.__trh;
  });
  document.querySelectorAll('[data-en-ph]').forEach((el) => {
    if (el.__trp === undefined) el.__trp = el.getAttribute('placeholder') || '';
    el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-ph') : el.__trp);
  });
  const ht = document.getElementById('heroTitle');
  if (ht && HERO_TITLE[lang]) ht.innerHTML = HERO_TITLE[lang]; // satır/kelime yapısı korunur, rise yeniden oynar
}
if (langWrap) {
  langWrap.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  root.setAttribute('data-lang', 'tr');
}
