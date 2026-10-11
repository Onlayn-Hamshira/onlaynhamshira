import { SITE_URL } from "@/lib/seo/site";

// Tilda robots.txt bilan bayt-ma-bayt bir xil (docs/seo-baseline/robots-original.txt). Tilda'ning texnik yo'llari
// (/tilda/*, /header, /footer ...) Next.js'da yo'q, lekin taqiqlar zararsiz — qidiruv tizimlari uchun fayl o'zgarmagani
// muhimroq. Hech qachon "Disallow: /" qo'shmang — seo:check buni tekshiradi.

export const dynamic = "force-static";

const ROBOTS = `User-Agent: *
Disallow: /page66424133.html
Disallow: /header
Disallow: /page67007365.html
Disallow: /error404
Disallow: /page67433297.html
Disallow: /footer
Disallow: /tilda/form*
Disallow: /tilda/rec*
Disallow: /tilda/click*
Disallow: /tilda/scroll*
Disallow: /tilda/popup*
Disallow: /tilda/cart*
Disallow: /tilda/product*
Disallow: /tilda/event*
Disallow:


Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
  return new Response(ROBOTS, { headers: { "Content-Type": "text/plain; charset=UTF-8" } });
}
