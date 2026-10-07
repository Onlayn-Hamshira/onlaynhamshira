import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileCTA } from "@/components/MobileCTA";
import { LegacyCta, QrRedirect } from "@/components/LegacyPage";
import { LOCALES, OG_LOCALE, hasLocale, localePath, type Locale } from "@/lib/i18n/config";
import { NAV_KEY_BY_GROUP, hreflangAlternates, pageAlternates, pageHref, translationPaths } from "@/lib/nav";
import { LEGACY_ROUTES } from "@/lib/seo/routes";
import { findLegacyPage, legacyPages, slugOf } from "@/lib/seo/legacy";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/site";
import { isArticle } from "@/lib/blog";
import { CertificatesPage } from "@/components/certificates/CertificatesPage";
import { ExpertPage } from "@/components/ExpertPage";
import { WhyPage } from "@/components/WhyPage";
import { ContactsPage } from "@/components/ContactsPage";
import { AppLanding } from "@/components/AppLanding";
import { LegalPage } from "@/components/legal/LegalPage";
import { BlogIndexPage, BlogPostPage } from "@/components/blog/BlogPages";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { expertText, whyText } from "@/lib/edit/text";

// Eski Tilda sahifalari: har biri build vaqtida statik HTML. Ro'yxatda yo'q yo'l — 404
export const dynamicParams = false;
export const generateStaticParams = () => {
  // Til almashtirgich tarjimalari (lib/nav → TRANSLATIONS) faqat mavjud Tilda URL'lariga ko'rsatsin
  const known = new Set(LEGACY_ROUTES.map((r) => r.path));
  const bad = translationPaths().filter((p) => !known.has(p));
  if (bad.length) throw new Error(`lib/nav TRANSLATIONS: unknown paths ${bad.join(", ")}`);
  return legacyPages().map((pg) => ({ lang: pg.contentLang, slug: slugOf(pg) }));
};

/** Tilda'dagi QR kodlar: Android → Google Play, iOS → App Store, qolganlar → bosh sahifa */
// Til almashtirgich: juftligi yo'q sahifada boshqa tillar — bosh sahifa, joriy til — sahifaning o'zi
const homes = Object.fromEntries(LOCALES.map((l) => [l, localePath(l)])) as Record<Locale, string>;

const QR_TARGETS: Record<string, { android: string; ios: string }> = {
  client: {
    android: "https://play.google.com/store/apps/details?id=uz.teamwork.onlinehamshiraclient&hl=ru&gl=US",
    ios: "https://apps.apple.com/uz/app/onlayn-hamshira/id6529538342",
  },
  // /qr2 — mutaxassislar (hamshiralar) ilovasi
  specialist: {
    android: "https://play.google.com/store/apps/details?id=uz.teamwork.onlinehamshiramutaxassis",
    ios: "https://apps.apple.com/uz/app/onlayn-hamshira-mutaxassis/id6590618718",
  },
};

// Tilda'dagi <meta name="robots"> qiymati ("index, follow") → Next.js formati
const parseRobots = (v: string | null): Metadata["robots"] => {
  if (!v) return undefined;
  const parts = v.split(",").map((s) => s.trim().toLowerCase());
  return { index: !parts.includes("noindex"), follow: !parts.includes("nofollow") };
};

const firstImage = (html: string) => {
  const m = html.match(/<img[^>]*\ssrc="(\/(?:legacy|uploads)\/[^"]+)"/);
  return m ? m[1] : null;
};

