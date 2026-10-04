// Sayt navigatsiyasi — yagona manba (header, mobil menyu, footer).
// Har bir til o'z sahifasiga olib boradi: /ru dagi "Блог" → /ru/blog (o'zbekcha /blog emas).
// ⚠️ Yo'llar Tilda'dagi URL'lar (lib/seo/routes.ts) — yangi yo'l o'ylab topmang.

import { localePath, type Locale } from "@/lib/i18n/config";

/** Alohida sahifalar — har tilda mavjud manzili */
export const PAGES = {
  blog: { uz: "/blog", ru: "/ru/blog", en: "/en/blog" },
  partner: { uz: "/expert", ru: "/ru/expert", en: "/en/expert" },
  certificates: { uz: "/certificates", ru: "/ru/certificates", en: "/en/certificates" },
  why: { uz: "/onlayn-hamshira-vs-ananaviy", ru: "/onlayn-uhod-vs-tradicionnyj", en: "/online-nursing-vs-traditional" },
  // /contacts faqat o'zbekcha bor — ru/en uchun bosh sahifadagi aloqa bo'limi
  contacts: { uz: "/contacts", ru: "/ru#contact", en: "/en#contact" },
  privacy: { uz: "/privacy-policy", ru: "/ru/privacy-policy", en: "/en/privacy-policy" },
} satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof PAGES;
export type SectionKey = "about" | "services" | "specialists" | "reviews" | "faq";
export type NavKey = SectionKey | PageKey;

export const pageHref = (key: PageKey, lang: Locale) => PAGES[key][lang];

/**
 * Bir xil maqola/hujjatning uch tildagi nusxalari (sarlavhalar bo'yicha juftlangan). Yo'llar — Tilda URL'lari
 * (lib/seo/routes.ts). Ba'zi URL'lar "boshqa til" bo'limida turadi (masalan /home-detox — inglizcha), bu ataylab.
 */
const TRANSLATIONS: Record<Locale, string>[] = [
  // Blog maqolalari
  { uz: "/blog/hamshira-uyga-chaqirish-toshkent", ru: "/ru/blog/medsestra-na-dom-tashkent", en: "/en/blog/nurse-at-home-tashkent-services-prices" },
  { uz: "/blog/uyga-hamshira-chaqirish-tibbiy-yordam", ru: "/ru/blog/vyzov-medsestry-na-dom-meditsinskaya-pomoshch", en: "/en/blog/home-nurse-visit-medical-care" },
  { uz: "/blog/uyda-ukol-qildirish-toshkentda", ru: "/ru/blog/ukoly-na-domu-v-tashkente", en: "/en/blog/injection-service-at-home-tashkent" },
  { uz: "/blog/ayollar-bolalar-massaji-toshkentda", ru: "/ru/blog/massazh-dlya-zhenshchin-i-detey-v-tashkente", en: "/en/blog/massage-in-tashkent-women-baby" },
  { uz: "/blog/immunitetni-kotarish-mavsumiy-kasalliklar", ru: "/ru/blog/kak-ukrepit-immunitet-profilaktika", en: "/en/blog/boosting-immunity-preventing-illness" },
  { uz: "/blog/infeksiyadan-himoyalanish-uy-gigiyenasi", ru: "/ru/blog/kak-zashchititsya-ot-infektsii-doma", en: "/en/blog/home-infection-protection-guide" },
  { uz: "/blog/kasallikni-oldini-olish-9-kunlik-odatlar", ru: "/ru/blog/profilaktika-9-ezhednevnyh-privychek", en: "/en/blog/daily-habits-to-prevent-illness" },
  { uz: "/blog/chaqaloq-parvarishi-yangi-onalar-uchun", ru: "/ru/blog/uhod-za-novorozhdyonnym", en: "/en/blog/newborn-care-home-guide" },
  { uz: "/blog/qon-bosimi-yuqori-bolsa-nima-qilish-kerak", ru: "/blog/chto-delat-esli-povysilos-davlenie", en: "/blog/what-to-do-high-blood-pressure" },
  { uz: "/uyda-qon-bosimini-olchash-va-nazorat-qilish", ru: "/ru/blog/kak-izmerit-i-kontrolirovat-davlenie-doma", en: "/en/blog/how-to-measure-and-control-blood-pressure-at-home" },
  { uz: "/blog/uy-sharoitida-detoks", ru: "/detoks-v-domashnih-usloviyah", en: "/home-detox" },
  { uz: "/blog/operatsiyadan-keyingi-parvarish", ru: "/posleoperatsionnyy-uhod-doma", en: "/postoperative-care-at-home" },
  { uz: "/saraton-bemor-uyda-parvarish-tavsiyalar", ru: "/podderzhka-onkologicheskih-pacientov-doma", en: "/home-palliative-care-symptom-management" },
  { uz: "/yotib-qolgan-bemorlarni-uyda-parvarish-qilish", ru: "/ru/uhod-za-lezhachimi-bolnymi-doma", en: "/en/home-care-for-bedridden-patients" },
  { uz: "/chaqaloqni-uyda-chomiltirish", ru: "/ru/kak-kupat-novorozhdennogo-doma", en: "/en/how-to-bathe-a-newborn-at-home" },
  { uz: "/onlayn-hamshira-2-0-app-update", ru: "/ru/onlayn-hamshira-2-0-app-update", en: "/en/onlayn-hamshira-2-0-app-update" },
  { uz: "/uyga-hamshira-chilonzor", ru: "/ru/medsestra-na-dom-chilanzar", en: "/home-nurse-chilanzar" },
  // Ommaviy oferta shartnomasi
  { uz: "/hamshirapolitic", ru: "/ru/politichamshira", en: "/nurse-politic" },
];

