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

## Admin panel (matn va rasmlarni tahrirlash)

`/admin` → login/parol → sayt o'zi tahrirlash rejimida ochiladi: har bir matn va rasm yonida **⋯** tugmasi
(Tahrirlash / Qo'shish / O'chirish). Matn modalda uch tilda birga chiqadi. "O'zgarishni tasdiqlash" →
GitHub'ga commit → Vercel saytni avtomatik qayta yasaydi (1–3 daqiqa, holati pastki panelda ko'rinadi).
Oddiy tashrifchilar avvalgidek statik sahifa oladi — tezlik va SEO o'zgarmaydi.

Vercel → Settings → Environment Variables:

| O'zgaruvchi | Qiymat |
|---|---|
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Admin login va paroli |
| `ADMIN_SECRET` | Sessiya imzosi uchun uzun tasodifiy satr (`openssl rand -hex 32`) |
| `GITHUB_TOKEN` | Fine-grained token, faqat shu repo: **Contents: Read and write**, **Deployments: Read**, **Commit statuses: Read** |
| `GITHUB_REPO`, `GITHUB_BRANCH` | Ixtiyoriy (standart: `AsilbekXoliyorov441/onlaynhamshira-demo`, `main`) |

Lokal sinov: `npm run dev` → `/admin` (login `admin`, parol `admin12345`); token bo'lmasa o'zgarishlar diskka yoziladi.

Qayerga yoziladi: lug'atlar / "Nega biz?" / hamkorlik sahifasi matnlari — `content/edits/text.json`,
almashtirilgan rasmlar — `content/edits/images.json` + `public/uploads/`, blog va eski sahifalar — `content/legacy/*.json`.
SEO uchun title/description/H1 qulflangan; tartib bo'yicha rasm/narx bilan bog'langan ro'yxatlarga element
qo'shib/o'chirib bo'lmaydi (`lib/edit/shared.ts` → `LOCKED`, `LISTS`).

## ⚠️ Ishga tushirishdan oldin
1. **Narxlar taxminiy** — `lib/data.ts` dagi `priceFrom` qiymatlarini app.onlaynhamshira.uz dagi haqiqiy narxlar bilan almashtiring.
2. Rasmlar hozircha tildacdn.net va prod.onlaynhamshira.uz dan yuklanadi. Tilda'dan ko'chsangiz, ularni `/public` ga yuklab, `lib/data.ts` dagi URL'larni yangilang.
3. `LINKS.download` hozir `onlaynhamshira.uz/qr` ga yo'naltiradi — to'g'ridan-to'g'ri App Store / Google Play havolalarini qo'yish tavsiya etiladi.
# onlaynhamshira-demo
# onlaynhamshira-demo
# onlaynhamshira-demo
