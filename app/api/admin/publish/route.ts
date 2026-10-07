import { adminRoute, json } from "@/lib/edit/api";
import { publish, storeMode } from "@/lib/edit/store";

// Qoralamani saytga chiqarish: main'ga merge → Vercel production deploy
export const POST = adminRoute(async (user) => json({ ok: true, mode: storeMode(), ...(await publish(user)) }));
