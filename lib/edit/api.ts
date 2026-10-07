// Admin API route'lari uchun umumiy yordamchilar

import { sessionUser } from "./auth";
import { StoreError } from "./store";
import { InputError } from "./save";

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

/** Sessiyani tekshiradi va xatolarni foydalanuvchiga tushunarli javobga aylantiradi */
export function adminRoute<A extends unknown[]>(fn: (user: string, ...args: A) => Promise<Response>) {
  return async (...args: A) => {
    const user = await sessionUser();
    if (!user) return json({ error: "Sessiya tugagan — qaytadan kiring." }, 401);
    try {
      return await fn(user, ...args);
    } catch (e) {
      if (e instanceof InputError) return json({ error: e.message }, 400);
      if (e instanceof StoreError) return json({ error: e.message }, e.status === 503 ? 503 : 502);
      console.error("[admin]", e);
      return json({ error: "Kutilmagan xato. Qayta urinib ko‘ring." }, 500);
    }
  };
}
