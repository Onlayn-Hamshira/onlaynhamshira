"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppPhoneDemo } from "./app-demo/AppPhoneDemo";
import { editableImage } from "@/lib/edit/edits";

// Quti o'lchami (poster bilan bir xil — telefon qiyshiq, fon shaffof)
const W = 386;
const H = 612;
const POSTER = editableImage("/img/app/phone-poster-v3.webp"); // 20KB

/**
 * Ilova animatsiyasi (20 soniya) — HTML/CSS bilan chizilgan telefon (video/GIF emas):
 *  1) SSR/boshlang'ich — statik poster (LCP, JS'siz holat)
 *  2) bo'lim ekranga yaqinlashganda — kodli demo yuklanadi, rasmlari tayyor bo'lgach poster yashirinadi
 *  3) ekranda bo'lgandagina o'ynaydi; prefers-reduced-motion'da statik bosh sahifa
 *
 * priority — birinchi ekranda (LCP): poster darhol, yuqori ustuvorlik bilan yuklanadi.
 * deferVideo — demo foydalanuvchining birinchi harakatidan keyin (scroll/bosish/klaviatura) boshlanadi:
 * birinchi ekranda sahifa yuklanishi paytida asosiy oqim band bo'lmasin.
 */
export function AppPhone({ alt, className = "", priority = false, deferVideo = false }: { alt: string; className?: string; priority?: boolean; deferVideo?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false); // demo'ni qo'shish
  const [ready, setReady] = useState(false); // demo rasmlari tayyor → poster yashirinadi
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [k, setK] = useState(0); // quti kengligi / 386

  // Yuklash: ekranga yaqinlashganda yoki (deferVideo) birinchi harakatda
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (deferVideo) {
      const evs = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
      const go = () => { setLoad(true); evs.forEach((e) => window.removeEventListener(e, go)); };
      evs.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
      return () => evs.forEach((e) => window.removeEventListener(e, go));
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setLoad(true);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [deferVideo]);

  // Faqat ekranda bo'lganda o'ynaydi
  useEffect(() => {
    const el = wrap.current;
    if (!el || !load) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [load]);

  // Telefon 386px kenglikda chiziladi va quti kengligiga masshtablanadi
  useEffect(() => {
    const el = wrap.current;
    if (!el || !load) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, [load]);

  const onReady = useCallback(() => setReady(true), []);
  const shown = ready && k > 0;

  return (
    <div ref={wrap} className={`relative ${className}`} style={{ aspectRatio: `${W} / ${H}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- 20KB poster, demo tayyor bo'lguncha */}
      <img
        src={POSTER}
        alt={alt}
        width={W}
        height={H}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`absolute inset-0 size-full transition-opacity duration-300 ${shown ? "opacity-0" : ""}`}
      />
      {load && (
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${shown ? "" : "opacity-0"}`}
          style={{ "--k": k } as React.CSSProperties}
        >
          <AppPhoneDemo play={shown && visible && !reduced} onReady={onReady} />
        </div>
      )}
    </div>
  );
}
