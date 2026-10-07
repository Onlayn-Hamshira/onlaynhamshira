import { adminRoute, json } from "@/lib/edit/api";
import { deployState } from "@/lib/edit/store";

// Saqlangan commit Vercel'da qay holatda: pending → success (saytda yangilandi) yoki failure
export const GET = adminRoute(async (_user, req: Request) => {
  const sha = new URL(req.url).searchParams.get("sha") ?? "";
  if (!/^[0-9a-f]{40}$/.test(sha)) return json({ error: "sha" }, 400);
  return json({ state: await deployState(sha) });
});
