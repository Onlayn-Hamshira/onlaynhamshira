import { SITE_URL } from "@/lib/seo/site";
import { liveRoutes } from "@/lib/seo/routes";

// Tilda sitemap.xml bilan bayt-ma-bayt bir xil format (docs/seo-baseline/sitemap-original.xml): o'sha sarlavha,
// tab bilan chekinish, faqat <loc> + <lastmod>, o'sha tartib (lib/seo/routes.ts tartibi). Qidiruv tizimlari sayt
// almashganini sitemap'dan sezmasligi uchun changefreq/priority/hreflang qo'shmang — seo:check buni tekshiradi.
// Sitemap FAQAT tayyor (status: "live") sahifalarni chiqaradi — 404 beradigan URL hech qachon qo'shilmaydi.

export const dynamic = "force-static";

const abs = (p: string) => (p === "/" ? `${SITE_URL}/` : `${SITE_URL}${p}`);

export function GET() {
  const urls = liveRoutes()
    .map((r) => `\t<url>\n\t\t<loc>${abs(r.path)}</loc>\n\t\t<lastmod>${r.lastmod}</lastmod>\n\t</url>\n`)
    .join("");
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n` +
    urls +
    `</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
