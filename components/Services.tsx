"use client";

import { useState } from "react";
import { ArrowRight, Check, Clock3, Plus } from "lucide-react";
import { LINKS, SERVICES } from "@/lib/data";
import { fill, formatPrice } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { SectionHead } from "./Sections";
import { ServiceGlyph } from "./ServiceGlyph";

export default function Services({ t, common }: { t: Dict["services"]; common: Dict["common"] }) {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const active = SERVICES.find((s) => s.id === activeId)!;
  const at = t.items[active.id];
  const price = (n: number) => formatPrice(n, common.money);
  const priceFrom = (n: number) => fill(common.priceFrom, { p: price(n) });
  // Ikki qatorli ko'rinish: narx + kichik "dan" (ru/en: "от/from" oldinda)
  const fromWord = <span className="text-sm text-ink-soft">{common.fromWord}</span>;

  return (
    <section id="prices" aria-labelledby="svc-h" className="py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <SectionHead
          id="svc-h"
          label={t.label}
          title={t.title}
          text={t.text}
        />

        <div data-reveal className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[1.35fr_1fr]">
          {/* Ro'yxat */}
          <ul className="divide-y divide-line overflow-hidden rounded-[24px] border border-line sm:rounded-[28px]">
            {SERVICES.map((s) => {
              const on = s.id === activeId;
              const it = t.items[s.id];
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setActiveId(s.id)}
                    aria-expanded={on}
                    aria-controls={`svc-${s.id}`}
                    className={`group flex w-full items-center gap-3 px-4 py-3.5 text-left transition sm:gap-4 sm:px-7 sm:py-4 ${on ? "bg-mint" : "hover:bg-mist"}`}
                  >
                    <span className={`grid size-11 shrink-0 place-items-center rounded-xl transition sm:size-14 sm:rounded-2xl ${on ? "bg-white shadow-sm" : "bg-mist group-hover:bg-white"}`}>
                      <ServiceGlyph icon={s.icon} size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] leading-snug font-medium sm:text-[17px]">{it.title}</span>
                      {/* Mobilda narx sarlavha ostida (o'ng ustun faqat sm+) */}
                      <span className={`mt-0.5 text-[13px] text-ink-soft tabular-nums sm:hidden ${on ? "hidden" : "block"}`}>
                        {common.fromBefore && `${common.fromWord} `}
                        <span className="font-semibold text-ink">{price(s.priceFrom)}</span>
                        {!common.fromBefore && common.fromWord}
                      </span>
                    </span>
                    <span className="hidden shrink-0 text-right sm:block">
                      {common.fromBefore && fromWord}
                      <span className="block font-semibold whitespace-nowrap tabular-nums">{price(s.priceFrom)}</span>
                      {!common.fromBefore && fromWord}
                    </span>
                    <Plus className={`size-5 shrink-0 text-ink-soft transition lg:hidden ${on ? "rotate-45" : ""}`} aria-hidden />
                  </button>
                  {/* Mobil: tafsilot ro'yxat ichida */}
                  <div id={`svc-${s.id}`} hidden={!on} className="animate-pop bg-mint px-5 pb-6 sm:px-7 lg:hidden">
                    <p className="leading-relaxed text-ink-soft">{it.description}</p>
                    <p className="mt-3 font-semibold tabular-nums">{priceFrom(s.priceFrom)}</p>
                    <a href={LINKS.webApp} className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-brand-grad text-white py-3.5 font-semibold">
                      {common.order} <ArrowRight className="size-5" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Tafsilot paneli (desktop) */}
          <aside aria-live="polite" className="hidden lg:block">
            <div key={active.id} className="sticky top-28 animate-pop overflow-hidden rounded-[28px] bg-brand-grad-deep p-9 text-white">
              <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/20 blur-3xl" />
              <span className="relative grid size-20 place-items-center rounded-3xl bg-white/20 ring-1 ring-white/30">
                <ServiceGlyph icon={active.icon} size={40} tone="current" className="animate-float text-white" />
              </span>
              <h3 className="relative mt-7 text-[28px] leading-tight font-semibold tracking-tight text-balance">{at.title}</h3>
              <p className="mt-4 leading-relaxed text-white/90">{at.description}</p>
              <div className="mt-8 flex items-end justify-between border-t border-white/30 pt-6">
                <div>
                  <p className="text-sm text-white/85">{t.price}</p>
                  <p className="mt-1 text-3xl font-bold tabular-nums">
                    {common.fromBefore && <span className="mr-1.5 text-lg font-medium text-white/85">{common.fromWord}</span>}
                    {price(active.priceFrom)}
                    {!common.fromBefore && <span className="text-lg font-medium text-white/85">{common.fromWord}</span>}
                  </p>
                </div>
                <p className="flex items-center gap-1.5 text-sm text-white/90"><Clock3 className="size-4" /> {at.duration}</p>
              </div>
              <ul className="mt-6 space-y-2 text-[15px] text-white/95">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-white" /> {p}</li>
                ))}
              </ul>
              <a href={LINKS.webApp} className="group mt-8 flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-[17px] font-bold text-ink shadow-[0_14px_30px_-16px_rgb(13_47_68/0.5)] transition hover:-translate-y-0.5">
                {common.order} <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </aside>
        </div>
        <p className="mt-6 max-w-[70ch] text-sm text-ink-soft">
          {t.note}
        </p>
      </div>
    </section>
  );
}
