import Image from "next/image";
import { Globe, Mail } from "lucide-react";
import { IMAGES, LINKS } from "@/lib/data";
import { fill } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { localePath, type Locale } from "@/lib/i18n/config";
import { pageHref, sectionHref } from "@/lib/nav";
import { InstagramIcon, Logo, TelegramIcon, YoutubeIcon } from "./StoreIcons";
import { Icon } from "./Icon";

// Alohida faylda: [...slug] sahifalari faqat Footer'ni oladi — Sections.tsx dagi yangiliklar karuseli,
// ilova demosi va ularning CSS'i ichki sahifalarga tushmaydi
/* ───────── Footer ───────── */
export function Footer({ t, common, lang, home }: { t: Dict["footer"]; common: Dict["common"]; lang: Locale; home?: string }) {
  // Har til o'z sahifalariga: /ru dagi "Блог" → /ru/blog. Ichki sahifalarda bo'limlar bosh sahifaga ("/ru#faq")
  const onHome = !home;
  const hrefs = [
    onHome ? "#top" : localePath(lang),
    sectionHref("about", lang, onHome),
    sectionHref("services", lang, onHome),
    sectionHref("reviews", lang, onHome),
    sectionHref("faq", lang, onHome),
    pageHref("blog", lang),
    pageHref("partner", lang),
    pageHref("certificates", lang),
  ];
  const links = hrefs.map((h, i) => ({ h, l: t.links[i] }));
  const socials = [
    { href: LINKS.telegram, Icon: TelegramIcon, l: "Telegram" },
    { href: LINKS.instagram, Icon: InstagramIcon, l: "Instagram" },
    { href: LINKS.youtube, Icon: YoutubeIcon, l: "YouTube" },
  ];
  return (
    <footer className="px-3 pb-24 sm:px-4 lg:pb-4">
      <div className="mx-auto max-w-[1400px] rounded-[32px] bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.6fr_1fr]">
          <div>
            <div className="inline-block rounded-2xl bg-white px-4 py-3"><Logo className="h-9" /></div>
            <p className="mt-6 max-w-[32ch] text-white/70">{t.tagline}</p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, Icon, l }) => (
                <a key={l} href={href} aria-label={l} className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:-translate-y-1 hover:bg-brand-grad hover:text-white">
                  <Icon />
                </a>
              ))}
              <a href={`mailto:${LINKS.email}`} aria-label="Email" className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:-translate-y-1 hover:bg-brand-grad hover:text-white">
                <Mail className="size-5" />
              </a>
            </div>
          </div>
          <nav aria-label={t.nav}>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {links.map((x) => (
                <li key={x.l}><a href={x.h} className="inline-block py-1 text-white/80 transition hover:text-brand">{x.l}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <div className="flex gap-3">
              {[IMAGES.qrAndroid, IMAGES.qrIphone].map((q, i) => (
                <figure key={q} className="text-center text-xs text-white/60">
                  <Image src={q} alt={fill(t.qr, { p: i ? "iPhone" : "Android" })} width={100} height={100} unoptimized className="size-[100px] rounded-xl bg-white p-1.5" />
                  <figcaption className="mt-1.5">{i ? "iPhone" : "Android"}</figcaption>
                </figure>
              ))}
            </div>
            <a href={LINKS.webApp} className="mt-5 flex items-center justify-center gap-2 rounded-full border border-white/30 py-3 font-semibold transition hover:border-brand hover:text-brand">
              <Globe className="size-4" /> {common.onlineApp}
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{fill(t.rights, { year: new Date().getFullYear() })}</p>
          <a href={pageHref("privacy", lang)} className="hover:text-white">{t.privacy}</a>
        </div>
      </div>
    </footer>
  );
}
