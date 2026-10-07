// Admin panel (alohida loyiha: onlaynhamshira-admin) uchun manba ma'lumotlar: asl matnlar (admin o'zgarishlarisiz),
// SEO qulflari, ro'yxatlar, almashtiriladigan rasmlar va eski sahifalar ro'yxati. Build vaqtida bir marta
// yasaladigan statik JSON — saytga hech qanday so'rov-paytidagi yuk qo'shmaydi. Qoidalar shu repoda qoladi
// (lib/edit/shared.ts), admin panel ularni shu fayldan o'qiydi.

import fs from "node:fs";
import path from "node:path";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { getRawDictionary } from "@/lib/i18n/get-dictionary";
import { WHY } from "@/lib/why";
import { EXPERT } from "@/lib/expert";
import { legacyFile, legacyPages } from "@/lib/seo/legacy";
import { EDITABLE_IMAGE_PREFIXES } from "@/lib/edit/edits";
import { LISTS, LOCKED, SOURCES } from "@/lib/edit/shared";

export const dynamic = "force-static";

// O'z dizayniga ega sahifalar: HTML'dan faqat qism ajratib oladi (blog ro'yxati, kontaktlar, ilova, sertifikatlar)
// yoki matni lib/why.ts, lib/expert.ts da — bloklab tahrirlanmaydi
const NO_BLOCK_EDIT = new Set(["blogIndex", "compare", "contacts", "app", "certificates", "expert", "qr"]);

const IMAGE_EXT = /\.(webp|jpe?g|png|avif|svg)$/i;

function publicImages(prefix: string): string[] {
  const dir = path.join(process.cwd(), "public", prefix);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => IMAGE_EXT.test(f)).sort().map((f) => `${prefix}${f}`);
}

export async function GET() {
  const byLang = async <T,>(get: (l: Locale) => T | Promise<T>) =>
    Object.fromEntries(await Promise.all(LOCALES.map(async (l) => [l, await get(l)] as const)));

  const body = {
    version: 1,
    generatedAt: new Date().toISOString(),
    locales: LOCALES,
    sources: {
      dict: await byLang(getRawDictionary),
      why: await byLang((l) => WHY[l]),
      expert: await byLang((l) => EXPERT[l]),
    },
    locked: Object.fromEntries(SOURCES.map((s) => [s, LOCKED[s].map((re) => re.source)])),
    lists: LISTS,
    imagePrefixes: EDITABLE_IMAGE_PREFIXES,
    images: EDITABLE_IMAGE_PREFIXES.flatMap(publicImages),
    pages: legacyPages().map((pg) => ({
      path: pg.path,
      file: legacyFile(pg.path),
      group: pg.group,
      lang: pg.contentLang,
      title: pg.meta.title,
      blockEditable: !NO_BLOCK_EDIT.has(pg.group),
    })),
  };
  return Response.json(body, { headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
