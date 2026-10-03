"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { LINKS } from "@/lib/data";
import { NAV_MORE, NAV_PRIMARY, isSection, navHref, type NavKey, type SectionKey } from "@/lib/nav";
import type { Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { LangSwitch } from "./LangSwitch";
import { Logo, InstagramIcon, TelegramIcon, YoutubeIcon } from "./StoreIcons";
import { StoreButtons } from "./DownloadModal";
import { setScrollLock, useActiveSection } from "./Motion";

const SECTION_IDS: SectionKey[] = ["about", "services", "specialists", "reviews", "faq"];

type Item = { key: NavKey; href: string; label: string };

/**
 * home — ichki sahifalarda bosh sahifa manzili (bo'lim havolalari "/ru#faq" ko'rinishida bosh sahifaga olib boradi).
 * current — ichki sahifa qaysi bo'limga tegishli (masalan blog maqolasi → "blog"), header'da faol ko'rinadi.
 */
export default function Header({
  lang,
  t,
  common,
  home,
  current,
  alternates,
}: {
  lang: Locale;
  t: Dict["header"];
  common: Dict["common"];
  home?: string;
  current?: NavKey;
  /** Sahifaning boshqa tillardagi manzillari (til almashtirgich uchun) */
  alternates?: Record<Locale, string>;
}) {
  const onHome = !home;
  const labels: Record<NavKey, string> = {
    about: t.nav[0],
    services: t.nav[1],
    specialists: t.nav[2],
    reviews: t.nav[3],
    faq: t.nav[4],
    blog: t.blog,
    partner: t.partnerShort,
    why: t.whyShort,
    certificates: t.certificates,
    contacts: t.contacts,
    privacy: "",
  };
  const item = (key: NavKey): Item => ({ key, href: navHref(key, lang, onHome), label: labels[key] });
  const primary = NAV_PRIMARY.map(item);
  const more = NAV_MORE.map(item);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const activeSection = useActiveSection(onHome ? SECTION_IDS : []);
  // Bosh sahifada — ekrandagi bo'lim, ichki sahifada — sahifa bo'limi
  const active: NavKey | null = onHome ? (activeSection as NavKey | null) : (current ?? null);
  const isOn = (k: NavKey) => active === k;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setScrollLock(menu);
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-all duration-300 ${
          scrolled ? "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-6 px-4 sm:px-6 lg:gap-3 xl:gap-6">
          <a href={home ?? "#top"} aria-label={t.homeLabel} className="shrink-0">
            <Logo className="h-9 sm:h-10" />
          </a>

          <nav aria-label={t.mainNav} className="ml-2 hidden lg:block xl:ml-4">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {primary.map((n) => (
                <li key={n.key}>
                  <NavLink item={n} on={isOn(n.key)} section={isSection(n.key)} />
                </li>
              ))}
              <li>
                <MoreMenu label={t.more} items={more} isOn={isOn} />
              </li>
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <LangSwitch lang={lang} label={common.languages} hrefs={alternates} />
            <a
              href={`tel:${LINKS.phone}`}
              className="hidden items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold whitespace-nowrap transition hover:bg-mist md:inline-flex lg:hidden xl:inline-flex"
            >
              <Phone className="size-4 text-brand-deep" /> {LINKS.phoneLabel}
            </a>
            <a
              href={LINKS.webApp}
              className="hidden rounded-full bg-brand-grad text-white px-5 py-2.5 text-[15px] font-semibold whitespace-nowrap shadow-[0_8px_20px_-10px_rgb(56_197_177/0.9)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 sm:inline-flex"
            >
              {common.callNurse}
            </a>
            <button
              onClick={() => setMenu(true)}
              aria-label={t.openMenu}
              aria-expanded={menu}
              className="grid size-11 place-items-center rounded-full border border-line bg-white transition hover:border-brand lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
        {/* Scroll progress */}
        <div
          aria-hidden
          data-scroll-p
          className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-gradient-to-r from-brand via-brand-teal to-brand-blue transition-opacity ${scrolled ? "opacity-100" : "opacity-0"}`}
          style={{ transform: "scaleX(var(--scroll-p, 0))" }}
        />
      </header>

      {/* Mobil menyu */}
      <div
        // Yopiq menyu invisible: ekrandan tashqaridagi rasmlari LCP nomzodi bo'lmaydi; visibility yopilish animatsiyasi tugagach o'chadi
        className={`fixed inset-0 z-[60] transition-[visibility] duration-300 lg:hidden ${menu ? "visible" : "pointer-events-none invisible"}`}
        aria-hidden={!menu}
        inert={!menu}
      >
        <div
          onClick={() => setMenu(false)}
          className={`absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity ${menu ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute top-0 right-0 flex h-full w-[min(92vw,400px)] flex-col overflow-y-auto overscroll-contain bg-white p-6 pt-[calc(env(safe-area-inset-top)+24px)] shadow-2xl transition-transform duration-300 ${
            menu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo className="h-9" />
            <button onClick={() => setMenu(false)} aria-label={t.closeMenu} className="grid size-11 place-items-center rounded-full bg-mist">
              <X className="size-5" />
            </button>
          </div>
          <nav className="mt-8" aria-label={t.mobileNav}>
            <ul className="space-y-1">
              {/* Mobilda faqat sahifa havolalari — bosh sahifa bo'limlariga skroll (NAV_MORE) kerak emas */}
              {primary.map((n) => (
                <li key={n.key}>
                  <a
                    href={n.href}
                    onClick={() => setMenu(false)}
                    tabIndex={menu ? 0 : -1}
                    aria-current={isOn(n.key) ? (isSection(n.key) ? "location" : "page") : undefined}
                    className={`block rounded-xl px-3 py-3 text-lg font-medium transition hover:bg-mist ${isOn(n.key) ? "bg-mint text-ink" : ""}`}
                  >
                    {n.key === "partner" ? t.partner : n.key === "why" ? t.why : n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-3">
            <a href={LINKS.webApp} tabIndex={menu ? 0 : -1} className="flex justify-center rounded-2xl bg-brand-grad text-white py-4 font-semibold">
              {common.callNurseOnline}
            </a>
            <a href={`tel:${LINKS.phone}`} tabIndex={menu ? 0 : -1} className="flex items-center justify-center gap-2 rounded-2xl border border-line py-4 font-semibold">
              <Phone className="size-4" /> {LINKS.phoneLabel}
            </a>
            <StoreButtons className="justify-center" />
            <div className="flex justify-center gap-3 pt-2">
              {[
                { href: LINKS.telegram, Icon: TelegramIcon, l: "Telegram" },
                { href: LINKS.instagram, Icon: InstagramIcon, l: "Instagram" },
                { href: LINKS.youtube, Icon: YoutubeIcon, l: "YouTube" },
              ].map(({ href, Icon, l }) => (
                <a key={l} href={href} aria-label={l} tabIndex={menu ? 0 : -1} className="grid size-11 place-items-center rounded-full bg-mint text-brand-deep">
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

const linkCls = (on: boolean) =>
  // 1024–1279px: ruscha nomlar uzunroq — punktlar ixchamroq, aks holda header sig'maydi
  `relative block rounded-full px-2 py-2 text-[14px] whitespace-nowrap transition xl:px-3.5 xl:text-[15px] ${
    on ? "bg-mint font-medium text-ink" : "text-ink-soft hover:bg-mist hover:text-ink"
  }`;

function NavLink({ item, on, section }: { item: Item; on: boolean; section: boolean }) {
  return (
    <a href={item.href} aria-current={on ? (section ? "location" : "page") : undefined} className={linkCls(on)}>
      {item.label}
    </a>
  );
}

/** "Yana" — ochiladigan ro'yxat: bosish/hover bilan ochiladi, Escape va tashqariga bosish yopadi */
function MoreMenu({ label, items, isOn }: { label: string; items: Item[]; isOn: (k: NavKey) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  // Sichqoncha kelganda hover ochadi; o'sha zahoti bosilsa yopilib qolmasin (bosish faqat ochiq qoldiradi)
  const hoverOpened = useRef(false);
  const id = useId();
  const anyOn = items.some((i) => isOn(i.key));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      btn.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      // Hover faqat sichqonchada (sensorli ekranda bosish bilan ochiladi)
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse" || open) return;
        hoverOpened.current = true;
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        hoverOpened.current = false;
        setOpen(false);
      }}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          if (hoverOpened.current) hoverOpened.current = false;
          else setOpen((o) => !o);
        }}
        className={`${linkCls(anyOn)} inline-flex items-center gap-1`}
      >
        {label}
        <ChevronDown aria-hidden className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {/* pt-2 — tugma va ro'yxat orasidagi "ko'prik": sichqoncha o'tayotganda yopilib qolmasin */}
      <div id={id} hidden={!open} className="absolute top-full left-0 z-10 pt-2">
        <ul className="min-w-[240px] rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-16px_rgb(16_41_58/0.35)] ring-1 ring-line">
          {items.map((n) => {
            const on = isOn(n.key);
            return (
              <li key={n.key}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={on ? (isSection(n.key) ? "location" : "page") : undefined}
                  className={`block rounded-xl px-3.5 py-2.5 text-[15px] transition ${on ? "bg-mint font-medium text-ink" : "text-ink-soft hover:bg-mist hover:text-ink"}`}
                >
                  {n.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
