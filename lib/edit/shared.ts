// Admin tahrirlash tizimining server va brauzerda ishlaydigan umumiy qismi (Node API'siz).
//
// Matn manbalari (SOURCES) — uch tildagi bir xil tuzilmali obyektlar: lug'atlar (lib/i18n/dictionaries),
// "Nega biz?" (lib/why.ts) va hamkor sahifasi (lib/expert.ts). Admin o'zgarishlari manba fayllarga emas,
// content/edits/text.json ga "yo'l → qiymat" ko'rinishida yoziladi va build vaqtida ustiga qo'yiladi.
// Shu sabab izohlar va TS turlari buzilmaydi, o'zgarishlar tarixi esa git'da qoladi.

import type { Locale } from "@/lib/i18n/config";

export const SOURCES = ["dict", "why", "expert"] as const;
export type Source = (typeof SOURCES)[number];
export const isSource = (s: unknown): s is Source => (SOURCES as readonly unknown[]).includes(s);

export type Overrides = Record<string, unknown>;
export type TextEdits = Record<Source, Record<Locale, Overrides>>;

/**
 * ⚠️ SEO: tahrirlanmaydigan yo'llar. meta — Tilda <head> qiymatlari; H1 — seo:check Tilda bilan solishtiradi.
 * Pul formati va belgilar — matn emas (raqamlarga qo'shilib ketadi).
 */
const LOCKED: Record<Source, RegExp[]> = {
  dict: [/^meta(\.|$)/, /^hero\.title(Before|Accent|After)$/, /^common\.(money|fromBefore)(\.|$)/],
  why: [/^h1$/],
  expert: [/^h1$/],
};
export const LOCK_REASON = "SEO: bu matn Tilda'dagi asl qiymat bilan bir xil bo‘lishi shart (title/H1) — admin paneldan o‘zgartirilmaydi.";
export const isLocked = (source: Source, path: string) => LOCKED[source].some((re) => re.test(path));

/**
 * Element qo'shish/o'chirish mumkin bo'lgan ro'yxatlar. Qolgan ro'yxatlar boshqa ma'lumot bilan tartib bo'yicha
 * bog'langan (rasm, ikonka, narx — lib/data.ts), ularda element soni o'zgarsa dizayn buziladi.
 */
export const LISTS: Record<Source, string[]> = {
  dict: ["faq.items", "hero.perks", "services.perks", "blog.principles", "certificates.how", "join.steps"],
  why: ["highlights", "benefits", "steps", "faq"],
  expert: ["faq.items"],
};
export const LIST_REASON = "Bu ro‘yxat rasm/ikonka/narxlar bilan tartib bo‘yicha bog‘langan — element qo‘shilsa yoki o‘chirilsa dizayn buziladi.";

/** "faq.items.3.q" → ["faq.items", 3] (eng yaqin qo'shish/o'chirish mumkin bo'lgan ro'yxat va element raqami) */
export function listOf(source: Source, path: string): { list: string; index: number } | null {
  for (const list of LISTS[source]) {
    if (!path.startsWith(list + ".")) continue;
    const index = Number(path.slice(list.length + 1).split(".")[0]);
    if (Number.isInteger(index)) return { list, index };
  }
  return null;
}

export const splitPath = (p: string) => p.split(".").map((k) => (/^\d+$/.test(k) ? Number(k) : k));

export function getPath(obj: unknown, path: string): unknown {
  let cur: unknown = obj;
  for (const k of splitPath(path)) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[k];
  }
  return cur;
}

