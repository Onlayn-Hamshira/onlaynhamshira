import type { NextConfig } from "next";
import { legacyRouting } from "./lib/seo/legacy";
import { TILDA_PAGE_IDS } from "./lib/seo/tilda-page-ids";

// Eski Tilda URL'lari (83 ta) — tashqi yo'l o'zgarmaydi, ichkarida app/[lang]/[...slug] ga yo'naltiriladi
const legacy = legacyRouting();

// Tilda saytining o'zidagi buzuq ichki havolalar (404 berardi) → to'g'ri sahifaga 301.
// Yo'qolgan "link juice" qaytadi, eski havolalar ham ishlaydi (docs/seo-baseline/README 6c)
const BROKEN_TILDA_LINKS = [
  { source: "/politic", destination: "/hamshirapolitic" },
  { source: "/ru/politic", destination: "/ru/politichamshira" },
  { source: "/en/politic", destination: "/nurse-politic" },
  { source: "/chaqaloq-parvarishi-yangi-onalar-uchun", destination: "/blog/chaqaloq-parvarishi-yangi-onalar-uchun" },
];

const nextConfig: NextConfig = {
  images: {
    // AVIF — WebP'dan ~20–30% kichik; qo'llamaydigan brauzerlarga WebP
    formats: ["image/avif", "image/webp"],
    // Optimallashtirilgan rasm nusxalari 30 kun keshda
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Fotosuratlar (yangiliklar, hero) q60 — farq sezilmaydi, hajm ~30% kam
    qualities: [60, 75],
  },
  // public/ dagi statik fayllar standart holatda max-age=0 bilan beriladi — har tashrifda qayta tekshiriladi.
  // 30 kun keshlaymiz. Faylni almashtirganda NOMINI o'zgartiring (masalan google-play-black.png kabi),
  // aks holda eski nusxa keshda qoladi.
  // Standart til (uz) prefikssiz: "/" → statik /uz sahifasi. Proxy (middleware) shart emas —
  // har bir til build vaqtida tayyor HTML, so'rov paytida kod ishlamaydi
  async rewrites() {
    return [{ source: "/", destination: "/uz" }, ...legacy.rewrites];
  },
  // Doimiy redirectlar aynan 301 (Next.js'ning permanent: true standarti 308 beradi; SEO talabi — 301)
  async redirects() {
    return [
      { source: "/uz", destination: "/", statusCode: 301 },
      ...legacy.redirects,
      ...BROKEN_TILDA_LINKS.map((r) => ({ ...r, statusCode: 301 as const })),
      // Tilda'ning /page{ID}.html manzillari → asl sahifa
      ...Object.entries(TILDA_PAGE_IDS).map(([id, destination]) => ({ source: `/page${id}.html`, destination, statusCode: 301 as const })),
    ];
  },
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }];
    return [
      { source: "/img/:path*", headers: cache },
      { source: "/services/:path*", headers: cache },
      { source: "/badges/:path*", headers: cache },
      { source: "/logo-v2.svg", headers: cache },
      { source: "/legacy/:path*", headers: cache },
      // Admin paneldan yuklangan rasmlar — nomi har safar yangi (lib/edit/save.ts)
      { source: "/uploads/:path*", headers: cache },
    ];
  },
};

export default nextConfig;
