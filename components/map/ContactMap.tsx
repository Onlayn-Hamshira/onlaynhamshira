"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { OFFICE, directionsUrl } from "./office";
import type { Dict } from "@/lib/i18n/dictionaries/uz";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

// Faqat haqiqiy foydalanuvchi harakati (Analytics.tsx dagi bilan bir xil): PageSpeed foydalanuvchisiz ham
// siljishsiz "scroll" va soxta "mousemove" (movementX/Y = 0) yuboradi — xarita test paytida yuklanib qolmasin
function isRealInteraction(e: Event) {
  if (!e.isTrusted) return false;
  if (e.type === "scroll") return (window.scrollY || document.documentElement.scrollTop) > 0;
  if (e.type === "mousemove") return (e as MouseEvent).movementX !== 0 || (e as MouseEvent).movementY !== 0;
  return true;
}

/** Xarita bo'limi: kutubxona ekranga yaqinlashganda va foydalanuvchi harakatidan keyin yuklanadi; ustida manzil kartochkasi */
export function ContactMap({ t, address, className = "" }: { t: Dict["map"]; address: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  // Yandex Maps API og'ir (bir necha yuz KB + uchinchi tomon cookie): ekranga yaqin bo'lsa HAM foydalanuvchi
  // sahifa bilan harakat qilgan bo'lsa (teginish/skroll/sichqoncha) yuklanadi. Xarita ekranning tepasida
  // turgan sahifalarda (/contacts) birinchi chizish va interaktivlikni bloklamaydi.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    let interacted = false;
    const evs = ["pointerdown", "touchstart", "keydown", "scroll", "wheel", "mousemove"] as const;
    const tryLoad = () => {
      if (visible && interacted) {
        io.disconnect();
        setLoad(true);
      }
    };
    const onInteract = (e: Event) => {
      if (!isRealInteraction(e)) return;
      interacted = true;
      evs.forEach((e) => removeEventListener(e, onInteract, true));
      tryLoad();
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        tryLoad();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    evs.forEach((e) => addEventListener(e, onInteract, { capture: true, passive: true }));
    return () => {
      io.disconnect();
      evs.forEach((e) => removeEventListener(e, onInteract, true));
    };
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-[#eef1f3] ${className}`}>
      {/* Yuklanguncha yumshoq skelet */}
      <div aria-hidden className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_50%_55%,#e3e8eb,transparent_60%)]" />
      {load && <MapView t={t} address={address} />}

      {/* Manzil kartochkasi */}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex sm:inset-x-auto sm:top-4 sm:left-4">
        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl bg-white/95 p-2.5 pr-3 shadow-[0_14px_34px_-16px_rgb(16_41_58/0.45)] ring-1 ring-line backdrop-blur sm:w-auto sm:max-w-[380px]">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-grad text-white">
            <MapPin className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] leading-tight font-semibold">{OFFICE.name}</p>
            <p className="truncate text-[13px] text-ink-soft">{address}</p>
          </div>
          <a
            href={directionsUrl.yandex}
            target="_blank"
            rel="noopener"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-ink/85"
          >
            <Navigation className="size-3.5" aria-hidden /> {t.directions}
          </a>
        </div>
      </div>
    </div>
  );
}