// Juftligi yo'q maqola (faqat bir tilda) — boshqa til tanlansa o'sha tilning blogi (bosh sahifa emas)
const BLOG_GROUPS = new Set(["blogIndex", "blogPost", "article"]);

/**
 * Til almashtirgich uchun: sahifaning boshqa tillardagi rasmiy (Tilda/SEO) manzillari.
 * Masalan "/onlayn-hamshira-vs-ananaviy" → en "/online-nursing-vs-traditional". Juftligi yo'q maqola — blog,
 * qolganlari — undefined (bosh sahifa). <head>dagi hreflang'ga tegilmaydi.
 */
export const pageAlternates = (path: string, group?: string): Record<Locale, string> | undefined =>
  Object.values(PAGES).find((p) => Object.values(p).includes(path)) ??
  TRANSLATIONS.find((t) => Object.values(t).includes(path)) ??
  (group && BLOG_GROUPS.has(group) ? PAGES.blog : undefined);

/**
 * <head>dagi hreflang uchun: faqat sahifaning HAQIQIY tarjimalari (+ x-default = o'zbekchasi).
 * Tilda har sahifada bosh sahifalarni ko'rsatardi (xato, Google e'tiborsiz qoldiradi). Juftligi yo'q
 * sahifa — hreflang yo'q (blogga zaxira yoki "/ru#contact" kabi bo'lim havolalari hreflang bo'la olmaydi).
 */
export const hreflangAlternates = (path: string): Record<Locale | "x-default", string> | undefined => {
  const set = [...Object.values(PAGES), ...TRANSLATIONS].find(
    (t) => Object.values(t).includes(path) && !Object.values(t).some((p) => p.includes("#")),
  );
  return set && { ...set, "x-default": set.uz };
};

/** Build vaqtida: TRANSLATIONS dagi har bir yo'l haqiqiy sahifa bo'lishi shart (xato yozilsa build to'xtaydi) */
export const translationPaths = () => TRANSLATIONS.flatMap((t) => Object.values(t));

/** Bosh sahifa bo'limi: bosh sahifaning o'zida "#faq", boshqa sahifalarda "/ru#faq" */
export const sectionHref = (id: SectionKey, lang: Locale, onHome: boolean) =>
  onHome ? `#${id}` : `${localePath(lang)}#${id}`;

/** Ichki sahifa guruhi (lib/seo/routes.ts) → header'da qaysi punkt faol */
export const NAV_KEY_BY_GROUP: Partial<Record<string, NavKey>> = {
  blogIndex: "blog",
  blogPost: "blog",
  article: "blog",
  expert: "partner",
  certificates: "certificates",
  contacts: "contacts",
  compare: "why",
};

/**
 * Header tuzilishi: boshqa sahifaga olib boradigan havolalar ochiq turadi,
 * bosh sahifa bo'limlariga skroll qiladiganlari — "Yana" ochiladigan ro'yxatida
 */
export const NAV_PRIMARY: NavKey[] = ["blog", "partner", "why", "certificates", "contacts"];
export const NAV_MORE: NavKey[] = ["services", "about", "specialists", "reviews", "faq"];

const SECTION_KEYS: SectionKey[] = ["about", "services", "specialists", "reviews", "faq"];
export const isSection = (k: NavKey): k is SectionKey => (SECTION_KEYS as string[]).includes(k);

export const navHref = (k: NavKey, lang: Locale, onHome: boolean) =>
  isSection(k) ? sectionHref(k, lang, onHome) : pageHref(k, lang);
