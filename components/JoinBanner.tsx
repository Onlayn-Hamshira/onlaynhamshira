import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ClipboardCheck, FileCheck2, Lock, Save, ShieldCheck } from "lucide-react";
import { EXPERT_LINKS } from "@/lib/expert";
import { pageHref } from "@/lib/nav";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { editableImage } from "@/lib/edit/edits";

// Mutaxassislarni jalb qilish: asosiy yo'l — HR onboarding web-ilovasi (hr.onlaynhamshira.uz/hamkor),
// batafsil shartlar — mavjud /expert sahifasi (URL o'zgarmaydi).
const HR_STEPS = 8; // HR ilovadagi onboarding bosqichlari soni

export function JoinBanner({ t, lang }: { t: Dict["join"]; lang: Locale }) {
  return (
    <div
      data-reveal="scale"
      className="relative mt-10 overflow-hidden rounded-[32px] bg-brand-grad-deep text-white sm:mt-14"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.14)_1.2px,transparent_1.6px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_60%_70%_at_85%_40%,#000_10%,transparent_70%)]" />
      <div className="relative grid gap-10 px-5 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12 lg:px-14 lg:py-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/25">
            <span className="size-1.5 rounded-full bg-white" /> {t.label}
          </p>
          <h2 className="mt-4 max-w-[22ch] text-[clamp(26px,7.5vw,32px)] leading-[1.08] font-bold tracking-[-0.03em] text-balance sm:text-[40px]">
            {t.title}
          </h2>
          <p className="mt-4 max-w-[56ch] leading-relaxed text-white/90 sm:text-lg">{t.text}</p>

          {/* Jarayon: 1 → 2 → 3 */}
          <ol className="mt-6 flex flex-wrap gap-2">
            {t.steps.map((s, i) => (
              <li key={s} className="inline-flex items-center gap-2 rounded-full bg-white/12 py-1.5 pr-3.5 pl-1.5 text-sm font-medium ring-1 ring-white/20">
                <span className="grid size-6 place-items-center rounded-full bg-white text-xs font-bold text-brand-deep tabular-nums">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={EXPERT_LINKS.hrApply}
              rel="noopener"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-7 py-4 font-semibold text-brand-deep shadow-[0_16px_32px_-16px_rgb(0_0_0/0.5)] transition hover:-translate-y-0.5"
            >
              <ClipboardCheck className="size-5" aria-hidden /> {t.apply}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden />
            </a>
            <Link
              href={pageHref("partner", lang)}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold ring-1 ring-white/40 transition hover:bg-white/10"
            >
              {t.details}
            </Link>
          </div>
        </div>

        {/* HR ilova sahifasi maketi — mutaxassis qayerga o'tishini tanib olsin (telefonda yashirin: matn va tugma yetarli) */}
        <a
          href={EXPERT_LINKS.hrApply}
          rel="noopener"
          aria-label={`${t.browserLabel}: hr.onlaynhamshira.uz`}
          className="group relative mx-auto hidden w-full max-w-[440px] sm:block"
        >
          <div className="overflow-hidden rounded-[20px] bg-white text-ink shadow-[0_40px_80px_-32px_rgb(0_0_0/0.65)] ring-1 ring-black/5 transition duration-500 group-hover:-translate-y-1">
            {/* Brauzer paneli */}
            <div className="flex items-center gap-3 border-b border-line bg-mist/70 px-3.5 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
                <span className="size-2.5 rounded-full bg-ink/15" />
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[13px] ring-1 ring-line">
                <Lock className="size-3.5 shrink-0 text-brand-deep" aria-hidden />
                <span className="truncate"><strong className="font-semibold">hr.onlaynhamshira.uz</strong><span className="text-ink-soft">/hamkor</span></span>
              </span>
            </div>

            <div aria-hidden className="px-5 pt-4 pb-5">
              {/* Sarlavha + bosqich */}
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[13px] font-semibold">
                  <img src={editableImage("/img/map-pin.svg")} alt="" width={34} height={42} className="h-6 w-auto" />
                  {t.mock.brand}
                </span>
                <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand-deep tabular-nums">{t.mock.step}</span>
              </div>
              <div className="mt-3 flex gap-1">
                {Array.from({ length: HR_STEPS }, (_, i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i < 2 ? "bg-brand-grad" : "bg-line"}`} />
                ))}
              </div>

              <p className="mt-4 text-[17px] font-bold tracking-[-0.01em]">{t.mock.title}</p>

              {/* Mutaxassislik */}
              <p className="mt-3 text-[11px] font-semibold tracking-wide text-ink-soft uppercase">{t.mock.specialty}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {t.mock.specialties.map((sp, i) => (
                  <span
                    key={sp}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium ring-1 ${
                      i === 0 ? "bg-brand/8 text-brand-deep ring-brand/50" : "text-ink-soft ring-line"
                    }`}
                  >
                    {i === 0 && <Check className="size-3.5" />}
                    {sp}
                  </span>
                ))}
              </div>

              {/* Tajriba */}
              <p className="mt-3 text-[11px] font-semibold tracking-wide text-ink-soft uppercase">{t.mock.experience}</p>
              <span className="mt-1.5 flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium ring-1 ring-line">
                {t.mock.experienceValue}
                <ChevronDown className="size-4 text-ink-soft" />
              </span>

              {/* Hujjatlar */}
              <p className="mt-3 text-[11px] font-semibold tracking-wide text-ink-soft uppercase">{t.mock.docs}</p>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {t.mock.docsValue.map((d) => (
                  <span key={d} className="flex items-center gap-2 rounded-lg bg-mist px-3 py-2 text-[13px] font-medium">
                    <FileCheck2 className="size-4 text-brand-deep" />
                    {d}
                    <span className="ml-auto grid size-4 place-items-center rounded-full bg-brand-deep text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  </span>
                ))}
              </div>

              <span className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-grad text-sm font-semibold text-white transition group-hover:brightness-105">
                {t.mock.next} <ArrowRight className="size-4" />
              </span>

              <div className="mt-3 flex items-center justify-between gap-2 text-[11.5px] text-ink-soft">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-brand-deep" />{t.mock.secure}</span>
                <span className="flex items-center gap-1.5"><Save className="size-3.5" />{t.mock.resume}</span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
