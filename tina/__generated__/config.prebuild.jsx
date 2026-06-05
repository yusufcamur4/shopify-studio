// tina/config.ts
import { defineConfig } from "tinacms";
var config_default = defineConfig({
  branch: "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    // Panel public/admin'e uretilir; vite bunu dist/admin'e kopyalar -> canlida /admin
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "works",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      // -------------------------------------------------------- SEO
      {
        name: "seo",
        label: "SEO",
        path: "content/seo",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "title", label: "Sayfa Ba\u015Fl\u0131\u011F\u0131 (title)", isTitle: true, required: true },
          { type: "string", name: "description", label: "Meta A\xE7\u0131klama", ui: { component: "textarea" }, description: "Arama sonu\xE7lar\u0131nda g\xF6r\xFCnen a\xE7\u0131klama (~155 karakter)" },
          { type: "image", name: "og_image", label: "Sosyal Payla\u015F\u0131m G\xF6rseli (OG)" },
          { type: "string", name: "keywords", label: "Anahtar Kelimeler", list: true }
        ]
      },
      // ------------------------------------------------------- HERO
      {
        name: "hero",
        label: "Hero (A\xE7\u0131l\u0131\u015F)",
        path: "content/sections",
        match: { include: "hero" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "\xDCst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "\xDCst Etiket (EN)" },
          { type: "string", name: "title_tr", label: "Ba\u015Fl\u0131k Sat\u0131rlar\u0131 (TR)", list: true, description: "Her sat\u0131r ayr\u0131. Vurgu i\xE7in *kelime* yaz (e\u011Fik g\xF6sterilir)." },
          { type: "string", name: "title_en", label: "Ba\u015Fl\u0131k Sat\u0131rlar\u0131 (EN)", list: true, description: "Her sat\u0131r ayr\u0131. Vurgu i\xE7in *word*." },
          { type: "string", name: "lede", label: "Alt Metin (TR)", ui: { component: "textarea" } },
          { type: "string", name: "lede_en", label: "Alt Metin (EN)", ui: { component: "textarea" } },
          { type: "string", name: "credits_label", label: "\u0130\u015F Birlikleri Etiketi (TR)" },
          { type: "string", name: "credits_label_en", label: "\u0130\u015F Birlikleri Etiketi (EN)" },
          { type: "string", name: "chips", label: "Marka Etiketleri", list: true },
          { type: "string", name: "chip_last", label: "Son Etiket (TR)" },
          { type: "string", name: "chip_last_en", label: "Son Etiket (EN)" },
          { type: "string", name: "cta_primary", label: "Ana Buton (TR)" },
          { type: "string", name: "cta_primary_en", label: "Ana Buton (EN)" },
          { type: "string", name: "cta_secondary", label: "\u0130kincil Buton (TR)" },
          { type: "string", name: "cta_secondary_en", label: "\u0130kincil Buton (EN)" },
          { type: "string", name: "scroll", label: "Kayd\u0131r Etiketi (TR)" },
          { type: "string", name: "scroll_en", label: "Kayd\u0131r Etiketi (EN)" },
          { type: "object", name: "marquee1", label: "\xDCst Kayan \u015Eerit", list: true, ui: { itemProps: (i) => ({ label: i?.tr }) }, fields: [{ type: "string", name: "tr", label: "TR" }, { type: "string", name: "en", label: "EN" }] },
          { type: "object", name: "marquee2", label: "Alt Kayan \u015Eerit", list: true, ui: { itemProps: (i) => ({ label: i?.tr }) }, fields: [{ type: "string", name: "tr", label: "TR" }, { type: "string", name: "en", label: "EN" }] }
        ]
      },
      // --------------------------------------------------- HAKKINDA
      {
        name: "hakkinda",
        label: "Hakk\u0131nda",
        path: "content/sections",
        match: { include: "about" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "\xDCst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "\xDCst Etiket (EN)" },
          { type: "string", name: "heading_pre", label: "Ba\u015Fl\u0131k \u2014 1. K\u0131s\u0131m (TR)" },
          { type: "string", name: "heading_whisper", label: "Ba\u015Fl\u0131k \u2014 Vurgu (TR)", description: "\u0130nce/italik g\xF6sterilen orta k\u0131s\u0131m" },
          { type: "string", name: "heading_post", label: "Ba\u015Fl\u0131k \u2014 Son K\u0131s\u0131m (TR)" },
          { type: "string", name: "heading_pre_en", label: "Ba\u015Fl\u0131k \u2014 1. K\u0131s\u0131m (EN)" },
          { type: "string", name: "heading_whisper_en", label: "Ba\u015Fl\u0131k \u2014 Vurgu (EN)" },
          { type: "string", name: "heading_post_en", label: "Ba\u015Fl\u0131k \u2014 Son K\u0131s\u0131m (EN)" },
          { type: "string", name: "p1", label: "Paragraf 1 (TR)", ui: { component: "textarea" } },
          { type: "string", name: "p1_en", label: "Paragraf 1 (EN)", ui: { component: "textarea" } },
          { type: "string", name: "p2", label: "Paragraf 2 (TR)", ui: { component: "textarea" } },
          { type: "string", name: "p2_en", label: "Paragraf 2 (EN)", ui: { component: "textarea" } },
          { type: "string", name: "expertise_label", label: "Uzmanl\u0131k Etiketi (TR)" },
          { type: "string", name: "expertise_label_en", label: "Uzmanl\u0131k Etiketi (EN)" },
          { type: "string", name: "expertise", label: "Uzmanl\u0131k (TR)", ui: { component: "textarea" } },
          { type: "string", name: "expertise_en", label: "Uzmanl\u0131k (EN)", ui: { component: "textarea" } },
          { type: "string", name: "signature_label", label: "\u0130mza \u0130\u015Fler Etiketi (TR)" },
          { type: "string", name: "signature_label_en", label: "\u0130mza \u0130\u015Fler Etiketi (EN)" },
          { type: "string", name: "signature", label: "\u0130mza \u0130\u015Fler" }
        ]
      },
      // -------------------------------------------------- YETENEKLER
      {
        name: "yetenekler",
        label: "Yetenekler",
        path: "content/sections",
        match: { include: "skills" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "lede", label: "Giri\u015F Metni (TR)", ui: { component: "textarea" }, isTitle: true, required: true },
          { type: "string", name: "lede_en", label: "Giri\u015F Metni (EN)", ui: { component: "textarea" } },
          { type: "string", name: "techstack_label", label: "Teknoloji Etiketi (TR)" },
          { type: "string", name: "techstack_label_en", label: "Teknoloji Etiketi (EN)" },
          { type: "string", name: "techstack", label: "Teknoloji Y\u0131\u011F\u0131n\u0131", list: true },
          {
            type: "object",
            name: "skills",
            label: "Yetenek Kartlar\u0131",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "tag", label: "Etiket (TR)" },
              { type: "string", name: "tag_en", label: "Etiket (EN)" },
              { type: "string", name: "title", label: "Ba\u015Fl\u0131k (TR)" },
              { type: "string", name: "title_en", label: "Ba\u015Fl\u0131k (EN)" },
              { type: "string", name: "lead", label: "\xD6zet (TR)" },
              { type: "string", name: "lead_en", label: "\xD6zet (EN)" },
              { type: "string", name: "body", label: "A\xE7\u0131klama (TR)", ui: { component: "textarea" } },
              { type: "string", name: "body_en", label: "A\xE7\u0131klama (EN)", ui: { component: "textarea" } },
              {
                type: "object",
                name: "items",
                label: "Madde Listesi",
                list: true,
                ui: { itemProps: (i) => ({ label: i?.tr }) },
                fields: [
                  { type: "string", name: "tr", label: "TR" },
                  { type: "string", name: "en", label: "EN (bo\u015F = TR ile ayn\u0131)" }
                ]
              },
              { type: "string", name: "tags", label: "Teknoloji Etiketleri", list: true }
            ]
          }
        ]
      },
      // ------------------------------------------------------ SÜREÇ
      {
        name: "surec",
        label: "S\xFCre\xE7",
        path: "content/sections",
        match: { include: "process" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "\xDCst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "\xDCst Etiket (EN)" },
          { type: "string", name: "intro", label: "Ba\u015Fl\u0131k (TR)" },
          { type: "string", name: "intro_en", label: "Ba\u015Fl\u0131k (EN)" },
          {
            type: "object",
            name: "steps",
            label: "Ad\u0131mlar",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "n_label", label: "Numara Etiketi (TR)", description: "\xF6rn: 01 \u2014 Ke\u015Fif" },
              { type: "string", name: "n_label_en", label: "Numara Etiketi (EN)" },
              { type: "string", name: "title", label: "Ba\u015Fl\u0131k (TR)" },
              { type: "string", name: "title_en", label: "Ba\u015Fl\u0131k (EN)" },
              { type: "string", name: "body", label: "A\xE7\u0131klama (TR)", ui: { component: "textarea" } },
              { type: "string", name: "body_en", label: "A\xE7\u0131klama (EN)", ui: { component: "textarea" } }
            ]
          }
        ]
      },
      // ---------------------------------------------------- İLETİŞİM
      {
        name: "iletisim",
        label: "\u0130leti\u015Fim B\xF6l\xFCm\xFC",
        path: "content/sections",
        match: { include: "contact" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "\xDCst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "\xDCst Etiket (EN)" },
          { type: "string", name: "title_pre", label: "Ba\u015Fl\u0131k \u2014 1. K\u0131s\u0131m (TR)" },
          { type: "string", name: "title_whisper", label: "Ba\u015Fl\u0131k \u2014 Vurgu (TR)" },
          { type: "string", name: "title_post", label: "Ba\u015Fl\u0131k \u2014 Son K\u0131s\u0131m (TR)" },
          { type: "string", name: "title_pre_en", label: "Ba\u015Fl\u0131k \u2014 1. K\u0131s\u0131m (EN)" },
          { type: "string", name: "title_whisper_en", label: "Ba\u015Fl\u0131k \u2014 Vurgu (EN)" },
          { type: "string", name: "title_post_en", label: "Ba\u015Fl\u0131k \u2014 Son K\u0131s\u0131m (EN)" },
          { type: "string", name: "lede", label: "Alt Metin (TR)", ui: { component: "textarea" } },
          { type: "string", name: "lede_en", label: "Alt Metin (EN)", ui: { component: "textarea" } },
          { type: "string", name: "cta", label: "Buton (TR)" },
          { type: "string", name: "cta_en", label: "Buton (EN)" },
          { type: "string", name: "tag", label: "Durum Etiketi (TR)" },
          { type: "string", name: "tag_en", label: "Durum Etiketi (EN)" }
        ]
      },
      // -------------------------------------------------------- FORM
      {
        name: "form",
        label: "\u0130leti\u015Fim Formu",
        path: "content/form",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "aside_eyebrow", label: "Form \xDCst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "aside_eyebrow_en", label: "Form \xDCst Etiket (EN)" },
          { type: "string", name: "aside_title", label: "Form Ba\u015Fl\u0131k (TR)", description: "Vurgu i\xE7in *kelime*" },
          { type: "string", name: "aside_title_en", label: "Form Ba\u015Fl\u0131k (EN)" },
          { type: "string", name: "aside_lede", label: "Form A\xE7\u0131klama (TR)", ui: { component: "textarea" } },
          { type: "string", name: "aside_lede_en", label: "Form A\xE7\u0131klama (EN)", ui: { component: "textarea" } },
          { type: "string", name: "name_label", label: "Ad Alan\u0131 Etiketi (TR)" },
          { type: "string", name: "name_label_en", label: "Ad Alan\u0131 Etiketi (EN)" },
          { type: "string", name: "name_ph", label: "Ad Placeholder (TR)" },
          { type: "string", name: "name_ph_en", label: "Ad Placeholder (EN)" },
          { type: "string", name: "email_ph", label: "E-posta Placeholder (TR)" },
          { type: "string", name: "email_ph_en", label: "E-posta Placeholder (EN)" },
          { type: "string", name: "phone_label", label: "Telefon Etiketi (TR)" },
          { type: "string", name: "phone_label_en", label: "Telefon Etiketi (EN)" },
          { type: "string", name: "phone_ph", label: "Telefon Placeholder (TR)" },
          { type: "string", name: "phone_ph_en", label: "Telefon Placeholder (EN)" },
          { type: "string", name: "type_label", label: "Proje T\xFCr\xFC Etiketi (TR)" },
          { type: "string", name: "type_label_en", label: "Proje T\xFCr\xFC Etiketi (EN)" },
          {
            type: "object",
            name: "options",
            label: "Proje T\xFCr\xFC Se\xE7enekleri",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "value", label: "De\u011Fer (form g\xF6nderiminde, de\u011Fi\u015Ftirme)" },
              { type: "string", name: "label", label: "G\xF6r\xFCnen (TR)" },
              { type: "string", name: "label_en", label: "G\xF6r\xFCnen (EN)" }
            ]
          },
          { type: "string", name: "msg_label", label: "Mesaj Etiketi (TR)" },
          { type: "string", name: "msg_label_en", label: "Mesaj Etiketi (EN)" },
          { type: "string", name: "msg_ph", label: "Mesaj Placeholder (TR)" },
          { type: "string", name: "msg_ph_en", label: "Mesaj Placeholder (EN)" },
          { type: "string", name: "submit", label: "G\xF6nder Butonu (TR)" },
          { type: "string", name: "submit_en", label: "G\xF6nder Butonu (EN)" },
          { type: "string", name: "subject", label: "E-posta Konusu" }
        ]
      },
      // ------------------------------------------ GENEL AYARLAR (iletişim)
      {
        name: "ayarlar",
        label: "Genel Ayarlar",
        path: "content/settings",
        match: { include: "contact" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "phone", label: "Telefon (tel: linki)", description: "\xF6rn: +905398624697", isTitle: true, required: true },
          { type: "string", name: "phone_display", label: "Telefon (g\xF6r\xFCnen)", description: "\xF6rn: +90 539 862 46 97" },
          { type: "string", name: "email", label: "E-posta" },
          { type: "string", name: "location", label: "Konum (TR)" },
          { type: "string", name: "location_en", label: "Konum (EN)" }
        ]
      },
      // ------------------------------------------------------ FOOTER
      {
        name: "footer",
        label: "Footer",
        path: "content/sections",
        match: { include: "footer" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "tag", label: "Slogan (TR)", isTitle: true, required: true },
          { type: "string", name: "tag_en", label: "Slogan (EN)" },
          { type: "string", name: "col1_title", label: "1. S\xFCtun Ba\u015Fl\u0131k" },
          {
            type: "object",
            name: "col1",
            label: "1. S\xFCtun Linkleri",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "label", label: "Yaz\u0131 (TR)" },
              { type: "string", name: "label_en", label: "Yaz\u0131 (EN)" },
              { type: "string", name: "href", label: "Ba\u011Flant\u0131" }
            ]
          },
          { type: "string", name: "col2_title", label: "2. S\xFCtun Ba\u015Fl\u0131k (TR)" },
          { type: "string", name: "col2_title_en", label: "2. S\xFCtun Ba\u015Fl\u0131k (EN)" },
          {
            type: "object",
            name: "col2",
            label: "2. S\xFCtun Linkleri",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "label", label: "Yaz\u0131 (TR)" },
              { type: "string", name: "label_en", label: "Yaz\u0131 (EN)" },
              { type: "string", name: "href", label: "Ba\u011Flant\u0131 (mailto = e-posta, tel = telefon)" }
            ]
          },
          { type: "string", name: "col3_title", label: "3. S\xFCtun Ba\u015Fl\u0131k (TR)" },
          { type: "string", name: "col3_title_en", label: "3. S\xFCtun Ba\u015Fl\u0131k (EN)" },
          { type: "string", name: "col4_title", label: "4. S\xFCtun Ba\u015Fl\u0131k" },
          { type: "string", name: "copyright", label: "Telif" },
          { type: "string", name: "studio", label: "St\xFCdyo (TR)" },
          { type: "string", name: "studio_en", label: "St\xFCdyo (EN)" },
          { type: "string", name: "rights", label: "Haklar (TR)" },
          { type: "string", name: "rights_en", label: "Haklar (EN)" }
        ]
      },
      // ------------------------------------------------------- MENÜ
      {
        name: "menu",
        label: "Men\xFC",
        path: "content/sections",
        match: { include: "menu" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "submenu_title", label: "Alt Men\xFC Ba\u015Fl\u0131k (TR)", isTitle: true, required: true },
          { type: "string", name: "submenu_title_en", label: "Alt Men\xFC Ba\u015Fl\u0131k (EN)" },
          {
            type: "object",
            name: "submenu",
            label: "Yetenekler Alt Men\xFCs\xFC",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "label", label: "Yaz\u0131 (TR)" },
              { type: "string", name: "label_en", label: "Yaz\u0131 (EN)" },
              { type: "string", name: "href", label: "Ba\u011Flant\u0131 (#b\xF6l\xFCm)" }
            ]
          },
          { type: "string", name: "meta1", label: "Men\xFC Alt Bilgi" },
          { type: "string", name: "caption", label: "Video Ba\u015Fl\u0131\u011F\u0131 (TR)" },
          { type: "string", name: "caption_en", label: "Video Ba\u015Fl\u0131\u011F\u0131 (EN)" }
        ]
      },
      // ------------------------------------------- ETİKETLER (menü/başlık)
      {
        name: "etiketler",
        label: "Etiketler (men\xFC/ba\u015Fl\u0131k)",
        path: "content/settings",
        match: { include: "labels" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "items",
            label: "Etiketler",
            list: true,
            ui: { itemProps: (i) => ({ label: `${i?.key} \u2014 ${i?.tr}` }) },
            fields: [
              { type: "string", name: "key", label: "Anahtar (de\u011Fi\u015Ftirme)" },
              { type: "string", name: "tr", label: "TR" },
              { type: "string", name: "en", label: "EN" }
            ]
          }
        ]
      },
      // --------------------------------------------- HİZMET SAYFALARI
      {
        name: "landings",
        label: "Hizmet Sayfalar\u0131",
        label_singular: "Hizmet Sayfas\u0131",
        path: "content/landings",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "crumb", label: "Sayfa Ad\u0131 (TR)", isTitle: true, required: true },
          { type: "string", name: "crumb_en", label: "Sayfa Ad\u0131 (EN)" },
          { type: "string", name: "eyebrow", label: "\xDCst Etiket (TR)" },
          { type: "string", name: "eyebrow_en", label: "\xDCst Etiket (EN)" },
          { type: "string", name: "title", label: "Ba\u015Fl\u0131k (TR)", description: "Vurgu i\xE7in *kelime* yaz" },
          { type: "string", name: "title_en", label: "Ba\u015Fl\u0131k (EN)", description: "Vurgu i\xE7in *word*" },
          { type: "string", name: "lede", label: "Alt Metin (TR)", ui: { component: "textarea" } },
          { type: "string", name: "lede_en", label: "Alt Metin (EN)", ui: { component: "textarea" } },
          { type: "string", name: "project", label: "Form Proje T\xFCr\xFC", description: "Butona bas\u0131nca formda \xF6n se\xE7ilen t\xFCr" },
          { type: "string", name: "cta", label: "Ana Buton (TR)" },
          { type: "string", name: "cta_en", label: "Ana Buton (EN)" },
          { type: "string", name: "cta2", label: "\u0130kincil Buton (TR)" },
          { type: "string", name: "cta2_en", label: "\u0130kincil Buton (EN)" },
          { type: "image", name: "image", label: "Cihaz G\xF6rseli" },
          { type: "string", name: "image_alt", label: "G\xF6rsel Alt Metni" },
          {
            type: "object",
            name: "trust",
            label: "G\xFCven Rozetleri",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.value }) },
            fields: [
              { type: "string", name: "value", label: "De\u011Fer (\xF6rn: \u2605 4.9)" },
              { type: "string", name: "label", label: "Etiket (TR, bo\u015F olabilir)" },
              { type: "string", name: "label_en", label: "Etiket (EN)" }
            ]
          },
          {
            type: "object",
            name: "benefits",
            label: "Avantajlar",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "title", label: "Ba\u015Fl\u0131k (TR)" },
              { type: "string", name: "title_en", label: "Ba\u015Fl\u0131k (EN)" },
              { type: "string", name: "body", label: "A\xE7\u0131klama (TR)" },
              { type: "string", name: "body_en", label: "A\xE7\u0131klama (EN)" }
            ]
          },
          {
            type: "object",
            name: "includes",
            label: "Neler Dahil",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.tr }) },
            fields: [
              { type: "string", name: "tr", label: "TR" },
              { type: "string", name: "en", label: "EN (bo\u015F = TR ile ayn\u0131)" }
            ]
          },
          {
            type: "object",
            name: "steps",
            label: "\xC7al\u0131\u015Fma Ad\u0131mlar\u0131",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "title", label: "Ba\u015Fl\u0131k (TR)" },
              { type: "string", name: "title_en", label: "Ba\u015Fl\u0131k (EN)" },
              { type: "string", name: "body", label: "A\xE7\u0131klama (TR)" },
              { type: "string", name: "body_en", label: "A\xE7\u0131klama (EN)" }
            ]
          },
          {
            type: "object",
            name: "faq",
            label: "S\u0131k Sorulanlar",
            list: true,
            ui: { itemProps: (i) => ({ label: i?.q }) },
            fields: [
              { type: "string", name: "q", label: "Soru (TR)" },
              { type: "string", name: "q_en", label: "Soru (EN)" },
              { type: "string", name: "a", label: "Cevap (TR)", ui: { component: "textarea" } },
              { type: "string", name: "a_en", label: "Cevap (EN)", ui: { component: "textarea" } }
            ]
          },
          { type: "string", name: "band_h", label: "Alt Bant Ba\u015Fl\u0131k (TR)" },
          { type: "string", name: "band_h_en", label: "Alt Bant Ba\u015Fl\u0131k (EN)" },
          { type: "string", name: "band_p", label: "Alt Bant Metin (TR)" },
          { type: "string", name: "band_p_en", label: "Alt Bant Metin (EN)" },
          { type: "string", name: "band_cta", label: "Alt Bant Buton (TR)" },
          { type: "string", name: "band_cta_en", label: "Alt Bant Buton (EN)" }
        ]
      },
      // -------------------------------------------------- PROJELER
      {
        name: "projeler",
        label: "Projeler",
        path: "content/projects",
        format: "md",
        ui: {
          filename: { readonly: false }
        },
        fields: [
          { type: "string", name: "title", label: "Proje Ad\u0131 (TR)", isTitle: true, required: true },
          { type: "string", name: "title_en", label: "Proje Ad\u0131 (EN)" },
          { type: "number", name: "order", label: "S\u0131ra", description: "K\xFC\xE7\xFCk say\u0131 \xF6nce g\xF6sterilir" },
          {
            type: "reference",
            name: "category",
            label: "Kategori",
            collections: ["kategoriler"]
          },
          { type: "string", name: "badge", label: "Etiket (TR)", description: "\xF6rn: Restoran \xB7 Web & Marka" },
          { type: "string", name: "badge_en", label: "Etiket (EN)" },
          { type: "string", name: "metric", label: "Sonu\xE7 / Metrik (TR)", description: "\xF6rn: Online rezervasyon +%54" },
          { type: "string", name: "metric_en", label: "Sonu\xE7 / Metrik (EN)" },
          { type: "string", name: "url", label: "Site Adresi", description: "Kart \xFCst\xFCnde g\xF6r\xFCnen adres" },
          { type: "image", name: "cover", label: "Kapak G\xF6rseli" },
          { type: "boolean", name: "featured", label: "\xD6ne \xE7\u0131kar" },
          { type: "rich-text", name: "body", label: "Detay Metni", isBody: true }
        ]
      },
      // ------------------------------------------------ KATEGORİLER
      {
        name: "kategoriler",
        label: "Kategoriler",
        path: "content/categories",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Kategori Ad\u0131 (TR)", isTitle: true, required: true },
          { type: "string", name: "name_en", label: "Kategori Ad\u0131 (EN)" },
          { type: "string", name: "slug", label: "K\u0131sa Ad (slug)", description: "URL'de g\xF6r\xFCn\xFCr, \xF6rn: web-marka" },
          { type: "number", name: "order", label: "S\u0131ra" }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
