import { preload } from "react-dom";
import { ArrowDown, Building2, CalendarDays, ChevronRight, ExternalLink, Hash, Maximize2, QrCode, ShieldCheck, FileCheck2 } from "lucide-react";
import { CERTIFICATES, COMPANY_TIN } from "@/lib/data";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { fill } from "@/lib/i18n/format";
import { IconTile, type IconName } from "../Icon";
import { LazyCertificateViewer as CertificateViewer } from "../AppLandingLazy";
import type { CertImage } from "./CertificateViewer";

const ICONS: IconName[] = ["id", "shield", "check"];
const FACT_ICONS = [CalendarDays, FileCheck2, Hash];
const d = (i: number) => ({ "--d": i }) as React.CSSProperties;

/** Rasmlar content/legacy/*certificates.json dagi HTML'dan olinadi (har til o'z nusxasini ko'rsatadi) */
function parseImages(html: string): CertImage[] {
  return [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => {
    const at = (n: string) => tag.match(new RegExp(`\\s${n}="([^"]*)"`))?.[1];
    return { src: at("src")!, srcSet: at("srcset"), width: Number(at("width")), height: Number(at("height")) };
  });
}

/** srcset'dagi eng kichik variant — kichik ko'rinishlar uchun */
const smallest = (img: CertImage) => img.srcSet?.split(",")[0].trim().split(" ")[0] ?? img.src;

/**
 * /certificates, /ru/certificates, /en/certificates. H1 matni Tilda'dagidek (content JSON'dan),
 * metadata esa [...slug]/page.tsx da — bu yerda faqat sahifa tanasi.
 */
