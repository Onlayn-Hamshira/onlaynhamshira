import { adminRoute, json } from "@/lib/edit/api";
import { discard } from "@/lib/edit/store";

// Nashr qilinmagan barcha o'zgarishlarni bekor qilish
export const POST = adminRoute(async () => {
  await discard();
  return json({ ok: true });
});
