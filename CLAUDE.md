@AGENTS.md

# ⚠️ SEO — BUZILMASIN (marketing uchun eng muhim qoida)

onlaynhamshira.uz Tilda'dan ko'chirilgan. Google'dagi o'rinlar, Instagram botlar, bosma QR kodlar va
reklama kampaniyalari Tilda'dagi **aynan o'sha URL va metadata**ga bog'langan. Har qanday o'zgarish
(dizayn, refaktor, yangi bo'lim, kutubxona yangilash) shu qoidalarga zid bo'lmasligi shart.

## Har o'zgarishdan keyin — majburiy tekshiruv

```bash
npm run build && npm start        # boshqa terminalda (yoki: npx next start -p 3311)
npm run seo:check                 # yoki: node scripts/seo-check.mjs http://localhost:3311
```

`✓ SEO OK: 86 URL ...` chiqmaguncha ish tugagan hisoblanmaydi, commit/push qilinmaydi.
Skript 86 URL'ning title, description, keywords, canonical, og:*, hreflang qiymatlarini, tracking
kodlarini, JSON-LD, H1, sitemap va robots'ni Tilda asli (`docs/seo-baseline/expected-head.json`)
bilan solishtiradi. Uni "o'tishi uchun" o'zgartirmang, expected-head.json'ni ham tahrirlamang.
Qiymatni o'zgartirish kerak bo'lsa (marketing qarori bilan), alohida va aniq aytilgan holda o'zgartiring.

## O'ZGARTIRILMAYDIGAN narsalar

1. **URL yo'llari** — `lib/seo/routes.ts` dagi 86 ta yo'l (bosh sahifa + 83 ichki sahifa + /ru, /en).
   Birortasini o'chirmang, nomini o'zgartirmang, slash qo'shmang/olib tashlamang.
   QR yo'llari `/qr` … `/qr8` bosma materiallarda — ayniqsa tegmang.
2. **Metadata** — sahifalarniki `content/legacy/*.json` → `meta`, bosh sahifaniki
   `lib/i18n/dictionaries/{uz,ru,en}.ts` → `meta` (Tilda qiymatlari, keywords ham Tilda kesgan holida).
   "Yaxshiroq" qilish uchun ham qo'lda o'zgartirmang.
3. **Tracking** (`lib/seo/site.ts`, `components/Analytics.tsx`) — GA4 `G-MP5XEFGJRB`,
   Google Ads `AW-17432829439` + `tel:` konversiyasi, Yandex Metrika `97597715`,
   Google Search Console tasdig'i. ID'larni o'zgartirmang, `<Analytics />`ni layout'dan olib tashlamang.
   Kutubxonalar (gtag.js, tag.js) faqat birinchi harakatda (teginish/skroll/sichqoncha/klaviatura) yuklanadi,
   hodisalar esa darhol navbatga yoziladi. Ularni yana `<head>`/afterInteractive'da to'g'ridan-to'g'ri
   yuklamang va vaqt bo'yicha zaxira (setTimeout) qo'shmang: sekin tarmoqda (PageSpeed Insights) test davomida
   yuklanib, Lighthouse Performance 40'larga, Best Practices 77 ga tushadi (third-party cookies).
   QR sahifalari darhol yuklaydi.
4. **JSON-LD** — layout'dagi MedicalBusiness (har sahifada) va `content/legacy/*.json` → `jsonLd`.
5. **sitemap.xml / robots.txt** — sitemap 86 URL'dan kam bo'lmasin; robots'da `Disallow: /` yoki
   `noindex` hech qachon bo'lmasin.
6. **Redirectlar** (`next.config.ts`) — `/uz`→`/`, ichki yo'l→tashqi yo'l, buzuq Tilda havolalari
   (`/politic` va boshq.). `trailingSlash` sozlamasini o'zgartirmang.

## Arxitektura (nima qayerda)

- Bosh sahifa: `app/[lang]/page.tsx` (uz `/` — rewrite orqali `/uz`).
- Qolgan 83 sahifa: `app/[lang]/[...slug]/page.tsx` + `content/legacy/*.json`
  (Tilda HTML'dan avtomatik olingan: `<head>` metadata, JSON-LD, tozalangan matn/rasmlar).
  Matnni tahrirlash mumkin, lekin `meta`, `jsonLd`, `path` maydonlariga tegmang.
- `lib/seo/legacy.ts` — tashqi URL ↔ ichki yo'l. Ba'zi uz-prefikssiz URL'larda ru/en kontent bor
  (masalan `/home-detox` → ichkarida `/en/home-detox`) — bu ataylab, `<html lang>` to'g'ri bo'lishi uchun.
  `routes.ts` dagi URL uchun sahifa topilmasa build ataylab to'xtaydi.
- Kontent rasmlari `public/legacy/` da (Tilda CDN'ga bog'liq emas). og:image esa Tilda'dagi URL'da qolgan.
- Asl Tilda ma'lumotlari: `docs/seo-baseline/` (README-SEO-MIGRATION.md — to'liq nazorat ro'yxati).

## Navigatsiya (header, mobil menyu, footer)

Yagona manba — `lib/nav.ts`. Havolani komponentga qo'lda yozmang (`"/blog"` kabi): har til o'z
sahifasiga olib borishi kerak (`pageHref("blog", lang)` → `/ru/blog`). Bosh sahifa bo'limlari —
`sectionHref()` (bosh sahifada `#faq`, boshqa sahifalarda `/ru#faq`).
- Header: boshqa sahifaga olib boradigan havolalar ochiq turadi (`NAV_PRIMARY`), bosh sahifa
  bo'limlariga skroll qiladiganlari "Yana" ichida (`NAV_MORE`). Bu qoidani buzmang.
- Mobil menyu: faqat `NAV_PRIMARY` (sahifa havolalari); bosh sahifa bo'limlari (`NAV_MORE`) mobilda ko'rsatilmaydi.
- Ichki sahifada qaysi punkt faol bo'lishi — `NAV_KEY_BY_GROUP` (routes.ts dagi `group` bo'yicha).

## Yangi sahifa qo'shilsa

Mavjud URL'lar o'zgarmaydi. Yangi sahifaga o'zining title, description, canonical va H1'ini bering,
uni `lib/seo/routes.ts` ga qo'shing (sitemap'ga shundan tushadi) va `seo:check`dan o'tkazing.
Menyuda ko'rinishi kerak bo'lsa: `lib/nav.ts` → `PAGES` ga uch tildagi manzilini, lug'atlarga
(`header`) nomini qo'shing va `NAV_PRIMARY` ga joylang (sahifa havolasi bo'lgani uchun).

