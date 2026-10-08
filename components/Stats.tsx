"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/data";
import { Icon, type IconName } from "./Icon";
import { formatNum } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";

const ICONS: IconName[] = ["nurse", "check2", "people", "pin"];

function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Counter({ to, run, sep }: { to: number; run: boolean; sep: string }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to]);
  // 11 400 (bo'linmaydigan probel) yoki en: 11,400
  return <>{formatNum(n, sep)}</>;
}

/** Mustaqil hisoblagich (blog hero va h.k.): ko'ringanda 0 dan sanaydi; SSR'da va JS'siz yakuniy qiymat turadi */
export function CountUp({ to, sep }: { to: number; sep: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  return <span ref={ref}><Counter to={to} run={seen} sep={sep} /></span>;
}

export default function Stats({ t, sep }: { t: Dict["stats"]; sep: string }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const tones = ["bg-aqua", "bg-sky", "bg-madang", "bg-mint"];
  return (
    <section aria-label={t.label} className="px-3 pt-3 sm:px-4">
      <div ref={ref} className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={i}
            data-reveal
            style={{ "--d": i } as React.CSSProperties}
            className={`${tones[i]} lift relative overflow-hidden rounded-[28px] px-4 py-6 min-[400px]:px-5 sm:px-8 sm:py-9`}
          >
            <Icon name={ICONS[i]} size={44} tone="tile" className="mb-3 size-10! sm:absolute sm:top-5 sm:right-5 sm:mb-0 sm:size-11!" />
            <p data-oh-stat={i} className="text-[clamp(24px,7.8vw,36px)] leading-none font-bold tracking-[-0.03em] whitespace-nowrap tabular-nums sm:text-[56px]">
              <Counter to={s.value} run={seen} sep={sep} />
              {s.suffix}
            </p>
            <p className="mt-3 text-[14px] leading-snug text-ink-soft hyphens-auto [overflow-wrap:anywhere] min-[400px]:text-[15px] sm:text-lg">{t.items[i]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
