# pentayazilim.com — Tam Site Analizi

> Analiz tarihi: 2026-06-04 · Kaynak: canlı site + `sitemap.xml` + build asset'leri (ham HTML/JS/CSS).
> Not: Site sunucu-render (Laravel Blade) olduğu için tüm içerik ham HTML'de gelir; analiz gerçek kaynak dosyalar üzerinden yapıldı, tahmin değil.

---

## 1) Site Haritası — Genel Yapı

Toplam **618 URL** (`sitemap.xml`). Kırılım:

| Kategori | Adet | Açıklama |
|---|---|---|
| **Kurumsal / Hizmet sayfaları** | ~36 | Ana menüdeki sekmeler (aşağıda) |
| **Referanslar (vaka sayfaları)** | ~430 | Her müşteri için ayrı sayfa (`/referanslar/<marka>/`) |
| **Blog yazıları** | 136 | `/blog/<slug>/` |
| **Ürünler** | 4 | `/urun/mesai`, `/urun/peku`, `/urun/penta-lms`, `/urun/penta-hrm` |
| **Yasal** | 3 | gizlilik, çerez, KVKK |
| **Dönüşüm/iletişim** | 3 | `/teklif-al`, `/iletisim`, `/performans-brief-formu` |

### Ana Menü (sekmeler)
Hizmet sayfaları (her biri ayrı landing):

- **Web:** `web-tasarim`, `web-yazilim`, `kurumsal-web-tasarim`, `kurumsal-web-site-tasarim`, `web-site-tasarim`, `en-iyi-web-tasarim-firmalari`, `ui-ux`
- **E-ticaret & Mobil:** `e-ticaret`, `mobil-uygulama`, `yazilim-projelendirme`
- **Tasarım:** `logo-tasarimi`, `kurumsal-kimlik-tasarimi`, `katalog-tasarimi`
- **Üretim:** `video-produksiyon`, `fotografcilik`, `icerik-hizmeti`
- **Pazarlama:** `seo`, `google-arama-agi-reklamlari`, `sosyal-medya-yonetimi`, `sosyal-medya-reklamlari`, `e-mail-pazarlama`
- **Altyapı/Destek:** `hosting-ve-sunucu`, `kurumsal-mail`, `teknik-destek-ve-bakim-hizmeti`
- **Kurumsal:** `hakkimizda`, `neden-biz`, `proje-sureclerimiz`, `urunlerimiz`, `referanslar`, `kariyer`, `blog`, `iletisim`, `teklif-al`, `odeme-bilgileri`

