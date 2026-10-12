# Admin panel o'zgarishlari

Bu fayllarni admin panel (alohida loyiha: `onlaynhamshira-admin`) GitHub orqali yozadi. "Nashr qilish" —
production branch'ga bitta commit, CI saytni qayta yasaydi.

- `text.json` — matnlar: `manba → til → "yo'l" → qiymat` (masalan `dict.uz["faq.items.3.q"]`).
  Manbalar: `dict` (lib/i18n/dictionaries), `why` (lib/why.ts), `expert` (lib/expert.ts).
  Build vaqtida asl matn ustiga qo'yiladi (lib/edit/shared.ts → applyOverrides). Faqat serverda o'qiladi.
- `images.json` — almashtirilgan rasmlar: `asl yo'l → /uploads/...` (lib/edit/edits.ts → editableImage).
- `posts.json` — admin paneldan qo'shilgan blog maqolalari (ro'yxat). Har bir maqola uch tilli (matnlar `{uz, ru, en}`,
  rasmlar umumiy) va uchala tilda chiqadi: `/blog/slug`, `/ru/blog/slug`, `/en/blog/slug` (o'zaro hreflang).
  `status: "ready"` bo'lganlari build vaqtida oddiy maqola sahifasiga aylanadi (lib/seo/posts.ts → lib/seo/legacy.ts): blog ro'yxati, o'xshash maqolalar,
  `seo.index` bo'lsa sitemap.xml (Tilda ro'yxatidan keyin), `seo.featured` bo'lsa blog boshi va bosh sahifadagi "Yangiliklar".
- `nav.json` — header menyusi tartibi: `{ primary?: [...], more?: [...] }` (ochiq punktlar va "Yana" ro'yxati;
  lib/nav.ts → NAV_PRIMARY / NAV_MORE). Punktlar to'plami asl bilan bir xil bo'lmasa — e'tiborsiz qoldiriladi.
- `styles.json` — shrift o'lchami: `sahifa yo'li → element manzili → { d: kompyuter, m: telefon }` (masshtab, 1 = asl;
  lib/edit/styles.ts → components/EditStyles.tsx).

Dasturchi asl faylda (masalan uz.ts) matnni o'zgartirsa, bu yerdagi shu yo'ldagi yozuv uni bosib turadi —
kerak bo'lsa yozuvni shu yerdan o'chiring. Blog va boshqa eski sahifalar matni to'g'ridan-to'g'ri
`content/legacy/*.json` → `html` ga yoziladi.
