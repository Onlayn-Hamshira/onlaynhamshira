// Admin paneldan TASDIQ bilan o'zgartirilgan metadata (content/edits/seo.json): sahifa yo'li → maydonlar.
// ⚠️ Bu Tilda'dan olingan SEO qiymatlarini almashtiradi. Admin panel uni faqat ogohlantirish va yozma tasdiqdan
// keyin saqlaydi; scripts/seo-check.mjs shu fayldagi qiymatlarni kutilgan qiymat deb oladi.

import raw from "@/content/edits/seo.json";

export const SEO_FIELDS = ["title", "description", "keywords", "ogTitle", "ogDescription"] as const;
export type SeoFields = Partial<Record<(typeof SEO_FIELDS)[number], string>>;

const SEO_EDITS = raw as Record<string, SeoFields>;

/** Sahifaning (tashqi URL yo'li: "/", "/ru", "/blog/x") tasdiqlangan metadata o'zgarishlari */
export const seoEdit = (path: string): SeoFields => SEO_EDITS[path] ?? {};
