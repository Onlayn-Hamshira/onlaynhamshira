# Admin panel o'zgarishlari

Bu fayllarni admin panel (`/admin`) yozadi — har saqlash GitHub'ga commit, Vercel esa saytni qayta yasaydi.

- `text.json` — matnlar: `manba → til → "yo'l" → qiymat` (masalan `dict.uz["faq.items.3.q"]`).
  Manbalar: `dict` (lib/i18n/dictionaries), `why` (lib/why.ts), `expert` (lib/expert.ts).
  Build vaqtida asl matn ustiga qo'yiladi (lib/edit/shared.ts → applyOverrides). Faqat serverda o'qiladi.
- `images.json` — almashtirilgan rasmlar: `asl yo'l → /uploads/...` (lib/edit/edits.ts → editableImage).

Dasturchi asl faylda (masalan uz.ts) matnni o'zgartirsa, bu yerdagi shu yo'ldagi yozuv uni bosib turadi —
kerak bo'lsa yozuvni shu yerdan o'chiring. Blog va boshqa eski sahifalar matni to'g'ridan-to'g'ri
`content/legacy/*.json` → `html` ga yoziladi.
