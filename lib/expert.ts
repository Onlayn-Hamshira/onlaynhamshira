// "Hamkor bo'lish" sahifasi (/expert, /ru/expert, /en/expert) — mutaxassislar uchun.
// Matnlar Tilda sahifasidan (content/legacy/*expert.json) olingan. Metadata va H1 o'sha JSON'da qoladi:
// ⚠️ h1 qiymati Tilda'dagi H1 bilan aynan bir xil — o'zgartirmang (SEO).

import type { IconName } from "@/components/Icon";
import type { Locale } from "@/lib/i18n/config";
import { editableImage } from "@/lib/edit/edits";

export const EXPERT_LINKS = {
  // Asosiy yo'l: HR onboarding web-ilovasi (ariza → platforma → shartlar → saralash → o'quv → video)
  hrApp: "https://hr.onlaynhamshira.uz",
  hrApply: "https://hr.onlaynhamshira.uz/hamkor",
  hrBot: "https://t.me/Onlayn_Hamshira_HR_bot",
  // Mutaxassislar ilovasi (mijozlar ilovasi emas) — /qr2 bilan bir xil
  android: "https://play.google.com/store/apps/details?id=uz.teamwork.onlinehamshiramutaxassis",
  ios: "https://apps.apple.com/uz/app/onlayn-hamshira-mutaxassis/id6590618718",
  qrAndroid: editableImage("/legacy/61336433-qr-code-android-2-w480.webp"),
  qrIos: editableImage("/legacy/66613831-qr-code-iphone-2-w480.webp"),
  phoneShot: editableImage("/legacy/61323838-group-1-1.webp"),
};

export const STEP_ICONS: IconName[] = ["chat", "people", "phone", "wallet"];
export const BENEFIT_ICONS: IconName[] = ["calendar", "wallet", "pin", "phone"];
export const REQUIREMENT_ICONS: IconName[] = ["id", "syringe", "stethoscope", "shield"];
export const INCOME_ICONS: IconName[] = ["handshake", "check2", "download", "label"];

type Item = { title: string; text: string };

export type ExpertDict = {
  eyebrow: string;
  h1: string;
  lead: string;
  apply: string;
  applyNote: string;
  /** Ikkinchi darajali yo'l: "yoki Telegram orqali" */
  applyTg: string;
  scanQr: string;
  facts: { value: string; label: string }[];
  floatOrder: string;
  floatOrderSub: string;
  floatPaid: string;
  floatPaidSub: string;
  steps: { label: string; title: string; text: string; stepWord: string; items: Item[] };
  benefits: { label: string; title: string; text: string; items: Item[] };
  requirements: { label: string; title: string; text: string; items: Item[] };
  income: {
    label: string; title: string; text: string;
    clientPays: string; youGet: string; commission: string; items: Item[];
  };
  faq: { label: string; title: string; text: string; more: string; call: string; items: { q: string; a: string }[] };
  final: { title: string; text: string };
  /** Hero'dagi jonli telefon demosi: yuklab olish → ro'yxat → onlayn → buyurtma → yakunlash → to'lov */
  demo: ExpertDemoDict;
};

export type ExpertDemoDict = {
  currency: string;
  captions: [string, string, string, string, string, string];
  store: { dev: string; reviews: string; install: string; open: string; downloading: string };
  reg: { title: string; phone: string; getCode: string; sms: string; verify: string };
  home: { name: string; balance: string; topUp: string; status: string; goOnline: string; goOffline: string; stories: [string, string, string]; nav: [string, string, string]; earned: string };
  order: { title: string; address: string; service: string; services: string; time: string; arrive: string; payment: string; cash: string; skip: string; accept: string };
  flow: { title: string; stages: [string, string, string]; buttons: [string, string, string]; done: string; paid: string };
};

