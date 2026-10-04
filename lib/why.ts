// "Nega biz?" sahifalari (/onlayn-hamshira-vs-ananaviy, /onlayn-uhod-vs-tradicionnyj,
// /online-nursing-vs-traditional). Matnlar Tilda sahifalaridan (content/legacy/*.json) olingan.
// ⚠️ h1 — Tilda'dagi birinchi H1 bilan aynan bir xil (SEO). Metadata va JSON-LD o'sha JSON'da qoladi.
// Bo'lim sarlavhasi (H2, advantagesTitle) Tilda'da "...an'anaviy usullardan yaxshiroq" edi — egasi qarori bilan
// betaraf qilingan ("Nega OnlaynHamshira.uz?"): sahifa offline usulni yomonlamasligi kerak.
//
// Tilda'dagi 17 qatorli "biz ✓ / offline ✗" jadvali ATAYLAB olib tashlangan: har mezonda an'anaviy usulni
// yomonlayotgandek ko'rinardi. O'rniga faqat o'z ustunliklarimiz: hero'da 4 ta qisqa (highlights), bo'limda
// 6 ta kartochka (benefits). Jadvalning "biz" tomonidagi da'volar kartochka izohlariga ko'chirilgan, ichki
// havolalar (blog maqolalari) saqlangan. Offline usul haqida salbiy gap qo'shmang.

import type { IconName } from "@/components/Icon";
import type { Locale } from "@/lib/i18n/config";

type Link = { label: string; href: string };
type Item = { title: string; text?: string; links?: Link[] };
type Highlight = { label: string; text: string };

export type WhyDict = {
  eyebrow: string;
  h1: string;
  lead: string;
  cta: string;
  toAdvantages: string;
  chipVerified: string;
  chipFast: string;
  brand: string;
  /** Hero'dagi qisqa ustunliklar paneli */
  highlightsTitle: string;
  highlights: Highlight[];
  /** Ustunliklar bo'limi: betaraf sarlavha (H2) va an'anaviy usulni yomonlamaydigan qisqa kirish */
  advantagesTitle: string;
  advantagesText: string;
  benefitsLabel: string;
  /** Kartochkalar ustidagi qo'shimcha sarlavha (faqat Tilda'da alohida matn bo'lgan tilda) */
  benefitsTitle?: string;
  benefits: Item[];
  forWhoTitle: string;
  forWho: string[];
  howTitle: string;
  steps: string[];
  stepWord: string;
  faqTitle?: string;
  faq?: { q: string; a: string; list?: string[]; after?: string }[];
  conclusionTitle: string;
  conclusion: string;
};

export const WHY_BENEFIT_ICONS: IconName[] = ["shield", "clock", "label", "download", "pin", "calendar"];
export const WHY_FORWHO_ICONS: IconName[] = ["heart", "bandage", "people", "calendar", "shield"];

