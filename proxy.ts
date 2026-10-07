import { NextResponse, type NextRequest } from "next/server";

// Admin tahrirlash manzillari: /admin → bosh sahifa, /admin/blog → /blog va h.k. Sahifaning o'zi chiziladi,
// faqat "tahrirlash" belgisi (x-oh-edit) bilan. Proxy FAQAT /admin/... uchun ishlaydi (matcher) —
// oddiy tashrifchilar so'rovlariga tegmaydi, sayt tezligi o'zgarmaydi.
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  // To'liq tekshiruv sahifada (lib/edit/auth.ts); bu yerda — cookie yo'q bo'lsa darhol login sahifasiga
  if (!req.cookies.has("oh_admin_session")) {
    const login = req.nextUrl.clone();
    login.pathname = "/admin/login";
    login.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(login);
  }

  const target = req.nextUrl.clone();
  target.pathname = pathname.replace(/^\/admin/, "") || "/";
  const headers = new Headers(req.headers);
  headers.set("x-oh-edit", "1");
  const res = NextResponse.rewrite(target, { request: { headers } });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = { matcher: "/admin/:path*" };
