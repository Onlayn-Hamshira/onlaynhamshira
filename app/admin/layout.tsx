import type { Metadata } from "next";
import { Onest } from "next/font/google";

const onest = Onest({ subsets: ["latin", "cyrillic"], display: "swap" });

// Admin panel — alohida root layout (sayt CSS'i, analitika va JSON-LD bu yerga tushmaydi). Indekslanmaydi.
export const metadata: Metadata = {
  title: "Admin — Onlayn Hamshira",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon/icon-light-scheme.png" },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className={onest.className} style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
