import { adminRoute, json } from "@/lib/edit/api";
import { readBlock, readTextField } from "@/lib/edit/save";

// Modal uchun joriy qiymatlar: matn — uch tilda, eski sahifa bloki — o'z tilida
export const GET = adminRoute(async (_user, req: Request) => {
  const q = new URL(req.url).searchParams;
  const id = q.get("id");
  if (id) return json(await readTextField(id));
  return json(await readBlock(q.get("page") ?? "", Number(q.get("n"))));
});
