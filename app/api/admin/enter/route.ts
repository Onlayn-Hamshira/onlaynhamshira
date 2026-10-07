import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { FLAG_COOKIE, sessionUser } from "@/lib/edit/auth";

// Tahrirlash rejimini (Draft Mode) yoqib, /admin/... sahifasiga qaytaradi. Yangi deploy'dan keyin eskirgan
// draft cookie'ni sahifadagi kichik skript (app/[lang]/layout.tsx → ADMIN_RECONNECT) shu yerga yuboradi.
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("next") ?? "/admin";
  // Faqat /admin/... ichidagi yo'l (open redirect bo'lmasin)
  const next = /^\/admin(\/|$|\?|#)/.test(raw) && !raw.startsWith("/admin/login") ? raw : "/admin";
  if (!(await sessionUser())) {
    (await cookies()).delete(FLAG_COOKIE);
    redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  }
  (await draftMode()).enable();
  redirect(next);
}
