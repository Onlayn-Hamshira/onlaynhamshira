"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Modal / menyu ochilganda sahifa scrollini to'xtatish */
export function setScrollLock(locked: boolean) {
  document.body.style.overflow = locked ? "hidden" : "";
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Scroll paytida paydo bo'lish animatsiyalari + skroll progressi */
export function SmoothScroll() {
  useEffect(() => {
    // Lenis (JS smooth scroll) ataylab ishlatilmaydi: u sahifani kasr piksellarga surib, skroll paytida
    // matnni "surtilgan"/xira ko'rsatardi. Brauzerning tabiiy skrolli butun piksellarda ishlaydi;
    // anchor'lar uchun silliqlik va header ofseti CSS'da (scroll-behavior, scroll-padding-top).

    // [data-reveal] elementlari ko'rinish maydoniga kirganda animatsiya bilan chiqadi
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const scan = () =>
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    // Filtrlashdan keyin yangi paydo bo'lgan kartalar uchun ham.
    // Sahifada DOM tez-tez o'zgaradi (animatsiyali sahnalar) — faqat element qo'shilganda
    // va kadrga bir marta skanerlaymiz.
    let pending = 0;
    const mo = new MutationObserver((list) => {
      if (pending || !list.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1))) return;
      pending = requestAnimationFrame(() => { pending = 0; scan(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const untrack = trackScrollProgress();

    return () => {
      untrack();
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(pending);
    };
  }, []);

  return null;
}

// Hujjat balandligi ResizeObserver orqali keshlanadi: u layout tugagach chaqiriladi.
// scrollHeight'ni to'g'ridan-to'g'ri o'qish (ayniqsa hydration paytida) butun sahifani majburiy
// qayta hisoblatardi — Lighthouse "Forced reflow" ~1.5s. Skroll paytida faqat scrollY o'qiladi.
let docHeight = 0;
let heightObserver: ResizeObserver | null = null;
const heightListeners = new Set<() => void>();
function watchDocHeight(cb: () => void) {
  if (!heightObserver) {
    heightObserver = new ResizeObserver(([e]) => {
      docHeight = e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height;
      heightListeners.forEach((f) => f());
    });
    heightObserver.observe(document.documentElement);
  }
  heightListeners.add(cb);
  return () => { heightListeners.delete(cb); };
}
const scrollMax = () => docHeight - window.innerHeight;

/**
 * Sahifa bo'ylab scroll progress (0..1) → [data-scroll-p] elementlardagi --scroll-p CSS o'zgaruvchisi.
 * React state emas: progress chizig'i/halqasi CSS orqali yangilanadi, komponentlar
 * har skroll kadrida qayta render bo'lmaydi. Bir marta (SmoothScroll ichida) ulanadi.
 * :root'ga yozilmaydi: meros o'tadigan o'zgaruvchi har kadrda butun sahifa (2000+ element) stilini
 * qayta hisoblatardi va keyingi scrollY o'qishi ~450ms forced reflow berardi (PageSpeed).
 */
function trackScrollProgress() {
  let raf = 0;
  let last = "";
  const update = () => {
    raf = 0;
    const max = scrollMax();
    const p = String(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    if (p === last) return;
    last = p;
    document.querySelectorAll<HTMLElement>("[data-scroll-p]").forEach((el) => el.style.setProperty("--scroll-p", p));
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  // Birinchi o'lchov ResizeObserver'dan (layout tayyor bo'lgach) — majburiy reflow yo'q
  const unwatch = watchDocHeight(onScroll);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    unwatch();
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

/** Qaysi bo'lim hozir ekranda ekanini aniqlaydi (header navigatsiyasi uchun) */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    const els = key.split(",").map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
  return active;
}

/** Faqat chegaradan o'tganda qayta render bo'ladi (har skroll kadrida emas) */
function useScrolledPast(ratio: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = scrollMax();
      setPast(max > 0 && window.scrollY / max > ratio);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const unwatch = watchDocHeight(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { unwatch(); cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); };
  }, [ratio]);
  return past;
}

export function BackToTop({ label }: { label: string }) {
  const show = useScrolledPast(0.15);
  const R = 22;
  const C = 2 * Math.PI * R;
  return (
    <button
      data-scroll-p
      onClick={scrollToTop}
      aria-label={label}
      tabIndex={show ? 0 : -1}
      className={`fixed right-5 bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-white shadow-[0_12px_32px_-12px_rgb(13_47_68/0.45)] ring-1 ring-line transition duration-300 hover:-translate-y-1 lg:grid ${
        show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={R} fill="none" stroke="var(--color-mint)" strokeWidth="3" />
        <circle
          cx="24" cy="24" r={R} fill="none" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={C} style={{ strokeDashoffset: `calc(${C}px * (1 - var(--scroll-p, 0)))` }}
        />
      </svg>
      <ArrowUp className="relative size-5" />
    </button>
  );
}
