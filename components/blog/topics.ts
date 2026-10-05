import type { BlogTopic } from "@/lib/blog-shared";
import type { IconName } from "../Icon";

/** Mavzu ko'rinishi: kartochka foni (rasmsiz maqolalar uchun) va ikonka — sayt palitrasidan */
export const TOPIC_STYLE: Record<BlogTopic, { icon: IconName; tone: string; grad: string }> = {
  nurse: { icon: "nurse", tone: "bg-sky", grad: "from-[#4ccaf8] to-[#008fd1]" },
  care: { icon: "bed", tone: "bg-madang", grad: "from-[#2f8fb8] to-[#174f70]" },
  family: { icon: "massage", tone: "bg-aqua", grad: "from-[#40d9c1] to-[#12a08e]" },
  pressure: { icon: "heart", tone: "bg-sky", grad: "from-[#00b6f3] to-[#0a70a8]" },
  prevention: { icon: "shield", tone: "bg-mint", grad: "from-[#54de62] to-[#1bb3f7]" },
  news: { icon: "phone", tone: "bg-mist", grad: "from-[#2ec9b0] to-[#0d619b]" },
};