function setPath(obj: unknown, path: string, value: unknown) {
  const keys = splitPath(path);
  let cur = obj as Record<string | number, unknown>;
  for (const k of keys.slice(0, -1)) {
    if (cur[k] == null || typeof cur[k] !== "object") return; // manbada yo'q yo'l — e'tiborsiz
    cur = cur[k] as Record<string | number, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

/** Manba obyektiga admin o'zgarishlarini qo'yadi (asl obyekt o'zgarmaydi). Qisqa yo'llar avval: ro'yxat, keyin uning elementi */
export function applyOverrides<T>(base: T, overrides: Overrides | undefined, source: Source): T {
  const keys = Object.keys(overrides ?? {}).filter((k) => !isLocked(source, k));
  if (!keys.length) return base;
  const out = structuredClone(base);
  keys.sort((a, b) => a.split(".").length - b.split(".").length);
  for (const k of keys) setPath(out, k, structuredClone(overrides![k]));
  return out;
}

// ─── Stega: ko'rinmas belgilar ───────────────────────────────────────────────────────────────────────────
// Faqat admin rejimida har bir matn oxiriga ko'rinmas belgilar bilan uning manzili ("dict:uz:faq.items.3.q")
// yoziladi. Brauzerdagi overlay matn tugunlaridan shu belgilarni o'qib, qaysi element qaysi matn ekanini biladi —
// komponentlarni birma-bir o'zgartirish shart emas. Oddiy tashrifchilar bu belgilarni hech qachon olmaydi.

const DIGITS = ["​", "‌", "‍", "⁠"];
const START = "⁤";
const END = "⁣";
export const STEGA_RE = /⁤([​‌‍⁠]+)⁣/g;

export function stegaEncode(id: string): string {
  let s = START;
  for (const byte of new TextEncoder().encode(id)) {
    for (let shift = 6; shift >= 0; shift -= 2) s += DIGITS[(byte >> shift) & 3];
  }
  return s + END;
}

export function stegaDecode(digits: string): string {
  const bytes: number[] = [];
  for (let i = 0; i + 3 < digits.length; i += 4) {
    let b = 0;
    for (let j = 0; j < 4; j++) b = (b << 2) | DIGITS.indexOf(digits[i + j]);
    bytes.push(b);
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export const stegaStrip = (s: string) => s.replace(STEGA_RE, "");

// Matn emas: havolalar, fayl yo'llari, identifikatorlar
const NOT_TEXT = /^(\/|https?:|#|tel:|mailto:)/;

/** Har bir matnga manzil belgisini qo'shadi (faqat admin rejimi uchun) */
export function stegaDeep<T>(obj: T, source: Source, lang: Locale): T {
  const walk = (v: unknown, path: string): unknown => {
    if (typeof v === "string") {
      if (!v.trim() || NOT_TEXT.test(v) || isLocked(source, path)) return v;
      return v + stegaEncode(`${source}:${lang}:${path}`);
    }
    if (Array.isArray(v)) return v.map((x, i) => walk(x, path ? `${path}.${i}` : String(i)));
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, path ? `${path}.${k}` : k)]));
    }
    return v;
  };
  return walk(obj, "") as T;
}

/** Bo'lim nomlari — modal sarlavhasida "Savol-javoblar › 4-element › Savol" ko'rinishida */
export const SECTION_LABELS: Record<string, string> = {
  common: "Umumiy", header: "Menyu", download: "Yuklab olish oynasi", hero: "Bosh ekran", booking: "Buyurtma bloki",
  stats: "Raqamlar", bento: "Xizmatlar kartochkalari", how: "Qanday ishlaydi", benefits: "Afzalliklar",
  services: "Narxlar", app: "Mobil ilova", safety: "Xavfsizlik", specialists: "Mutaxassislar", join: "Hamkorlik banneri",
  reviews: "Mijozlar fikrlari", news: "Yangiliklar", faq: "Savol-javoblar", contact: "Aloqa", footer: "Footer",
  certificates: "Sertifikatlar", legacy: "Sahifa oxiri", blog: "Blog", contactsPage: "Kontaktlar sahifasi",
  legalPage: "Huquqiy hujjat", appPage: "Ilova sahifasi", mobileCta: "Mobil tugmalar",
  items: "Ro‘yxat", title: "Sarlavha", text: "Matn", label: "Belgi", q: "Savol", a: "Javob", lead: "Kirish matni",
  desc: "Tavsif", description: "Tavsif", note: "Izoh", name: "Ism", city: "Shahar", perks: "Afzalliklar",
};

export function pathLabel(source: Source, path: string): string {
  const prefix = source === "why" ? ["Nega biz?"] : source === "expert" ? ["Hamkorlik sahifasi"] : [];
  return [...prefix, ...path.split(".").map((k) => (/^\d+$/.test(k) ? `${Number(k) + 1}-element` : (SECTION_LABELS[k] ?? k)))].join(" › ");
}
