import { defineConfig } from "tinacms";

// ============================================================
//  OB° STÜDYO — TinaCMS şeması (FAZ 1: Projeler + Kategoriler)
//  Local modda clientId/token gerekmez; canlı e-posta/şifre
//  girişi için sonra tina.io'dan bu iki anahtar eklenir.
// ============================================================
export default defineConfig({
  branch: "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    // Panel public/admin'e uretilir; vite bunu dist/admin'e kopyalar -> canlida /admin
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "works",
      publicFolder: "public",
    },
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
          { type: "string", name: "title", label: "Sayfa Başlığı (title)", isTitle: true, required: true },
          { type: "string", name: "description", label: "Meta Açıklama", ui: { component: "textarea" }, description: "Arama sonuçlarında görünen açıklama (~155 karakter)" },
          { type: "image", name: "og_image", label: "Sosyal Paylaşım Görseli (OG)" },
          { type: "string", name: "keywords", label: "Anahtar Kelimeler", list: true },
        ],
      },

      // ------------------------------------------------------- HERO
      {
        name: "hero",
        label: "Hero (Açılış)",
        path: "content/sections",
        match: { include: "hero" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "Üst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "Üst Etiket (EN)" },
          { type: "string", name: "title_tr", label: "Başlık Satırları (TR)", list: true, description: "Her satır ayrı. Vurgu için *kelime* yaz (eğik gösterilir)." },
          { type: "string", name: "title_en", label: "Başlık Satırları (EN)", list: true, description: "Her satır ayrı. Vurgu için *word*." },
          { type: "string", name: "lede", label: "Alt Metin (TR)", ui: { component: "textarea" } },
          { type: "string", name: "lede_en", label: "Alt Metin (EN)", ui: { component: "textarea" } },
          { type: "string", name: "credits_label", label: "İş Birlikleri Etiketi (TR)" },
          { type: "string", name: "credits_label_en", label: "İş Birlikleri Etiketi (EN)" },
          { type: "string", name: "chips", label: "Marka Etiketleri", list: true },
          { type: "string", name: "chip_last", label: "Son Etiket (TR)" },
          { type: "string", name: "chip_last_en", label: "Son Etiket (EN)" },
          { type: "string", name: "cta_primary", label: "Ana Buton (TR)" },
          { type: "string", name: "cta_primary_en", label: "Ana Buton (EN)" },
          { type: "string", name: "cta_secondary", label: "İkincil Buton (TR)" },
          { type: "string", name: "cta_secondary_en", label: "İkincil Buton (EN)" },
          { type: "string", name: "scroll", label: "Kaydır Etiketi (TR)" },
          { type: "string", name: "scroll_en", label: "Kaydır Etiketi (EN)" },
          { type: "object", name: "marquee1", label: "Üst Kayan Şerit", list: true, ui: { itemProps: (i) => ({ label: i?.tr }) }, fields: [ { type: "string", name: "tr", label: "TR" }, { type: "string", name: "en", label: "EN" } ] },
          { type: "object", name: "marquee2", label: "Alt Kayan Şerit", list: true, ui: { itemProps: (i) => ({ label: i?.tr }) }, fields: [ { type: "string", name: "tr", label: "TR" }, { type: "string", name: "en", label: "EN" } ] },
        ],
      },

      // --------------------------------------------------- HAKKINDA
      {
        name: "hakkinda",
        label: "Hakkında",
        path: "content/sections",
        match: { include: "about" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "Üst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "Üst Etiket (EN)" },
          { type: "string", name: "heading_pre", label: "Başlık — 1. Kısım (TR)" },
          { type: "string", name: "heading_whisper", label: "Başlık — Vurgu (TR)", description: "İnce/italik gösterilen orta kısım" },
          { type: "string", name: "heading_post", label: "Başlık — Son Kısım (TR)" },
          { type: "string", name: "heading_pre_en", label: "Başlık — 1. Kısım (EN)" },
          { type: "string", name: "heading_whisper_en", label: "Başlık — Vurgu (EN)" },
          { type: "string", name: "heading_post_en", label: "Başlık — Son Kısım (EN)" },
          { type: "string", name: "p1", label: "Paragraf 1 (TR)", ui: { component: "textarea" } },
          { type: "string", name: "p1_en", label: "Paragraf 1 (EN)", ui: { component: "textarea" } },
          { type: "string", name: "p2", label: "Paragraf 2 (TR)", ui: { component: "textarea" } },
          { type: "string", name: "p2_en", label: "Paragraf 2 (EN)", ui: { component: "textarea" } },
          { type: "string", name: "expertise_label", label: "Uzmanlık Etiketi (TR)" },
          { type: "string", name: "expertise_label_en", label: "Uzmanlık Etiketi (EN)" },
          { type: "string", name: "expertise", label: "Uzmanlık (TR)", ui: { component: "textarea" } },
          { type: "string", name: "expertise_en", label: "Uzmanlık (EN)", ui: { component: "textarea" } },
          { type: "string", name: "signature_label", label: "İmza İşler Etiketi (TR)" },
          { type: "string", name: "signature_label_en", label: "İmza İşler Etiketi (EN)" },
          { type: "string", name: "signature", label: "İmza İşler" },
        ],
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
          { type: "string", name: "lede", label: "Giriş Metni (TR)", ui: { component: "textarea" }, isTitle: true, required: true },
          { type: "string", name: "lede_en", label: "Giriş Metni (EN)", ui: { component: "textarea" } },
          { type: "string", name: "techstack_label", label: "Teknoloji Etiketi (TR)" },
          { type: "string", name: "techstack_label_en", label: "Teknoloji Etiketi (EN)" },
          { type: "string", name: "techstack", label: "Teknoloji Yığını", list: true },
          {
            type: "object", name: "skills", label: "Yetenek Kartları", list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "tag", label: "Etiket (TR)" },
              { type: "string", name: "tag_en", label: "Etiket (EN)" },
              { type: "string", name: "title", label: "Başlık (TR)" },
              { type: "string", name: "title_en", label: "Başlık (EN)" },
              { type: "string", name: "lead", label: "Özet (TR)" },
              { type: "string", name: "lead_en", label: "Özet (EN)" },
              { type: "string", name: "body", label: "Açıklama (TR)", ui: { component: "textarea" } },
              { type: "string", name: "body_en", label: "Açıklama (EN)", ui: { component: "textarea" } },
              {
                type: "object", name: "items", label: "Madde Listesi", list: true,
                ui: { itemProps: (i) => ({ label: i?.tr }) },
                fields: [
                  { type: "string", name: "tr", label: "TR" },
                  { type: "string", name: "en", label: "EN (boş = TR ile aynı)" },
                ],
              },
              { type: "string", name: "tags", label: "Teknoloji Etiketleri", list: true },
            ],
          },
        ],
      },

      // ------------------------------------------------------ SÜREÇ
      {
        name: "surec",
        label: "Süreç",
        path: "content/sections",
        match: { include: "process" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "Üst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "Üst Etiket (EN)" },
          { type: "string", name: "intro", label: "Başlık (TR)" },
          { type: "string", name: "intro_en", label: "Başlık (EN)" },
          {
            type: "object", name: "steps", label: "Adımlar", list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "n_label", label: "Numara Etiketi (TR)", description: "örn: 01 — Keşif" },
              { type: "string", name: "n_label_en", label: "Numara Etiketi (EN)" },
              { type: "string", name: "title", label: "Başlık (TR)" },
              { type: "string", name: "title_en", label: "Başlık (EN)" },
              { type: "string", name: "body", label: "Açıklama (TR)", ui: { component: "textarea" } },
              { type: "string", name: "body_en", label: "Açıklama (EN)", ui: { component: "textarea" } },
            ],
          },
        ],
      },

      // ---------------------------------------------------- İLETİŞİM
      {
        name: "iletisim",
        label: "İletişim Bölümü",
        path: "content/sections",
        match: { include: "contact" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "eyebrow", label: "Üst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "eyebrow_en", label: "Üst Etiket (EN)" },
          { type: "string", name: "title_pre", label: "Başlık — 1. Kısım (TR)" },
          { type: "string", name: "title_whisper", label: "Başlık — Vurgu (TR)" },
          { type: "string", name: "title_post", label: "Başlık — Son Kısım (TR)" },
          { type: "string", name: "title_pre_en", label: "Başlık — 1. Kısım (EN)" },
          { type: "string", name: "title_whisper_en", label: "Başlık — Vurgu (EN)" },
          { type: "string", name: "title_post_en", label: "Başlık — Son Kısım (EN)" },
          { type: "string", name: "lede", label: "Alt Metin (TR)", ui: { component: "textarea" } },
          { type: "string", name: "lede_en", label: "Alt Metin (EN)", ui: { component: "textarea" } },
          { type: "string", name: "cta", label: "Buton (TR)" },
          { type: "string", name: "cta_en", label: "Buton (EN)" },
          { type: "string", name: "tag", label: "Durum Etiketi (TR)" },
          { type: "string", name: "tag_en", label: "Durum Etiketi (EN)" },
        ],
      },

      // -------------------------------------------------------- FORM
      {
        name: "form",
        label: "İletişim Formu",
        path: "content/form",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "aside_eyebrow", label: "Form Üst Etiket (TR)", isTitle: true, required: true },
          { type: "string", name: "aside_eyebrow_en", label: "Form Üst Etiket (EN)" },
          { type: "string", name: "aside_title", label: "Form Başlık (TR)", description: "Vurgu için *kelime*" },
          { type: "string", name: "aside_title_en", label: "Form Başlık (EN)" },
          { type: "string", name: "aside_lede", label: "Form Açıklama (TR)", ui: { component: "textarea" } },
          { type: "string", name: "aside_lede_en", label: "Form Açıklama (EN)", ui: { component: "textarea" } },
          { type: "string", name: "name_label", label: "Ad Alanı Etiketi (TR)" },
          { type: "string", name: "name_label_en", label: "Ad Alanı Etiketi (EN)" },
          { type: "string", name: "name_ph", label: "Ad Placeholder (TR)" },
          { type: "string", name: "name_ph_en", label: "Ad Placeholder (EN)" },
          { type: "string", name: "email_ph", label: "E-posta Placeholder (TR)" },
          { type: "string", name: "email_ph_en", label: "E-posta Placeholder (EN)" },
          { type: "string", name: "phone_label", label: "Telefon Etiketi (TR)" },
          { type: "string", name: "phone_label_en", label: "Telefon Etiketi (EN)" },
          { type: "string", name: "phone_ph", label: "Telefon Placeholder (TR)" },
          { type: "string", name: "phone_ph_en", label: "Telefon Placeholder (EN)" },
          { type: "string", name: "type_label", label: "Proje Türü Etiketi (TR)" },
          { type: "string", name: "type_label_en", label: "Proje Türü Etiketi (EN)" },
          {
            type: "object", name: "options", label: "Proje Türü Seçenekleri", list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "value", label: "Değer (form gönderiminde, değiştirme)" },
              { type: "string", name: "label", label: "Görünen (TR)" },
              { type: "string", name: "label_en", label: "Görünen (EN)" },
            ],
          },
          { type: "string", name: "msg_label", label: "Mesaj Etiketi (TR)" },
          { type: "string", name: "msg_label_en", label: "Mesaj Etiketi (EN)" },
          { type: "string", name: "msg_ph", label: "Mesaj Placeholder (TR)" },
          { type: "string", name: "msg_ph_en", label: "Mesaj Placeholder (EN)" },
          { type: "string", name: "submit", label: "Gönder Butonu (TR)" },
          { type: "string", name: "submit_en", label: "Gönder Butonu (EN)" },
          { type: "string", name: "subject", label: "E-posta Konusu" },
        ],
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
          { type: "string", name: "phone", label: "Telefon (tel: linki)", description: "örn: +905398624697", isTitle: true, required: true },
          { type: "string", name: "phone_display", label: "Telefon (görünen)", description: "örn: +90 539 862 46 97" },
          { type: "string", name: "email", label: "E-posta" },
          { type: "string", name: "location", label: "Konum (TR)" },
          { type: "string", name: "location_en", label: "Konum (EN)" },
        ],
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
          { type: "string", name: "col1_title", label: "1. Sütun Başlık" },
          {
            type: "object", name: "col1", label: "1. Sütun Linkleri", list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "label", label: "Yazı (TR)" },
              { type: "string", name: "label_en", label: "Yazı (EN)" },
              { type: "string", name: "href", label: "Bağlantı" },
            ],
          },
          { type: "string", name: "col2_title", label: "2. Sütun Başlık (TR)" },
          { type: "string", name: "col2_title_en", label: "2. Sütun Başlık (EN)" },
          {
            type: "object", name: "col2", label: "2. Sütun Linkleri", list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "label", label: "Yazı (TR)" },
              { type: "string", name: "label_en", label: "Yazı (EN)" },
              { type: "string", name: "href", label: "Bağlantı (mailto = e-posta, tel = telefon)" },
            ],
          },
          { type: "string", name: "col3_title", label: "3. Sütun Başlık (TR)" },
          { type: "string", name: "col3_title_en", label: "3. Sütun Başlık (EN)" },
          { type: "string", name: "col4_title", label: "4. Sütun Başlık" },
          { type: "string", name: "copyright", label: "Telif" },
          { type: "string", name: "studio", label: "Stüdyo (TR)" },
          { type: "string", name: "studio_en", label: "Stüdyo (EN)" },
          { type: "string", name: "rights", label: "Haklar (TR)" },
          { type: "string", name: "rights_en", label: "Haklar (EN)" },
        ],
      },

      // ------------------------------------------------------- MENÜ
      {
        name: "menu",
        label: "Menü",
        path: "content/sections",
        match: { include: "menu" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "submenu_title", label: "Alt Menü Başlık (TR)", isTitle: true, required: true },
          { type: "string", name: "submenu_title_en", label: "Alt Menü Başlık (EN)" },
          {
            type: "object", name: "submenu", label: "Yetenekler Alt Menüsü", list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: "string", name: "label", label: "Yazı (TR)" },
              { type: "string", name: "label_en", label: "Yazı (EN)" },
              { type: "string", name: "href", label: "Bağlantı (#bölüm)" },
            ],
          },
          { type: "string", name: "meta1", label: "Menü Alt Bilgi" },
          { type: "string", name: "caption", label: "Video Başlığı (TR)" },
          { type: "string", name: "caption_en", label: "Video Başlığı (EN)" },
        ],
      },

      // ------------------------------------------- ETİKETLER (menü/başlık)
      {
        name: "etiketler",
        label: "Etiketler (menü/başlık)",
        path: "content/settings",
        match: { include: "labels" },
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object", name: "items", label: "Etiketler", list: true,
            ui: { itemProps: (i) => ({ label: `${i?.key} — ${i?.tr}` }) },
            fields: [
              { type: "string", name: "key", label: "Anahtar (değiştirme)" },
              { type: "string", name: "tr", label: "TR" },
              { type: "string", name: "en", label: "EN" },
            ],
          },
        ],
      },

      // --------------------------------------------- HİZMET SAYFALARI
      {
        name: "landings",
        label: "Hizmet Sayfaları",
        label_singular: "Hizmet Sayfası",
        path: "content/landings",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "crumb", label: "Sayfa Adı (TR)", isTitle: true, required: true },
          { type: "string", name: "crumb_en", label: "Sayfa Adı (EN)" },
          { type: "string", name: "eyebrow", label: "Üst Etiket (TR)" },
          { type: "string", name: "eyebrow_en", label: "Üst Etiket (EN)" },
          { type: "string", name: "title", label: "Başlık (TR)", description: "Vurgu için *kelime* yaz" },
          { type: "string", name: "title_en", label: "Başlık (EN)", description: "Vurgu için *word*" },
          { type: "string", name: "lede", label: "Alt Metin (TR)", ui: { component: "textarea" } },
          { type: "string", name: "lede_en", label: "Alt Metin (EN)", ui: { component: "textarea" } },
          { type: "string", name: "project", label: "Form Proje Türü", description: "Butona basınca formda ön seçilen tür" },
          { type: "string", name: "cta", label: "Ana Buton (TR)" },
          { type: "string", name: "cta_en", label: "Ana Buton (EN)" },
          { type: "string", name: "cta2", label: "İkincil Buton (TR)" },
          { type: "string", name: "cta2_en", label: "İkincil Buton (EN)" },
          { type: "image", name: "image", label: "Cihaz Görseli" },
          { type: "string", name: "image_alt", label: "Görsel Alt Metni" },
          {
            type: "object", name: "trust", label: "Güven Rozetleri", list: true,
            ui: { itemProps: (i) => ({ label: i?.value }) },
            fields: [
              { type: "string", name: "value", label: "Değer (örn: ★ 4.9)" },
              { type: "string", name: "label", label: "Etiket (TR, boş olabilir)" },
              { type: "string", name: "label_en", label: "Etiket (EN)" },
            ],
          },
          {
            type: "object", name: "benefits", label: "Avantajlar", list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "title", label: "Başlık (TR)" },
              { type: "string", name: "title_en", label: "Başlık (EN)" },
              { type: "string", name: "body", label: "Açıklama (TR)" },
              { type: "string", name: "body_en", label: "Açıklama (EN)" },
            ],
          },
          {
            type: "object", name: "includes", label: "Neler Dahil", list: true,
            ui: { itemProps: (i) => ({ label: i?.tr }) },
            fields: [
              { type: "string", name: "tr", label: "TR" },
              { type: "string", name: "en", label: "EN (boş = TR ile aynı)" },
            ],
          },
          {
            type: "object", name: "steps", label: "Çalışma Adımları", list: true,
            ui: { itemProps: (i) => ({ label: i?.title }) },
            fields: [
              { type: "string", name: "title", label: "Başlık (TR)" },
              { type: "string", name: "title_en", label: "Başlık (EN)" },
              { type: "string", name: "body", label: "Açıklama (TR)" },
              { type: "string", name: "body_en", label: "Açıklama (EN)" },
            ],
          },
          {
            type: "object", name: "faq", label: "Sık Sorulanlar", list: true,
            ui: { itemProps: (i) => ({ label: i?.q }) },
            fields: [
              { type: "string", name: "q", label: "Soru (TR)" },
              { type: "string", name: "q_en", label: "Soru (EN)" },
              { type: "string", name: "a", label: "Cevap (TR)", ui: { component: "textarea" } },
              { type: "string", name: "a_en", label: "Cevap (EN)", ui: { component: "textarea" } },
            ],
          },
          { type: "string", name: "band_h", label: "Alt Bant Başlık (TR)" },
          { type: "string", name: "band_h_en", label: "Alt Bant Başlık (EN)" },
          { type: "string", name: "band_p", label: "Alt Bant Metin (TR)" },
          { type: "string", name: "band_p_en", label: "Alt Bant Metin (EN)" },
          { type: "string", name: "band_cta", label: "Alt Bant Buton (TR)" },
          { type: "string", name: "band_cta_en", label: "Alt Bant Buton (EN)" },
        ],
      },

      // -------------------------------------------------- PROJELER
      {
        name: "projeler",
        label: "Projeler",
        path: "content/projects",
        format: "md",
        ui: {
          filename: { readonly: false },
        },
        fields: [
          { type: "string", name: "title", label: "Proje Adı (TR)", isTitle: true, required: true },
          { type: "string", name: "title_en", label: "Proje Adı (EN)" },
          { type: "number", name: "order", label: "Sıra", description: "Küçük sayı önce gösterilir" },
          {
            type: "reference",
            name: "category",
            label: "Kategori",
            collections: ["kategoriler"],
          },
          { type: "string", name: "badge", label: "Etiket (TR)", description: "örn: Restoran · Web & Marka" },
          { type: "string", name: "badge_en", label: "Etiket (EN)" },
          { type: "string", name: "metric", label: "Sonuç / Metrik (TR)", description: "örn: Online rezervasyon +%54" },
          { type: "string", name: "metric_en", label: "Sonuç / Metrik (EN)" },
          { type: "string", name: "url", label: "Site Adresi", description: "Kart üstünde görünen adres" },
          { type: "image", name: "cover", label: "Kapak Görseli" },
          { type: "boolean", name: "featured", label: "Öne çıkar" },
          { type: "rich-text", name: "body", label: "Detay Metni", isBody: true },
        ],
      },

      // ------------------------------------------------ KATEGORİLER
      {
        name: "kategoriler",
        label: "Kategoriler",
        path: "content/categories",
        format: "md",
        fields: [
          { type: "string", name: "name", label: "Kategori Adı (TR)", isTitle: true, required: true },
          { type: "string", name: "name_en", label: "Kategori Adı (EN)" },
          { type: "string", name: "slug", label: "Kısa Ad (slug)", description: "URL'de görünür, örn: web-marka" },
          { type: "number", name: "order", label: "Sıra" },
        ],
      },
    ],
  },
});
