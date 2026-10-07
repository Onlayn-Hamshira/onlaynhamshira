import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Onest } from "next/font/google";
import "../globals.css";
import { DownloadProvider } from "@/components/DownloadModal";
import { BackToTop, SmoothScroll } from "@/components/Motion";
import { LOCALES, OG_LOCALE, hasLocale, localePath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Analytics } from "@/components/Analytics";
import { SITE_URL, DEFAULT_OG_IMAGE, GOOGLE_SITE_VERIFICATION } from "@/lib/seo/site";
import { freshImageEdits, pageText } from "@/lib/edit/admin";
import { storeMode } from "@/lib/edit/store";
import { AdminLoader } from "@/components/admin/AdminLoader";

const onest = Onest({
  // Faqat lotin oldindan yuklanadi; kirill (ru) unicode-range orqali faqat kerak bo'lganda yuklanadi
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

// Har bir til build vaqtida statik HTML sifatida tayyorlanadi; boshqa segmentlar — 404
export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    verification: { google: GOOGLE_SITE_VERIFICATION },
    alternates: {
      canonical: localePath(lang),
      languages: { ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l)])), "x-default": "/" },
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: localePath(lang),
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    formatDetection: { telephone: false },
    // Favicon — onlaynhamshira.uz (Tilda) dagi bilan aynan bir xil fayllar: yorug' mavzuda to'q, qorong'ida och belgi;
    // telefon/bosh ekran uchun Mobile.png. Fayllar o'zimizda (public/favicon) — Tilda CDN'ga bog'liq emas.
    icons: {
      icon: [
        { url: "/favicon/icon-light-scheme.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
        { url: "/favicon/icon-dark-scheme.png", type: "image/png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
        { url: "/favicon/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
      ],
      apple: { url: "/favicon/apple-touch-icon.png", type: "image/png" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#2EC9B0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Har sahifada (Tilda'dagi kabi). Tilda'dagi barcha maydonlar (description, sameAs) saqlangan + manzil/ish vaqti
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Onlayn Hamshira",
  url: "https://onlaynhamshira.uz/",
  description: "24/7 tibbiy yordam, shifokor va hamshira xizmatlari uyda.",
  telephone: "+998781139616",
  email: "info@onlaynhamshira.uz",
  openingHours: "Mo-Su 00:00-24:00",
  availableLanguage: ["uz", "ru", "en"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shahrisabz ko‘chasi 25, U-Enter",
    addressLocality: "Toshkent",
    addressCountry: "UZ",
  },
  areaServed: ["Toshkent", "Samarqand", "Farg‘ona", "Namangan", "Nukus", "Marg‘ilon"],
  sameAs: [
    "https://www.youtube.com/@OnlaynHamshira",
    "https://t.me/Onlayn_Hamshira_Admin",
    "https://www.instagram.com/onlayn_hamshira/",
  ],
};

// html.js — reveal animatsiyalari uchun. html.cv-off — anchorga o'tishda content-visibility o'chadi
// (globals.css), aks holda chizilmagan bo'limlar sabab skroll noto'g'ri joyga tushadi
const CV_SCRIPT = `(function(h){h.classList.add('js');if(location.hash)h.classList.add('cv-off');
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="#"]');if(a&&a.hash)h.classList.add('cv-off')},true)})(document.documentElement)`;

// Admin tahrirlash manzillari (/admin/..., proxy.ts) Draft Mode'ga tayanadi, u esa har yangi deploy'dan keyin
// eskiradi. Shunda /admin/... sahifasi statik chiqadi — skript adminni bir marta /api/admin/enter orqali qayta ulaydi.
// Oddiy manzillarda hech narsa qilmaydi.
const ADMIN_RECONNECT = `;(function(){try{var p=location.pathname;if(!/^\\/admin(\\/|$)/.test(p))return;var k='ohAdminTry',n=+sessionStorage.getItem(k)||0;
if(Date.now()-n<15000)return;sessionStorage.setItem(k,Date.now());location.replace('/api/admin/enter?next='+encodeURIComponent(p+location.search+location.hash))}catch(e){}})()`;

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  // Admin rejimida matnlar repodagi eng so'nggi holatdan + tahrirlash belgilari bilan (lib/edit/admin.ts)
  const { t, admin } = await pageText(lang);
  return (
    <html lang={lang} className={onest.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: CV_SCRIPT + (admin ? ";window.__ohAdmin=1" : ADMIN_RECONNECT) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <DownloadProvider t={{ ...t.download, close: t.common.close, onlineApp: t.common.onlineApp }}>{children}</DownloadProvider>
        <SmoothScroll />
        <BackToTop label={t.common.backToTop} />
        <Analytics />
        {admin && <AdminLoader user={admin} lang={lang} mode={storeMode()} images={await freshImageEdits().catch(() => ({}))} />}
      </body>
    </html>
  );
}
