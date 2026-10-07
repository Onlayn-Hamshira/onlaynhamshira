import { adminRoute, json } from "@/lib/edit/api";
import { pending } from "@/lib/edit/store";

// Nashr qilinmagan (qoralamadagi) o'zgarishlar ro'yxati
export const GET = adminRoute(async () => json(await pending()));