export function CertificatesPage({
  html, t, home, homeLabel, closeLabel,
}: { html: string; t: Dict["certificates"]; home: string; homeLabel: string; closeLabel: string }) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
  const images = parseImages(html);
  const docs = CERTIFICATES.slice(0, images.length).map((c, i) => ({ ...c, ...t.items[i], image: images[i] }));

  // Birinchi ekrandagi hujjatlar to'plami — LCP
  const lcp = docs[0]?.image;
  if (lcp) preload(smallest(lcp), { as: "image", fetchPriority: "high" });

  const firstYear = CERTIFICATES[0].date.slice(-4);
  // Ko'rinishda chiroyli turishi uchun: ikki tik hujjat orqada, yotiq hujjat oldinda
  const stack = [
    "left-[2%] top-[4%] w-[46%] -rotate-[7deg] z-10",
    "right-[2%] top-0 w-[46%] rotate-[6deg] z-20",
    "left-1/2 bottom-[2%] w-[72%] -translate-x-1/2 -rotate-[2deg] z-30",
  ];

  const facts = [
    { v: firstYear, l: t.facts.since },
    { v: String(docs.length), l: t.facts.docs },
    { v: COMPANY_TIN, l: t.facts.tin },
  ];

  return (
    <>
      {/* ── Hero: boshqa sahifalar bilan bir xil konteyner, brend foni ── */}
      <section className="px-3 pt-[calc(80px+env(safe-area-inset-top))] sm:px-4">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#fff_0%,var(--color-mist)_40%,#cdebfa_100%)] ring-1 ring-line">
          {/* Brend foni: to'lqin patterni (Pattern | Pack 1) + suzuvchi nur dog'lari */}
          <div aria-hidden className="glow-blob pointer-events-none absolute -top-28 left-[6%] size-[400px] bg-grad-blue/25" />
          <div aria-hidden className="glow-blob glow-blob-alt pointer-events-none absolute right-[8%] -bottom-36 size-[440px] bg-grad-green/25" />
          <div aria-hidden className="hero-pattern-wide pointer-events-none absolute inset-0" />

          <div className="relative grid items-center gap-10 px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-16">
            <div>
              <nav aria-label="Breadcrumb" className="hero-in text-sm text-ink-soft">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li><a href={home} className="transition hover:text-ink">{homeLabel}</a></li>
                  <li aria-hidden><ChevronRight className="size-3.5" /></li>
                  <li aria-current="page" className="font-medium text-ink">{h1}</li>
                </ol>
              </nav>

              <p className="hero-in mt-6 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-brand-deep shadow-sm" style={d(1)}>
                <ShieldCheck className="size-4" aria-hidden /> {t.label}
              </p>
              <h1 className="hero-in mt-4 text-[clamp(34px,10vw,44px)] leading-[1.04] font-bold tracking-[-0.03em] sm:text-6xl" style={d(1)}>
                {h1}
              </h1>
              <p className="hero-in mt-5 max-w-[56ch] text-lg leading-relaxed text-pretty text-ink-soft" style={d(2)}>{t.lead}</p>

              {/* Rekvizitlar — ikonkali kartochkalar */}
              <dl className="hero-in mt-8 grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1.35fr] sm:gap-3" style={d(3)}>
                {facts.map((f, i) => {
                  const Ico = FACT_ICONS[i];
                  return (
                    // <dl> ichida dt/dd o'rovchi div'ning bevosita bolalari bo'lishi kerak (a11y) — ikonka dt ichida
                    <div key={f.l} className={`relative flex min-w-0 flex-col-reverse justify-center rounded-2xl bg-white/85 py-3 pr-3 pl-16 shadow-[0_10px_30px_-20px_rgb(13_47_68/0.4)] ring-1 ring-white backdrop-blur sm:py-4 sm:pr-4 sm:pl-[68px] ${i === 2 ? "max-sm:col-span-2" : ""}`}>
                      <dt className="text-[12px] leading-snug text-ink-soft sm:text-[13px]">
                        <span aria-hidden className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-xl bg-brand-grad text-white sm:left-4"><Ico className="size-5" /></span>
                        {f.l}
                      </dt>
                      <dd className="text-lg leading-tight font-bold tracking-tight whitespace-nowrap tabular-nums sm:text-xl">{f.v}</dd>
                    </div>
                  );
                })}
              </dl>

              <div className="hero-in mt-7 flex flex-wrap items-center gap-x-5 gap-y-3" style={d(4)}>
                <a href="#docs" className="inline-flex items-center gap-2 rounded-full bg-brand-grad px-6 py-3.5 font-semibold text-white shadow-[0_12px_28px_-12px_rgb(46_201_176/0.9)] transition hover:-translate-y-0.5 hover:brightness-105">
                  {t.browse} <ArrowDown className="size-4" aria-hidden />
                </a>
                <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink-soft">
                  <Building2 className="size-4 text-brand-deep" aria-hidden /> {t.company}
                </span>
              </div>
            </div>

            {/* Hujjatlar to'plami — bosilsa kattalashadi */}
            <div className="hero-in relative mx-auto aspect-[10/9] w-full max-w-[520px]" style={d(2)}>
              {docs.map((doc, i) => (
                <a
                  key={doc.number}
                  href={doc.image.src}
                  data-cert={i}
                  aria-label={fill(t.openDoc, { t: doc.title })}
                  className={`group absolute block rounded-xl bg-white p-1.5 shadow-[0_24px_50px_-20px_rgb(13_47_68/0.45)] ring-1 ring-ink/5 transition duration-300 hover:z-40 hover:scale-[1.04] sm:p-2 ${stack[i]}`}
                >
                  <img
                    src={smallest(doc.image)}
                    width={doc.image.width}
                    height={doc.image.height}
                    alt=""
                    decoding="async"
                    {...(i === 0 ? { fetchPriority: "high" as const } : {})}
                    className="h-auto w-full rounded-lg"
                  />
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Hujjatlar ro'yxati ── */}
      <section id="docs" aria-labelledby="docs-h" className="mx-auto max-w-[1320px] scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[680px]">
            <h2 id="docs-h" className="text-[clamp(26px,8vw,32px)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance sm:text-5xl">
              {t.listTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-ink-soft">{t.listText}</p>
          </div>
          {/* Tezkor o'tish: har bir hujjatga */}
          <ol className="flex flex-wrap gap-2">
            {docs.map((doc, i) => (
              <li key={doc.number}>
                <a href={`#doc-${i + 1}`} className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pr-4 pl-1.5 text-sm font-semibold ring-1 ring-line transition hover:ring-brand">
                  <span className="grid size-7 place-items-center rounded-full bg-mint text-xs text-brand-deep tabular-nums">0{i + 1}</span>
                  {doc.kind}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <ol className="mt-10 grid gap-5 sm:mt-12 sm:gap-6">
          {docs.map((doc, i) => {
            const landscape = doc.image.width > doc.image.height;
            return (
              <li id={`doc-${i + 1}`} key={doc.number} data-reveal className="grid scroll-mt-24 overflow-hidden rounded-[28px] bg-white ring-1 ring-line lg:grid-cols-[minmax(0,480px)_1fr]">
                {/* Rasm — bir xil neytral fon, nozik nuqtali naqsh */}
                <div className="relative grid place-items-center bg-mist px-6 pt-14 pb-6 sm:p-12">
                  <div aria-hidden className="dots pointer-events-none absolute inset-0 opacity-60" />
                  <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-ink-soft tabular-nums ring-1 ring-line">
                    0{i + 1} / 0{docs.length}
                  </span>
                  <a
                    href={doc.image.src}
                    data-cert={i}
                    aria-label={fill(t.openDoc, { t: doc.title })}
                    className={`group relative block rounded-xl bg-white p-2 shadow-[0_24px_50px_-24px_rgb(13_47_68/0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_60px_-24px_rgb(13_47_68/0.55)] ${landscape ? "w-full" : "w-[72%] max-w-[300px]"}`}
                  >
                    <img
                      src={doc.image.src}
                      srcSet={doc.image.srcSet}
                      sizes={landscape ? "(max-width: 1024px) calc(100vw - 96px), 400px" : "(max-width: 1024px) 60vw, 290px"}
                      width={doc.image.width}
                      height={doc.image.height}
                      alt={doc.title}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full rounded-lg"
                    />
                    <span className="absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink opacity-95 ring-1 ring-line backdrop-blur transition group-hover:bg-brand-grad group-hover:text-white group-hover:opacity-100 group-hover:ring-transparent">
                      <Maximize2 className="size-3.5" /> {t.open}
                    </span>
                  </a>
                </div>

                {/* Ma'lumot */}
                <div className="flex flex-col p-6 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <IconTile name={ICONS[i]} size={44} className="rounded-2xl!" />
                    <p className="text-sm font-semibold tracking-wide text-brand-deep uppercase">{doc.kind}</p>
                  </div>
                  <h3 className="mt-5 text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-[28px]">{doc.title}</h3>
                  <p className="mt-3 leading-relaxed text-pretty text-ink-soft sm:text-lg">{doc.text}</p>

                  <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-2">
                    <Fact icon={<Building2 className="size-4" />} label={t.fields.issuer} value={doc.issuer} className="sm:col-span-2" />
                    <Fact icon={<CalendarDays className="size-4" />} label={t.fields.date} value={doc.date} />
                    <Fact icon={<Hash className="size-4" />} label={t.fields.number} value={doc.number} />
                  </dl>

                  <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-8">
                    <a
                      href={doc.verify}
                      target="_blank"
                      rel="noopener nofollow"
                      className="inline-flex items-center gap-2 rounded-full bg-brand-grad px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-105"
                    >
                      <ExternalLink className="size-4" /> {t.verify}
                    </a>
                    <a
                      href={doc.image.src}
                      data-cert={i}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold ring-1 ring-line transition hover:ring-brand"
                    >
                      <Maximize2 className="size-4 text-brand-deep" /> {t.open}
                    </a>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-soft">
                    <QrCode className="size-4 shrink-0" /> {t.verifyNote}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ── Qanday tekshirish ── */}
      <section aria-labelledby="how-h" className="px-3 sm:px-4">
        <div data-reveal className="relative mx-auto mb-12 max-w-[1400px] overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#fff_0%,var(--color-mist)_45%,#cdebfa_100%)] px-6 py-12 ring-1 ring-line sm:px-12 sm:py-16">
          <div aria-hidden className="hero-pattern-wide pointer-events-none absolute inset-0" />
          <div className="relative grid gap-8 lg:grid-cols-[0.8fr_2fr] lg:gap-12">
            <div>
              <h2 id="how-h" className="max-w-[22ch] text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">{t.howTitle}</h2>
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-ink-soft">
                <Building2 className="size-4 shrink-0" aria-hidden /> {t.company} · {t.facts.tin}: {COMPANY_TIN}
              </p>
            </div>
            <ol className="grid gap-4 md:grid-cols-3">
              {t.how.map((s, i) => (
                <li key={s} className="rounded-2xl bg-white/85 p-5 shadow-[0_20px_40px_-28px_rgb(13_47_68/0.4)] ring-1 ring-white backdrop-blur sm:p-6">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-grad font-semibold text-white tabular-nums">{i + 1}</span>
                  <p className="mt-4 leading-relaxed">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <CertificateViewer
        docs={docs.map((doc) => ({ ...doc.image, title: doc.title, verify: doc.verify }))}
        t={t}
        close={closeLabel}
      />
    </>
  );
}

function Fact({ icon, label, value, className = "" }: { icon: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    // <dl> ichida dt/dd guruhni o'rovchi div'ning bevosita bolalari bo'lishi kerak (a11y) — ikonka dt ichida
    <div className={`relative min-w-0 bg-mist p-4 pl-15 ${className}`}>
      <dt className="text-sm text-ink-soft">
        <span aria-hidden className="absolute top-4 left-4 grid size-8 place-items-center rounded-full bg-white text-brand-deep ring-1 ring-line">{icon}</span>
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
