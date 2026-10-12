// Admin paneldan qo'shilgan blog maqolalari (content/edits/posts.json). Har bir maqola build vaqtida eski (Tilda)
// maqolalar bilan bir xil ko'rinishga — LegacyPage'ga aylantiriladi: o'sha dizayn, mundarija, muqova, o'xshash
// maqolalar. Faqat "ready" holatidagilar saytga chiqadi ("draft" — admin hali to'ldirmoqda).
// ⚠️ Bu fayl next.config.ts dan ham yuklanadi (lib/seo/legacy.ts orqali) — "@/" alias ishlatmang.

import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";

export type PostImage = { src: string; width: number; height: number; alt?: string };
/** Uch tildagi matn */
export type L10n = Record<Locale, string>;
/** Bo'lim: sarlavha va matn — har tilda, rasm — umumiy */
export type PostSection = { heading: L10n; text: L10n; image?: PostImage | null };

/** Bitta maqola — uchala tilda chiqadi: /blog/slug, /ru/blog/slug, /en/blog/slug (bir-biriga hreflang) */
export type Post = {
  id: string;
  slug: string;
  status: "draft" | "ready";
  created: string;
  updated: string;
  /** Mavzu (lib/blog-shared.ts → BlogTopic) */
  topic: string;
  cover: PostImage | null;
  title: L10n;
  /** Kartadagi va sarlavha ostidagi qisqa tavsif */
  excerpt: L10n;
  intro: L10n;
  sections: PostSection[];
  seo: {
    title: L10n;
    description: L10n;
    keywords: L10n;
    /** Google indekslaydi va sitemap.xml ga qo'shiladi */
    index: boolean;
    /** Blog ro'yxati boshida va bosh sahifadagi "Yangiliklar"da chiqadi */
    featured: boolean;
  };
};

/** LegacyPage'ga qo'shiladigan maqola ma'lumoti (lib/blog.ts kartochka uchun ishlatadi) */
export type PostInfo = {
  id: string; topic: string; excerpt: string; created: string; updated: string; featured: boolean; index: boolean;
  /** Maqolaning uch tildagi manzillari (hreflang va til almashtirgich) */
  alternates: Record<Locale, string>;
};

const LANGS: Locale[] = ["uz", "ru", "en"];
export const postPath = (lang: Locale, slug: string) => `${lang === "uz" ? "" : `/${lang}`}/blog/${slug}`;

const SITE = "https://onlaynhamshira.uz";
const FILE = path.join(process.cwd(), "content/edits/posts.json");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Matn ichida faqat **qalin** belgisi qo'llanadi, qolgan hamma narsa matn bo'lib qoladi */
const inline = (s: string) => esc(s.trim()).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

/** Matn → HTML: bo'sh qator — yangi abzas, "- " bilan boshlangan qatorlar — ro'yxat */
export function textHtml(text: string): string {
  return text
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split("\n").filter((l) => l.trim());
      if (!lines.length) return "";
      const out: string[] = [];
      let list: string[] = [];
      let para: string[] = [];
      const flush = () => {
        if (para.length) out.push(`<p>${para.map(inline).join("<br>")}</p>`);
        if (list.length) out.push(`<ul>${list.map((l) => `<li>${inline(l)}</li>`).join("")}</ul>`);
        para = [];
        list = [];
      };
      for (const l of lines) {
        const m = l.match(/^\s*[-•*]\s+(.+)$/);
        if (m) {
          if (para.length) flush();
          list.push(m[1]);
        } else {
          if (list.length) flush();
          para.push(l);
        }
      }
      flush();
      return out.join("");
    })
    .join("\n");
}

const imgHtml = (img: PostImage, alt: string) =>
  `<figure><img src="${esc(img.src)}" alt="${esc(img.alt ?? alt)}" width="${Math.round(img.width)}" height="${Math.round(img.height)}" loading="lazy" decoding="async"></figure>`;

/** Maqola tanasi (bitta tilda): H1, muqova, kirish, bo'limlar (H2 + matn + rasm) — lib/blog.ts → parseArticle shu tuzilmani kutadi */
export function postHtml(p: Post, lang: Locale): string {
  return [
    `<h1>${esc(p.title[lang])}</h1>`,
    p.cover ? imgHtml(p.cover, p.title[lang]) : "",
    textHtml(p.intro[lang]),
    ...p.sections.map((s) => [s.heading[lang].trim() ? `<h2>${esc(s.heading[lang].trim())}</h2>` : "", textHtml(s.text[lang]), s.image ? imgHtml(s.image, s.heading[lang]) : ""].join("\n")),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Sitemap formati (Tilda'dagidek): 2026-08-22T19:24:32+00:00 */
export const sitemapDate = (iso: string) => new Date(iso).toISOString().replace(/\.\d+Z$/, "+00:00");

let cache: Post[] | null = null;
/** Saytga chiqadigan (ready) maqolalar — yaratilgan vaqti bo'yicha, yangisi oxirida */
export function readyPosts(): Post[] {
  if (!cache) {
    const all = fs.existsSync(FILE) ? (JSON.parse(fs.readFileSync(FILE, "utf8")) as Post[]) : [];
    // Faqat uch tilli (yangi) formatdagi tayyor maqolalar
    cache = all
      .filter((p) => p.status === "ready" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug ?? "") && typeof p.title === "object")
      .sort((a, b) => a.created.localeCompare(b.created));
  }
  return cache;
}

/** Maqolaning bitta tildagi nusxasi → eski sahifa formati (lib/seo/legacy.ts → LegacyPage) */
export function postPage(p: Post, lang: Locale) {
  const alternates = Object.fromEntries(LANGS.map((l) => [l, postPath(l, p.slug)])) as Record<Locale, string>;
  const pagePath = alternates[lang];
  const url = SITE + pagePath;
  const title = p.seo.title[lang].trim() || p.title[lang];
  const description = p.seo.description[lang].trim() || p.excerpt[lang];
  const image = p.cover ? SITE + p.cover.src : null;
  const info: PostInfo = { id: p.id, topic: p.topic, excerpt: p.excerpt[lang], created: p.created, updated: p.updated, featured: p.seo.featured, index: p.seo.index, alternates };
  return {
    path: pagePath,
    group: "blogPost" as const,
    urlLang: lang,
    contentLang: lang,
    meta: {
      htmlLang: null,
      title,
      description,
      keywords: p.seo.keywords[lang].trim() || null,
      robots: p.seo.index ? null : "noindex, follow",
      canonical: url,
      hreflang: {},
      og: { url, title, description, type: "article", image },
    },
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title[lang],
        description,
        inLanguage: lang,
        datePublished: p.created,
        dateModified: p.updated,
        mainEntityOfPage: url,
        ...(image && { image }),
        author: { "@type": "Organization", name: "Onlayn Hamshira", url: SITE },
        publisher: { "@type": "Organization", name: "Onlayn Hamshira", url: SITE },
      },
    ],
    html: postHtml(p, lang),
    post: info,
  };
}

/** Barcha tayyor maqolalarning uchala tildagi sahifalari */
export const postPages = () => readyPosts().flatMap((p) => LANGS.map((l) => postPage(p, l)));
