// Blog: Tilda'dan olingan maqolalar (content/legacy) build vaqtida yagona ko'rinishga keltiriladi.
// Maqola HTML'i turli Tilda shablonlaridan kelgan (zero-blok, HTML-kod bloki, cover + article-wrapper),
// shuning uchun bu yerda: sarlavha (H1 matni aynan saqlanadi), muqova rasmi, mundarija (H2), o'qish vaqti
// va mavzu ajratiladi. ⚠️ <head> metadata, JSON-LD va URL'lar o'zgarmaydi — faqat sahifa tanasi.

import { legacyPages, type LegacyPage } from "@/lib/seo/legacy";
import { LEGACY_ROUTES } from "@/lib/seo/routes";

export { BLOG_TOPICS, formatDate } from "./blog-shared";
export type { BlogEntry, BlogImage, BlogTopic, TocItem } from "./blog-shared";
import type { BlogEntry, BlogImage, BlogTopic, TocItem } from "./blog-shared";

const ARTICLE_GROUPS = new Set(["blogPost", "article"]);
export const isArticle = (pg: LegacyPage) => ARTICLE_GROUPS.has(pg.group);

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

/** HTML → oddiy matn (<br> bo'shliq, boshqa teglar olib tashlanadi) */
const plain = (html: string) => decode(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

const imageOf = (tag: string): BlogImage | null => {
  const src = attr(tag, "src");
  if (!src) return null;
  const w = attr(tag, "width"), h = attr(tag, "height");
  return { src, srcSet: attr(tag, "srcset"), width: w ? +w : undefined, height: h ? +h : undefined };
};

// Mavzu — URL va sarlavhadagi kalit so'zlar bo'yicha (uch tilda)
const TOPIC_RULES: [BlogTopic, RegExp][] = [
  ["news", /app-update|prezident|uzbekistan/],
  ["pressure", /bosim|davlen|pressure/],
  ["family", /chaqaloq|newborn|novorozh|massaj|massag|massazh|kupat|chomiltir|bathe/],
  ["care", /operats|postoperat|posleoper|saraton|onkolog|palliativ|yotib|lezhach|bedridden/],
  ["prevention", /immun|infek|infekts|infection|habits|privych|odatlar|profilakt|detok|detox/],
];
const topicOf = (pg: LegacyPage): BlogTopic => TOPIC_RULES.find(([, re]) => re.test(pg.path))?.[0] ?? "nurse";

/** Daqiqada o'qish vaqti (~200 so'z/daqiqa) */
const minutesOf = (html: string) => Math.max(1, Math.round(plain(html).split(" ").length / 200));

type Parsed = { title: string; cover: BlogImage | null; body: string; toc: TocItem[]; entry: BlogEntry };
const parsedCache = new Map<string, Parsed>();

/** Maqolani ajratish: H1 va muqova sahifa sarlavhasiga ko'chadi, qolgani — matn */
export function parseArticle(pg: LegacyPage): Parsed {
  const hit = parsedCache.get(pg.path);
  if (hit) return hit;
  let html = pg.html;

  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1 ? plain(h1[1]) : (pg.meta.title ?? "");
  if (h1) html = html.replace(h1[0], "");

  // Muqova: birinchi H2'dan oldingi birinchi rasm (Tilda'da sarlavha ustidagi yoki ostidagi katta rasm)
  let cover: BlogImage | null = null;
  const firstH2 = html.search(/<h2[\s>]/);
  const img = html.match(/<img[^>]*>/);
  if (img && img.index !== undefined && (firstH2 === -1 || img.index < firstH2)) {
    cover = imageOf(img[0]);
    const fig = [...html.matchAll(/<figure[^>]*>[\s\S]*?<\/figure>/g)].find((m) => m[0].includes(img[0]));
    html = html.replace(fig ? fig[0] : img[0], "");
  }

  // Tilda'dan qolgan matnsiz havolalar (<a href> </a>) — ko'rinmaydi, ekran o'quvchiga nomsiz havola bo'lib chiqadi
  html = html.replace(/<a\s[^>]*>\s*<\/a>/g, "");

  // YouTube: iframe o'rniga muqova + play (facade). Video faqat bosilganda yuklanadi (youtube-nocookie) —
  // sahifa tezroq, uchinchi tomon cookie'lari yo'q. JS'siz havola YouTube'da ochiladi.
  html = html.replace(/<iframe[^>]*\ssrc="https:\/\/www\.youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})[^"]*"[^>]*>\s*<\/iframe>/g, (tag, id: string) => {
    const label = tag.match(/\stitle="([^"]*)"/)?.[1] ?? "YouTube";
    return (
      `<a class="yt-facade" href="https://www.youtube.com/watch?v=${id}" data-yt="${id}" target="_blank" rel="noopener">` +
      `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">` +
      `<span class="yt-play" aria-hidden="true"></span><span class="sr-only">${label}</span></a>`
    );
  });

  // Raqamlangan sarlavha + ro'yxat ("1. Ukol qilish" + <ul>) → ochiladigan blok (<details>, JS'siz ishlaydi).
  // Matn DOM'da qoladi (SEO), ko'rinishi — globals.css dagi .acc
  html = html.replace(
    /<p>\s*(<strong>(?:(?!<\/p>)[\s\S])*?)<\/p>\s*(?:<div>\s*)?<(ul|ol)>((?:(?!<\/\2>)[\s\S])*)<\/\2>(?:\s*<\/div>)?/g,
    (all, head: string, tag: string, items: string) => {
      const m = plain(head).match(/^(\d+)\.\s*(.+)$/);
      if (!m) return all;
      return (
        `<details class="acc"><summary><span class="acc-num">${m[1]}</span><span class="acc-title">${m[2]}</span>` +
        `<span class="acc-arrow" aria-hidden="true"></span></summary><${tag}>${items}</${tag}></details>`
      );
    },
  );

  // Bo'sh qolgan o'ram div'lar (Tilda bloklari) — oraliq bo'shliq bermasin
  for (let prev = ""; prev !== html; ) {
    prev = html;
    html = html.replace(/<div[^>]*>\s*<\/div>/g, "");
  }

  // Mundarija: H2'larga langar
  const toc: TocItem[] = [];
  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_, attrs: string, inner: string) => {
    const text = plain(inner);
    if (!text) return `<h2${attrs}>${inner}</h2>`;
    const id = `s-${toc.length + 1}`;
    toc.push({ id, text });
    return `<h2${attrs.replace(/\sid="[^"]*"/, "")} id="${id}">${inner}</h2>`;
  });

  const firstP = html.match(/<p[^>]*>([\s\S]*?)<\/p>/);
  const desc = pg.meta.description ?? (firstP ? plain(firstP[1]) : "");
  const entry: BlogEntry = {
    href: pg.path,
    lang: pg.contentLang,
    title,
    excerpt: desc.length > 200 ? `${desc.slice(0, 197).trimEnd()}…` : desc,
    cover,
    topic: topicOf(pg),
    minutes: minutesOf(pg.html),
    updated: LEGACY_ROUTES.find((r) => r.path === pg.path)?.lastmod,
  };
  const res = { title, cover, body: html, toc, entry };
  parsedCache.set(pg.path, res);
  return res;
}

