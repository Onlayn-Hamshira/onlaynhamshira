"use client";

import { useState } from "react";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { LINKS, type Service } from "@/lib/data";
import { formatPrice } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { ServiceGlyph } from "./ServiceGlyph";
import { Icon } from "./Icon";

type QuickItem = Service & { short: string; duration: string };

/** Hero'dagi yagona interaktiv qism — xizmat tanlash kartasi (qolgan Hero server komponent) */
export function HeroBooking({ t, common, items }: { t: Dict["booking"]; common: Dict["common"]; items: QuickItem[] }) {
  const [activeId, setActiveId] = useState(items[1].id);
  const from = <span className="block">{common.fromWord}</span>;
  return (
    <>
          {/* Pastda: kenglik bo'yicha to'liq buyurtma kartasi */}
          <div className="relative flex flex-1">
            <div className="flex flex-1 flex-col rounded-[22px] bg-white p-5 shadow-[0_24px_60px_-20px_rgb(13_47_68/0.45)] sm:p-7">
              <p className="text-[15px] font-semibold sm:text-xl sm:tracking-tight">{t.question}</p>
              <div role="radiogroup" aria-label={t.groupLabel} className="mt-4 grid flex-1 auto-rows-fr gap-2">
                {items.map((s) => {
                  const on = s.id === activeId;
                  return (
                    <button
                      key={s.id}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setActiveId(s.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-2.5 pr-4 text-left transition ${
                        on ? "border-transparent bg-mint/70 ring-2 ring-brand" : "border-line bg-white hover:border-ink/25 hover:bg-mist"
                      }`}
                    >
                      <span className={`grid size-10 shrink-0 place-items-center rounded-xl transition ${on ? "bg-brand-grad text-white" : "bg-mist"}`}>
                        <ServiceGlyph icon={s.icon} size={20} tone={on ? "current" : "brand"} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] leading-tight font-semibold">{s.short}</span>
                        <span className="block truncate text-[13px] text-ink-soft">{s.duration}</span>
                      </span>
                      {/* "50 000 so‘m / dan" — ru/en'da "от / from" narxdan oldin */}
                      <span className="shrink-0 text-right text-[13px] leading-tight text-ink-soft">
                        {common.fromBefore && from}
                        <span className="block text-[15px] font-semibold whitespace-nowrap text-ink tabular-nums">{formatPrice(s.priceFrom, common.money)}</span>
                        {!common.fromBefore && from}
                      </span>
                    </button>
                  );
                })}
              </div>

              <ul className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="clock" size={18} />
                  <span><span className="sr-only">{t.arrivalLabel}</span>{t.arrival}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="wallet" size={18} />
                  <span>{t.payAfter}</span>
                </li>
              </ul>

              <a
                href={LINKS.webApp}
                className="group mt-5 flex items-center justify-center gap-2 rounded-2xl bg-brand-grad text-white py-4 text-[17px] font-bold shadow-[0_12px_28px_-12px_rgb(46_201_176/0.9)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.99]"
              >
                {common.callNurse}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={`tel:${LINKS.phone}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-2xl py-2.5 text-[15px] font-medium whitespace-nowrap text-ink-soft transition hover:text-ink"
              >
                <Phone className="size-4" /> <span className="max-sm:hidden">{t.orCall}</span><span className="sm:hidden">{t.orCallShort}</span> {LINKS.phoneLabel}
              </a>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
                <ShieldCheck className="size-3.5 shrink-0" /> {t.emergency}
              </p>
            </div>
          </div>
    </>
  );
}