Çok dilli: **TR / EN / DE** (header'da `en`, `england`, `germany`, `de` bayrak ikonları; Londra ofisi + Almanya referansları).

---

## 2) Teknoloji Yığını

| Katman | Teknoloji | Kanıt |
|---|---|---|
| **Backend framework** | **Laravel (PHP)** | `penta_yazilim_session` + `XSRF-TOKEN` cookie'leri |
| **Admin / Form paneli** | **Filament** (Laravel) | `/js/filament/...`, `/css/filament/forms...` |
| **Reaktif katman** | **Livewire + Alpine.js** | app bundle'da 83× livewire, 84× alpine |
| **Build aracı** | **Vite** | `/build/assets/app-[hash].js`, `app-[hash].css`, `utils-[hash].css` |
| **CSS framework** | **Tailwind CSS** (özel config) | arbitrary variants, `duration-450`, `ease-manidar` gibi özel token'lar |
| **Slider** | **Swiper.js** | HTML'de 47× swiper sınıfı/init |
| **Lightbox** | **Fancybox** | galeri/medya büyütme |
| **Video** | **hls.js** (özel Alpine `hls()` bileşeni) | hover-önizleme + tam video streaming |
| **Web sunucusu** | **LiteSpeed** (origin) + **Cloudflare** (CDN/proxy) | `x-litespeed-cache-control`, `Server: cloudflare` |
| **Medya CDN** | `cdn.pentayazilim.com` | tüm görsel/video, otomatik `webp` conversions |
| **Tipografi** | **Inter Display** (+ sistem fontları) | CSS `font-family:Inter Display` |
| **Analitik/Pixel** | Google Tag Manager + GA4 (gtag) + Facebook Pixel | homepage script'leri |
| **Güvenlik** | HSTS, CSP (upgrade-insecure-requests), X-Frame SAMEORIGIN, nosniff, Permissions-Policy | response header'ları |

**Mimari özeti:** Klasik **TALL stack** (Tailwind + Alpine + Laravel + Livewire), Filament ile yönetilen, Vite ile derlenen, Cloudflare+LiteSpeed önbellekli, ayrı medya CDN'li sunucu-render bir kurumsal site. JS SPA **değil** — içerik HTML'de hazır gelir (SEO için ideal).

---

## 3) Animasyon & Etkileşim Sistemi

Önemli: **GSAP/ScrollMagic/Locomotive YOK.** Tüm hareket **CSS transition/animation + IntersectionObserver + Alpine** ile yapılıyor (hafif ve performanslı yaklaşım).

### a) Özel easing eğrileri (imza his buradan geliyor)
- `ease-manidar` → `cubic-bezier(.77,.16,.09,.94)` — dramatik, geç başlayıp hızlanan ease-in-out. En çok kullanılan (72×).
- `ease-kagitmiadam` → `cubic-bezier(.42,.97,.52,1.49)` — **yaylanmalı/overshoot** (son değer >1), "zıplama" hissi.
- Standart: `cubic-bezier(.4,0,.2,1)` (Tailwind default) çoğunlukta.

### b) Süre/gecikme sistemi (Tailwind token)
`duration-300` (345×), `duration-450` (112×), `duration-600` (108×), `duration-350` (43×) + `delay-0/50/100/300/600` ile **stagger** (sıralı) reveal.

### c) Scroll-reveal
`fx-reveal` + yön varyantları (`from-top`, `from-bottom` …). IntersectionObserver (app.js'te 4 örnek) elemana `reveal` sınıfı ekleyip `translate-y-0`'a getiriyor → klasik "kaydırınca belir" ama yön bazlı.

### d) Animasyonlu SVG logo (en dikkat çekici detay)
Header & footer logosu **canlı SVG**; harfler `<path>`. TR↔EN dil geçişinde harfler **3B perspektifte dönüyor** (`perspective(1000px) rotateX/rotateY`, CSS değişkenleri `--header-logo-letter-rotate`, `--…-translate`). `animate-tr` / `animate-en` sınıfları bu dönüşü tetikliyor.

### e) Video etkileşimi
Özel `x-data="hls(...)"` Alpine bileşeni: kart üzerinde **hafif önizleme** (`data-preview-src`), tıkla/hover'da **tam video** (`data-src`), `autoplay/loop/muted/playsinline`, `preload="none"` (performans). Poster = webp.

### f) Keyframe animasyonları (CSS)
`bgMove` (hareketli gradient arka plan), `blip`/`blipping` (nabız atan nokta — "canlı/online" göstergesi), `pulse`, `pulsePin` (`animate-pin-pulse` — harita pini), `spin`.

### g) Diğer efektler
`backdrop-blur` (17× — cam/glassmorphism), `mix-blend-screen`/`lighten` (video bindirme), `will-change` (GPU ipucu), Alpine `x-transition` (menü/modal aç-kapa).

---

## 4) Medya Envanteri

### Videolar (CDN, benzersiz — sitemap'ten doğrulandı, 23 adet)
Tümü `https://cdn.pentayazilim.com/media/media_item/...` altında `.mp4`, her birinin `-webp.webp` poster'ı var:

```
penta-yazilim-showreel.mp4        (hakkımızda — ana showreel)
video-penta-2.mp4 / video-kısa1.mp4 (ana sayfa hero — önizleme+tam)
web-tasarim-penta-yazilim.mp4
penta-responsive.mp4
video-e-ticare2t.mp4              (e-ticaret)
e-mail-marketing255.mp4           (e-mail pazarlama)
google-ads_1-1.mp4                (google reklam)
yazılım-projelendirme.mp4
teknik-destek.mp4
icerik.mp4
kurumsal-mail.mp4
server.mp4                        (hosting/sunucu)
+ 3.mp4, 4.mp4, 6.mp4, 12.mp4, 13.mp4, 21.mp4, 102/104/105/107.mp4
ana sayfa arka plan: /assets/video/22.mp4
```
Her hizmet sayfasının kendi tanıtım videosu var. Toplam 51 video referansı (sayfalar arası tekrarlı).

### Görseller
- **Format:** neredeyse tamamı **WebP** (tek ana sayfada **535 webp**, sadece 4 png). GIF kullanılmıyor — yerine `.mp4`/webp tercih edilmiş.
- **Responsive conversions:** CDN otomatik boyut varyantları üretiyor (`/conversions/...-webp.webp`).
- **İkonlar:** `/assets/image/icon/*.webp` (dil bayrakları, UI ikonları).
- **Referans logoları:** ~430 müşteri logosu (referans sayfaları + ana sayfa logo duvarı).

### Tipografi
**Inter Display** (başlık+gövde), fallback sistem fontları.

---

## 5) Entegrasyonlar
- Google Tag Manager + GA4 (gtag)
- Facebook Pixel (fbq)
- YouTube embed (13×)
- Cloudflare (NEL/Report-To, CDN)
- Çok dilli yapı (TR/EN/DE)
- Cookie consent (Alpine `cookieConsent` bileşeni)
- Uluslararası telefon input (`phoneInputFormComponent`) — formlarda ülke kodu seçici

---

## 6) Bizim Projeye Çıkarımlar (Okan Bayraktar sitesi)

Senin sitenle örtüşen ve "çalınabilir" iyi fikirler:

1. **Özel easing imzası** — Penta'nın hissi `ease-manidar` ve overshoot'lu `ease-kagitmiadam`'dan geliyor. Bizde de `--ease-out` var; bir **overshoot easing** ekleyip CTA/kart reveal'lerinde kullanmak premium his katar.
2. **Hover-önizleme video kartları** — referans/iş kartlarında hafif önizleme → tam video. Senin "Yapılan İşler" bölümün için güçlü (şu an statik SVG; ileride gerçek iş videoları).
3. **Animasyonlu logo** — 3B dönen harf logosu güçlü bir imza. Senin "OB°" markan için benzeri yapılabilir.
4. **WebP + responsive conversions** — GIF yerine mp4/webp. Bizde de görseller webp olmalı.
5. **IntersectionObserver reveal** (GSAP'siz) — zaten bizim yaklaşımımız; doğru yoldayız.
6. **Tek hizmet = tek landing** — her hizmet için ayrı, video'lu, SEO odaklı sayfa. Senin yeteneklerin de ileride ayrı sayfalara bölünebilir.
7. **Showreel hero** — Penta hero'da video kullanıyor; senin "sinematik" konumlandırman için showreel hero hâlâ en güçlü seçenek (elinde reel olduğunda).

---

---

## 7) CANLI YAKALAMA (Playwright ile — gerçek tarayıcıda doğrulandı)

`penta_capture.mjs` ile 4 sayfa headless Chromium'da açıldı; video kaydedildi, scroll boyunca ekran görüntüsü alındı ve `document.getAnimations()` ile **o an çalışan** animasyonlar dökümlendi. Çıktılar: `penta-capture/` (37 ekran görüntüsü, 4 `.webm` video, `report.json`).

### Statik analizde görünmeyen, canlı yakalanan animasyonlar
| Animasyon | Süre / Easing | Ne yapıyor |
|---|---|---|
| `objectMove1-4` | 600ms linear | Hero'da **yüzen UI objeleri** (küçük kart/ikonlar süzülüyor) |
| `maskMove1-2` | 1000ms linear | Görsellerde **maske kaydırma** (reveal/parallax dokusu) |
| `bgMove` | 4000ms linear | CTA butonunda **hareketli gradient** (`fx-button`) |
| `blipping` | 750ms linear | **Nabız atan canlı nokta** (online göstergesi) — SVG path |
| video köşe yuvarlaklığı | 450ms **`cubic-bezier(.42,.97,.52,1.49)`** | Video açılırken köşeler **yaylanarak** yuvarlanıyor (overshoot = `ease-kagitmiadam`) |
| `play-trigger` opacity | 450ms overshoot | Play düğmesi katmanı yaylanarak beliriyor |
| swiper `transform` | 1000ms ease | Otomatik kayan slider |

> Doğrulama: imza overshoot easing'i (`.42,.97,.52,1.49`) gerçekten **video reveal**'lerinde çalışıyor — sitenin "yaylanan" hissinin kaynağı bu.

### Canlı video davranışı
- **Global ambient arka plan videosu** `assets/video/22.mp4` (1920×1080) her sayfada otomatik oynuyor — `opacity-20 mix-blend-screen` + alttan maske ile çok hafif doku olarak.
- Hero kart videosu `video-kısa1.mp4` **önizleme**, hover/etkileşimde tam video.
- Referans sayfasında **projeye özel** video (`Sahibinden.mp4`, 1920×1360) laptop mockup içinde.
- `105.mp4` (400×502 **dikey**) tekrarlı showcase videosu.
- Ana sayfa tek açılışta **342 medya** dosyası yükledi.

### Gözle görülen tasarım dili (ekran görüntülerinden)
- **Ana sayfa hero:** koyu lacivert/siyah zemin, parlayan **laptop mockup** + Penta "R" logosu, başlıkta **typewriter (daktilo) yazı animasyonu** ("Bi_" imleci), mor CTA.
- **İç bölümler:** canlı **mor→mavi gradient** panolar, **glassmorphism** yüzen kartlar (yukarıdaki objectMove), güvenlik kalkanı + dev `%80` istatistik.
- **Hakkımızda:** "Zamanın Ötesinde Bir Yer" dev başlık + sağda ekip/ofis foto kolajı; showreel videosu.
- **Referans sayfası:** breadcrumb → büyük başlık → meta (Müşteri / Yıl / Hizmet) → "Prototipi İncele" + "Canlı Siteyi Gör" → laptop'ta proje videosu.
- Tüm tipografi büyük, kalın **Inter Display**.

### Nasıl tekrar çalıştırılır
```
node penta_capture.mjs        # penta-capture/ altına yeniden üretir
```

---

## Ek: Tam URL listeleri
- Tüm sayfalar: `sitemap.xml` (618 URL) — bu repodaki `/tmp/penta_sitemap.xml`'den çekildi.
- Referans markaları (~430) ve blog yazıları (136) tam liste sitemap'te mevcut; istenirse ayrı dosyaya dökülebilir.
