import Image from "next/image";
import { ArrowRight, Check, ClipboardCheck, Globe, Phone, Plus } from "lucide-react";
import { LINKS } from "@/lib/data";
import {
  BENEFIT_ICONS, EXPERT_LINKS, INCOME_ICONS, REQUIREMENT_ICONS, STEP_ICONS, type ExpertDict,
} from "@/lib/expert";
import { SectionHead } from "./Sections";
import { Icon, IconTile } from "./Icon";
import { TelegramIcon } from "./StoreIcons";
import { LazyExpertPhoneDemo as ExpertPhoneDemo } from "./AppLandingLazy";
import { editableImage } from "@/lib/edit/edits";

// "Hamkor bo'lish" sahifasi — mutaxassislar uchun. Anchor'lar (#instructions, #advantages, #income, #faq)
// Tilda'dagi havolalar bilan bir xil — o'zgartirmang.

const d = (i: number) => ({ "--d": i }) as React.CSSProperties;

const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1320px] px-4 sm:px-6 ${className}`}>{children}</div>
);

/** Asosiy CTA — HR onboarding web-ilovasidagi ariza (hr.onlaynhamshira.uz/hamkor) */
function ApplyButton({ t, className = "" }: { t: ExpertDict; className?: string }) {
  return (
    <a
      href={EXPERT_LINKS.hrApply}
      rel="noopener"
      className={`group inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-grad px-7 py-4 font-semibold text-white shadow-[0_16px_32px_-16px_rgb(0_182_243/0.8)] transition hover:-translate-y-0.5 hover:brightness-105 ${className}`}
    >
      <ClipboardCheck className="size-5" aria-hidden /> {t.apply}
      <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
    </a>
  );
}

/** Ariza qayerda to'ldirilishini ko'rsatadi + ikkinchi darajali Telegram yo'li */
function ApplyMeta({ t, className = "" }: { t: ExpertDict; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 pl-2 text-sm text-ink-soft ${className}`}>
      <span className="inline-flex items-center gap-1.5">
        <Globe className="size-4 text-brand-deep" aria-hidden />
        <span className="font-semibold text-ink">hr.onlaynhamshira.uz</span> · {t.applyNote}
      </span>
      <a href={EXPERT_LINKS.hrBot} rel="noopener" className="inline-flex items-center gap-1.5 self-start underline-offset-4 hover:text-ink hover:underline">
        <TelegramIcon className="size-4 text-sky-deep" /> {t.applyTg}
      </a>
    </div>
  );
}

/** Mutaxassislar ilovasi (mijozlar ilovasi emas) — shuning uchun umumiy StoreButtons ishlatilmaydi */
function StoreLinks({ className = "" }: { className?: string }) {
  const items = [
    { href: EXPERT_LINKS.android, src: editableImage("/badges/google-play-black.png"), w: 600, h: 178, label: "Google Play" },
    { href: EXPERT_LINKS.ios, src: editableImage("/badges/app-store.png"), w: 600, h: 209, label: "App Store" },
  ];
  return (
    <div className={`flex flex-wrap gap-2.5 sm:gap-3 ${className}`}>
      {items.map((s) => (
        <a key={s.href} href={s.href} rel="noopener" aria-label={s.label} className="rounded-[12px] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgb(13_47_68/0.5)]">
          <Image src={s.src} alt="" width={s.w} height={s.h} sizes="(min-width: 640px) 180px, 150px" className="h-11 w-auto sm:h-[52px]" draggable={false} />
        </a>
      ))}
    </div>
  );
}

