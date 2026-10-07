import Image from "next/image";
import { ArrowRight, BadgeCheck, Clock, ScanLine, Wallet } from "lucide-react";
import { IMAGES, LINKS, REVIEW_IMAGES, SERVICES, type ServiceId } from "@/lib/data";
import { fill } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { StoreButtons } from "./DownloadModal";
import { HeroBooking } from "./HeroBooking";
import { AppleIcon, PlayIcon } from "./StoreIcons";

const PERK_ICONS = [BadgeCheck, Clock, Wallet];
// Buyurtma kartasidagi tezkor tanlov — client komponentga faqat shu 5 tasining qisqa matni boradi
const QUICK: ServiceId[] = ["ukol", "kapelnitsa", "yara", "bosim", "massaj"];
const QR = [
  { src: IMAGES.qrIphone, label: "iPhone", Icon: AppleIcon, href: LINKS.appStore },
  { src: IMAGES.qrAndroid, label: "Android", Icon: PlayIcon, href: LINKS.playStore },
];

export default function Hero({ t }: { t: Dict }) {
  const h = t.hero;
  return (
    <section id="top" className="relative px-3 pt-[88px] sm:px-4">
      <div className="relative mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-[1.05fr_1fr]">
        {/* Chap: sarlavha */}
        <div className="hero-in relative flex flex-col overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#fff_0%,var(--color-mist)_45%,#cdebfa_100%)] px-6 pt-9 pb-7 sm:px-12 sm:pt-10 sm:pb-8">
          {/* Brend qo'llanmadagi grafik element (Graphic element | Pack 2): qiya moviy-yashil tasma */}
          <div aria-hidden className="hero-angle pointer-events-none absolute inset-0" />

          <div className="relative flex flex-1 flex-col">
            <a
              href={LINKS.webApp}
              className="group inline-flex w-fit items-center gap-2.5 rounded-full bg-white/80 py-1.5 pr-2 pl-3 text-sm font-medium shadow-[0_6px_20px_-12px_rgb(13_47_68/0.5)] ring-1 ring-white backdrop-blur transition hover:bg-white"
            >
              <span className="relative grid size-2.5 place-items-center">
                <span className="absolute size-2.5 animate-pulse-ring rounded-full bg-brand" />
                <span className="size-2.5 rounded-full bg-brand-deep" />
              </span>
              {t.common.callNurseOnline}
              <span className="grid size-6 place-items-center rounded-full bg-brand-grad text-white transition group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" />
              </span>
            </a>

            <h1 className="mt-6 max-w-[13ch] text-[clamp(32px,11vw,40px)] leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-[54px] xl:text-[62px]">
              {h.titleBefore}<span className="text-brand-grad">{h.titleAccent}</span>{h.titleAfter}
            </h1>
            <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink-soft sm:text-[18px]">
              {h.lead}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2">
              {h.perks.map((text, i) => {
                const Glyph = PERK_ICONS[i];
                return (
                <li key={text} className="inline-flex items-center gap-2 rounded-full bg-white/70 py-2 pr-3.5 pl-2.5 text-sm font-medium ring-1 ring-white backdrop-blur">
                  <Glyph className="size-4 text-brand-deep" aria-hidden /> {text}
                </li>
                );
              })}
            </ul>

            <StoreButtons className="mt-6 sm:mb-6" />

            {/* Ilova QR kodlari — faqat kompyuter/planshetda (telefonda do'kon tugmalari yetarli) */}
            <div className="mt-auto hidden items-center gap-5 border-t border-ink/10 pt-5 sm:flex">
              <div className="flex shrink-0 gap-3">
                {QR.map(({ src, label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener"
                    className="rounded-[18px] bg-white p-2 shadow-[0_6px_20px_-12px_rgb(13_47_68/0.5)] ring-1 ring-white transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {/* 1-bitli PNG (~5KB) — qayta kodlash faqat buzadi */}
                    <Image src={src} alt={fill(t.download.qrFor, { p: label })} width={104} height={104} unoptimized className="size-[88px]" />
                    <span className="mt-1.5 flex items-center justify-center gap-1.5 text-[13px] font-medium">
                      <Icon className="size-3.5" /> {label}
                    </span>
                  </a>
                ))}
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[17px] leading-snug font-semibold tracking-tight">
                  <ScanLine className="size-5 shrink-0 text-brand-deep" aria-hidden /> {h.qrTitle}
                </p>
                <p className="mt-1.5 max-w-[34ch] text-sm leading-relaxed text-ink-soft">{h.qrText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* O'ng: buyurtma kartasi */}
        <div style={{ "--d": 1 } as React.CSSProperties} className="hero-in relative flex flex-col gap-3 overflow-hidden rounded-[32px] bg-mist p-3">
          {/* Tepada: ishonch ko'rsatkichlari */}
          <div className="relative flex flex-wrap items-stretch gap-3">
            <div className="flex min-w-[260px] flex-1 items-center gap-3.5 rounded-[20px] bg-white/90 py-3.5 pr-5 pl-3.5 shadow-lg backdrop-blur">
              <div className="flex shrink-0 -space-x-3">
                {REVIEW_IMAGES.slice(0, 3).map((src) => (
                  <Image key={src} src={src} alt="" width={44} height={44} className="size-11 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <p className="min-w-0 text-[15px] leading-tight">
                <strong className="block text-lg font-bold tracking-tight sm:text-xl">{h.clients}</strong>
                <span className="text-ink-soft">{h.clientsSub}</span>
              </p>
            </div>
            <div className="flex min-w-[260px] flex-1 items-center gap-3.5 rounded-[20px] bg-white/90 py-3.5 pr-5 pl-3.5 shadow-lg backdrop-blur">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-grad text-white"><Clock className="size-[22px]" aria-hidden /></span>
              <p className="text-[15px] leading-tight">
                <strong className="block text-xl font-bold tracking-tight">{h.allDay}</strong>
                <span className="text-ink-soft">{h.allDaySub}</span>
              </p>
            </div>
          </div>

          <HeroBooking
            t={t.booking}
            common={t.common}
            items={SERVICES.filter((s) => QUICK.includes(s.id)).map((s) => ({ ...s, short: t.services.items[s.id].short, duration: t.services.items[s.id].duration }))}
          />
        </div>
      </div>
    </section>
  );
}
