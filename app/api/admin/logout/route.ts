import { cookies, draftMode } from "next/headers";
import { FLAG_COOKIE, SESSION_COOKIE } from "@/lib/edit/auth";
import { json } from "@/lib/edit/api";

export async function POST() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(FLAG_COOKIE);
  (await draftMode()).disable();
  return json({ ok: true });
}
