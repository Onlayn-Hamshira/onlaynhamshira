import { ArrowUpRight } from "lucide-react";
import { formatDate, type BlogEntry } from "@/lib/blog-shared";
import { fill } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { Cover } from "./Cover";

export type CardT = Pick<Dict["blog"], "minutes" | "read" | "topics" | "byline">;

/** Butun karta bitta havola: ekran o'quvchi sarlavhani o'qiydi, qolgani qo'shimcha ma'lumot */
export function BlogCard({ e, t, priority }: { e: BlogEntry; t: CardT; priority?: boolean }) {
  return (
    <a
      href={e.href}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-line transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(13_47_68/0.35)] hover:ring-transparent focus-visible:ring-3 focus-visible:ring-brand-teal"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <Cover
          img={e.cover}
          topic={e.topic}
          priority={priority}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, calc(100vw - 32px)"
          className="transition duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[13px] font-semibold text-ink shadow-sm backdrop-blur">
          {t.topics[e.topic]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex flex-wrap items-center gap-x-2 text-[13px] text-ink-soft">
          {e.updated && <time dateTime={e.updated}>{formatDate(e.updated, e.lang)}</time>}
          {e.updated && <span aria-hidden className="size-1 rounded-full bg-ink-soft/50" />}
          <span>{fill(t.minutes, { n: e.minutes })}</span>
        </p>
        <h3 className="mt-2 line-clamp-3 text-lg leading-snug font-semibold tracking-tight text-balance">{e.title}</h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-soft">{e.excerpt}</p>
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
            <span className="flex min-w-0 items-center gap-2 font-medium">
              <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-mint">
                {/* eslint-disable-next-line @next/next/no-img-element -- kichik SVG logo */}
                <img src="/img/map-pin.svg" alt="" width={34} height={42} className="h-4 w-auto" />
              </span>
              <span className="truncate">{t.byline}</span>
            </span>
            <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-mint text-brand-deep transition group-hover:rotate-45 group-hover:bg-brand-grad group-hover:text-white">
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
