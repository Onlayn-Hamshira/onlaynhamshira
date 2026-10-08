// Admin paneldan sozlangan shrift o'lchami (content/edits/styles.json): sahifa yo'li → element manzili → masshtab.
// d — kompyuter (≥640px), m — telefon; 1 = asl o'lcham. Sahifaga server tomonda <style> bo'lib qo'shiladi
// (components/EditStyles.tsx) — yuklanishda sakrash yo'q. Element manzili admin vizual tahrirlovchisida
// hisoblanadi: sahifa tuzilmasi o'zgarsa, eski manzil boshqa elementga tushmasligi uchun shu yerda tekshiring.

import raw from "@/content/edits/styles.json";

export type Scale = { d?: number; m?: number };

const STYLE_EDITS = raw as Record<string, Record<string, Scale>>;

// Faqat "body" yoki "#id" dan boshlanib, teg:nth-of-type(n) zanjiri — <style> ichiga boshqa narsa tushmasin
const SELECTOR = /^(?:body|#[A-Za-z][\w-]{0,40})(?:>[a-z][a-z0-9-]{0,20}:nth-of-type\(\d{1,4}\)){1,30}$/;
const ok = (n: unknown): n is number => typeof n === "number" && n >= 0.5 && n <= 2;

/** Sahifaning (tashqi URL yo'li: "/", "/ru", "/blog/x") shrift o'lchami qoidalari — CSS */
export function editStylesCss(path: string): string {
  const desk: string[] = [], mob: string[] = [], all: string[] = [];
  for (const [sel, s] of Object.entries(STYLE_EDITS[path] ?? {})) {
    if (!SELECTOR.test(sel)) continue;
    const d = ok(s.d) ? s.d : 1, m = ok(s.m) ? s.m : 1;
    if (d === m) {
      if (d !== 1) all.push(`${sel}{zoom:${d}}`);
      continue;
    }
    if (d !== 1) desk.push(`${sel}{zoom:${d}}`);
    if (m !== 1) mob.push(`${sel}{zoom:${m}}`);
  }
  return [
    ...all,
    desk.length ? `@media (min-width:640px){${desk.join("")}}` : "",
    mob.length ? `@media (max-width:639.98px){${mob.join("")}}` : "",
  ].join("");
}