const uz: WhyDict = {
  eyebrow: "Nega biz?",
  h1: "Onlayn hamshiralik vs an’anaviy hamshiralik Qaysi biri yaxshiroq O‘zbekistonda?",
  lead: "Tekshirilgan mutaxassislar, aniq narxlar va bir necha daqiqada onlayn buyurtma — hammasi bitta platformada.",
  cta: "Hamshira chaqirish",
  toAdvantages: "Ustunliklarni ko‘rish",
  chipVerified: "Tekshirilgan mutaxassislar",
  chipFast: "Bir necha daqiqada",
  brand: "OnlaynHamshira.uz",
  highlightsTitle: "Asosiy ustunliklar",
  highlights: [
    { label: "Tekshiruv", text: "Shaxs va tajriba tasdiqlangan" },
    { label: "Narxlar", text: "Ochig‘i ko‘rsatiladi" },
    { label: "Tezlik", text: "Bir necha daqiqada" },
    { label: "Kafolat", text: "Muammo bo‘lsa yordam" },
  ],
  advantagesTitle: "Nega OnlaynHamshira.uz?",
  advantagesText: "An’anaviy usulda hamshira odatda tanishlar orqali topiladi. Platforma shu jarayonni tezroq, shaffofroq va qulayroq qiladi.",
  benefitsLabel: "Afzalliklar",
  benefits: [
    {
      title: "Tekshirilgan tibbiy mutaxassislar",
      text: "Shaxsi va tajribasi tasdiqlangan mutaxassislar, profilida haqiqiy mijoz sharhlari.",
      links: [{ label: "Hamshira, shifokor, massaj, parvarish, postpartum xizmat", href: "/blog/ayollar-bolalar-massaji-toshkentda" }],
    },
    { title: "Bir necha daqiqada onlayn buyurtma", text: "Hudud, narx va xizmat turi bo‘yicha tanlaysiz — bron qilish 24/7 ochiq." },
    { title: "Aniq narxlar", text: "Narxlar ochiq ko‘rsatiladi, to‘lov xavfsiz tizim orqali." },
    { title: "Xizmatdan so‘ng elektron hisobot", text: "Tashrifdan so‘ng hisobot olasiz, buyurtmalar tarixi saqlanadi." },
    {
      title: "O‘zbekiston bo‘ylab xizmat",
      text: "Mutaxassis uyingizga keladi.",
      links: [{ label: "Uyga kelish, qulay xizmat", href: "/blog/hamshira-uyga-chaqirish-toshkent" }],
    },
    { title: "Qulay grafik va qo‘llab-quvvatlash", text: "Muammo bo‘lsa platforma yordam beradi, mutaxassisni almashtirish oson." },
  ],
  forWhoTitle: "Kimlar uchun mos",
  forWho: [
    "Uyda parvarishga muhtoj keksalar",
    "Operatsiyadan keyingi bemorlar",
    "Oilalar uchun ishonchli yordam",
    "Band insonlar uchun qulay yechim",
    "Hamshira yoki parvarish bo‘yicha xavfsiz xizmat izlaydiganlar",
  ],
  howTitle: "Qanday ishlaydi",
  steps: ["Xizmat va mutaxassisni tanlang", "Sana va vaqtni belgilang", "Mutaxassis keladi, so‘ng elektron hisobot olasiz"],
  stepWord: "Qadam",
  conclusionTitle: "Yakuniy fikr",
  conclusion:
    "OnlaynHamshira.uz O‘zbekistonda: Namangan, Nukus, Farg’ona, uyda professional parvarish topishning eng qulay, eng birinchi taqdim etilgan (2022) va ishonchli yo‘li.",
};