const uz: ExpertDict = {
  eyebrow: "Onlayn hamshirada ishlash",
  h1: "Qulay paytda ishlang va Onlayn Hamshira bilan daromad toping!",
  lead: "Odamlarga yordam bering, biz esa buyurtmalar va o‘z vaqtida to‘lovlar haqida qayg‘uramiz.",
  apply: "Onlayn ariza qoldirish",
  applyNote: "Istalgan bosqichda saqlab, keyin davom ettirish mumkin",
  applyTg: "yoki Telegram orqali",
  scanQr: "Ilovani o‘rnatish uchun QR kodni skanerlang",
  facts: [
    { value: "4", label: "qadamda boshlash" },
    { value: "~30%", label: "komissiya, yashirin to‘lovlarsiz" },
    { value: "0", label: "majburiy smena" },
    { value: "3+", label: "yil tajriba talab qilinadi" },
  ],
  floatOrder: "Yangi buyurtma",
  floatOrderSub: "Sizning hududingizda",
  floatPaid: "To‘lov olindi",
  floatPaidSub: "Xizmatdan so‘ng darhol",
  steps: {
    label: "Yo‘riqnoma",
    title: "Onlayn Hamshira bilan ishlashni qanday boshlash mumkin?",
    text: "Atigi 4 qadam va siz Onlayn Hamshira jamoasining bir qismisiz.",
    stepWord: "Qadam",
    items: [
      { title: "Onlayn ariza qoldiring", text: "hr.onlaynhamshira.uz saytida qisqa onboardingdan o‘ting: platforma bilan tanishuv, shartlar, saralash va o‘quv videosi." },
      { title: "Suhbatdan o‘ting", text: "Konsultant bilan qisqa suhbat va hujjatlarni tekshirish." },
      { title: "Ilovani yuklab oling va profilni to‘ldiring", text: "Mutaxassislar uchun ilovani o‘rnating va kerakli ma’lumotlarni to‘ldiring." },
      { title: "Buyurtmalar oling", text: "Sizga qulay buyurtmalarni tanlang va o‘zingizga qulay vaqtda pul ishlashni boshlang." },
    ],
  },
  benefits: {
    label: "Imtiyozlar",
    title: "Onlayn Hamshira bilan ishlash nima uchun foydali?",
    text: "Bizda sizni qanday imkoniyatlar kutmoqda?",
    items: [
      { title: "Moslashuvchan grafik", text: "Qat’iy jadvalsiz, qulay vaqtda ishlang." },
      { title: "Munosib daromad", text: "Har bir buyurtma uchun to‘lovlarni kechiktirmasdan oling." },
      { title: "Qulay joylashuv", text: "Ortiqcha sayohatlarsiz o‘z mahallangizda ishlang." },
      { title: "Hammasi bitta ilovada", text: "Buyurtmalar va jadvallarni bir joyda boshqaring." },
    ],
  },
  requirements: {
    label: "Talablar",
    title: "Mutaxassislarga qo‘yiladigan talablar",
    text: "Agar sizda tibbiy ma’lumot, ish tajribasi va odamlarga yordam berish istagi bo‘lsa - jamoaga xush kelibsiz!",
    items: [
      { title: "Kerakli hujjatlar", text: "Malakani tasdiqlash uchun diplom, sertifikatlar va shaxsiy guvohnoma." },
      { title: "Kasbiy ko‘nikmalar", text: "Kapelnitsa, ukol qilish va boshqa tibbiy muolajalarni bajara olish." },
      { title: "Ish tajribasi", text: "Xizmatlar sifatini kafolatlash uchun kamida 3 yil tibbiyot sohasida tajriba." },
      { title: "Mas’uliyat va tartiblilik", text: "Bemorlarga o‘z vaqtida va e’tiborli bo‘lish muhim." },
    ],
  },
  income: {
    label: "Daromad va to‘lovlar",
    title: "Yashirin shartlarsiz halol daromad",
    text: "Mijozdan to‘g‘ridan-to‘g‘ri to‘lov olasiz - komissiya ~30% ni tashkil etadi, yashirin to‘lovlarsiz.",
    clientPays: "Mijoz to‘laydi",
    youGet: "Sizga qoladi",
    commission: "Komissiya",
    items: [
      { title: "Mijozdan to‘g‘ridan-to‘g‘ri to‘lov", text: "Xizmat ko‘rsatishingiz bilan darhol pul olasiz." },
      { title: "Komissiya faqat ishdan keyin", text: "30% komissiya har bir buyurtmadan avtomatik yechib olinadi." },
      { title: "Balansni oson to‘ldirish", text: "Buyurtmalarni olish uchun ilovada hisobni to‘ldiring." },
      { title: "Shaffof va adolatli shartlar", text: "Xizmat ko‘rsatilgandan so‘ng - kechiktirmasdan to‘lov olasiz." },
    ],
  },
  faq: {
    label: "FAQ",
    title: "Savollaringizga javoblar",
    text: "Xizmatni yaxshiroq tushunishingiz uchun eng ko‘p so‘raladigan savollarni to‘plab chiqdik.",
    more: "Boshqa savolingiz bormi? Maslahatchilarimiz ro‘yxatdan o‘tishda yordam beradi.",
    call: "Qo‘ng‘iroq qilish",
    items: [
      { q: "Onlayn Hamshira platformasida kimlar hamshira bo‘lishi mumkin?", a: "Diplom va 3 yildan ortiq ish tajribasiga ega bo‘lgan tibbiyot mutaxassislari. Malakani tasdiqlash majburiydir." },
      { q: "Ro‘yxatdan o‘tish qanday amalga oshiriladi?", a: "Ilovani yuklab oling, telefon raqamingiz orqali ro‘yxatdan o‘ting va menejerimiz bilan qisqa suhbatdan o‘ting." },
      { q: "Daromad qanday hisoblanadi?", a: "Siz to‘lovni to‘g‘ridan-to‘g‘ri mijozdan olasiz, bir qismini esa komissiya sifatida ilovaga o‘tkazasiz - xuddi Yandex.Taksi kabi." },
      { q: "Majburiy smenalar yoki jadval bormi?", a: "Yo‘q. Siz o‘zingizga qulay vaqtda ishlaysiz va ilovada buyurtmalarni o‘zingiz tanlaysiz." },
    ],
  },
  final: {
    title: "Onlayn Hamshiraga qo‘shiling — odamlarga yordam berib daromad topishni boshlang",
    text: "O‘zingizga qulay vaqtda ishlab, chindan ham yordam kerak bo‘lgan joylarda professional ko‘mak bering. Buning uchun faqatgina smartfon va yordam berish ishtiyoqi bo‘lsa kifoya!",
  },
  demo: {
    currency: "so‘m",
    captions: ["Ilovani yuklab oling", "Ro‘yxatdan o‘ting", "Onlayn bo‘ling", "Buyurtmani qabul qiling", "Xizmatni yakunlang", "To‘lovni oling"],
    store: { dev: "ONLAYN HAMSHIRA LLC", reviews: "41 ta sharh", install: "O‘rnatish", open: "Ochish", downloading: "Yuklab olinmoqda" },
    reg: { title: "Telefon raqamingizni kiriting", phone: "Telefon raqami", getCode: "Kodni olish", sms: "SMS orqali kelgan kodni kiriting", verify: "Tasdiqlash" },
    home: { name: "Dilnoza Karimova", balance: "Balans", topUp: "Hisobni to‘ldirish", status: "Holat", goOnline: "Onlayn bo‘lish uchun suring", goOffline: "Oflayn bo‘lish uchun suring", stories: ["Xizmat standarti", "Xizmat narxlari", "Qanday ishlaydi"], nav: ["Bosh sahifa", "Buyurtmalar", "Yangiliklar"], earned: "Bugungi daromad" },
    order: { title: "Yangi buyurtma", address: "Musaffo Maskan, 2, Toshkent", service: "Kardiolog", services: "Xizmatlar", time: "Borish vaqti", arrive: "Kelish vaqti", payment: "To‘lov", cash: "Naqd pul", skip: "O‘tkazib yuborish", accept: "Qabul qilish" },
    flow: { title: "Joriy buyurtma", stages: ["Yo‘lda", "Yetib keldim", "Xizmat"], buttons: ["Yetib keldim", "Xizmatni boshlash", "Yakunlash"], done: "Buyurtma yakunlandi", paid: "To‘lov olindi" },
  },
};

