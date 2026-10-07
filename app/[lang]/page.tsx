import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import ServiceBento from "@/components/ServiceBento";
import { AppBand, Benefits, Contact, Safety } from "@/components/Sections";
import { News } from "@/components/news/NewsSection";
import { Footer } from "@/components/Footer";
import { homeNewsEntries } from "@/lib/blog";
import HowItWorks from "@/components/how-it-works/HowItWorks";
import { Faq, Reviews, Specialists } from "@/components/Interactive";
import { MobileCTA } from "@/components/MobileCTA";
import { JoinBanner } from "@/components/JoinBanner";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);
  const { common } = t;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-white">
        {common.skipToContent}
      </a>
      <Header lang={lang} t={t.header} common={common} />
      <main id="main">
        <Hero t={t} />
        <Stats t={t.stats} sep={common.money.sep} />
        <ServiceBento t={t.bento} common={common} />
        <HowItWorks t={t.how} money={common.money} />
        <Benefits t={t.benefits} common={common} />
        <Services t={t.services} common={common} />
        <AppBand t={t.app} />
        <Safety t={t.safety} lang={lang} />
        <Specialists t={t.specialists}>
          <JoinBanner t={t.join} lang={lang} />
        </Specialists>
        <Reviews t={t.reviews} stars={common.fiveStars} />
        <News t={t.news} topics={t.blog.topics} entries={homeNewsEntries(lang)} lang={lang} />
        <Faq t={t.faq} />
        <div className="h-3" />
        <Contact t={t.contact} />
      </main>
      <Footer t={t.footer} common={common} lang={lang} />
      <MobileCTA t={t.mobileCta} cta={common.callNurse} />
    </>
  );
}