const ru: WhyDict = {
  eyebrow: "Почему мы?",
  h1: "Онлайн ухаживание vs традиционный уход что лучше в Узбекистане?",
  lead: "Проверенные специалисты, прозрачные цены и онлайн-заказ за несколько минут — всё на одной платформе.",
  cta: "Вызвать медсестру",
  toAdvantages: "Смотреть преимущества",
  chipVerified: "Проверенные специалисты",
  chipFast: "Заказ за минуты",
  brand: "OnlaynHamshira.uz",
  highlightsTitle: "Ключевые преимущества",
  highlights: [
    { label: "Верификация", text: "Проверенные профили и документы" },
    { label: "Цены", text: "Чёткие и прозрачные" },
    { label: "Скорость", text: "Подбор и заказ за минуты" },
    { label: "Гарантии", text: "Поддержка при проблемах" },
  ],
  advantagesTitle: "Почему выбирают OnlaynHamshira.uz",
  advantagesText: "Традиционно медсестру ищут через знакомых. Платформа делает этот процесс быстрее, прозрачнее и удобнее.",
  benefitsLabel: "Преимущества",
  benefits: [
    {
      title: "Проверенные медицинские сотрудники",
      text: "Профили и документы проверены, в профиле — настоящие отзывы клиентов.",
      links: [{ label: "Медсёстры, врачи, массаж, сиделки, послеродовые специалисты", href: "/ru/blog/massazh-dlya-zhenshchin-i-detey-v-tashkente" }],
    },
    { title: "Онлайн-бронирование за несколько минут", text: "Выбор по навыкам, цене, району и полу — бронирование доступно 24/7." },
    { title: "Прозрачные цены", text: "Цены чёткие и прозрачные, оплата — через безопасные платежи." },
    { title: "Электронные записи после визита", text: "После визита вы получаете отчёт, история заказов сохраняется." },
    {
      title: "Доступно по всему Узбекистану",
      text: "Специалист приезжает к вам домой.",
      links: [{ label: "Услуги на дому", href: "/ru/blog/medsestra-na-dom-tashkent" }],
    },
    { title: "Гибкий график и поддержка", text: "Поддержка при проблемах и лёгкий поиск замены специалиста." },
  ],
  forWhoTitle: "Для кого подходит",
  forWho: [
    "Пожилые пациенты",
    "Люди после операций",
    "Семьи, которым нужен надёжный уход",
    "Занятые люди, ценящие удобство",
    "Каждый, кто хочет безопасный и современный сервис",
  ],
  howTitle: "Как работает",
  steps: ["Выберите услугу и специалиста", "Укажите дату и время", "Специалист приезжает, вы получаете отчёт после услуги"],
  stepWord: "Шаг",
  conclusionTitle: "Заключение",
  conclusion: "OnlaynHamshira.uz современное, безопасное и удобное решение для поиска медперсонала на дому в Узбекистане.",
};

