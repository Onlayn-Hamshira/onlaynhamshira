import {
  ArrowDown, ArrowRight, BadgeCheck, CalendarClock, Check, ChevronDown, CreditCard, HeartHandshake, History, House, MessageCircle,
  Phone, PhoneCall, Plus, RefreshCw, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, Stethoscope, Tag,
  UserCheck, X, Zap, type LucideIcon,
} from "lucide-react";
import { CERTIFICATES, COMPANY_TIN, LINKS, STATS } from "@/lib/data";
import { fill } from "@/lib/i18n/format";
import { WHY_BENEFIT_ICONS, WHY_FORWHO_ICONS, type WhyDict } from "@/lib/why";
import { IconTile } from "./Icon";

// Faoliyat boshlangan yil — birinchi davlat guvohnomasidan (sertifikatlar sahifasidagi bilan bir xil)
const SINCE_YEAR = CERTIFICATES[0].date.slice(-4);

// Taqqoslash qatorlari uch tilda bir xil tartibda (lib/why.ts) — har biriga ikonka
const ROW_ICONS: LucideIcon[] = [
  Search, BadgeCheck, Star, ShieldCheck, CalendarClock, Zap, SlidersHorizontal, MessageCircle, Stethoscope,
  Tag, CreditCard, HeartHandshake, RefreshCw, House, UserCheck, History, Sparkles,
];
// Hero'dagi qisqa taqqoslash: Tekshiruv, Narxlar, Tezlik, Kafolat
const KEY_ROWS = [1, 9, 5, 11];

