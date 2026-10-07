"use client";

import dynamic from "next/dynamic";
import type { AdminOverlayProps } from "./AdminOverlay";

// Tahrirlash qatlami faqat admin rejimida (draft) chiziladi va alohida chunk sifatida yuklanadi —
// oddiy tashrifchining JS/CSS hajmiga qo'shilmaydi
const AdminOverlay = dynamic(() => import("./AdminOverlay"), { ssr: false });

export function AdminLoader(props: AdminOverlayProps) {
  return <AdminOverlay {...props} />;
}
