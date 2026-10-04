// Eski Tilda sahifalari (bosh sahifadan tashqari 83 ta) — kontent content/legacy/*.json da.
// JSON fayllar Tilda HTML'idan avtomatik ajratilgan: <head> metadata (Google aynan shuni o'qiydi),
// sahifa JSON-LD'lari va tozalangan matn/rasmlar. Faqat build vaqtida (server) o'qiladi.
//
// URL'lar: tashqi (public) yo'l Tilda'dagi bilan AYNAN bir xil. Ichki yo'l = /{kontent tili}{qolgan qism}:
//   /blog/x            → /uz/blog/x   (rewrite)
//   /home-detox        → /en/home-detox (inglizcha maqola uz-prefikssiz manzilda — <html lang="en"> bo'lsin)
//   /ru/blog/x         → /ru/blog/x   (o'zi)
// Ichki yo'l to'g'ridan-to'g'ri ochilsa tashqi yo'lga 301 (dublikat URL bo'lmasin).

import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/i18n/config";
import { LEGACY_ROUTES, type RouteGroup } from "./routes";

export type LegacyMeta = {
  htmlLang: string | null;
  title: string | null;
  description: string | null;
  keywords: string | null;
  robots: string | null;
  canonical: string | null;
  hreflang: Record<string, string>;
  og: { url: string | null; title: string | null; description: string | null; type: string | null; image: string | null };
};

export type LegacyPage = {
  path: string;
  group: RouteGroup;
  urlLang: Locale;
  contentLang: Locale;
  meta: LegacyMeta;
  jsonLd: unknown[];
  html: string;
};

const DIR = path.join(process.cwd(), "content/legacy");

let cache: LegacyPage[] | null = null;
export function legacyPages(): LegacyPage[] {
  if (!cache) {
    cache = fs
      .readdirSync(DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as LegacyPage)
      .sort((a, b) => a.path.localeCompare(b.path));
  }
  return cache;
}

/** Tashqi yo'ldan URL til prefiksini olib tashlaydi: "/ru/blog/x" → "/blog/x" */
const stripLangPrefix = (p: string, urlLang: Locale) => (urlLang === "uz" ? p : p.slice(urlLang.length + 1) || "/");

/** Next.js ichidagi yo'l: app/[lang]/[...slug] */
export const internalPath = (pg: LegacyPage) => `/${pg.contentLang}${stripLangPrefix(pg.path, pg.urlLang)}`;

export const slugOf = (pg: LegacyPage) => internalPath(pg).split("/").filter(Boolean).slice(1);

export function findLegacyPage(lang: string, slug: string[]): LegacyPage | undefined {
  const p = `/${lang}/${slug.join("/")}`;
  return legacyPages().find((pg) => internalPath(pg) === p);
}

/** next.config uchun: tashqi→ichki rewrite va ichki→tashqi 301 ro'yxati */
export function legacyRouting() {
  const pages = legacyPages();
  const publicPaths = new Set(pages.map((p) => p.path));
  // Tilda'dagi har bir URL uchun sahifa bo'lishi shart — bittasi yo'qolsa build to'xtaydi
  const missing = LEGACY_ROUTES.filter((r) => r.group !== "home" && !publicPaths.has(r.path));
  if (missing.length) throw new Error(`Legacy pages missing: ${missing.map((r) => r.path).join(", ")}`);
  const seen = new Map<string, string>();
  const rewrites: { source: string; destination: string }[] = [];
  const redirects: { source: string; destination: string; statusCode: 301 }[] = [];
  for (const pg of pages) {
    const internal = internalPath(pg);
    if (seen.has(internal)) throw new Error(`Legacy route collision: ${internal} (${seen.get(internal)} vs ${pg.path})`);
    seen.set(internal, pg.path);
    if (internal === pg.path) continue;
    if (publicPaths.has(internal)) throw new Error(`Internal path ${internal} shadows public URL`);
    rewrites.push({ source: pg.path, destination: internal });
    redirects.push({ source: internal, destination: pg.path, statusCode: 301 });
  }
  return { rewrites, redirects };
}
