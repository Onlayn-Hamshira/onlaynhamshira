#!/usr/bin/env node
// SEO regressiya tekshiruvi: ishlab turgan sayt (standart: http://localhost:3000) Tilda'dagi
// 86 URL'ning <head> qiymatlari bilan solishtiriladi (docs/seo-baseline/expected-head.json).
//
//   npm run build && npm start      # boshqa terminalda
//   npm run seo:check               # yoki: node scripts/seo-check.mjs http://localhost:3311
//
// Bitta ham farq bo'lsa — exit code 1. Har qanday o'zgarishdan keyin (deploy oldidan) ishga tushiring.

import fs from "node:fs";

const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const SITE = "https://onlaynhamshira.uz";
const expected = JSON.parse(fs.readFileSync(new URL("../docs/seo-baseline/expected-head.json", import.meta.url)));
const originalSitemap = fs.readFileSync(new URL("../docs/seo-baseline/sitemap-original.xml", import.meta.url), "utf8");

const decode = (s) =>
  s
    .replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d)).replace(/&amp;/g, "&");
const norm = (s) => (s == null ? null : decode(s).replace(/\s+/g, " ").trim() || null);
const abs = (u) => (u == null ? null : (u.startsWith("/") ? SITE + u : u).replace(/\/$/, ""));
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i")); return m ? m[1] : null; };

function readHead(html) {
  const head = html.split(/<body[\s>]/i)[0];
  const tags = head.match(/<(meta|link)\b[^>]*>/gi) || [];
  const find = (pred, a) => { const t = tags.find(pred); return t ? norm(attr(t, a)) : null; };
  const meta = (k, v) => (t) => /^<meta/i.test(t) && attr(t, k) === v;
  const hreflang = {};
  for (const t of tags) if (/^<link/i.test(t) && attr(t, "rel") === "alternate" && attr(t, "hreflang")) hreflang[attr(t, "hreflang")] = abs(attr(t, "href"));
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return {
    title: title ? norm(title[1]) : null,
    description: find(meta("name", "description"), "content"),
    keywords: find(meta("name", "keywords"), "content"),
    canonical: abs(find((t) => /^<link/i.test(t) && attr(t, "rel") === "canonical", "href")),
    ogUrl: abs(find(meta("property", "og:url"), "content")),
    ogTitle: find(meta("property", "og:title"), "content"),
    ogDescription: find(meta("property", "og:description"), "content"),
    ogImage: find(meta("property", "og:image"), "content"),
    hreflang,
  };
}

const errors = [];
const fail = (p, msg) => errors.push(`${p}: ${msg}`);
const heads = new Map();

for (const [p, exp] of Object.entries(expected)) {
  let res;
  try { res = await fetch(BASE + p, { redirect: "manual" }); } catch (e) { console.error(`Server ishlamayapti: ${BASE} (${e.message})`); process.exit(2); }
  if (res.status !== 200) { fail(p, `status ${res.status} (200 kutilgan)`); continue; }
  const html = await res.text();
  const got = readHead(html);
  heads.set(abs(SITE + p), got);
  // Tilda'dagi xato qaytmasin: canonical boshqa sahifaga ko'rsatmasin
  if (got.canonical !== abs(SITE + p)) fail(p, `canonical o'z URL'i emas: ${got.canonical}`);
  for (const k of ["title", "description", "keywords", "ogTitle", "ogDescription"]) if ((exp[k] || null) !== got[k]) fail(p, `${k}: kutilgan ${JSON.stringify(exp[k])} | bor ${JSON.stringify(got[k])}`);
  for (const k of ["canonical", "ogUrl"]) if (abs(exp[k]) !== got[k]) fail(p, `${k}: kutilgan ${exp[k]} | bor ${got[k]}`);
  if (exp.ogImage && exp.ogImage !== got.ogImage) fail(p, `og:image: kutilgan ${exp.ogImage} | bor ${got.ogImage}`);
  const expHl = Object.fromEntries(Object.entries(exp.hreflang).map(([k, v]) => [k, abs(v)]));
  if (JSON.stringify(Object.entries(expHl).sort()) !== JSON.stringify(Object.entries(got.hreflang).sort())) fail(p, `hreflang: kutilgan ${JSON.stringify(expHl)} | bor ${JSON.stringify(got.hreflang)}`);
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) fail(p, "noindex qo'yilgan!");
  if (!html.includes("EVBVxL3PtTQMVXOX-ZGZtYCH8kGH0vyVIby_P5xXbWU")) fail(p, "google-site-verification yo'q");
  if (!html.includes("G-MP5XEFGJRB")) fail(p, "Google Analytics (G-MP5XEFGJRB) yo'q");
  if (!html.includes("AW-17432829439")) fail(p, "Google Ads (AW-17432829439) yo'q");
  if (!html.includes("97597715")) fail(p, "Yandex Metrika (97597715) yo'q");
  if (!/"@type":"MedicalBusiness"/.test(html)) fail(p, "MedicalBusiness JSON-LD yo'q");
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { fail(p, "yaroqsiz JSON-LD"); }
  }
  if (!p.startsWith("/qr") && !/<h1[\s>]/.test(html)) fail(p, "H1 yo'q");
}

// hreflang: o'zini o'z ichiga olsin, har bir alternativ tekshirilgan sahifa bo'lsin va xuddi shu to'plamni
// qaytarsin (ikki tomonlama — aks holda Google hreflang'ni e'tiborsiz qoldiradi)
for (const [url, h] of heads) {
  const entries = Object.entries(h.hreflang).filter(([k]) => k !== "x-default");
  if (!entries.length) continue;
  const p = url.replace(SITE, "") || "/";
  if (!entries.some(([, u]) => u === url)) fail(p, "hreflang sahifaning o'zini ko'rsatmaydi");
  for (const [lang, u] of entries) {
    const other = heads.get(u);
    if (!other) { fail(p, `hreflang ${lang} → ${u} tekshirilgan sahifa emas`); continue; }
    if (JSON.stringify(Object.entries(other.hreflang).sort()) !== JSON.stringify(Object.entries(h.hreflang).sort()))
      fail(p, `hreflang ${lang} → ${u} bilan ikki tomonlama emas`);
  }
}

// sitemap: asl 86 URL kamaymasligi kerak
const locs = (xml) => new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, "")));
const sm = await (await fetch(BASE + "/sitemap.xml")).text();
const mine = locs(sm);
for (const u of locs(originalSitemap)) if (!mine.has(u)) fail("/sitemap.xml", `yo'q: ${u}`);
const robots = await (await fetch(BASE + "/robots.txt")).text();
if (!/Sitemap:\s*https:\/\/onlaynhamshira\.uz\/sitemap\.xml/.test(robots)) fail("/robots.txt", "Sitemap qatori yo'q");
if (/Disallow:\s*\/\s*$/m.test(robots)) fail("/robots.txt", "butun sayt yopilgan (Disallow: /)!");

if (errors.length) {
  console.error(`✗ SEO buzilgan — ${errors.length} ta muammo:\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`✓ SEO OK: ${Object.keys(expected).length} URL, sitemap ${mine.size} URL, tracking va JSON-LD joyida`);
