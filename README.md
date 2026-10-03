# Onlayn Hamshira — landing (Next.js 16 + Tailwind CSS 4)

## Ishga tushirish
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Tuzilma
- `lib/data.ts` — barcha matnlar, xizmatlar, narxlar, mutaxassislar, FAQ, havolalar (bitta joyda tahrirlanadi)
- `components/Hero.tsx` — interaktiv "Qaysi xizmat kerak?" buyurtma kartasi (asosiy CTA)
- `components/Services.tsx` — narxli xizmatlar ro'yxati + tafsilot paneli
- `components/Interactive.tsx` — mutaxassislar filtri, fikrlar karuseli, FAQ akkordeon, mobil pastki CTA
- `components/DownloadModal.tsx` — qurilmani aniqlaydi: telefonda to'g'ridan-to'g'ri do'konga, kompyuterda QR oyna
- `components/Sections.tsx` — qadamlar, afzalliklar, ilova banneri, xavfsizlik, yangiliklar, aloqa, footer

## ⚠️ Ishga tushirishdan oldin
1. **Narxlar taxminiy** — `lib/data.ts` dagi `priceFrom` qiymatlarini app.onlaynhamshira.uz dagi haqiqiy narxlar bilan almashtiring.
2. Rasmlar hozircha tildacdn.net va prod.onlaynhamshira.uz dan yuklanadi. Tilda'dan ko'chsangiz, ularni `/public` ga yuklab, `lib/data.ts` dagi URL'larni yangilang.
3. `LINKS.download` hozir `onlaynhamshira.uz/qr` ga yo'naltiradi — to'g'ridan-to'g'ri App Store / Google Play havolalarini qo'yish tavsiya etiladi.
# onlaynhamshira-demo
# onlaynhamshira-demo
# onlaynhamshira-demo
