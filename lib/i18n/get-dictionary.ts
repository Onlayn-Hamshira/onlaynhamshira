import type { Locale } from "./config";
import { withEdits } from "@/lib/edit/text";

// Lug'atlar faqat serverda yuklanadi; client komponentlarga faqat kerakli qismi prop sifatida beriladi
const dictionaries = {
  uz: () => import("./dictionaries/uz").then((m) => m.default),
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

/** Asl lug'at (admin o'zgarishlarisiz) — admin panel uchun */
export const getRawDictionary = (l: Locale) => dictionaries[l]();

/** Lug'at + admin paneldan saqlangan o'zgarishlar (content/edits/text.json, build vaqtida) */
export const getDictionary = async (l: Locale) => withEdits("dict", l, await dictionaries[l]());
