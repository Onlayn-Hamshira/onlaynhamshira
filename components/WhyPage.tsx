import {
  ArrowDown, ArrowRight, BadgeCheck, Check, HeartHandshake, Phone, Plus, ShieldCheck, Tag, Zap, type LucideIcon,
} from "lucide-react";
import { CERTIFICATES, COMPANY_TIN, LINKS, STATS } from "@/lib/data";
import { WHY_BENEFIT_ICONS, WHY_FORWHO_ICONS, type WhyDict } from "@/lib/why";
import { IconTile } from "./Icon";

// Faoliyat boshlangan yil — birinchi davlat guvohnomasidan (sertifikatlar sahifasidagi bilan bir xil)
const SINCE_YEAR = CERTIFICATES[0].date.slice(-4);

// Hero'dagi qisqa ustunliklar (lib/why.ts → highlights) uch tilda bir xil tartibda: tekshiruv, narx, tezlik, kafolat
const HIGHLIGHT_ICONS: LucideIcon[] = [BadgeCheck, Tag, Zap, HeartHandshake];

/** 13500 → "13 500" (bosh sahifadagi hisoblagich bilan bir xil ko'rinish) */
const num = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const Yes = ({ className = "" }: { className?: string }) => (
  <span aria-hidden className={`grid size-5 shrink-0 place-items-center rounded-full bg-brand-deep text-white ${className}`}>
    <Check className="size-3.5" strokeWidth={3} />
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

export type WhyOrg = { company: string; tinLabel: string; sinceLabel: string; docsLabel: string; docsHref: string };

export function WhyPage({ t, callLabel, stats, org }: { t: WhyDict; callLabel: string; stats: string[]; org: WhyOrg }) {
  // Raqamlar: bosh sahifadagi bilan bir xil manba (lib/data.ts → STATS, lug'at → stats.items)
  const numbers = [0, 1, 2].map((i) => ({ v: `${num(STATS[i].value)}${STATS[i].suffix}`, l: stats[i] }));

  return (
    <>
      {/* ───── Hero: jiddiy, tuzilmali — chapda da'vo, o'ngda dalil (taqqoslash + rasmiy ma'lumotlar) ───── */}
      <section className="px-3 pt-[calc(80px+env(safe-area-inset-top))] sm:px-4">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-white ring-1 ring-line">
          {/* Nozik to'r fon — bezaksiz, "hujjat" hissi */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgb(16_41_58/0.045)_1px,transparent_1px),linear-gradient(90deg,rgb(16_41_58/0.045)_1px,transparent_1px)] bg-[length:44px_44px] [mask-image:linear-gradient(180deg,#000,transparent_75%)]" />
          <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-brand-grad" />

          <div className="relative grid items-center gap-10 px-6 pt-12 pb-10 sm:px-12 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-14">
            <div>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="mt-5 text-[clamp(30px,7vw,54px)] leading-[1.06] font-bold tracking-[-0.03em] text-balance">{t.h1}</h1>
              <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-ink-soft">{t.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={LINKS.webApp} className="group inline-flex items-center gap-2 rounded-full bg-brand-grad px-7 py-4 font-semibold text-white shadow-[0_12px_28px_-12px_rgb(56_197_177/0.9)] transition hover:-translate-y-0.5 hover:brightness-105">
                  {t.cta} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
                </a>
                <a href="#advantages" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold ring-1 ring-line transition hover:ring-ink/25">
                  {t.toAdvantages} <ArrowDown className="size-4" aria-hidden />
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

            {/* Dalil paneli: asosiy ustunliklar + kompaniya rekvizitlari (offline usul bilan qatorma-qator solishtirish yo'q) */}
            <div className="rounded-[28px] bg-ink p-5 text-white shadow-[0_40px_80px_-40px_rgb(16_41_58/0.8)] sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] font-semibold tracking-wide text-white/60 uppercase">{t.highlightsTitle}</p>
                <span className="flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-1 text-[13px] font-semibold ring-1 ring-white/15">
                  <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-white"><Pin className="h-4" /></span>
                  {t.brand}
                </span>
              </div>
              <ul className="mt-3 divide-y divide-white/10">
                {t.highlights.map((h, i) => {
                  const Ico = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
                  return (
                    <li key={h.label} className="flex items-center gap-4 py-3.5">
                      <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-brand ring-1 ring-white/10">
                        <Ico className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold tracking-wide text-white/50 uppercase">{h.label}</p>
                        <p className="mt-0.5 text-[15px] leading-snug font-semibold">{h.text}</p>
                      </div>
                      <Yes className="size-6! bg-brand-grad!" />
                    </li>
                  );
                })}
              </ul>
              <a href={org.docsHref} className="group mt-3 flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 text-ink transition hover:-translate-y-0.5">
                <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint text-brand-deep"><ShieldCheck className="size-5" /></span>
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

      {/* ───── Asosiy ustunliklar ─────
          Tilda'dagi "biz ✓ / offline ✗" jadvali o'rnida (sababi — lib/why.ts boshidagi izoh): an'anaviy usulni
          mezonma-mezon yomonlamaymiz, faqat o'z ustunliklarimizni ko'rsatamiz. */}
      <section id="advantages" aria-labelledby="adv-h" className="mt-12 scroll-mt-24 bg-mist py-16 sm:mt-16 sm:py-24">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_2fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow tone="white">{t.benefitsLabel}</Eyebrow>
            <h2 id="adv-h" className="mt-3 text-[clamp(26px,5vw,38px)] leading-[1.12] font-semibold tracking-[-0.025em] text-balance">{t.advantagesTitle}</h2>
            <p className="mt-4 max-w-[44ch] leading-relaxed text-ink-soft">{t.advantagesText}</p>
            <a href={LINKS.webApp} className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition hover:bg-brand-grad">
              {t.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          </div>
          <div>
            {t.benefitsTitle && <p className="mb-4 text-xl font-semibold tracking-tight sm:mb-5 sm:text-2xl">{t.benefitsTitle}</p>}
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {t.benefits.map((b, i) => (
                <li key={b.title} className="lift relative flex gap-4 overflow-hidden rounded-[24px] bg-white p-5 ring-1 ring-white sm:block sm:rounded-[28px] sm:p-7">
                  <span aria-hidden className="pointer-events-none absolute top-4 right-5 bg-brand-grad bg-clip-text text-[44px] leading-none font-bold tracking-tight text-transparent opacity-25 tabular-nums max-sm:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <IconTile name={WHY_BENEFIT_ICONS[i % WHY_BENEFIT_ICONS.length]} size={56} className="shrink-0 max-sm:size-12! max-sm:rounded-2xl" />
                  <div className="min-w-0">
                    <h3 className="text-lg leading-snug font-semibold tracking-tight sm:mt-6 sm:text-xl">{b.title}</h3>
                    {b.text && <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft sm:mt-2">{b.text}</p>}
                    {b.links && (
                      <ul className="mt-3 space-y-1.5">
                        {b.links.map((l) => (
                          <li key={l.href}>
                            <a href={l.href} className="inline-flex items-start gap-1.5 text-[14px] leading-snug font-semibold text-brand-deep underline decoration-brand-deep/30 decoration-2 underline-offset-3 hover:decoration-current">
                              {l.label} <ArrowRight className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
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

          <div className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-white sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand/20 blur-3xl" />
            <h2 className="relative text-[clamp(24px,5vw,34px)] leading-tight font-semibold tracking-[-0.02em]">{t.howTitle}</h2>
            {/* Vertikal yo'l: raqamlar gradient chiziq bilan bog'langan */}
            <ol className="relative mt-8">
              {t.steps.map((s, i) => (
                <li key={s} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < t.steps.length - 1 && <span aria-hidden className="absolute top-12 bottom-1 left-[23px] w-0.5 rounded-full bg-gradient-to-b from-brand-teal/80 to-white/10" />}
                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-grad text-lg font-bold shadow-[0_10px_24px_-10px_rgb(56_197_177/0.9)]">{i + 1}</span>
                  <span className="pt-1">
                    <span className="block text-xs font-semibold tracking-wide text-white/55 uppercase">{t.stepWord} {i + 1}</span>
                    <span className="mt-1 block text-[17px] leading-snug font-medium">{s}</span>
                  </span>
                </li>
              ))}
            </ol>
            <a href={LINKS.webApp} className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-ink transition hover:bg-brand-grad hover:text-white">
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
                <details key={f.q} open={i === 0} className="group rounded-[22px] bg-white/70 ring-1 ring-transparent transition open:bg-white open:shadow-[0_16px_40px_-24px_rgb(16_41_58/0.35)] hover:ring-line">
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
        <div className="relative mx-auto grid max-w-[1400px] gap-10 overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#12803e_0%,#0b7571_50%,#0d619b_100%)] px-6 py-12 text-white sm:px-14 sm:py-16 lg:grid-cols-[1.3fr_1fr] lg:items-center">
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
