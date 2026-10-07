import { redirect } from "next/navigation";
import { loginConfigured, sessionUser } from "@/lib/edit/auth";
import { storeMode } from "@/lib/edit/store";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const q = await searchParams;
  const raw = typeof q.next === "string" ? q.next : "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  // Kirgan bo'lsa — darhol saytga, tahrirlash rejimida
  if (await sessionUser()) redirect(`/api/admin/enter?next=${encodeURIComponent(next)}`);
  return (
    <LoginForm
      next={next}
      configured={loginConfigured()}
      devHint={process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD}
      readonly={storeMode() === "readonly"}
    />
  );
}
