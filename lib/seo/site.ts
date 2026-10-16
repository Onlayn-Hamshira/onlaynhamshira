// SEO va marketing uchun yagona manba (single source of truth).
// Qiymatlar eski Tilda saytidan aynan olingan — SEO/analitika uzilmasligi uchun
// bularni O'ZGARTIRMANG (manba: docs/seo-baseline/).

export const SITE_URL = "https://onlaynhamshira.uz";

/** Bosh sahifaning standart Open Graph rasmi — Tilda'dagi rasmning nusxasi (public/og/, docs/seo-baseline/tilda-images.json) */
export const DEFAULT_OG_IMAGE =
  "https://onlaynhamshira.uz/og/tild3462-3165-4335-b732-383031326461-photo.jpg";

// ── Marketing / analitika ID'lari (Tilda saytidagi aynan o'sha kodlar) ──
export const TRACKING = {
  /** Google Analytics 4 — tarixiy statistika shu ID'ga bog'liq */
  ga4: "G-MP5XEFGJRB",
  /** Google Ads — reklama konversiyalari (Instagram kampaniyalari) */
  googleAds: "AW-17432829439",
  /** Telefon bosilganda ("tel:") yoziladigan konversiya hodisasi */
  callConversionLabel: "AW-17432829439/NuEICIOfq-EcEP-7z_hA",
  /** Yandex Metrika hisobi (webvisor yoqilgan) */
  yandexMetrika: 97597715,
} as const;

/** Google Search Console egalik tasdiqi — o'chsa Search Console ulanishi uziladi */
export const GOOGLE_SITE_VERIFICATION = "EVBVxL3PtTQMVXOX-ZGZtYCH8kGH0vyVIby_P5xXbWU";
