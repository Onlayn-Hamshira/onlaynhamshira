import Link from "next/link";
import ns from "./News.module.css";
import { NewsCarousel } from "./NewsCarousel";
import { NewsCard, type NewsPost } from "./NewsCard";
import { ArrowRight as NewsArrowRight } from "./icons";
import type { BlogEntry } from "@/lib/blog-shared";
import type { Dict } from "@/lib/i18n/dictionaries/uz";
import { type Locale } from "@/lib/i18n/config";
import { pageHref } from "@/lib/nav";
import { SectionHead } from "../Sections";

/* ───────── Yangiliklar ───────── */
// Shundan ko'p yangilik bo'lsa karusel, aks holda oddiy to'r (JS'siz)
const NEWS_CAROUSEL_FROM = 4;

export function News({ t, topics, entries, lang }: { t: Dict["news"]; topics: Dict["blog"]["topics"]; entries: BlogEntry[]; lang: Locale }) {
  const blog = pageHref("blog", lang);
  // Yagona manba — blog: kartalar blog sahifasidagi maqolalar (o'sha tartibda, lib/blog → homeNewsEntries),
  // har biri o'z maqolasiga olib boradi. Ma'lumot server sahifasida olinadi (Sections client bundle'ga ham tushadi).
  const posts: NewsPost[] = entries.map((e) => ({
    title: e.title,
    excerpt: e.excerpt,
    image: e.cover!.src,
    href: e.href,
    category: topics[e.topic],
  }));
  const labels = { more: t.more, readMore: t.readMore };
  if (!posts.length) return null;

  return (
    <section aria-labelledby="news-h" className={ns.section}>
      <div className={ns.container}>
        <SectionHead
          id="news-h"
          label={t.label}
          title={t.title}
          text={t.text}
        />

        {posts.length >= NEWS_CAROUSEL_FROM ? (
          <NewsCarousel posts={posts} t={{ ...labels, carousel: t.carousel, prev: t.prev, next: t.next, page: t.page }} />
        ) : (
          <div className={ns.grid} style={{ "--n": posts.length } as React.CSSProperties}>
            {posts.map((p) => <NewsCard key={p.title} post={p} t={labels} />)}
          </div>
        )}

        <Link href={blog} className={ns.allLink}>
          {t.all}
          <span className={ns.allLinkIcon}><NewsArrowRight /></span>
        </Link>
      </div>
    </section>
  );
}
