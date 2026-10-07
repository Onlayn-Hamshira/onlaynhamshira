import { adminRoute } from "@/lib/edit/api";
import { readFile } from "@/lib/edit/store";

const TYPES: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", png: "image/png", svg: "image/svg+xml", avif: "image/avif", gif: "image/gif" };

// Yangi yuklangan rasm deploy tugaguncha saytda yo'q — admin ko'rishi uchun repodan beriladi
export const GET = adminRoute(async (_user, req: Request) => {
  const p = new URL(req.url).searchParams.get("p") ?? "";
  const ext = p.split(".").pop()?.toLowerCase() ?? "";
  if (!/^\/uploads\/[\w./-]+$/.test(p) || p.includes("..") || !TYPES[ext]) return new Response("Not found", { status: 404 });
  const buf = await readFile(`public${p}`).catch(() => null);
  if (!buf) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(buf), {
    headers: { "Content-Type": TYPES[ext], "Cache-Control": "private, max-age=600", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" },
  });
});
