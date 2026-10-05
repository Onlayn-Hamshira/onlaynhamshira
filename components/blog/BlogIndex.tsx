"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { BLOG_TOPICS, formatDate, type BlogEntry, type BlogTopic } from "@/lib/blog-shared";
import { fill } from "@/lib/i18n/format";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { BlogCard } from "./BlogCard";
import { Cover } from "./Cover";

type T = Pick<Dict["blog"], "minutes" | "read" | "topics" | "featured" | "filterLabel" | "all" | "allPosts" | "byline">;

/**
 * Mavzu filtri + kartalar. Barcha kartalar serverda HTML'ga render bo'ladi (havolalar qidiruv tizimiga ko'rinadi),
 * filtr faqat ko'rinishni o'zgartiradi.
 */
export function BlogIndex({ entries, t }: { entries: BlogEntry[]; t: T }) {
  const [topic, setTopic] = useState<BlogTopic | "all">("all");
  const counts = useMemo(() => {
    const c = new Map<BlogTopic, number>();
    for (const e of entries) c.set(e.topic, (c.get(e.topic) ?? 0) + 1);
    return c;
  }, [entries]);
  const topics = BLOG_TOPICS.filter((k) => counts.get(k));
  const list = topic === "all" ? entries : entries.filter((e) => e.topic === topic);
  const [featured, ...rest] = list;
  const showFeatured = topic === "all" && featured;

  return (
    <>
      {showFeatured && <Featured e={featured} t={t} />}

      <div role="group" aria-label={t.filterLabel} className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {(["all", ...topics] as const).map((k) => {
          const on = k === topic;
          return (
            <button
              key={k}
              type="button"
              aria-pressed={on}
              onClick={() => setTopic(k)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-[15px] font-medium transition ${
                on ? "bg-brand-grad text-white shadow-[0_10px_22px_-12px_rgb(46_201_176/0.9)]" : "bg-white ring-1 ring-line hover:-translate-y-0.5 hover:ring-ink/20"
              }`}
            >
              {k === "all" ? t.all : t.topics[k]}
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs tabular-nums ${on ? "bg-white/15" : "bg-mist"}`}>
                {k === "all" ? entries.length : counts.get(k)}
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="sr-only" aria-live="polite">
        {topic === "all" ? t.allPosts : t.topics[topic]}
      </h2>
      <ul key={topic} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {(showFeatured ? rest : list).map((e, i) => (
          <li key={e.href} className="animate-pop" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
            <BlogCard e={e} t={t} />
          </li>
        ))}
      </ul>
    </>
  );
}

/** Birinchi maqola — katta gorizontal karta (sahifaning LCP rasmi) */
function Featured({ e, t }: { e: BlogEntry; t: T }) {
  return (
    <a
      href={e.href}
      className="group mt-8 grid overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#fff_0%,var(--color-mist)_55%,#d3f0fb_100%)] ring-1 ring-line transition duration-300 hover:shadow-[0_30px_60px_-30px_rgb(13_47_68/0.45)] focus-visible:ring-3 focus-visible:ring-brand-teal sm:mt-10 lg:grid-cols-[1.25fr_1fr]"
    >
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[400px]">
        <Cover
          img={e.cover}
          topic={e.topic}
          priority
          sizes="(min-width: 1024px) 720px, calc(100vw - 32px)"
          className="absolute inset-0 transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="relative flex flex-col p-6 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-brand/25 blur-3xl" />
        <p className="relative flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-brand-grad px-3 py-1 font-semibold text-white">{t.featured}</span>
          <span className="rounded-full bg-white px-3 py-1 font-medium ring-1 ring-line">{t.topics[e.topic]}</span>
        </p>
        <h2 className="relative mt-5 text-[clamp(24px,6vw,34px)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">{e.title}</h2>
        <p className="relative mt-4 line-clamp-4 leading-relaxed text-ink-soft">{e.excerpt}</p>
        <div className="relative mt-auto flex items-center justify-between gap-4 pt-8">
          <span className="flex flex-col gap-1 text-sm text-ink-soft">
            <span className="font-medium text-ink">{t.byline}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-4" aria-hidden />
              {e.updated && <time dateTime={e.updated}>{formatDate(e.updated, e.lang)} ·</time>} {fill(t.minutes, { n: e.minutes })}
            </span>
          </span>
          <span aria-hidden className="inline-flex items-center gap-2 rounded-full bg-brand-grad px-5 py-2.5 font-semibold text-white transition group-hover:brightness-105">
            {t.read} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </a>
  );
}
