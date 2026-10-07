import Image from "next/image";
import { ArrowUpRight, Globe } from "lucide-react";
import { IMAGES, LINKS } from "@/lib/data";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { Icon } from "./Icon";
import { Benefits } from "./Sections";
import { preload } from "react-dom";
import { LazyAppPhone, LazyHowItWorks, LazyStats } from "./AppLandingLazy";
import { AppleIcon, PlayIcon } from "./StoreIcons";
import { editableImage } from "@/lib/edit/edits";

const plain = (s: string) => s.replace(/<[^>]+>/g, "").trim();

/**
 * /ilova — ilovani yuklab olish sahifasi. Tilda'dagi matnlar (yorliq, H1, tavsif, tugma yozuvlari)
 * sahifa HTML'idan aynan olinadi; pastdagi bo'limlar bosh sahifadagi komponentlar.
 */
export function AppLanding({ html, t }: { html: string; t: Dict }) {
  const a = t.appPage;
  const h1 = plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? t.app.title);
  const ps = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => plain(m[1]));
  const [eyebrow, lead, androidLabel, iosLabel] = [ps[0] ?? t.app.label, ps[1] ?? t.app.text, ps[2] ?? a.android, ps[3] ?? a.ios];

  // Telefon posteri — sahifaning LCP rasmi
  preload(editableImage("/img/app/phone-poster-v3.webp"), { as: "image", fetchPriority: "high" });

  const stores = [
    { href: LINKS.playStore, label: androidLabel, sub: "Google Play", Glyph: PlayIcon },
    { href: LINKS.appStore, label: iosLabel, sub: "App Store", Glyph: AppleIcon },
  ];

  return (
    <>
      <section className="px-3 pt-[calc(80px+env(safe-area-inset-top))] sm:px-4">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-brand-grad-deep text-white">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-32 size-[520px] rounded-full bg-white/[0.07] blur-[120px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.14)_1.2px,transparent_1.6px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_70%_60%_at_80%_50%,#000_10%,transparent_70%)]" />
          </div>

          <div className="relative grid gap-10 px-6 pt-12 pb-10 sm:px-14 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-16">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur">
                <span className="size-1.5 rounded-full bg-white" /> {eyebrow}
              </p>
              <h1 className="mt-5 max-w-[16ch] text-[clamp(32px,8vw,60px)] leading-[1.04] font-bold tracking-[-0.03em] text-balance">{h1}</h1>
              <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-white/90">{lead}</p>

              <ul className="mt-8 grid gap-3 sm:max-w-[520px] sm:grid-cols-2">
                {stores.map(({ href, label, sub, Glyph }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener"
                      className="group flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-ink shadow-[0_14px_30px_-16px_rgb(0_0_0/0.5)] transition hover:-translate-y-0.5"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink text-white"><Glyph className="size-6" /></span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block text-xs font-medium text-ink-soft">{sub}</span>
                        <span className="block font-semibold">{label}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-ink-soft transition group-hover:rotate-45 group-hover:text-ink" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 hidden items-center gap-4 lg:flex">
                <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.45)]">
                  {[IMAGES.qrAndroid, IMAGES.qrIphone].map((q, i) => (
                    <figure key={q} className="text-center text-[11px] font-medium text-ink-soft">
                      <Image src={q} alt={`${i ? a.ios : a.android} QR`} width={88} height={88} unoptimized className="size-[88px] rounded-lg" />
                      <figcaption className="mt-0.5">{i ? a.ios : a.android}</figcaption>
                    </figure>
                  ))}
                </div>
                <p className="max-w-[18ch] text-sm leading-snug text-white/90">{a.scan}</p>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[460px] justify-center">
              <div aria-hidden className="absolute bottom-[10%] left-1/2 size-[340px] -translate-x-1/2 rounded-full bg-white/25 blur-[70px]" />
              <LazyAppPhone alt={t.app.phoneAlt} priority deferVideo className="relative w-[74%] max-w-[380px] sm:drop-shadow-[0_40px_50px_rgb(0_0_0/0.35)]" />
              <div aria-hidden className="absolute top-[30%] -left-1 hidden animate-float items-center gap-2.5 rounded-2xl bg-white py-2 pr-4 pl-2 text-ink shadow-xl sm:flex">
                <Icon name="chat" size={36} tone="tile" className="ring-0!" />
                <span className="text-sm leading-tight"><strong className="block">{t.app.aiChat}</strong><span className="text-ink-soft">{t.app.aiChatSub}</span></span>
              </div>
              <div aria-hidden className="absolute right-0 bottom-[16%] hidden animate-float-slow items-center gap-2.5 rounded-2xl bg-white py-2 pr-4 pl-2 text-ink shadow-xl sm:flex">
                <Icon name="check" size={36} tone="tile" className="ring-0!" />
                <span className="text-sm leading-tight"><strong className="block">{t.app.onTheWay}</strong><span className="text-ink-soft">{t.app.onTheWaySub}</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LazyStats t={t.stats} sep={t.common.money.sep} />
      <LazyHowItWorks t={t.how} money={t.common.money} />
      <Benefits t={t.benefits} common={t.common} />

      {/* Ilovasiz — brauzerda */}
      <section className="px-3 pt-3 sm:px-4">
        <div className="relative mx-auto flex max-w-[1400px] flex-col items-start gap-6 overflow-hidden rounded-[36px] bg-mint px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-14 sm:py-12">
          <div className="flex items-start gap-5">
            <span className="hidden size-16 shrink-0 place-items-center rounded-2xl bg-white text-brand-deep shadow-sm sm:grid"><Globe className="size-8" aria-hidden /></span>
            <div>
              <h2 className="text-[clamp(24px,5vw,34px)] leading-tight font-bold tracking-[-0.02em]">{a.webTitle}</h2>
              <p className="mt-2 max-w-[52ch] text-lg text-ink-soft">{a.webText}</p>
            </div>
          </div>
          <a href={LINKS.webApp} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-grad px-7 py-4 font-semibold text-white shadow-[0_12px_28px_-12px_rgb(46_201_176/0.9)] transition hover:-translate-y-0.5 hover:brightness-105">
            <Globe className="size-5" aria-hidden /> {t.common.onlineApp}
          </a>
        </div>
      </section>
    </>
  );
}