const byPath = () => new Map(legacyPages().map((p) => [p.path, p]));

/**
 * Blog ro'yxati: avval Tilda'dagi blog sahifasida tanlangan tartib (havolalar o'z sahifasidan sarlavha/rasm oladi —
 * Tilda'dagi noto'g'ri havola matnlari tuzaladi, takrorlar olib tashlanadi), so'ng shu tildagi qolgan blog maqolalari.
 * Kartochka rasmi — Tilda blog sahifasidagi miniatyura (bo'lmasa maqola muqovasi).
 */
export function blogEntries(index: LegacyPage): BlogEntry[] {
  const pages = byPath();
  const seen = new Set<string>();
  const out: BlogEntry[] = [];
  const add = (pg: LegacyPage | undefined, thumb?: BlogImage | null) => {
    if (!pg || !isArticle(pg) || pg.contentLang !== index.contentLang || seen.has(pg.path)) return;
    seen.add(pg.path);
    const { entry } = parseArticle(pg);
    out.push(thumb ? { ...entry, cover: thumb } : entry);
  };

  // Tilda blog sahifasi: <figure><a href><img></a></figure> + <p><a href>sarlavha</a></p>
  for (const m of index.html.matchAll(/<figure[^>]*>\s*<a href="([^"]+)"[^>]*>\s*(<img[^>]*>)/g)) {
    add(pages.get(m[1]), imageOf(m[2]));
  }
  for (const pg of legacyPages()) if (pg.group === "blogPost") add(pg);
  return out;
}

/**
 * Bosh sahifadagi "Yangiliklar": shu tildagi blog sahifasi bilan aynan bir xil ro'yxat va tartib (yagona manba) —
 * bosh sahifadagi har bir karta blogda ham bor va o'z maqolasiga olib boradi.
 */
export function homeNewsEntries(lang: string, n = 6): BlogEntry[] {
  const index = legacyPages().find((p) => p.group === "blogIndex" && p.contentLang === lang);
  return index ? blogEntries(index).filter((e) => e.cover).slice(0, n) : [];
}

/** Maqola ostidagi "o'xshash maqolalar": shu til, avval shu mavzu */
export function relatedEntries(pg: LegacyPage, n = 3): BlogEntry[] {
  const me = parseArticle(pg).entry;
  const pool = legacyPages()
    .filter((p) => isArticle(p) && p.contentLang === pg.contentLang && p.path !== pg.path)
    .map((p) => parseArticle(p).entry);
  return [...pool.filter((e) => e.topic === me.topic), ...pool.filter((e) => e.topic !== me.topic)].slice(0, n);
}