const ru: ExpertDict = {
  eyebrow: "Работа в Onlayn Hamshira",
  h1: "Работайте, когда удобно, и зарабатывайте с Onlayn Hamshira!",
  lead: "Помогайте людям, а мы позаботимся о заказах и своевременных выплатах.",
  apply: "Подать заявку онлайн",
  applyNote: "Можно сохранить прогресс и продолжить позже",
  applyTg: "или через Telegram",
  scanQr: "Отсканируйте QR-код для установки приложения",
  facts: [
    { value: "4", label: "шага до первого заказа" },
    { value: "~30%", label: "комиссия, без скрытых платежей" },
    { value: "0", label: "обязательных смен" },
    { value: "3+", label: "года опыта в медицине" },
  ],
  floatOrder: "Новый заказ",
  floatOrderSub: "В вашем районе",
  floatPaid: "Оплата получена",
  floatPaidSub: "Сразу после услуги",
  steps: {
    label: "Инструкция",
    title: "Как начать работать с Onlayn Hamshira?",
    text: "Всего 4 шага, и вы – часть команды Onlayn Hamshira.",
    stepWord: "Шаг",
    items: [
      { title: "Подайте заявку онлайн", text: "Пройдите короткий онбординг на hr.onlaynhamshira.uz: знакомство с платформой, условия, отбор и обучающее видео." },
      { title: "Пройдите интервью", text: "Короткое собеседование с консультантом и проверка документов." },
      { title: "Скачайте приложение и заполните профиль", text: "Установите приложение для специалистов и укажите необходимую информацию." },
      { title: "Получайте заказы", text: "Выбирайте подходящие вызовы и начинайте зарабатывать в удобное для вас время." },
    ],
  },
  benefits: {
    label: "Преимущества",
    title: "Почему работать с Onlayn Hamshira выгодно?",
    text: "Какие возможности ждут вас у нас?",
    items: [
      { title: "Гибкий график", text: "Работайте в удобное время, без жёсткого расписания." },
      { title: "Достойный доход", text: "Получайте выплаты за каждый заказ без задержек." },
      { title: "Удобная локация", text: "Работайте в своём районе, без лишних поездок." },
      { title: "Всё в одном приложении", text: "Управляйте заказами и расписанием в одном месте." },
    ],
  },
  requirements: {
    label: "Требования",
    title: "Требования к специалистам",
    text: "Если у вас есть медицинское образование, опыт работы и желание помогать людям — добро пожаловать в команду!",
    items: [
      { title: "Необходимые документы", text: "Диплом, сертификаты и удостоверение личности для подтверждения квалификации." },
      { title: "Профессиональные навыки", text: "Умение ставить капельницы, делать уколы и другие медицинские процедуры." },
      { title: "Опыт работы", text: "Минимум 3 года в сфере медицины, чтобы гарантировать качество услуг." },
      { title: "Ответственность и аккуратность", text: "Важно быть пунктуальным и внимательным к пациентам." },
    ],
  },
  income: {
    label: "Доход и выплаты",
    title: "Честный доход без скрытых условий",
    text: "Вы получаете оплату напрямую от клиента — комиссия составляет ~30%, без скрытых платежей.",
    clientPays: "Клиент платит",
    youGet: "Остаётся вам",
    commission: "Комиссия",
    items: [
      { title: "Оплата напрямую от клиента", text: "Деньги вы получаете сразу после оказания услуги." },
      { title: "Комиссия только после работы", text: "Комиссия 30% автоматически списывается с каждого заказа." },
      { title: "Простое пополнение баланса", text: "Пополняйте счёт в приложении для доступа к заказам." },
      { title: "Прозрачные и честные условия", text: "Деньги вы получаете сразу после услуги — без задержек." },
    ],
  },
  faq: {
    label: "FAQ",
    title: "Ответы на ваши вопросы",
    text: "Мы собрали самые популярные вопросы, чтобы вам было проще разобраться в сервисе.",
    more: "Остались вопросы? Наши консультанты помогут с регистрацией.",
    call: "Позвонить",
    items: [
      { q: "Кто может стать медсестрой на платформе Onlayn Hamshira?", a: "Медицинские специалисты с дипломом и опытом работы от 3х лет. Подтверждение квалификации обязательно." },
      { q: "Как происходит регистрация?", a: "Скачайте приложение, зарегистрируйтесь с помощью номера телефона и пройдите короткое интервью с нашим менеджером." },
      { q: "Как начисляется доход?", a: "Вы получаете оплату напрямую от клиента, а часть переводите в приложение как комиссию — аналогично Яндекс.Такси." },
      { q: "Есть ли обязательные смены или график?", a: "Нет. Вы работаете в удобное для себя время и сами выбираете заказы в приложении." },
    ],
  },
  final: {
    title: "Присоединяйтесь к Onlayn Hamshira — начните зарабатывать, помогая людям",
    text: "Работайте в удобное для вас время, оказывая профессиональную помощь там, где она действительно нужна. Всё, что нужно — смартфон и желание помогать!",
  },
  demo: {
    currency: "сум",
    captions: ["Скачайте приложение", "Зарегистрируйтесь", "Выйдите на линию", "Примите заказ", "Завершите услугу", "Получите оплату"],
    store: { dev: "ONLAYN HAMSHIRA LLC", reviews: "41 отзыв", install: "Установить", open: "Открыть", downloading: "Загрузка" },
    reg: { title: "Введите номер телефона", phone: "Номер телефона", getCode: "Получить код", sms: "Введите код из SMS", verify: "Подтвердить" },
    home: { name: "Дилноза Каримова", balance: "Баланс", topUp: "Пополнить", status: "Статус", goOnline: "Проведите, чтобы выйти на линию", goOffline: "Проведите, чтобы уйти с линии", stories: ["Стандарт услуг", "Цены на услуги", "Как это работает"], nav: ["Главная", "Заказы", "Новости"], earned: "Доход за сегодня" },
    order: { title: "Новый заказ", address: "ЖК Musaffo Maskan, 2, Ташкент", service: "Кардиолог", services: "Услуги", time: "Время выезда", arrive: "Время прибытия", payment: "Оплата", cash: "Наличные", skip: "Пропустить", accept: "Принять" },
    flow: { title: "Текущий заказ", stages: ["В пути", "На месте", "Услуга"], buttons: ["Я на месте", "Начать услугу", "Завершить"], done: "Заказ завершён", paid: "Оплата получена" },
  },
};

