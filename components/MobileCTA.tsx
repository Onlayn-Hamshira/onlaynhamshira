"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { LINKS } from "@/lib/data";
import type { Dict } from "@/lib/i18n/dictionaries/uz";

// Alohida fayl: barcha sahifalarda ishlatiladi — bosh sahifaning og'ir Interactive.tsx'ini (karusel, FAQ)
// ichki sahifalarga ergashtirib olib kelmasin
/* ───────── Mobil pastki CTA ───────── */
export function MobileCTA({ t, cta }: { t: Dict["mobileCta"]; cta: string }) {
  // Hero'dagi tugmalarni yopmasligi uchun biroz pastga tushilgach paydo bo'ladi
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-[130%]"
      }`}
    >
      <div className="flex gap-2 rounded-[22px] bg-white/90 p-2 shadow-[0_12px_40px_-12px_rgb(13_47_68/0.4)] ring-1 ring-line backdrop-blur-xl">
        <a href={`tel:${LINKS.phone}`} aria-label={t.call} className="grid size-14 shrink-0 place-items-center rounded-2xl bg-mist">
          <Phone className="size-5" />
        </a>
        <a href={LINKS.telegram} aria-label={t.telegram} className="grid size-14 shrink-0 place-items-center rounded-2xl bg-mist">
          <MessageCircle className="size-5" />
        </a>
        <a href={LINKS.webApp} className="flex min-w-0 flex-1 items-center justify-center rounded-2xl bg-brand-grad px-2 text-center text-[clamp(15px,4.8vw,17px)] leading-tight font-bold text-white">
          {cta}
        </a>
      </div>
    </div>
  );
}