export async function generateMetadata({ params }: PageProps<"/[lang]/[...slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const pg = findLegacyPage(lang, slug);
  if (!pg || !hasLocale(lang)) return {};
  const { meta } = pg;
  const title = meta.title ?? meta.og.title ?? "Onlayn Hamshira";
  // ⚠️ Barcha qiymatlar Tilda <head>'idan aynan olingan (docs/seo-baseline) — o'zgartirmang.
  // Layout'dagi bosh sahifa qiymatlari meros bo'lib qolmasligi uchun yo'q maydonlar null qilinadi.
  return {
    title: { absolute: title },
    description: meta.description,
    keywords: meta.keywords,
    robots: parseRobots(meta.robots),
    // Canonical — har doim sahifaning o'z URL'i; hreflang — sahifaning haqiqiy tarjimalari (lib/nav.ts).
    // Tilda'dagi qiymatlar (boshqa maqolaga canonical, har sahifada bosh sahifa hreflang'i) xato edi.
    alternates: {
      canonical: pg.path,
      languages: hreflangAlternates(pg.path),
    },
    openGraph: {
      url: meta.og.url ?? pg.path,
      title: meta.og.title ?? title,
      description: meta.og.description ?? meta.description ?? undefined,
      type: "website",
      locale: OG_LOCALE[pg.contentLang],
      siteName: "Onlayn Hamshira",
      // Tilda'da og:image yo'q 12 sahifaga — sahifa rasmi yoki saytning standart rasmi
      images: [meta.og.image ?? firstImage(pg.html) ?? DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LegacyRoute({ params }: PageProps<"/[lang]/[...slug]">) {
  const { lang, slug } = await params;
  const pg = findLegacyPage(lang, slug);
  if (!pg || !hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const home = localePath(lang);
  // Blog va maqolalar — yangi dizayn (faqat sahifa tanasi; <head>, JSON-LD va URL o'zgarmaydi)
  const blog = pg.group === "blogIndex" ? "index" : isArticle(pg) ? "post" : null;

  // Birinchi rasm odatda LCP: <head>'da oldindan yuklash — HTML'ni oxirigacha o'qishni kutmaydi
  // Yangi dizayndagi sahifalar (blog, compare, contacts) LCP rasmini o'zi oldindan yuklaydi
  const custom = !!blog || ["compare", "contacts", "app", "legal"].includes(pg.group);
  const lcp = !custom && pg.group !== "qr" && pg.group !== "expert" && pg.html.match(/<img fetchpriority="high"[^>]*>/)?.[0];
  if (lcp) {
    const at = (n: string) => lcp.match(new RegExp(`\\s${n}="([^"]*)"`))?.[1];
    const src = at("src");
    if (src) preload(src, { as: "image", fetchPriority: "high", imageSrcSet: at("srcset"), imageSizes: at("sizes") });
  }

  const jsonLd = pg.jsonLd.length ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(pg.jsonLd.length === 1 ? pg.jsonLd[0] : pg.jsonLd).replace(/</g, "\\u003c") }}
    />
  ) : null;

  if (pg.group === "qr") {
    const target = pg.path === "/qr2" ? QR_TARGETS.specialist : QR_TARGETS.client;
    return (
      <>
        {jsonLd}
        <QrRedirect code={pg.path.slice(1)} target={target} home={home} t={t.legacy} />
      </>
    );
  }

  return (
    <>
      {jsonLd}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">
        {t.common.skipToContent}
      </a>
      <Header lang={lang} t={t.header} common={t.common} home={home} current={NAV_KEY_BY_GROUP[pg.group]} alternates={{ ...(pageAlternates(pg.path, pg.group) ?? homes), [lang]: pg.path }} />
      {pg.group === "expert" ? (
        // Hamkor sahifasi — Tilda HTML o'rniga alohida dizayn (matnlar lib/expert.ts da, metadata JSON'da)
        <main id="main">
          <ExpertPage t={expertText(pg.contentLang)} />
        </main>
      ) : pg.group === "compare" ? (
        // "Nega biz?" — taqqoslash sahifasi (matnlar lib/why.ts da, metadata/JSON-LD JSON'da)
        <main id="main">
          <WhyPage
            t={whyText(pg.contentLang)}
            callLabel={t.mobileCta.call}
            stats={t.stats.items}
            org={{
              company: t.certificates.company,
              tinLabel: t.certificates.facts.tin,
              sinceLabel: t.certificates.facts.since,
              docsLabel: t.blog.docsLink,
              docsHref: pageHref("certificates", pg.contentLang),
            }}
          />
        </main>
      ) : pg.group === "app" ? (
        <main id="main">
          <AppLanding html={pg.html} t={t} />
        </main>
      ) : pg.group === "legal" ? (
        <main id="main">
          <LegalPage pg={pg} t={t} lang={lang} />
        </main>
      ) : pg.group === "contacts" ? (
        <main id="main">
          <ContactsPage html={pg.html} t={t} lang={lang} />
        </main>
      ) : blog ? (
        // Blog muqova/LCP rasmini o'zi oldindan yuklaydi (components/blog/BlogPages.tsx)
        <main id="main" className="pt-[calc(80px+env(safe-area-inset-top))]">
          {blog === "index" ? <BlogIndexPage pg={pg} t={t} lang={lang} /> : <BlogPostPage pg={pg} t={t} lang={lang} />}
        </main>
      ) : pg.group === "certificates" ? (
        // Sertifikatlar — boshqa yangi sahifalar bilan bir xil konteyner (hero 1400px, kontent 1320px)
        <main id="main">
          <CertificatesPage html={pg.html} t={t.certificates} home={home} homeLabel={t.legacy.home} closeLabel={t.common.close} />
          <div className="px-4 sm:px-6">
            <LegacyCta t={t.legacy} cta={t.common.callNurse} />
          </div>
        </main>
      ) : (
        <main id="main" className="px-4 pt-[calc(72px+env(safe-area-inset-top))] sm:px-6">
          <article className="legacy-prose mx-auto max-w-[860px] py-10 sm:py-14" dangerouslySetInnerHTML={{ __html: pg.html }} />
          <LegacyCta t={t.legacy} cta={t.common.callNurse} />
        </main>
      )}
      <div className="h-10" />
      <Footer t={t.footer} common={t.common} lang={lang} home={home} />
      {pg.group !== "expert" && <MobileCTA t={t.mobileCta} cta={t.common.callNurse} />}
    </>
  );
}