const en: ExpertDict = {
  eyebrow: "Work at Onlayn Hamshira",
  h1: "Work when it’s convenient and earn with Onlayn Hamshira!",
  lead: "Help people, and we’ll take care of the orders and timely payments.",
  apply: "Apply online",
  applyNote: "You can save your progress and continue later",
  applyTg: "or via Telegram",
  scanQr: "Scan the QR code to install the app",
  facts: [
    { value: "4", label: "steps to get started" },
    { value: "~30%", label: "commission, no hidden fees" },
    { value: "0", label: "mandatory shifts" },
    { value: "3+", label: "years of medical experience" },
  ],
  floatOrder: "New order",
  floatOrderSub: "In your area",
  floatPaid: "Payment received",
  floatPaidSub: "Right after the visit",
  steps: {
    label: "Instructions",
    title: "How to start working with Onlayn Hamshira?",
    text: "Just 4 steps, and you’re part of the Onlayn Hamshira team.",
    stepWord: "Step",
    items: [
      { title: "Apply online", text: "Complete a short onboarding at hr.onlaynhamshira.uz: meet the platform, review the terms, pass screening and watch a training video." },
      { title: "Take the interview", text: "A short interview with a consultant and document verification." },
      { title: "Download the app and complete your profile", text: "Install the specialist app and provide the necessary information." },
      { title: "Receive orders", text: "Choose suitable orders and start earning at your convenience." },
    ],
  },
  benefits: {
    label: "Advantages",
    title: "Why is it beneficial to work with Onlayn Hamshira?",
    text: "What opportunities await you with us?",
    items: [
      { title: "Flexible schedule", text: "Work at a convenient time, without a strict schedule." },
      { title: "Decent income", text: "Receive payments for each order without delays." },
      { title: "Convenient location", text: "Work within your area, eliminating unnecessary trips." },
      { title: "All in one app", text: "Manage orders and schedule in one place." },
    ],
  },
  requirements: {
    label: "Requirements",
    title: "Requirements for specialists",
    text: "If you have a medical education, work experience, and a desire to help people — welcome to the team!",
    items: [
      { title: "Required documents", text: "Diploma, certificates, and ID card to verify qualifications." },
      { title: "Professional skills", text: "Ability to administer IV drips, give injections, and perform other medical procedures." },
      { title: "Work experience", text: "A minimum of 3 years in the medical field to guarantee service quality." },
      { title: "Responsibility and attention to detail", text: "It is important to be punctual and attentive to patients." },
    ],
  },
  income: {
    label: "Income and payments",
    title: "Honest income with no hidden conditions",
    text: "You receive payment directly from the client — the commission is ~30%, with no hidden fees.",
    clientPays: "Client pays",
    youGet: "You keep",
    commission: "Commission",
    items: [
      { title: "Payment directly from the client", text: "You receive payment immediately after providing the service." },
      { title: "Commission only after work", text: "A 30% commission is automatically deducted from each order." },
      { title: "Easy balance top-up", text: "Top up your account in the app to access your orders." },
      { title: "Transparent and fair conditions", text: "You receive payment immediately after the service — without delays." },
    ],
  },
  faq: {
    label: "FAQ",
    title: "Answers to your questions",
    text: "We’ve gathered the most popular questions to make it easier for you to understand the service.",
    more: "Still have questions? Our consultants will help you register.",
    call: "Call us",
    items: [
      { q: "Who can become a nurse on the Onlayn Hamshira platform?", a: "Medical specialists with a diploma and at least 3 years of work experience. Qualification verification is mandatory." },
      { q: "How does the registration process work?", a: "Download the app, register using your phone number, and go through a short interview with our manager." },
      { q: "How is the income calculated?", a: "You receive payment directly from the client, and a portion is transferred to the app as a commission — similar to Yandex.Taxi." },
      { q: "Are there mandatory shifts or a schedule?", a: "No. You work at a time that is convenient for you and choose orders in the app." },
    ],
  },
  final: {
    title: "Join Onlayn Hamshira — start earning by helping people",
    text: "Work at a time convenient for you, providing professional assistance where it is really needed. All you need is a smartphone and a desire to help!",
  },
  demo: {
    currency: "UZS",
    captions: ["Download the app", "Sign up", "Go online", "Accept an order", "Complete the visit", "Get paid"],
    store: { dev: "ONLAYN HAMSHIRA LLC", reviews: "41 reviews", install: "Install", open: "Open", downloading: "Downloading" },
    reg: { title: "Enter your phone number", phone: "Phone number", getCode: "Get code", sms: "Enter the SMS code", verify: "Verify" },
    home: { name: "Dilnoza Karimova", balance: "Balance", topUp: "Top up", status: "Status", goOnline: "Swipe to go online", goOffline: "Swipe to go offline", stories: ["Service standard", "Service prices", "How it works"], nav: ["Home", "Orders", "News"], earned: "Today’s earnings" },
    order: { title: "New order", address: "Musaffo Maskan, 2, Tashkent", service: "Cardiologist", services: "Services", time: "Departure", arrive: "Arrival", payment: "Payment", cash: "Cash", skip: "Skip", accept: "Accept" },
    flow: { title: "Current order", stages: ["On the way", "Arrived", "Service"], buttons: ["I’ve arrived", "Start service", "Complete"], done: "Order completed", paid: "Payment received" },
  },
};

export const EXPERT: Record<Locale, ExpertDict> = { uz, ru, en };
