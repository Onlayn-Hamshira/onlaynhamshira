import { redirect } from "next/navigation";
import { loginConfigured, sessionUser } from "@/lib/edit/auth";
import { storeMode } from "@/lib/edit/store";
import { LoginForm } from "@/components/admin/LoginForm";

/** Faqat /admin/... ichidagi yo'l (open redirect bo'lmasin) */
const adminPath = (raw: unknown) => (typeof raw === "string" && /^\/admin(\/|$)/.test(raw) && !raw.startsWith("/admin/login") ? raw : "/admin");

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const next = adminPath((await searchParams).next);
  // Kirgan bo'lsa — darhol tahrirlash rejimiga
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
