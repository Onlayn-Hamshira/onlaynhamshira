// Admin panel (alohida loyiha: onlaynhamshira-admin) o'zgarishlarini saytga qo'llash qoidalari.
//
// Matn manbalari (SOURCES) — uch tildagi bir xil tuzilmali obyektlar: lug'atlar (lib/i18n/dictionaries),
// "Nega biz?" (lib/why.ts) va hamkor sahifasi (lib/expert.ts). Admin o'zgarishlari manba fayllarga emas,
// content/edits/text.json ga "yo'l → qiymat" ko'rinishida yoziladi va build vaqtida ustiga qo'yiladi.
// Qulflar va ro'yxatlar admin panelga app/edit-sources.json orqali beriladi — yagona manba shu fayl.

import type { Locale } from "@/lib/i18n/config";

export const SOURCES = ["dict", "why", "expert"] as const;
export type Source = (typeof SOURCES)[number];

export type Overrides = Record<string, unknown>;
export type TextEdits = Record<Source, Record<Locale, Overrides>>;

/**
 * ⚠️ SEO: tahrirlanmaydigan yo'llar. meta — Tilda <head> qiymatlari; H1 — seo:check Tilda bilan solishtiradi.
 * Pul formati va belgilar — matn emas (raqamlarga qo'shilib ketadi). text.json da bo'lsa ham e'tiborsiz qoldiriladi.
 */
export const LOCKED: Record<Source, RegExp[]> = {
  dict: [/^meta(\.|$)/, /^hero\.title(Before|Accent|After)$/, /^common\.(money|fromBefore)(\.|$)/],
  why: [/^h1$/],
  expert: [/^h1$/],
};
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

const splitPath = (p: string) => p.split(".").map((k) => (/^\d+$/.test(k) ? Number(k) : k));

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
