import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { IMAGES, LINKS } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { pageHref } from "@/lib/nav";
import { StoreButtons } from "./DownloadModal";
import { Icon, IconTile } from "./Icon";
import { InstagramIcon, TelegramIcon, YoutubeIcon } from "./StoreIcons";

const plain = (s: string) => s.replace(/<[^>]+>/g, "").trim();

/**
 * /contacts — Tilda'dagi matnlar (H1, shior, QR sarlavhasi) sahifa HTML'idan olinadi va aynan saqlanadi,
 * qolgan aloqa ma'lumotlari — saytning yagona manbalaridan (LINKS, lug'at).
 */
export function ContactsPage({ html, t, lang }: { html: string; t: Dict; lang: Locale }) {
  const c = t.contactsPage;
  const h1 = plain(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? t.contact.heading);
  const [tagline, qrTitle] = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => plain(m[1]));

  const methods = [
    { href: LINKS.telegram, label: "Telegram", value: "@Onlayn_Hamshira_Admin", note: c.telegramNote, Glyph: TelegramIcon, tone: "bg-sky", ext: true },
    { href: `mailto:${LINKS.email}`, label: "Email", value: LINKS.email, note: c.emailNote, Glyph: ({ className }: { className?: string }) => <Mail className={className} />, tone: "bg-mint" },
    { href: LINKS.instagram, label: "Instagram", value: "@onlayn_hamshira", note: c.instagramNote, Glyph: InstagramIcon, tone: "bg-aqua", ext: true },
    { href: LINKS.youtube, label: "YouTube", value: "@OnlaynHamshira", note: c.youtubeNote, Glyph: YoutubeIcon, tone: "bg-madang", ext: true },
  ];

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="px-3 pt-[calc(80px+env(safe-area-inset-top))] sm:px-4">
        <div className="relative mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-[1.25fr_1fr]">
          <div className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#fff_0%,var(--color-mist)_40%,#cdebfa_100%)] px-6 py-12 ring-1 ring-line sm:px-12 sm:py-16">
            {/* Brend foni: to'lqin patterni (Pattern | Pack 1) */}
            <div aria-hidden className="hero-pattern pointer-events-none absolute inset-0" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-brand-deep ring-1 ring-white backdrop-blur">
                <span className="size-1.5 rounded-full bg-brand-deep" /> {c.eyebrow}
              </p>
              <h1 className="mt-5 text-[clamp(40px,10vw,72px)] leading-[1] font-bold tracking-[-0.035em]">{h1}</h1>
              {tagline && <p className="mt-5 text-[clamp(20px,4.4vw,28px)] leading-snug font-semibold tracking-tight text-balance">{tagline}</p>}
              <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-ink-soft">{c.lead}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${LINKS.phone}`} className="inline-flex items-center gap-2 rounded-full bg-brand-grad px-7 py-4 font-semibold text-white shadow-[0_12px_28px_-12px_rgb(46_201_176/0.9)] transition hover:-translate-y-0.5 hover:brightness-105">
                  <Phone className="size-5" aria-hidden /> {c.callNow}
                </a>
                <a href={LINKS.telegram} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold ring-1 ring-line transition hover:ring-ink/25">
                  <TelegramIcon className="size-5 text-[#229ED9]" /> {c.writeTg}
                </a>
              </div>
            </div>
          </div>

          {/* Telefon kartasi */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[36px] bg-brand-grad-deep p-6 text-white sm:p-10">
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-white/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <IconTile name="telephone" size={56} />
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-white/30">
                  <span className="relative grid size-2.5 place-items-center">
                    <span className="absolute size-2.5 animate-pulse-ring rounded-full bg-white" />
                    <span className="size-2.5 rounded-full bg-white" />
                  </span>
                  {c.phoneNote}
                </span>
              </div>
              <p className="mt-8 text-white/90">{t.contact.phone}</p>
              <a href={`tel:${LINKS.phone}`} className="mt-1 block text-[clamp(26px,7vw,42px)] font-bold tracking-tight whitespace-nowrap tabular-nums hover:underline">
                {LINKS.phoneLabel}
              </a>
            </div>
            <div className="relative mt-8 grid gap-3 border-t border-white/30 pt-6 text-[15px] sm:grid-cols-2">
              <p className="flex gap-2.5"><MapPin className="mt-0.5 size-5 shrink-0 text-white" aria-hidden /> <span><span className="block font-semibold">{t.contact.address}</span><span className="text-white/90">{t.contact.addressText}</span></span></p>
              <p className="flex gap-2.5"><Icon name="clock" size={20} tone="current" className="mt-0.5 text-white" /> <span><span className="block font-semibold">{t.contact.hours}</span><span className="text-white/90">{t.contact.hoursText}</span></span></p>
            </div>
            <p className="relative mt-6 flex items-start gap-2 rounded-2xl bg-white/15 p-3.5 text-sm text-white/95 ring-1 ring-white/25">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-white" aria-hidden /> {t.booking.emergency}
            </p>
          </div>
        </div>
      </section>

      {/* ───── Aloqa usullari ───── */}
      <section aria-labelledby="methods-h" className="mx-auto max-w-[1400px] px-3 pt-16 sm:px-4 sm:pt-20">
        <h2 id="methods-h" className="px-3 text-[clamp(26px,6vw,40px)] leading-tight font-semibold tracking-[-0.025em]">{c.methodsTitle}</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {methods.map(({ href, label, value, note, Glyph, tone, ext }) => (
            <li key={label}>
              <a
                href={href}
                {...(ext ? { target: "_blank", rel: "noopener" } : {})}
                className={`group lift relative flex h-full flex-col rounded-[28px] ${tone} p-6`}
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-white text-ink shadow-sm transition group-hover:bg-brand-grad group-hover:text-white">
                  <Glyph className="size-6" />
                </span>
                <span className="absolute top-5 right-5 grid size-9 place-items-center rounded-full bg-white/60 text-ink/50 transition group-hover:rotate-45 group-hover:bg-white group-hover:text-ink" aria-hidden>
                  <ArrowUpRight className="size-4" />
                </span>
                <span className="mt-8 text-sm font-semibold text-ink-soft">{label}</span>
                <span className="mt-1 text-lg font-semibold break-all">{value}</span>
                <span className="mt-1 text-[15px] text-ink-soft">{note}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ───── Ilova + Hamkorlik ───── */}
      <section className="mx-auto mt-12 grid max-w-[1400px] gap-3 px-3 sm:mt-16 sm:px-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative overflow-hidden rounded-[32px] bg-brand-grad-deep p-6 text-white sm:p-10">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.14)_1.2px,transparent_1.6px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_70%_60%_at_80%_50%,#000_10%,transparent_70%)]" />
          <div className="relative grid items-center gap-8 sm:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-[clamp(24px,5vw,34px)] leading-tight font-bold tracking-[-0.02em] text-balance">{qrTitle ?? t.download.title}</h2>
              <p className="mt-3 max-w-[46ch] leading-relaxed text-white/90">{c.appText}</p>
              <StoreButtons className="mt-6" />
            </div>
            <div className="hidden gap-2 rounded-2xl bg-white p-2 shadow-[0_12px_30px_-14px_rgb(0_0_0/0.45)] sm:flex">
              {[IMAGES.qrAndroid, IMAGES.qrIphone].map((q, i) => (
                <figure key={q} className="text-center text-xs font-medium text-ink-soft">
                  <Image src={q} alt={`${i ? "iPhone" : "Android"} QR`} width={104} height={104} unoptimized className="size-[104px] rounded-lg" />
                  <figcaption className="mt-1">{i ? "iPhone" : "Android"}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
        <a href={pageHref("partner", lang)} className="group lift relative flex flex-col overflow-hidden rounded-[32px] bg-madang p-6 sm:p-10">
          <IconTile name="handshake" size={56} />
          <span className="mt-6 text-[clamp(22px,4.6vw,30px)] leading-tight font-semibold tracking-[-0.02em]">{c.partnerTitle}</span>
          <span className="mt-2 leading-relaxed text-ink-soft">{c.partnerText}</span>
          <span className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-brand-deep">
            {c.partnerCta}
            <span className="grid size-9 place-items-center rounded-full bg-white transition group-hover:rotate-45 group-hover:bg-brand-grad group-hover:text-white" aria-hidden>
              <ArrowUpRight className="size-4" />
            </span>
          </span>
        </a>
      </section>
    </>
  );
}
