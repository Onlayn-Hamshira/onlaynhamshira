"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Globe, X } from "lucide-react";
import { IMAGES, LINKS } from "@/lib/data";
import { AppleIcon, PlayIcon } from "./StoreIcons";
import { setScrollLock } from "./Motion";
import { fill } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { editableImage } from "@/lib/edit/edits";

type T = Dict["download"] & { close: string; onlineApp: string };

type Platform = "ios" | "android" | "desktop";
type Store = "android" | "ios";
type Ctx = { open: (store?: Store) => void; platform: Platform; t: Pick<T, "googlePlay" | "appStore"> };

const DownloadCtx = createContext<Ctx>({ open: () => {}, platform: "desktop", t: { googlePlay: "Google Play", appStore: "App Store" } });
export const useDownload = () => useContext(DownloadCtx);

function detect(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  // iPadOS o'zini Mac deb ko'rsatadi — sensor orqali ajratamiz
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return "desktop";
}

export function DownloadProvider({ t, children }: { t: T; children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>("desktop");
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => setPlatform(detect()), []);

  const open = useCallback((store?: Store) => {
    // Telefonda QR ko'rsatish befoyda — bosilgan tugmaning do'koniga yuboramiz
    const p = detect();
    if (p !== "desktop") {
      window.location.href = (store ?? p) === "ios" ? LINKS.appStore : LINKS.playStore;
      return;
    }
    lastFocus.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    setScrollLock(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLock(false);
    };
  }, [isOpen, close]);

  return (
    <DownloadCtx.Provider value={{ open, platform, t }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] grid animate-[pop_.25s_ease-out_both] place-items-center bg-ink/40 p-4 backdrop-blur-md"
          data-lenis-prevent
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dl-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[560px] animate-pop overflow-hidden rounded-[28px] bg-mint p-8 shadow-2xl sm:p-10"
          >
            <div className="dots pointer-events-none absolute inset-0" />
            <button
              ref={closeRef}
              onClick={close}
              aria-label={t.close}
              className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/70 text-ink transition hover:bg-white"
            >
              <X className="size-5" />
            </button>
            <h2 id="dl-title" className="relative text-center text-2xl font-semibold text-balance sm:text-[28px]">
              {t.title}
            </h2>
            <div className="relative mt-7 grid grid-cols-2 gap-4">
              {[
                { src: IMAGES.qrIphone, label: "iPhone", Icon: AppleIcon, href: LINKS.appStore },
                { src: IMAGES.qrAndroid, label: "Android", Icon: PlayIcon, href: LINKS.playStore },
              ].map(({ src, label, Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener" className="rounded-2xl bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
                  {/* 1-bitli PNG (~5KB) — qayta kodlash faqat buzadi */}
                  <Image src={src} alt={fill(t.qrFor, { p: label })} width={240} height={240} unoptimized className="aspect-square w-full" />
                  <span className="mt-2 flex items-center justify-center gap-1.5 text-sm font-medium">
                    <Icon className="size-4" /> {label}
                  </span>
                </a>
              ))}
            </div>
            <a
              href={LINKS.webApp}
              className="relative mt-6 flex items-center justify-center gap-3 rounded-full border-2 border-ink/80 bg-white/40 px-6 py-3.5 font-semibold transition hover:bg-white"
            >
              <Globe className="size-5" /> {t.onlineApp}
            </a>
            <p className="relative mt-3 text-center text-ink-soft">
              {t.note}
            </p>
          </div>
        </div>
      )}
    </DownloadCtx.Provider>
  );
}

/** Platformaga mos rasmiy do'kon badge'lari */
export function StoreButtons({ className = "" }: { className?: string }) {
  const { open, platform, t } = useDownload();
  const buttons = [
    { key: "android", src: editableImage("/badges/google-play-black.png"), w: 600, h: 178, label: t.googlePlay },
    { key: "ios", src: editableImage("/badges/app-store.png"), w: 600, h: 209, label: t.appStore },
  ];
  // Foydalanuvchi qurilmasiga mos tugma birinchi turadi
  if (platform === "ios") buttons.reverse();
  return (
    <div className={`flex flex-wrap gap-2.5 sm:gap-3 ${className}`}>
      {buttons.map(({ key, src, w, h, label }) => (
        <button
          key={key}
          onClick={() => open(key as Store)}
          aria-label={label}
          className="rounded-[12px] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgb(13_47_68/0.5)] active:translate-y-0 active:scale-[0.98]"
        >
          {/* Ekranda ~150–180px — 600px lik asl nusxa yuklanmasin */}
          <Image src={src} alt="" width={w} height={h} sizes="(min-width: 640px) 180px, 150px" className="h-11 w-auto sm:h-[52px]" draggable={false} />
        </button>
      ))}
    </div>
  );
}
