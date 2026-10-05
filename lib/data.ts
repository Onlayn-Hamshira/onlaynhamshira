// Tilga bog'liq bo'lmagan tuzilma: havolalar, rasmlar, narxlar, ikonkalar.
// Matnlar lib/i18n/dictionaries/* da (ro'yxatlar tartibi shu fayldagi bilan bir xil).
// ⚠️ NARXLAR TAXMINIY: ishga tushirishdan oldin app.onlaynhamshira.uz dagi haqiqiy narxlar bilan almashtiring.

export const LINKS = {
  webApp: "https://app.onlaynhamshira.uz/",
  download: "https://onlaynhamshira.uz/qr",
  playStore: "https://play.google.com/store/apps/details?id=uz.teamwork.onlinehamshiraclient",
  appStore: "https://apps.apple.com/uz/app/onlayn-hamshira/id6529538342",
  phone: "+998781139616",
  phoneLabel: "+998 78 113 96 16",
  telegram: "https://t.me/Onlayn_Hamshira_Admin",
  instagram: "https://www.instagram.com/onlayn_hamshira/",
  youtube: "https://www.youtube.com/@OnlaynHamshira",
  email: "info@onlaynhamshira.uz",
  // blog/expert/certificates/privacy — tilga bog'liq, lib/nav.ts dagi PAGES dan oling
};

export const IMAGES = {
  qrIphone: "/img/misc/qr-iphone.png",
  qrAndroid: "/img/misc/qr-android.png",
};

// Sahifa/bo'lim havolalari (har til uchun) — lib/nav.ts da

export type ServiceIcon =
  | "syringe" | "droplet" | "bandage" | "gauge" | "bed" | "stethoscope" | "flask" | "hand";

export type ServiceId = "ukol" | "kapelnitsa" | "yara" | "bosim" | "parvarish" | "korik" | "tahlil" | "massaj";

export type Service = { id: ServiceId; priceFrom: number; icon: ServiceIcon };

// Narxlar so'mda, TAXMINIY
export const SERVICES: Service[] = [
  { id: "ukol", priceFrom: 50000, icon: "syringe" },
  { id: "kapelnitsa", priceFrom: 150000, icon: "droplet" },
  { id: "yara", priceFrom: 80000, icon: "bandage" },
  { id: "bosim", priceFrom: 40000, icon: "gauge" },
  { id: "parvarish", priceFrom: 200000, icon: "bed" },
  { id: "korik", priceFrom: 150000, icon: "stethoscope" },
  { id: "tahlil", priceFrom: 70000, icon: "flask" },
  { id: "massaj", priceFrom: 120000, icon: "hand" },
];

// app.onlaynhamshira.uz dagi mutaxassisliklar (rasmlar ilovadan)
const spec = (id: string) => `/img/specialists/${id}.webp`;

export type SpecialistGroup = "nurses" | "kids" | "doctors";

export const SPECIALISTS: { img: string; group: SpecialistGroup }[] = [
  { img: spec("78b8f24c-c269-44cb-96a9-62da661bea34"), group: "nurses" },
  { img: spec("6cc3c26f-e05e-4802-a48f-96c9d62a3ecd"), group: "nurses" },
  { img: spec("6779f6a5-475e-4946-8890-e2cce0f91693"), group: "kids" },
  { img: spec("a4390bad-4536-4189-ad63-7d43f42e2883"), group: "kids" },
  { img: spec("95dd3123-2f6a-4e5f-aeb0-079e6ec6b892"), group: "kids" },
  { img: spec("b4c50205-d842-4c9d-b8e5-02186e548a04"), group: "kids" },
  { img: spec("2f1bdf41-f53c-47b8-8f6d-c93b427e27b5"), group: "doctors" },
  { img: spec("b113e253-1138-4194-981a-a96581bb245b"), group: "doctors" },
  { img: spec("c743f7af-85bf-4d28-a0b1-dc36ba0706ca"), group: "doctors" },
  { img: spec("b3aca9f1-60a8-4c98-a05b-0a661ec1573c"), group: "doctors" },
  { img: spec("47ab6828-b5ed-4de6-ae96-67f07041c64e"), group: "doctors" },
  { img: spec("b241b18d-a54d-4dd5-9d95-e51a38444125"), group: "doctors" },
  { img: spec("43ee2429-8e6b-4f99-b722-75aa21c25b93"), group: "doctors" },
  { img: spec("349ede49-2f31-4af9-8a42-369bdbaf6029"), group: "doctors" },
];

export const BENEFIT_ICONS = ["clock", "shield", "wallet", "label", "phone", "calendar"] as const;

export const STATS = [
  { value: 270, suffix: "+" },
  { value: 11400, suffix: "+" },
  { value: 13500, suffix: "+" },
  { value: 6, suffix: "+" },
];

// Rasmlar o'z serverimizda (public/img) — tashqi CDN'ga bog'liqlik va sovuq so'rov kechikishi yo'q
const img = (path: string) => `/img/${path}`;

export const REVIEW_IMAGES = ["01", "03", "04", "02", "06", "10", "08"].map((n) => img(`avatars/${n}.webp`));

/**
 * Sertifikatlar sahifasi (/certificates). Tartib content/legacy/*certificates.json dagi rasmlar va
 * lug'atlardagi `certificates.items` bilan bir xil. verify — hujjatdagi QR kodning o'zi olib boradigan
 * rasmiy manzil (QR'dan o'qilgan, o'zgartirmang).
 */
export const CERTIFICATES = [
  { number: "1072160", date: "13.12.2021", verify: "https://new.birdarcha.uz/document/b85f81d9-790c-45f3-8388-d16e1fd49d4b" },
  { number: "AA 0001113", date: "02.05.2024", verify: "https://pd.gov.uz/appeals/check?tin=309109813" },
  { number: "3755", date: "31.01.2025", verify: "https://my.it-park.uz/api/download-certificate-by-qrcode/O0fYYhbWsmZG" },
] as const;

/** Soliq to'lovchining identifikatsiya raqami (STIR) — guvohnomalardagi bilan bir xil */
export const COMPANY_TIN = "309 109 813";
