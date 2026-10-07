"use client";

import dynamic from "next/dynamic";

// /ilova'ning og'ir client qismlari (ilova videosi, "Qanday ishlaydi" sahnasi, raqamlar animatsiyasi).
// Barcha ichki sahifalar bitta [...slug] marshrutida — oddiy import'da bu kod har bir sahifaga tushardi.
// next/dynamic (SSR saqlanadi) bilan kod alohida bo'lakka chiqadi va faqat /ilova'da yuklanadi.
export const LazyAppPhone = dynamic(() => import("./AppPhone").then((m) => m.AppPhone));
export const LazyHowItWorks = dynamic(() => import("./how-it-works/HowItWorks"));
export const LazyStats = dynamic(() => import("./Stats"));
// Boshqa shablonlarning faqat o'z sahifasida kerak bo'ladigan client qismlari
export const LazyExpertPhoneDemo = dynamic(() => import("./expert-demo/ExpertPhoneDemo").then((m) => m.ExpertPhoneDemo));
export const LazyBlogIndex = dynamic(() => import("./blog/BlogIndex").then((m) => m.BlogIndex));
export const LazyCertificateViewer = dynamic(() => import("./certificates/CertificateViewer").then((m) => m.CertificateViewer));
