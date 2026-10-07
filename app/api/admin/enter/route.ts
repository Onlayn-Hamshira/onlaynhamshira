import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { FLAG_COOKIE, sessionUser } from "@/lib/edit/auth";

// Tahrirlash rejimini yoqib, sahifaga qaytaradi. Yangi deploy'dan keyin eskirgan draft cookie'ni
// sahifadagi kichik skript (app/[lang]/layout.tsx → ADMIN_RECONNECT) shu yerga yuboradi.
export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("next") ?? "/";
  // Faqat o'z saytimiz ichidagi yo'l (open redirect bo'lmasin)
  const next = raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : "/";
  if (!(await sessionUser())) {
    (await cookies()).delete(FLAG_COOKIE);
    redirect(`/admin?next=${encodeURIComponent(next)}`);
  }
  (await draftMode()).enable();
  redirect(next);
}
