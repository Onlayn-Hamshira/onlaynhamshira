// Admin paneldan saqlangan matnlar (content/edits/text.json) — build vaqtida asl matn ustiga qo'yiladi.
// Oddiy tashrifchi uchun bu statik ma'lumot: so'rov paytida hech qanday kod ishlamaydi.

import raw from "@/content/edits/text.json";
import type { Locale } from "@/lib/i18n/config";
import { WHY } from "@/lib/why";
import { EXPERT } from "@/lib/expert";
import { applyOverrides, type Source, type TextEdits } from "./shared";

export const TEXT_EDITS = raw as unknown as TextEdits;

export const withEdits = <T,>(source: Source, lang: Locale, base: T) => applyOverrides(base, TEXT_EDITS[source]?.[lang], source);

/** "Nega biz?" va hamkor sahifasi matnlari — admin o'zgarishlari bilan */
export const whyText = (l: Locale) => withEdits("why", l, WHY[l]);
export const expertText = (l: Locale) => withEdits("expert", l, EXPERT[l]);
