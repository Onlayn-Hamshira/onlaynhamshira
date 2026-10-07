import { adminRoute, json } from "@/lib/edit/api";
import { save } from "@/lib/edit/save";
import { storeMode } from "@/lib/edit/store";

export const POST = adminRoute(async (user, req: Request) => {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json({ error: "Noto‘g‘ri so‘rov" }, 400);
  const res = await save(body, user);
  return json({ ok: true, mode: storeMode(), ...res });
});