/** 13500 → "13 500" (bosh sahifadagi hisoblagich bilan bir xil ko'rinish) */
const num = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const Yes = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`grid size-5 shrink-0 place-items-center rounded-full bg-brand-deep text-white ${className}`}>
    <Check className="size-3.5" strokeWidth={3} />
  </span>
);
const No = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`grid size-5 shrink-0 place-items-center rounded-full bg-[#ffe7e7] text-alert ${className}`}>
    <X className="size-3.5" strokeWidth={3} />
  </span>
);
const Pin = ({ className = "" }: { className?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element -- kichik SVG logo
  <img src="/img/map-pin.svg" alt="" width={34} height={42} className={`w-auto ${className}`} />
);

function Eyebrow({ children, tone = "mint" }: { children: React.ReactNode; tone?: "mint" | "white" }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold text-brand-deep ${tone === "white" ? "bg-white ring-1 ring-line" : "bg-mint"}`}>
      <span className="size-1.5 rounded-full bg-brand-deep" /> {children}
    </p>
  );
}

const MOBILE_VISIBLE = 6;

function MobileRow({ r, i, cols }: { r: WhyDict["rows"][number]; i: number; cols: WhyDict["cols"] }) {
  const Ico = ROW_ICONS[i % ROW_ICONS.length];
  return (
    <li className="overflow-hidden rounded-[22px] bg-white ring-1 ring-line">
      <p className="flex items-center gap-3 px-4 pt-4 font-semibold">
        <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-mist text-brand-deep"><Ico className="size-4.5" /></span>
        {r.feature}
      </p>
      <p className="mx-3 mt-3 flex items-start gap-2.5 rounded-2xl bg-[#effbf2] p-3 text-[15px]">
        <Yes className="mt-0.5" />
        <span>
          <span className="sr-only">{cols.us}: </span>
          {r.href ? <a href={r.href} className="font-medium underline decoration-brand-deep/30 decoration-2 underline-offset-3">{r.us}</a> : <span className="font-medium">{r.us}</span>}
        </span>
      </p>
      <p className="flex items-start gap-2.5 px-6 pt-2.5 pb-4 text-[15px] text-ink-soft">
        <No className="mt-0.5" />
        <span><span className="sr-only">{cols.old}: </span>{r.old}</span>
      </p>
    </li>
  );
}

export type WhyOrg = { company: string; tinLabel: string; sinceLabel: string; docsLabel: string; docsHref: string };

export function WhyPage({ t, callLabel, stats, org }: { t: WhyDict; callLabel: string; stats: string[]; org: WhyOrg }) {
  // Raqamlar: bosh sahifadagi bilan bir xil manba (lib/data.ts → STATS, lug'at → stats.items)
  const numbers = [0, 1, 2].map((i) => ({ v: `${num(STATS[i].value)}${STATS[i].suffix}`, l: stats[i] }));

  return (
    <>
      {/* ───── Hero: jiddiy, tuzilmali — chapda da'vo, o'ngda dalil (taqqoslash + rasmiy ma'lumotlar) ───── */}
      <section className="px-3 pt-[calc(80px+env(safe-area-inset-top))] sm:px-4">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#fff_0%,var(--color-mist)_40%,#cdebfa_100%)] ring-1 ring-line">
          {/* Brend foni: egri grafik element (Graphic element | Pack 2) + suzuvchi nur dog'lari */}
          <div aria-hidden className="hero-wave pointer-events-none absolute inset-0" />
          <div aria-hidden className="glow-blob pointer-events-none absolute -top-28 left-[6%] size-[400px] bg-grad-blue/25" />
          <div aria-hidden className="glow-blob glow-blob-alt pointer-events-none absolute right-[8%] -bottom-36 size-[440px] bg-grad-green/25" />

          <div className="relative grid items-center gap-10 px-6 pt-12 pb-10 sm:px-12 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-14">
            <div>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="mt-5 text-[clamp(30px,7vw,54px)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">{t.h1}</h1>
              <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-ink-soft">{t.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={LINKS.webApp} className="group inline-flex items-center gap-2 rounded-full bg-brand-grad px-7 py-4 font-semibold text-white shadow-[0_12px_28px_-12px_rgb(46_201_176/0.9)] transition hover:-translate-y-0.5 hover:brightness-105">
                  {t.cta} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
                <a href="#compare" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold ring-1 ring-line transition hover:ring-ink/25">
                  {t.toCompare} <ArrowDown className="size-4" aria-hidden />
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px] font-medium">
                {[
                  { I: ShieldCheck, l: org.company },
                  { I: BadgeCheck, l: t.chipVerified },
                  { I: Zap, l: t.chipFast },
                ].map(({ I, l }) => (
                  <li key={l} className="flex items-center gap-2"><I className="size-5 text-brand-deep" aria-hidden /> {l}</li>
                ))}
              </ul>
            </div>

            {/* Dalil paneli: asosiy farqlar + kompaniya rekvizitlari */}
            <div className="rounded-[30px] bg-brand-grad p-[2px] shadow-[0_40px_80px_-40px_rgb(13_47_68/0.55)]">
            <div className="h-full rounded-[28px] bg-white p-5 sm:p-7">
              <p className="text-[13px] font-semibold tracking-wide text-ink-soft uppercase">{t.keyDiff}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[13px] font-semibold">
                <span className="flex items-center gap-2 rounded-xl bg-mint px-3 py-2.5 ring-1 ring-brand/30">
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-white"><Pin className="h-4" /></span>
                  <span className="truncate">{t.cols.us}</span>
                </span>
                <span className="flex items-center gap-2 rounded-xl bg-mist px-3 py-2.5 text-ink-soft ring-1 ring-line">
                  <PhoneCall className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{t.cols.old}</span>
                </span>
              </div>
              <ul className="mt-2 divide-y divide-line">
                {KEY_ROWS.map((i) => {
                  const r = t.rows[i];
                  const Ico = ROW_ICONS[i];
                  return (
                    <li key={r.feature} className="py-3.5">
                      <p className="flex items-center gap-2 text-[12px] font-semibold tracking-wide text-ink-soft uppercase">
                        <Ico className="size-3.5" aria-hidden /> {r.feature}
                      </p>
                      <div className="mt-1.5 grid grid-cols-2 gap-2 text-[14px] leading-snug">
                        <p className="flex items-start gap-2 font-semibold"><Yes className="mt-px size-4.5! bg-brand-grad!" /> {r.us}</p>
                        <p className="flex items-start gap-2 text-ink-soft"><No className="mt-px size-4.5!" /> {r.old}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <a href={org.docsHref} className="group mt-3 flex items-center gap-3 rounded-2xl bg-mist p-3 pr-4 text-ink ring-1 ring-line transition hover:-translate-y-0.5">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-grad text-white"><ShieldCheck className="size-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{org.company}</span>
                  <span className="block text-[12px] text-ink-soft">{org.tinLabel}: {COMPANY_TIN}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-deep max-sm:hidden">
                  {org.docsLabel} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <ArrowRight className="size-4 shrink-0 text-brand-deep sm:hidden" aria-hidden />
              </a>
            </div>
            </div>
          </div>

          {/* Raqamlar: bosh sahifa va sertifikatlar sahifasi bilan bir xil manba */}
          <dl className="relative grid grid-cols-2 border-t border-line bg-mist/50 sm:grid-cols-4">
            {[...numbers, { v: SINCE_YEAR, l: org.sinceLabel }].map((s, i) => (
              <div key={s.l} className={`flex flex-col-reverse justify-end gap-1.5 border-line px-6 py-5 sm:px-8 ${i % 2 ? "border-l" : ""} ${i > 1 ? "max-sm:border-t" : ""} ${i ? "sm:border-l" : ""}`}>
                <dt className="text-[13px] leading-snug text-ink-soft">{s.l}</dt>
                <dd className="text-[clamp(22px,4vw,30px)] leading-none font-bold tracking-tight tabular-nums">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───── Taqqoslash ───── */}
      <section id="compare" aria-labelledby="cmp-h" className="scroll-mt-24 py-16 sm:py-24">
        <div className="mx-auto max-w-[1160px] px-4 sm:px-6">
          <div className="mx-auto max-w-[760px] text-center">
            <Eyebrow>{t.compareCaption}</Eyebrow>
            <h2 id="cmp-h" className="mt-3 text-[clamp(26px,6vw,44px)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">{t.compareTitle}</h2>
          </div>

          {/* Desktop: jadval — OnlaynHamshira ustuni yaxlit ajratilgan, sarlavha skrollda yopishib turadi */}
          <table className="mt-12 hidden w-full border-separate border-spacing-0 text-left text-[15px] md:table">
            <caption className="sr-only">{t.compareCaption}</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky top-[72px] z-10 w-[27%] bg-white/95 px-4 pt-4 pb-4 align-bottom text-[13px] font-semibold tracking-wide text-ink-soft uppercase backdrop-blur">
                  {t.cols.feature}
                </th>
                <th scope="col" className="sticky top-[72px] z-10 w-[38%] rounded-t-[24px] bg-brand-grad px-6 py-5 text-white shadow-[0_-10px_30px_-18px_rgb(46_201_176/0.9)]">
                  <span className="flex items-center gap-3">
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-white"><Pin className="h-6" /></span>
                    <span className="text-lg font-bold">{t.cols.us}</span>
                  </span>
                </th>
                <th scope="col" className="sticky top-[72px] z-10 bg-white/95 px-6 py-5 backdrop-blur">
                  <span className="flex items-center gap-3 text-ink-soft">
                    <span aria-hidden className="grid size-10 place-items-center rounded-full bg-mist"><PhoneCall className="size-4.5" /></span>
                    <span className="font-semibold">{t.cols.old}</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r, i) => {
                const Ico = ROW_ICONS[i % ROW_ICONS.length];
                const last = i === t.rows.length - 1;
                return (
                  <tr key={r.feature} className="group">
                    <th scope="row" className="border-b border-line px-4 py-3.5 font-semibold group-hover:bg-mist/60">
                      <span className="flex items-center gap-3">
                        <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-xl bg-mist text-brand-deep transition group-hover:bg-white">
                          <Ico className="size-4.5" />
                        </span>
                        {r.feature}
                      </span>
                    </th>
                    <td className={`bg-[#effbf2] px-6 py-3.5 ${last ? "rounded-b-[24px]" : "border-b border-[#d9f3df]"} group-hover:bg-[#e4f8e9]`}>
                      <span className="flex items-start gap-2.5">
                        <Yes className="mt-0.5" />
                        {r.href ? (
                          <a href={r.href} className="font-medium underline decoration-brand-deep/30 decoration-2 underline-offset-3 hover:decoration-current">{r.us}</a>
                        ) : (
                          <span className="font-medium">{r.us}</span>
                        )}
                      </span>
                    </td>
                    <td className="border-b border-line px-6 py-3.5 text-ink-soft group-hover:bg-mist/60">
                      <span className="flex items-start gap-2.5"><No className="mt-0.5" /> {r.old}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobil: har bir xususiyat — alohida karta; dastlab MOBILE_VISIBLE ta, qolgani ochiladi (matn HTML'da qoladi) */}
          <ul className="mt-10 grid gap-3 md:hidden">
            {t.rows.slice(0, MOBILE_VISIBLE).map((r, i) => <MobileRow key={r.feature} r={r} i={i} cols={t.cols} />)}
          </ul>
          {t.rows.length > MOBILE_VISIBLE && (
            <details className="group mt-3 md:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full bg-mint px-5 py-3.5 font-semibold text-brand-deep group-open:hidden [&::-webkit-details-marker]:hidden">
                {fill(t.showMore, { n: t.rows.length - MOBILE_VISIBLE })} <ChevronDown className="size-4" aria-hidden />
              </summary>
              <ul className="grid gap-3">
                {t.rows.slice(MOBILE_VISIBLE).map((r, i) => <MobileRow key={r.feature} r={r} i={i + MOBILE_VISIBLE} cols={t.cols} />)}
              </ul>
            </details>
          )}
        </div>
      </section>

      {/* ───── Afzalliklar ───── */}
      <section aria-labelledby="ben-h" className="bg-mist py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_2fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow tone="white">{t.benefitsLabel}</Eyebrow>
            <h2 id="ben-h" className="mt-3 text-[clamp(26px,6vw,44px)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">{t.benefitsTitle}</h2>
            <p className="mt-4 max-w-[40ch] leading-relaxed text-ink-soft max-sm:hidden">{t.lead}</p>
            <a href={LINKS.webApp} className="group mt-7 inline-flex items-center gap-2 rounded-full bg-brand-grad px-6 py-3.5 font-semibold text-white shadow-[0_12px_28px_-12px_rgb(46_201_176/0.9)] transition hover:-translate-y-0.5 hover:brightness-105">
              {t.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {t.benefits.map((b, i) => (
              <li key={b.title} className="lift relative flex items-center gap-4 overflow-hidden rounded-[24px] bg-white p-5 ring-1 ring-white sm:block sm:rounded-[28px] sm:p-7">
                <span aria-hidden className="pointer-events-none absolute top-4 right-5 bg-brand-grad bg-clip-text text-[44px] leading-none font-bold tracking-tight text-transparent opacity-25 tabular-nums max-sm:hidden">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <IconTile name={WHY_BENEFIT_ICONS[i % WHY_BENEFIT_ICONS.length]} size={56} className="max-sm:size-12! max-sm:rounded-2xl" />
                <div>
                  <h3 className="text-lg leading-snug font-semibold tracking-tight sm:mt-6 sm:text-xl">{b.title}</h3>
                  {b.text && <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft sm:mt-2">{b.text}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───── Kimlar uchun + Qanday ishlaydi ───── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-white p-6 ring-1 ring-line sm:p-10">
            <h2 className="text-[clamp(24px,5vw,34px)] leading-tight font-semibold tracking-[-0.02em]">{t.forWhoTitle}</h2>
            <ul className="mt-6 divide-y divide-line">
              {t.forWho.map((w, i) => (
                <li key={w} className="flex items-center gap-4 py-3.5 text-[15px] font-medium first:pt-0 last:pb-0 sm:text-base">
                  <IconTile name={WHY_FORWHO_ICONS[i % WHY_FORWHO_ICONS.length]} size={44} className="rounded-xl!" />
                  <span className="flex-1">{w}</span>
                  <Check className="size-5 shrink-0 text-brand-deep" aria-hidden />
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#fff_0%,var(--color-mist)_45%,#cdebfa_100%)] p-6 ring-1 ring-line sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand/25 blur-3xl" />
            <h2 className="relative text-[clamp(24px,5vw,34px)] leading-tight font-semibold tracking-[-0.02em]">{t.howTitle}</h2>
            {/* Vertikal yo'l: raqamlar gradient chiziq bilan bog'langan */}
            <ol className="relative mt-8">
              {t.steps.map((s, i) => (
                <li key={s} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < t.steps.length - 1 && <span aria-hidden className="absolute top-12 bottom-1 left-[23px] w-0.5 rounded-full bg-gradient-to-b from-brand-teal/80 to-brand-teal/10" />}
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-grad text-lg font-bold text-white shadow-[0_10px_24px_-10px_rgb(46_201_176/0.9)]">{i + 1}</span>
                  <span className="pt-1">
                    <span className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">{t.stepWord} {i + 1}</span>
                    <span className="mt-1 block text-[17px] leading-snug font-medium">{s}</span>
                  </span>
                </li>
              ))}
            </ol>
            <a href={LINKS.webApp} className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-brand-grad px-6 py-3.5 font-semibold text-white transition hover:brightness-105">
              {t.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* ───── FAQ (faqat Tilda sahifasida bo'lgan tilda) ───── */}
      {t.faq && (
        <section aria-labelledby="wfaq-h" className="bg-mist py-16 sm:py-24">
          <div className="mx-auto max-w-[900px] px-4 sm:px-6">
            <h2 id="wfaq-h" className="text-center text-[clamp(26px,6vw,44px)] leading-[1.1] font-semibold tracking-[-0.025em]">{t.faqTitle}</h2>
            <div className="mt-10 space-y-2">
              {t.faq.map((f, i) => (
                <details key={f.q} open={i === 0} className="group rounded-[22px] bg-white/70 ring-1 ring-transparent transition open:bg-white open:shadow-[0_16px_40px_-24px_rgb(13_47_68/0.35)] hover:ring-line">
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 text-base leading-snug font-medium sm:px-7 sm:py-5 sm:text-lg [&::-webkit-details-marker]:hidden">
                    <span className="flex-1">{f.q}</span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist transition duration-300 group-open:rotate-45 group-open:bg-brand-grad group-open:text-white">
                      <Plus className="size-5" aria-hidden />
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft sm:px-7 sm:pb-6 sm:text-base">
                    <p>{f.a}</p>
                    {f.list && (
                      <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                        {f.list.map((l) => (
                          <li key={l} className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-brand-deep" aria-hidden /> {l}</li>
                        ))}
                      </ul>
                    )}
                    {f.after && <p className="mt-3">{f.after}</p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───── Xulosa ───── */}
      <section aria-labelledby="concl-h" className="px-3 pt-16 sm:px-4 sm:pt-24">
        <div className="relative mx-auto grid max-w-[1400px] gap-10 overflow-hidden rounded-[36px] bg-brand-grad-deep px-6 py-12 text-white sm:px-14 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.14)_1.2px,transparent_1.6px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_70%_60%_at_80%_50%,#000_10%,transparent_70%)]" />
          <div className="relative">
            <h2 id="concl-h" className="text-[clamp(26px,6vw,44px)] leading-[1.1] font-bold tracking-[-0.025em]">{t.conclusionTitle}</h2>
            <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-white/90">{t.conclusion}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={LINKS.webApp} className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-ink transition hover:-translate-y-0.5">
                {t.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a href={`tel:${LINKS.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-4 font-semibold ring-1 ring-white/30 transition hover:bg-white/25" aria-label={`${callLabel}: ${LINKS.phoneLabel}`}>
                <Phone className="size-4" aria-hidden /> {LINKS.phoneLabel}
              </a>
            </div>
          </div>

          {/* Ishonch paneli: raqamlar + rasmiy hujjatlar */}
          <div className="relative rounded-[28px] bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-sm sm:p-6">
            <dl className="grid grid-cols-3 gap-3">
              {numbers.map((s) => (
                <div key={s.l} className="flex flex-col-reverse justify-end gap-1.5">
                  <dt className="text-[12px] leading-snug text-white/75 hyphens-auto [overflow-wrap:anywhere]">{s.l}</dt>
                  <dd className="text-[clamp(20px,4vw,26px)] leading-none font-bold tabular-nums">{s.v}</dd>
                </div>
              ))}
            </dl>
            <a href={org.docsHref} className="group mt-5 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-ink transition hover:-translate-y-0.5">
              <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-brand-deep"><ShieldCheck className="size-5" /></span>
              <span className="flex-1 font-semibold">{org.docsLabel}</span>
              <ArrowRight className="size-4 text-brand-deep transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
