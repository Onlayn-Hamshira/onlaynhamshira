// Admin paneldan saqlangan matnlar (content/edits/text.json) — build vaqtida asl matn ustiga qo'yiladi.
// Oddiy tashrifchi uchun bu statik ma'lumot: so'rov paytida hech qanday kod ishlamaydi.

import raw from "@/content/edits/text.json";
import type { Locale } from "@/lib/i18n/config";
import { applyOverrides, type Source, type TextEdits } from "./shared";

export const TEXT_EDITS = raw as unknown as TextEdits;

export const withEdits = <T,>(source: Source, lang: Locale, base: T, edits: TextEdits = TEXT_EDITS) =>
  applyOverrides(base, edits[source]?.[lang], source);