const en: WhyDict = {
  eyebrow: "Why us?",
  h1: "Online Nursing vs Traditional Nursing in Uzbekistan What’s Better?",
  lead: "Verified professionals, transparent costs and online booking in minutes — all on one platform.",
  cta: "Call a nurse",
  toAdvantages: "See the advantages",
  chipVerified: "Verified specialists",
  chipFast: "Booked in minutes",
  brand: "OnlaynHamshira.uz",
  highlightsTitle: "Key advantages",
  highlights: [
    { label: "Verification", text: "Verified specialists, profiles, IDs" },
    { label: "Pricing", text: "Clear rates" },
    { label: "Speed", text: "Match & book in minutes" },
    { label: "Platform guarantee", text: "Support if something goes wrong" },
  ],
  advantagesTitle: "Why Choose OnlaynHamshira.uz",
  advantagesText: "Traditionally, a nurse is found through people you know. The platform makes that process faster, more transparent and more convenient.",
  benefitsLabel: "Benefits",
  benefitsTitle: "What makes OnlaynHamshira.uz stand out",
  benefits: [
    {
      title: "Verified professionals",
      text: "Every nurse on OnlaynHamshira.uz is fully credentialed and profiled. You see their experience, specialties, and ratings before booking.",
      links: [{ label: "Nurses, doctors, massage, caregivers, postpartum specialists, etc.", href: "/en/blog/massage-in-tashkent-women-baby" }],
    },
    { title: "Seamless Online Booking", text: "Go online, pick your service type, nurse, date & time in minutes. This speed gives you peace of mind fast." },
    { title: "Transparent Pricing", text: "We believe you should know the price upfront. You choose the service, see cost, and confirm. No surprise bills later." },
    { title: "Digital Records & Reports", text: "After the visit, you receive a digital report. All notes are stored securely and accessible anytime." },
    {
      title: "Wide Coverage Across Uzbekistan",
      text: "In Tashkent areas OnlaynHamshira.uz can handle it.",
      links: [{ label: "Home service + comfort", href: "/en/blog/nurse-at-home-tashkent-services-prices" }],
    },
    { title: "Flexible Scheduling & Follow-up", text: "Need to shift time, extend service, or ask questions later? We’ve got your back with online support and follow-ups." },
  ],
  forWhoTitle: "Who is this great for?",
  forWho: [
    "Elderly or immobile patients needing home-nursing support",
    "Post-surgery patients requiring short-term care at home",
    "Families wanting flexible, reliable nursing support",
    "Busy professionals who want booking and tracking done online",
    "Anyone in Uzbekistan who values a modern, digital service",
  ],
  howTitle: "How it works (3 easy steps)",
  steps: ["Choose your service and nurse.", "Select date & time, fill in the details.", "Nurse arrives, you get service and the digital report afterwards."],
  stepWord: "Step",
  faqTitle: "Frequently Asked Questions",
  faq: [
    {
      q: "What services can I book on Onlaynhamshira.uz?",
      a: "You can book verified specialists for:",
      list: [
        "Home nursing", "Doctor home visits", "Post-surgery care", "Elderly and long-term care", "Postpartum and newborn care",
        "Licensed massage therapy", "Rehabilitation and physiotherapy", "Babysitters with medical knowledge",
        "Special care for patients with disabilities or chronic conditions",
      ],
      after: "Our platform connects you with reliable healthcare and personal care professionals across Uzbekistan.",
    },
    { q: "Are the specialists verified?", a: "Yes. All specialists undergo an identity and profile verification process before joining the platform. Where applicable, certification and work experience information is reviewed. Client ratings and reviews add an additional layer of transparency." },
    { q: "How fast can I find a specialist?", a: "Most users find and book a suitable specialist within minutes. You can filter by location, service type, availability, and price to speed up the process." },
    { q: "Is the service available outside Tashkent?", a: "Yes. Onlaynhamshira.uz provides coverage across Uzbekistan, including major cities and regional centers. Availability continues to expand as more specialists join the platform." },
    { q: "Do specialists provide services at home?", a: "Yes. All services are offered at your home or preferred location. Simply select your area, time, and the type of specialist needed." },
    { q: "How do payments work?", a: "Payments are processed securely through the platform. This protects both clients and specialists." },
    { q: "Can I book long-term care?", a: "Yes. Options include short-term visits, long-term care, night shifts, daily support, and extended recovery services. You can discuss schedules directly with the specialist." },
    { q: "How are prices set?", a: "Each specialist sets their own pricing. You can view and compare prices transparently before booking. There are no hidden charges imposed by the platform." },
    { q: "Can I read reviews and ratings?", a: "Yes. Every specialist profile includes reviews and ratings from previous clients. This helps you make confident, informed decisions." },
    { q: "What if a specialist does not arrive or cancels?", a: "If a specialist fails to arrive or cancels unexpectedly, you can contact support and request assistance. We will help you find a replacement as quickly as possible." },
    { q: "Can I change specialists if I am not satisfied?", a: "Yes. You are free to book another specialist at any time. Your comfort and confidence are a priority." },
    { q: "Are there extra fees for using the platform?", a: "No. You only pay for the services provided by the specialist. Onlaynhamshira.uz does not add hidden fees." },
    { q: "Can family members book on behalf of a patient?", a: "Yes. Many clients book services for relatives such as parents, children, and elderly family members." },
    { q: "Is the service safe and legitimate?", a: "Yes. Onlaynhamshira.uz is a legally operating platform that verifies specialists, secures payments, and protects user data." },
    { q: "What if I need help or have questions before booking?", a: "Our support team is available to assist you with inquiries, help you navigate the platform, and provide guidance before or after booking." },
  ],
  conclusionTitle: "Closing statement",
  conclusion:
    "Finding reliable healthcare or personal care support should be simple and secure. Onlaynhamshira.uz provides a structured, transparent, and safe way to book qualified specialists. Fast online booking, verified professionals, transparent costs, country-wide coverage, and a digital experience built for you.",
};

export const WHY: Record<Locale, WhyDict> = { uz, ru, en };
