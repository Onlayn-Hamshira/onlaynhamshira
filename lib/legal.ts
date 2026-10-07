// Huquqiy hujjatlar (oferta, maxfiylik siyosati) — Tilda HTML'i yagona "hujjat" ko'rinishiga keltiriladi.
// Hujjat matni (bandlar, raqamlar) O'ZGARMAYDI: faqat H1 sahifa sarlavhasiga ko'chadi, Tilda'dagi qisman
// mundarija (toc-card) o'rniga barcha bo'limlardan to'liq mundarija yasaladi. <head> va URL'lar o'zgarmaydi.

import type { LegacyPage } from "@/lib/seo/legacy";
import type { TocItem } from "@/lib/blog-shared";

const plain = (s: string) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export type LegalDoc = { title: string; body: string; toc: TocItem[]; minutes: number };

// Sahifa obyekti bo'yicha (admin rejimida JSON qayta o'qilib, yangi obyekt keladi)
const cache = new WeakMap<LegacyPage, LegalDoc>();

export function parseLegal(pg: LegacyPage): LegalDoc {
  const hit = cache.get(pg);
  if (hit) return hit;
  let html = pg.html;

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1 ? plain(h1[1]) : (pg.meta.title ?? "");
  if (h1) html = html.replace(h1[0], "");

  // Tilda'dagi mundarija bloki (ba'zi tillarda bo'limlarning faqat bir qismi bor edi) — o'rniga to'liq ro'yxat
  html = html.replace(/<div class="toc-card"[^>]*>[\s\S]*?<div class="toc-grid">[\s\S]*?<\/div>\s*<\/div>/, "");

  const toc: TocItem[] = [];
  const sections = [...html.matchAll(/<div class="section" id="([^"]+)">\s*<div class="section-header">\s*<div class="section-num">([^<]*)<\/div>\s*<div class="section-title">([\s\S]*?)<\/div>/g)];
  if (sections.length) {
    // Uzun ofertalar: raqamlangan bo'limlar o'z id'lari bilan
    for (const m of sections) toc.push({ id: m[1], text: `${plain(m[2])}. ${plain(m[3])}` });
  } else {
    // Qisqa hujjatlar: H2 sarlavhalar
    html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_, attrs: string, inner: string) => {
      const text = plain(inner);
      if (!text) return `<h2${attrs}>${inner}</h2>`;
      const id = `d-${toc.length + 1}`;
      toc.push({ id, text });
      return `<h2${attrs.replace(/\sid="[^"]*"/, "")} id="${id}">${inner}</h2>`;
    });
  }

  for (let prev = ""; prev !== html; ) {
    prev = html;
    html = html.replace(/<div[^>]*>\s*<\/div>/g, "");
  }

  const doc = { title, body: html, toc, minutes: Math.max(1, Math.round(plain(pg.html).split(" ").length / 200)) };
  cache.set(pg, doc);
  return doc;
}
