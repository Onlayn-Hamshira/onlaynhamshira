// Sahifalar uchun matn manbalari: oddiy tashrifchiga — build vaqtidagi (statik) matn,
// admin tahrirlash rejimida — repodagi eng so'nggi o'zgarishlar + har matnga ko'rinmas manzil belgisi.

import { cache } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary, getRawDictionary } from "@/lib/i18n/get-dictionary";
import { WHY } from "@/lib/why";
import { EXPERT } from "@/lib/expert";
import { legacyFile, type LegacyPage } from "@/lib/seo/legacy";
import { adminUser } from "./auth";
import { stegaDeep, type TextEdits } from "./shared";
import { TEXT_EDITS, withEdits } from "./text";
import { readJson, storeMode } from "./store";
import { annotate } from "./html";

export const TEXT_FILE = "content/edits/text.json";
export const IMAGES_FILE = "content/edits/images.json";

/** Repodagi eng so'nggi holat (deploy kutilmaydi) — bitta so'rov ichida bir marta o'qiladi */
// (token yo'q Vercel'da fayl o'qilmaydi — build'dagi holat ishlatiladi)
export const freshTextEdits = cache(() => readJson<TextEdits>(TEXT_FILE).catch(() => TEXT_EDITS));
export const freshImageEdits = cache(() => readJson<Record<string, string>>(IMAGES_FILE));

export const pageText = cache(async (lang: Locale) => {
  const admin = await adminUser();
  if (!admin) {
    return {
      admin: null,
      t: await getDictionary(lang),
      why: (l: Locale) => withEdits("why", l, WHY[l]),
      expert: (l: Locale) => withEdits("expert", l, EXPERT[l]),
    };
  }
  const edits = await freshTextEdits();
  return {
    admin,
    t: stegaDeep(withEdits("dict", lang, await getRawDictionary(lang), edits), "dict", lang),
    why: (l: Locale) => stegaDeep(withEdits("why", l, WHY[l], edits), "why", l),
    expert: (l: Locale) => stegaDeep(withEdits("expert", l, EXPERT[l], edits), "expert", l),
  };
});

/** Admin rejimida HTML bloklari tahrirlanadigan sahifa turlari (qolganlari o'z dizayniga ega) */
// (blog ro'yxati, kontaktlar, ilova, sertifikatlar HTML'dan qism ajratib oladi; "Nega biz?" va hamkor sahifasi
// matni lib/why.ts, lib/expert.ts da — ular stega orqali tahrirlanadi)
const NO_BLOCK_EDIT = new Set(["blogIndex", "compare", "contacts", "app", "certificates", "expert", "qr"]);
export const blockEditable = (pg: LegacyPage) => !NO_BLOCK_EDIT.has(pg.group);

/** Admin: sahifa JSON'ini repodan qayta o'qiydi va bloklarga data-oh qo'yadi */
export async function adminLegacyPage(pg: LegacyPage): Promise<LegacyPage> {
  const file = legacyFile(pg.path);
  const fresh = file ? await readJson<LegacyPage>(file).catch(() => pg) : pg;
  if (!blockEditable(fresh)) return fresh;
  let html = annotate(fresh.html);
  // Yangi yuklangan rasm deploy tugaguncha saytda yo'q — admin uni repodan ko'radi
  if (storeMode() === "github") html = html.replace(/(\ssrc=")(\/uploads\/[^"]+)"/g, (_, a: string, p: string) => `${a}/api/admin/asset?p=${encodeURIComponent(p)}"`);
  return { ...fresh, html };
}
