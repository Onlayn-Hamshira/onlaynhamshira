import { cookies, draftMode } from "next/headers";
import { FLAG_COOKIE, SESSION_COOKIE, checkCredentials, createSession, loginConfigured } from "@/lib/edit/auth";
import { json } from "@/lib/edit/api";

// Parolni taxmin qilishga qarshi oddiy cheklov (bitta server nusxasi doirasida): 10 daqiqada 8 urinish
const attempts = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  if (!loginConfigured()) return json({ error: "Admin login sozlanmagan (ADMIN_USERNAME, ADMIN_PASSWORD)." }, 503);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.until > now && a.n >= 8) return json({ error: "Juda ko‘p urinish. 10 daqiqadan keyin qayta urinib ko‘ring." }, 429);

  const { username, password } = (await req.json().catch(() => ({}))) as { username?: string; password?: string };
  if (typeof username !== "string" || typeof password !== "string" || !checkCredentials(username.trim(), password)) {
    attempts.set(ip, { n: (a && a.until > now ? a.n : 0) + 1, until: now + 10 * 60 * 1000 });
    return json({ error: "Login yoki parol noto‘g‘ri." }, 401);
  }
  attempts.delete(ip);

  const s = createSession(username.trim());
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  jar.set(SESSION_COOKIE, s.value, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: s.maxAge });
  jar.set(FLAG_COOKIE, "1", { httpOnly: false, secure, sameSite: "lax", path: "/", maxAge: s.maxAge });
  (await draftMode()).enable();
  return json({ ok: true });
}