/* ───────── Hero ───────── */
function Hero({ t }: { t: ExpertDict }) {
  return (
    <section className="relative overflow-hidden px-3 pt-[calc(80px+env(safe-area-inset-top))] sm:px-4">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#eefbf0_0%,#e8f7fb_60%,#f3f8fa_100%)]">
        <div aria-hidden className="dots pointer-events-none absolute inset-0 opacity-70" />
        <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[460px] rounded-full bg-brand-blue/20 blur-[110px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 size-[420px] rounded-full bg-brand/25 blur-[110px]" />

        <div className="relative grid gap-10 px-5 pt-10 pb-8 sm:px-12 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-6 lg:px-16 lg:py-20">
          <div className="hero-in">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-brand-deep ring-1 ring-brand/30 backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand" />
                <span className="relative size-2 rounded-full bg-brand" />
              </span>
              {t.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[18ch] text-[clamp(32px,9vw,40px)] leading-[1.04] font-bold tracking-[-0.035em] text-balance sm:text-[56px] lg:text-[64px]">
              {t.h1}
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-pretty text-ink-soft sm:text-xl">{t.lead}</p>

            <div className="mt-8 flex flex-col gap-5">
              <div className="flex flex-col items-start gap-3">
                <ApplyButton t={t} className="max-sm:w-full" />
                <ApplyMeta t={t} />
              </div>
              <StoreLinks />
            </div>
          </div>

          {/* Mutaxassislar ilovasining jonli demosi: yuklab olish → ro'yxat → onlayn → buyurtma → yakunlash → to'lov */}
          <div className="hero-in relative mx-auto w-full max-w-[420px]" style={d(2)}>
            <div aria-hidden className="absolute inset-x-8 top-[10%] bottom-[14%] rounded-full bg-brand-grad opacity-30 blur-[60px]" />
            <ExpertPhoneDemo t={t.demo} />
          </div>
        </div>

        {/* Asosiy raqamlar */}
        <dl className="relative grid grid-cols-2 gap-px overflow-hidden border-t border-white/70 bg-white/60 lg:grid-cols-4">
          {t.facts.map((f) => (
            <div key={f.label} className="bg-white/70 px-5 py-5 backdrop-blur sm:px-8 sm:py-7">
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="block text-3xl font-bold tracking-tight text-brand-grad sm:text-4xl">{f.value}</span>
                <span className="mt-1 block text-sm leading-snug text-ink-soft sm:text-base">{f.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────── 4 qadam ───────── */
function Steps({ t }: { t: ExpertDict }) {
  const s = t.steps;
  return (
    <section id="instructions" aria-labelledby="steps-h" className="py-16 sm:py-24 lg:py-28">
      <Wrap>
        <SectionHead id="steps-h" label={s.label} title={s.title} text={s.text} wide />
        <ol className="relative mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {/* Qadamlarni bog'lovchi chiziq (desktop) */}
          <span aria-hidden className="absolute top-[52px] right-[12%] left-[12%] hidden h-0.5 bg-[repeating-linear-gradient(90deg,var(--color-brand-teal)_0_8px,transparent_8px_16px)] opacity-50 lg:block" />
          {s.items.map((it, i) => (
            <li key={it.title} data-reveal style={d(i)} className="lift relative flex flex-col rounded-[28px] bg-mist p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <IconTile name={STEP_ICONS[i]} size={56} />
                <span className="text-sm font-semibold text-ink-soft">{s.stepWord} {i + 1}/4</span>
              </div>
              <h3 className="mt-6 text-xl leading-snug font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{it.text}</p>
              {i === 0 && (
                <a href={EXPERT_LINKS.hrApply} rel="noopener" className="group mt-5 inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-line transition hover:ring-brand">
                  <Globe className="size-4 text-brand-deep" aria-hidden /> hr.onlaynhamshira.uz
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </a>
              )}
              {i === 2 && <StoreLinks className="mt-5 [&_img]:h-10! [&_img]:sm:h-10!" />}
            </li>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}

/* ───────── Imtiyozlar ───────── */
function Benefits({ t }: { t: ExpertDict }) {
  const b = t.benefits;
  const tones = ["bg-mint", "bg-sky", "bg-aqua", "bg-madang"];
  return (
    <section id="advantages" aria-labelledby="adv-h" className="bg-mist py-16 sm:py-24 lg:py-28">
      <Wrap className="grid gap-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead id="adv-h" align="left" label={b.label} title={b.title} text={b.text} />
          <ApplyButton t={t} className="mt-8 max-sm:w-full" />
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {b.items.map((it, i) => (
            <li key={it.title} data-reveal style={d(i % 2)} className="lift flex gap-4 rounded-[28px] bg-white p-5 sm:block sm:p-7">
              <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${tones[i]} sm:size-16`}>
                <Icon name={BENEFIT_ICONS[i]} size={28} />
              </span>
              <div>
                <h3 className="text-lg leading-snug font-semibold tracking-tight sm:mt-6 sm:text-2xl">{it.title}</h3>
                <p className="mt-1 leading-relaxed text-ink-soft sm:mt-2">{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ───────── Talablar ───────── */
function Requirements({ t }: { t: ExpertDict }) {
  const r = t.requirements;
  return (
    <section id="requirements" aria-labelledby="req-h" className="py-16 sm:py-24 lg:py-28">
      <Wrap>
        <SectionHead id="req-h" label={r.label} title={r.title} text={r.text} />
        <ul className="mx-auto mt-10 grid max-w-[1100px] gap-3 sm:mt-14 sm:grid-cols-2">
          {r.items.map((it, i) => (
            <li key={it.title} data-reveal style={d(i % 2)} className="flex gap-4 rounded-[24px] p-5 ring-1 ring-line sm:gap-5 sm:p-7">
              <IconTile name={REQUIREMENT_ICONS[i]} size={52} className="rounded-2xl!" />
              <div>
                <h3 className="flex items-center gap-2 text-lg leading-snug font-semibold tracking-tight sm:text-xl">
                  {it.title}
                  <Check className="size-5 shrink-0 text-brand-deep" aria-hidden strokeWidth={2.5} />
                </h3>
                <p className="mt-1.5 leading-relaxed text-ink-soft">{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ───────── Daromad ───────── */
function Income({ t }: { t: ExpertDict }) {
  const m = t.income;
  return (
    <section id="income" aria-labelledby="inc-h" className="px-3 sm:px-4">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-brand-grad-deep text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.14)_1.2px,transparent_1.6px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_70%_60%_at_85%_30%,#000_10%,transparent_70%)]" />
        <div className="relative grid gap-10 px-5 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-16">
          <div data-reveal>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/25">
              <span className="size-1.5 rounded-full bg-white" /> {m.label}
            </p>
            <h2 id="inc-h" className="mt-4 text-[clamp(28px,8.5vw,34px)] leading-[1.06] font-bold tracking-[-0.03em] text-balance sm:text-5xl">{m.title}</h2>
            <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-white/90">{m.text}</p>

            {/* Taqsimot: mijoz to'lovi → sizga ~70%, komissiya ~30% */}
            <div className="mt-8 rounded-[24px] bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur sm:p-6">
              <div className="flex items-baseline justify-between text-sm text-white/85">
                <span>{m.clientPays}</span><span className="font-semibold text-white">100%</span>
              </div>
              <div className="mt-3 flex h-14 overflow-hidden rounded-2xl text-sm font-semibold sm:h-16">
                <div className="flex w-[70%] flex-col justify-center bg-white px-4 text-ink">
                  <span className="text-xs font-medium text-ink-soft">{m.youGet}</span>~70%
                </div>
                <div className="flex w-[30%] flex-col justify-center bg-white/25 px-3">
                  <span className="text-xs font-medium text-white/80">{m.commission}</span>~30%
                </div>
              </div>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:self-center">
            {m.items.map((it, i) => (
              <li key={it.title} data-reveal style={d(i % 2)} className="rounded-[24px] bg-white p-5 text-ink sm:p-6">
                <Icon name={INCOME_ICONS[i]} size={28} />
                <h3 className="mt-4 text-lg leading-snug font-semibold tracking-tight">{it.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ (JS'siz: <details>) ───────── */
function Faq({ t }: { t: ExpertDict }) {
  const f = t.faq;
  return (
    <section id="faq" aria-labelledby="efaq-h" className="py-16 sm:py-24 lg:py-28">
      <Wrap className="grid gap-8 sm:gap-12 lg:grid-cols-[0.8fr_1.4fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead id="efaq-h" align="left" label={f.label} title={f.title} text={f.text} />
          <div data-reveal className="mt-6 rounded-[24px] bg-mist p-5 sm:mt-8 sm:p-6">
            <p className="font-semibold">{f.more}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={EXPERT_LINKS.hrBot} rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-brand-grad px-5 py-3 text-[15px] font-semibold text-white transition hover:brightness-105">
                <TelegramIcon className="size-4" /> Telegram
              </a>
              <a href={`tel:${LINKS.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold ring-1 ring-line">
                <Phone className="size-4" /> {f.call}
              </a>
            </div>
          </div>
        </div>
        <ul className="space-y-2">
          {f.items.map((it, i) => (
            <li key={it.q} data-reveal style={d(Math.min(i, 4))}>
              <details name="expert-faq" open={i === 0} className="group rounded-[22px] bg-mist transition-[background-color,box-shadow] open:bg-white open:shadow-[0_16px_40px_-24px_rgb(13_47_68/0.35)] open:ring-1 open:ring-line">
                <summary className="flex list-none items-center gap-3 px-5 py-4 text-base leading-snug font-medium sm:gap-4 sm:px-7 sm:py-5 sm:text-lg [&::-webkit-details-marker]:hidden">
                  <h3 className="flex-1">{it.q}</h3>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white transition duration-300 group-open:rotate-45 group-open:bg-brand-grad group-open:text-white sm:size-10">
                    <Plus className="size-5" aria-hidden />
                  </span>
                </summary>
                <p className="max-w-[68ch] px-5 pb-5 text-[15px] leading-relaxed text-ink-soft sm:px-7 sm:pb-6 sm:text-base">{it.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}

/* ───────── Yakuniy CTA ───────── */
function FinalCta({ t }: { t: ExpertDict }) {
  return (
    <section aria-labelledby="final-h" className="px-3 sm:px-4">
      <div data-reveal="scale" className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-[linear-gradient(160deg,#eefbf0_0%,#e8f7fb_60%,#f3f8fa_100%)]">
        <div aria-hidden className="dots pointer-events-none absolute inset-0 opacity-70" />
        <div aria-hidden className="pointer-events-none absolute -top-40 right-0 size-[520px] rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="relative grid gap-10 px-5 py-14 sm:px-12 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-16">
          <div>
            <h2 id="final-h" className="max-w-[22ch] text-[clamp(28px,8vw,34px)] leading-[1.08] font-bold tracking-[-0.03em] text-balance sm:text-5xl">{t.final.title}</h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{t.final.text}</p>
            <div className="mt-8 flex flex-col items-start gap-5">
              <div className="flex flex-col items-start gap-3 max-sm:w-full">
                <ApplyButton t={t} className="max-sm:w-full" />
                <ApplyMeta t={t} />
              </div>
              <StoreLinks />
            </div>
          </div>
          <div className="hidden items-center gap-4 justify-self-end lg:flex">
            <div className="flex gap-3 rounded-[24px] bg-white p-3 shadow-[0_20px_40px_-24px_rgb(13_47_68/0.4)]">
              {[{ src: EXPERT_LINKS.qrAndroid, label: "Android" }, { src: EXPERT_LINKS.qrIos, label: "iPhone" }].map((q) => (
                <figure key={q.src} className="text-center text-xs font-semibold text-ink">
                  <Image src={q.src} alt={`QR — ${q.label}`} width={480} height={480} unoptimized className="size-[120px] rounded-lg" />
                  <figcaption className="mt-1">{q.label}</figcaption>
                </figure>
              ))}
            </div>
            <p className="max-w-[14ch] text-sm leading-snug text-ink-soft">{t.scanQr}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExpertPage({ t }: { t: ExpertDict }) {
  return (
    <>
      <Hero t={t} />
      <Steps t={t} />
      <Benefits t={t} />
      <Requirements t={t} />
      <Income t={t} />
      <Faq t={t} />
      <FinalCta t={t} />
    </>
  );
}