## Tuzatilgan Tilda xatolari (marketing talabi bilan, 2026-10)

- Canonical har doim sahifaning o'z URL'i (`app/[lang]/[...slug]/page.tsx`). Avval `/home-detox`,
  `/postoperative-care-at-home`, `/posleoperatsionnyy-uhod-doma` detoks maqolasiga ko'rsatardi; ikki
  postoperatsion sahifaning title/description'i ham o'z mavzusiga tuzatildi.
- hreflang — sahifaning haqiqiy tarjimalari (`hreflangAlternates()` → `lib/nav.ts` dagi `TRANSLATIONS`/`PAGES`).
  Tilda har ichki sahifada bosh sahifalarni ko'rsatardi. Yangi tarjima juftligi `TRANSLATIONS` ga qo'shiladi.
- Doimiy redirectlar aynan `301` (`statusCode: 301`, `permanent: true` emas — u 308 beradi).
- `seo:check` canonical o'z URL'i ekanini va hreflang ikki tomonlama ekanini ham tekshiradi.

## Admin panel (`/admin`, `lib/edit/`, `components/admin/`)

Draft Mode orqali: admin uchun sahifa so'rov paytida chiziladi, boshqalar uchun statik qoladi. Har bir matn
oxiriga faqat admin rejimida ko'rinmas manzil belgisi qo'shiladi (`stegaDeep`). O'zgarishlar
`content/edits/text.json` (manba fayllar ustiga build vaqtida qo'yiladi), `content/edits/images.json`
va `content/legacy/*.json` ga GitHub commit sifatida yoziladi.
- Sahifada lug'atni `getDictionary` emas, `pageText(lang)` (`lib/edit/admin.ts`) orqali oling — aks holda admin tahrirlay olmaydi.
- Yangi almashtiriladigan rasm: `editableImage()` dan o'tkazing va prefiksini `EDITABLE_IMAGE_PREFIXES` ga qo'shing.
- Lug'atda tartib bo'yicha boshqa ma'lumotga bog'lanmagan yangi ro'yxat bo'lsa — `LISTS` ga qo'shing.
- `meta` va H1 qulfi (`LOCKED`) — SEO talabi, olib tashlamang.

## Git

- Commit xabarlari **ingliz tilida** yoziladi (sarlavha + qisqa ro'yxat).
- Commit/push qilishdan oldin `npm run seo:check` o'tgan bo'lishi shart (yuqoriga qarang).
