// Eski Tilda saytining BARCHA 95 indekslangan URL manzili — yagona ro'yxat.
// Maqsad: migratsiyada birorta ham URL yo'qolmasin. Manba: docs/seo-baseline/
// status: "live" = Next.js'da tayyor | "pending" = hali qurilmagan.
// 2-bosqich: barcha sahifalar tayyor (bosh sahifa — app/[lang]/page.tsx, qolgan 92 tasi —
// app/[lang]/[...slug] + content/legacy/*.json). Yangi sahifa qo'shilsa shu ro'yxatga ham yozing.
// Tartib — Tilda sitemap.xml'dagi tartib (app/sitemap.xml shu tartibda chiqaradi). O'zgartirmang;
// yangi sahifani ro'yxat OXIRIGA qo'shing.

export type RouteGroup =
  | "home"
  | "blogIndex"
  | "blogPost"
  | "article"
  | "compare"
  | "expert"
  | "certificates"
  | "contacts"
  | "app"
  | "legal"
  | "qr";
export type RouteStatus = "live" | "pending";
export type LegacyRoute = {
  path: string;
  lang: "uz" | "ru" | "en";
  group: RouteGroup;
  lastmod: string;
  status: RouteStatus;
};

export const LEGACY_ROUTES: LegacyRoute[] = [
  { path: "/", lang: "uz", group: "home", lastmod: "2026-09-30T20:13:56+00:00", status: "live" },
  { path: "/expert", lang: "uz", group: "expert", lastmod: "2026-08-22T19:24:24+00:00", status: "live" },
  { path: "/certificates", lang: "uz", group: "certificates", lastmod: "2026-08-22T19:24:25+00:00", status: "live" },
  { path: "/privacy-policy", lang: "uz", group: "legal", lastmod: "2026-08-22T19:24:26+00:00", status: "live" },
  { path: "/hamshirapolitic", lang: "uz", group: "legal", lastmod: "2026-08-22T19:24:27+00:00", status: "live" },
  { path: "/contacts", lang: "uz", group: "contacts", lastmod: "2026-08-31T09:13:51+00:00", status: "live" },
  { path: "/ilova", lang: "uz", group: "app", lastmod: "2026-08-22T19:24:28+00:00", status: "live" },
  { path: "/onlayn-hamshira-vs-ananaviy", lang: "uz", group: "compare", lastmod: "2026-08-22T19:24:30+00:00", status: "live" },
  { path: "/blog", lang: "uz", group: "blogIndex", lastmod: "2026-10-08T16:01:57+00:00", status: "live" },
  { path: "/blog/hamshira-uyga-chaqirish-toshkent", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:32+00:00", status: "live" },
  { path: "/uyda-qon-bosimini-olchash-va-nazorat-qilish", lang: "uz", group: "article", lastmod: "2026-08-22T19:24:33+00:00", status: "live" },
  { path: "/blog/ayollar-bolalar-massaji-toshkentda", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:34+00:00", status: "live" },
  { path: "/blog/uyda-ukol-qildirish-toshkentda", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:35+00:00", status: "live" },
  { path: "/blog/uyga-hamshira-chaqirish-tibbiy-yordam", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:36+00:00", status: "live" },
  { path: "/blog/kasallikni-oldini-olish-9-kunlik-odatlar", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:38+00:00", status: "live" },
  { path: "/uzbekistan", lang: "uz", group: "article", lastmod: "2026-08-22T19:24:39+00:00", status: "live" },
  { path: "/blog/uyda-hamshira-xizmati", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:40+00:00", status: "live" },
  { path: "/saraton-bemor-uyda-parvarish-tavsiyalar", lang: "uz", group: "article", lastmod: "2026-08-22T19:24:41+00:00", status: "live" },
  { path: "/blog/uy-sharoitida-detoks", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:42+00:00", status: "live" },
  { path: "/blog/operatsiyadan-keyingi-parvarish", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:43+00:00", status: "live" },
  { path: "/blog/chaqaloq-parvarishi-yangi-onalar-uchun", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:44+00:00", status: "live" },
  { path: "/blog/infeksiyadan-himoyalanish-uy-gigiyenasi", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:45+00:00", status: "live" },
  { path: "/blog/immunitetni-kotarish-mavsumiy-kasalliklar", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:46+00:00", status: "live" },
  { path: "/blog/qon-bosimi-yuqori-bolsa-nima-qilish-kerak", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:47+00:00", status: "live" },
  { path: "/blog/what-to-do-high-blood-pressure", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:24:50+00:00", status: "live" },
  { path: "/home-detox", lang: "uz", group: "article", lastmod: "2026-08-22T19:24:52+00:00", status: "live" },
  { path: "/home-palliative-care-symptom-management", lang: "uz", group: "article", lastmod: "2026-08-22T19:24:53+00:00", status: "live" },
  { path: "/en", lang: "en", group: "home", lastmod: "2026-09-30T20:14:38+00:00", status: "live" },
  { path: "/en/expert", lang: "en", group: "expert", lastmod: "2026-08-22T19:24:57+00:00", status: "live" },
  { path: "/en/certificates", lang: "en", group: "certificates", lastmod: "2026-08-22T19:24:58+00:00", status: "live" },
  { path: "/en/privacy-policy", lang: "en", group: "legal", lastmod: "2026-08-22T19:24:59+00:00", status: "live" },
  { path: "/en/blog", lang: "en", group: "blogIndex", lastmod: "2026-10-08T16:07:33+00:00", status: "live" },
  { path: "/en/blog/nurse-at-home-tashkent-services-prices", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:01+00:00", status: "live" },
  { path: "/en/blog/how-to-measure-and-control-blood-pressure-at-home", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:02+00:00", status: "live" },
  { path: "/en/blog/massage-in-tashkent-women-baby", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:03+00:00", status: "live" },
  { path: "/online-nursing-vs-traditional", lang: "uz", group: "compare", lastmod: "2026-08-22T19:25:04+00:00", status: "live" },
  { path: "/en/blog/injection-service-at-home-tashkent", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:05+00:00", status: "live" },
  { path: "/en/blog/home-nurse-visit-medical-care", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:06+00:00", status: "live" },
  { path: "/en/blog/daily-habits-to-prevent-illness", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:07+00:00", status: "live" },
  { path: "/postoperative-care-at-home", lang: "uz", group: "article", lastmod: "2026-08-22T19:25:08+00:00", status: "live" },
  { path: "/en/blog/boosting-immunity-preventing-illness", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:10+00:00", status: "live" },
  { path: "/en/blog/newborn-care-home-guide", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:11+00:00", status: "live" },
  { path: "/en/blog/home-infection-protection-guide", lang: "en", group: "blogPost", lastmod: "2026-08-22T19:25:12+00:00", status: "live" },
  { path: "/nurse-politic", lang: "uz", group: "legal", lastmod: "2026-08-22T19:25:13+00:00", status: "live" },
  { path: "/detoks-v-domashnih-usloviyah", lang: "uz", group: "article", lastmod: "2026-08-22T19:25:14+00:00", status: "live" },
  { path: "/podderzhka-onkologicheskih-pacientov-doma", lang: "uz", group: "article", lastmod: "2026-08-22T19:25:15+00:00", status: "live" },
  { path: "/ru", lang: "ru", group: "home", lastmod: "2026-09-30T20:15:12+00:00", status: "live" },
  { path: "/ru/expert", lang: "ru", group: "expert", lastmod: "2026-08-22T19:25:19+00:00", status: "live" },
  { path: "/ru/privacy-policy", lang: "ru", group: "legal", lastmod: "2026-08-22T19:25:20+00:00", status: "live" },
  { path: "/ru/politichamshira", lang: "ru", group: "legal", lastmod: "2026-08-22T19:25:21+00:00", status: "live" },
  { path: "/ru/certificates", lang: "ru", group: "certificates", lastmod: "2026-08-22T19:25:22+00:00", status: "live" },
  { path: "/ru/blog", lang: "ru", group: "blogIndex", lastmod: "2026-10-08T15:50:55+00:00", status: "live" },
  { path: "/ru/blog/medsestra-na-dom-tashkent", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:24+00:00", status: "live" },
  { path: "/ru/blog/kak-izmerit-i-kontrolirovat-davlenie-doma", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:25+00:00", status: "live" },
  { path: "/ru/blog/massazh-dlya-zhenshchin-i-detey-v-tashkente", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:27+00:00", status: "live" },
  { path: "/onlayn-uhod-vs-tradicionnyj", lang: "uz", group: "compare", lastmod: "2026-08-22T19:25:28+00:00", status: "live" },
  { path: "/ru/blog/ukoly-na-domu-v-tashkente", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:29+00:00", status: "live" },
  { path: "/ru/blog/vyzov-medsestry-na-dom-meditsinskaya-pomoshch", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:30+00:00", status: "live" },
  { path: "/ru/blog/profilaktika-9-ezhednevnyh-privychek", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:31+00:00", status: "live" },
  { path: "/posleoperatsionnyy-uhod-doma", lang: "uz", group: "article", lastmod: "2026-08-22T19:25:32+00:00", status: "live" },
  { path: "/ru/blog/kak-ukrepit-immunitet-profilaktika", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:33+00:00", status: "live" },
  { path: "/ru/blog/kak-zashchititsya-ot-infektsii-doma", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:34+00:00", status: "live" },
  { path: "/ru/blog/uhod-za-novorozhdyonnym", lang: "ru", group: "blogPost", lastmod: "2026-08-22T19:25:35+00:00", status: "live" },
  { path: "/qr", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:36+00:00", status: "live" },
  { path: "/qr2", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:37+00:00", status: "live" },
  { path: "/qr3", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:37+00:00", status: "live" },
  { path: "/qr4", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:38+00:00", status: "live" },
  { path: "/qr5", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:39+00:00", status: "live" },
  { path: "/qr6", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:39+00:00", status: "live" },
  { path: "/qr7", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:40+00:00", status: "live" },
  { path: "/qr8", lang: "uz", group: "qr", lastmod: "2026-08-22T19:25:41+00:00", status: "live" },
  { path: "/blog/chto-delat-esli-povysilos-davlenie", lang: "uz", group: "blogPost", lastmod: "2026-08-22T19:25:42+00:00", status: "live" },
  { path: "/kapelnitsa-nima-qachon-kerak", lang: "uz", group: "article", lastmod: "2026-08-22T19:25:43+00:00", status: "live" },
  { path: "/onlayn-hamshira-prezidentga-taqdim-etildi", lang: "uz", group: "article", lastmod: "2026-08-22T19:25:44+00:00", status: "live" },
  { path: "/home-nurse-chilanzar", lang: "uz", group: "article", lastmod: "2026-08-22T19:25:45+00:00", status: "live" },
  { path: "/ru/medsestra-na-dom-chilanzar", lang: "ru", group: "article", lastmod: "2026-08-22T19:25:46+00:00", status: "live" },
  { path: "/uyga-hamshira-chilonzor", lang: "uz", group: "article", lastmod: "2026-09-15T12:35:53+00:00", status: "live" },
  { path: "/en/onlayn-hamshira-2-0-app-update", lang: "en", group: "article", lastmod: "2026-08-22T19:25:48+00:00", status: "live" },
  { path: "/onlayn-hamshira-2-0-app-update", lang: "uz", group: "article", lastmod: "2026-09-15T13:36:12+00:00", status: "live" },
  { path: "/ru/onlayn-hamshira-2-0-app-update", lang: "ru", group: "article", lastmod: "2026-08-22T19:25:50+00:00", status: "live" },
  { path: "/chaqaloqni-uyda-chomiltirish", lang: "uz", group: "article", lastmod: "2026-09-15T13:38:06+00:00", status: "live" },
  { path: "/ru/kak-kupat-novorozhdennogo-doma", lang: "ru", group: "article", lastmod: "2026-09-24T01:22:58+00:00", status: "live" },
  { path: "/en/how-to-bathe-a-newborn-at-home", lang: "en", group: "article", lastmod: "2026-09-24T01:24:02+00:00", status: "live" },
  { path: "/yotib-qolgan-bemorlarni-uyda-parvarish-qilish", lang: "uz", group: "article", lastmod: "2026-09-24T01:21:28+00:00", status: "live" },
  { path: "/en/home-care-for-bedridden-patients", lang: "en", group: "article", lastmod: "2026-09-24T01:23:30+00:00", status: "live" },
  { path: "/ru/uhod-za-lezhachimi-bolnymi-doma", lang: "ru", group: "article", lastmod: "2026-09-24T01:22:36+00:00", status: "live" },
  { path: "/operatsiyadan-keyin-choklarni-parvarish-qilish", lang: "uz", group: "article", lastmod: "2026-10-04T12:28:11+00:00", status: "live" },
  { path: "/keksalarga-uyda-parvarish-toshkent", lang: "uz", group: "article", lastmod: "2026-10-04T12:27:38+00:00", status: "live" },
  { path: "/bolalarga-uyda-enagalik-xizmati-toshkent", lang: "uz", group: "article", lastmod: "2026-10-04T12:26:47+00:00", status: "live" },
  { path: "/uhod-za-posleoperacionnymi-shvami", lang: "uz", group: "article", lastmod: "2026-10-04T12:30:01+00:00", status: "live" },
  { path: "/uhod-za-pozhilymi-na-domu-tashkent", lang: "uz", group: "article", lastmod: "2026-10-04T12:29:35+00:00", status: "live" },
  { path: "/nyanya-na-domu-tashkent", lang: "uz", group: "article", lastmod: "2026-10-04T12:29:07+00:00", status: "live" },
  { path: "/post-surgery-wound-care-tashkent", lang: "uz", group: "article", lastmod: "2026-10-04T12:06:29+00:00", status: "live" },
  { path: "/elderly-home-care-tashkent", lang: "uz", group: "article", lastmod: "2026-10-04T12:14:53+00:00", status: "live" },
  { path: "/babysitter-at-home-tashkent", lang: "uz", group: "article", lastmod: "2026-10-04T12:19:12+00:00", status: "live" },
];

/** Hozirda Next.js'da tayyor (sitemap'ga chiqadigan) yo'llar */
export const liveRoutes = () => LEGACY_ROUTES.filter((r) => r.status === "live");
