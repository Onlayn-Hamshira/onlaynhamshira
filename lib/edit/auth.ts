// Admin kirishi: login/parol muhit o'zgaruvchilarida, sessiya — imzolangan httpOnly cookie.
// Tahrirlash rejimi Next.js Draft Mode orqali: faqat admin uchun sahifa so'rov paytida chiziladi,
// boshqa tashrifchilar avvalgidek statik HTML oladi (tezlik va SEO o'zgarmaydi).

import crypto from "node:crypto";
import { cookies, draftMode, headers } from "next/headers";

export const SESSION_COOKIE = "oh_admin_session";
/** JS o'qiy oladigan belgi: yangi deploy'dan keyin draft cookie eskiradi — sahifa adminni qayta ulaydi */
export const FLAG_COOKIE = "oh_admin";
/** proxy.ts /admin/... so'rovlariga qo'yadigan belgi: tahrirlash faqat shu manzillarda */
export const EDIT_HEADER = "x-oh-edit";
const TTL = 12 * 60 * 60; // 12 soat

function credentials(): { user: string; pass: string } | null {
  const user = process.env.ADMIN_USERNAME, pass = process.env.ADMIN_PASSWORD;
  if (user && pass) return { user, pass };
  // Faqat lokal sinov uchun standart login (productionda muhit o'zgaruvchilari shart)
  if (process.env.NODE_ENV !== "production") return { user: "admin", pass: "admin12345" };
  return null;
}

export const loginConfigured = () => credentials() !== null;

const secret = () => process.env.ADMIN_SECRET || `oh-admin:${credentials()?.pass ?? crypto.randomUUID()}`;
const hmac = (data: string) => crypto.createHmac("sha256", secret()).update(data).digest("base64url");
const sameText = (a: string, b: string) => {
  const ha = crypto.createHash("sha256").update(a).digest(), hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
};

export function checkCredentials(user: string, pass: string): boolean {
  const c = credentials();
  if (!c) return false;
  // Ikkalasi ham tekshiriladi (qisqa tutashuvsiz) — javob vaqti qaysi biri xatoligini bildirmasin
  return [sameText(user, c.user), sameText(pass, c.pass)].every(Boolean);
}

export function createSession(user: string) {
  const payload = Buffer.from(JSON.stringify({ u: user, exp: Math.floor(Date.now() / 1000) + TTL })).toString("base64url");
  return { value: `${payload}.${hmac(payload)}`, maxAge: TTL };
}

export function verifySession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !sameText(sig, hmac(payload))) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u: string; exp: number };
    return exp > Date.now() / 1000 ? u : null;
  } catch {
    return null;
  }
}

/** Route handler'lar uchun: sessiya egasi yoki null */
export async function sessionUser() {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value);
}

/**
 * Sahifalar uchun: /admin/... manzilida, tahrirlash rejimida bo'lsa — foydalanuvchi nomi.
 * Oddiy manzillarda admin ham saytni oddiy (nashr qilingan) ko'rinishda ko'radi.
 * cookies()/headers() faqat draft rejimida chaqiriladi — oddiy build/statik sahifa dinamik bo'lib qolmasin.
 */
export async function adminUser(): Promise<string | null> {
  if (!(await draftMode()).isEnabled) return null;
  if ((await headers()).get(EDIT_HEADER) !== "1") return null;
  return sessionUser();
}
