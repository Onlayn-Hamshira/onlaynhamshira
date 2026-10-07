"use client";

// Admin tahrirlash qatlami: saytning o'zi ustida har bir matn/rasm yonida ⋯ tugmasi → menyu
// (Tahrirlash / Qo'shish / O'chirish) → uch tilli modal → /api/admin/save → GitHub commit → Vercel deploy.
//
// Qaysi element qaysi matn ekanini komponentlar bilmaydi: admin rejimida server har matn oxiriga ko'rinmas
// manzil belgisini qo'shadi (lib/edit/shared.ts → stegaDeep), bu qatlam esa DOM'dagi matn tugunlaridan uni o'qiydi.
// Eski sahifalar (blog, maqolalar) bloklari — data-oh="N", rasmlar — src yo'li bo'yicha.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle, ArrowRight, Bold, Check, CircleCheck, ExternalLink, Eye, EyeOff, ImageUp, Italic, Link2, Loader2, Lock, LogOut,
  MoreHorizontal, Pencil, Plus, Send, Trash2, Undo2, Unlink, X,
} from "lucide-react";
import { ADMIN_CSS } from "./admin-styles";
import {
  SECTION_LABELS, STEGA_RE, isLocked, isSource, listOf, pathLabel, stegaDecode, type Source,
} from "@/lib/edit/shared";
import { EDITABLE_IMAGE_PREFIXES, EDITED_IMAGES } from "@/lib/edit/edits";
import type { Locale } from "@/lib/i18n/config";

export type AdminOverlayProps = {
  user: string;
  lang: Locale;
  mode: "github" | "local" | "readonly";
  /** Repodagi eng so'nggi rasm xaritasi (deploy tugamagan bo'lsa ham) */
  images: Record<string, string>;
};

const LANGS: { id: Locale; name: string; flag: string }[] = [
  { id: "uz", name: "O‘zbekcha", flag: "🇺🇿" },
  { id: "ru", name: "Русский", flag: "🇷🇺" },
  { id: "en", name: "English", flag: "🇬🇧" },
];

type TextTarget = { kind: "text"; el: HTMLElement; ids: string[] };
type BlockTarget = { kind: "block"; el: HTMLElement; n: number; tag: string };
type ImageTarget = { kind: "image"; el: HTMLImageElement; key: string };
type Target = TextTarget | BlockTarget | ImageTarget;
type ActionType = "edit" | "add" | "delete" | "image";
type Action = { type: ActionType; target: Target; id?: string };
type SaveResult = { ok: true; mode: string };

const parseId = (id: string) => {
  const [source, lang, path] = id.split(":");
  return isSource(source) ? { source: source as Source, lang: lang as Locale, path } : null;
};

const BLOCK_NAMES: Record<string, string> = {
  p: "Paragraf", h1: "Sarlavha (H1)", h2: "Sarlavha", h3: "Kichik sarlavha", h4: "Kichik sarlavha", h5: "Kichik sarlavha", h6: "Kichik sarlavha",
  li: "Ro‘yxat bandi", figcaption: "Rasm izohi", blockquote: "Iqtibos", td: "Jadval katagi", th: "Jadval sarlavhasi", dt: "Atama", dd: "Ta’rif", img: "Rasm",
};

// ─── DOM'dan tahrirlanadigan elementlarni topish ─────────────────────────────────────────────────────

function shownPath(img: HTMLImageElement): string | null {
  const raw = img.getAttribute("src");
  if (!raw) return null;
  try {
    const u = new URL(raw, location.href);
    if (u.origin !== location.origin) return null;
    if (u.pathname === "/_next/image") return u.searchParams.get("url");
    if (u.pathname === "/api/admin/asset") return u.searchParams.get("p");
    return decodeURIComponent(u.pathname);
  } catch {
    return null;
  }
}

function scan(images: Record<string, string>, mode: AdminOverlayProps["mode"]): Target[] {
  const out: Target[] = [];
  const byEl = new Map<HTMLElement, TextTarget>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const v = node.nodeValue;
    if (!v || !v.includes("⁤")) continue;
    const el = node.parentElement;
    if (!el || el.closest("[data-oh-ui],script,style,noscript,template,title")) continue;
    let t = byEl.get(el);
    if (!t) {
      t = { kind: "text", el, ids: [] };
      byEl.set(el, t);
      out.push(t);
    }
    for (const m of v.matchAll(STEGA_RE)) {
      const id = stegaDecode(m[1]);
      if (!t.ids.includes(id)) t.ids.push(id);
    }
  }

  document.querySelectorAll<HTMLElement>("[data-oh]").forEach((el) => {
    if (!el.closest("[data-oh-ui]")) out.push({ kind: "block", el, n: Number(el.dataset.oh), tag: el.tagName.toLowerCase() });
  });

  // Build'dagi xarita: ko'rsatilayotgan yo'l → asl kalit
  const reverse = new Map(Object.entries(EDITED_IMAGES).map(([k, v]) => [v, k]));
  document.querySelectorAll("img").forEach((img) => {
    if (img.closest("[data-oh-ui]") || img.hasAttribute("data-oh")) return;
    const shown = shownPath(img);
    const key = img.dataset.ohKey ?? (shown ? (reverse.get(shown) ?? shown) : null);
    if (!key || !EDITABLE_IMAGE_PREFIXES.some((p) => key.startsWith(p))) return;
    img.dataset.ohKey = key;
    // Qoralamadagi (hali nashr qilinmagan) rasm — admin uni darhol ko'rsin
    const fresh = images[key];
    if (fresh && shown !== fresh) {
      img.removeAttribute("srcset");
      img.src = `/api/admin/asset?p=${encodeURIComponent(fresh)}`;
    }
    out.push({ kind: "image", el: img, key });
  });
  return out;
}

const visible = (el: Element) =>
  !("checkVisibility" in el) || (el as Element & { checkVisibility: (o: object) => boolean }).checkVisibility({ opacityProperty: true, visibilityProperty: true });

// ─── Asosiy komponent ──────────────────────────────────────────────────────────────────────────────

type Deploy = { sha?: string; url?: string; mode: string; state: "pending" | "success" | "failure" | "local" };
type Pending = { count: number; changes: string[] };
type PublishResult = { ok: true; mode: string; sha?: string; url?: string };
const LAST_KEY = "ohAdminLast";
const FLASH_KEY = "ohAdminFlash";

/** Sahifaning asl manzili: /admin/blog → /blog, /admin → / */
const pagePath = () => location.pathname.replace(/^\/admin(?=\/|$)/, "") || "/";
const adminHref = (p: string) => (p === "/" ? "/admin" : `/admin${p}`);

export default function AdminOverlay({ user, lang, mode, images }: AdminOverlayProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [hidden, setHidden] = useState(false);
  // Menyu va hover — element obyektiga bog'langan: karusel aylanib qayta skanerlansa ham boshqa matnga o'tib ketmaydi
  const [menu, setMenu] = useState<{ target: Target; x: number; y: number } | null>(null);
  const [action, setAction] = useState<Action | null>(null);
  const [toast, setToast] = useState<{ title: string; text?: string; err?: boolean; link?: string } | null>(null);
  const [deploy, setDeploy] = useState<Deploy | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [dialog, setDialog] = useState<"publish" | "discard" | null>(null);
  const marks = useRef<(HTMLButtonElement | null)[]>([]);
  const outline = useRef<HTMLDivElement>(null);
  const hover = useRef<Element | null>(null);

  // Belgilarni yashirish holati — faqat shu brauzer uchun qulaylik
  useEffect(() => {
    try {
      setHidden(localStorage.getItem("ohAdminHidden") === "1");
    } catch {}
  }, []);
  const toggleHidden = () => {
    setHidden((h) => {
      try {
        localStorage.setItem("ohAdminHidden", h ? "0" : "1");
      } catch {}
      return !h;
    });
  };

  // Skanerlash: boshida va DOM o'zgarganda (karusel, akkordeon, til almashishi)
  useEffect(() => {
    let timer = 0;
    const run = () => setTargets(scan(images, mode));
    const first = window.setTimeout(run, 300);
    const mo = new MutationObserver((list) => {
      if (list.every((m) => (m.target as Element).closest?.("[data-oh-ui]"))) return;
      clearTimeout(timer);
      timer = window.setTimeout(run, 300);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => {
      clearTimeout(first);
      clearTimeout(timer);
      mo.disconnect();
    };
  }, [images, mode]);

  // Belgilar va hover chegarasini har kadrda joylashtirish (React render'siz — to'g'ridan-to'g'ri style)
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const vw = innerWidth, vh = innerHeight;
      const used = new Set<string>();
      targets.forEach((t, i) => {
        const b = marks.current[i];
        if (!b) return;
        const r = t.el.getBoundingClientRect();
        const show = t.el.isConnected && r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw && visible(t.el);
        if (!show) {
          b.style.display = "none";
          return;
        }
        let x = Math.max(4, Math.min(vw - 30, r.left - 28));
        const y = Math.max(4, Math.min(vh - 28, r.top - 2));
        // Bir joyga tushgan belgilar yonma-yon turadi
        while (used.has(`${Math.round(x / 14)}:${Math.round(y / 14)}`)) x += 26;
        used.add(`${Math.round(x / 14)}:${Math.round(y / 14)}`);
        b.style.display = "";
        b.style.transform = `translate(${x}px,${y}px)`;
        if (t.el === hover.current) b.dataset.on = "";
        else delete b.dataset.on;
      });
      const o = outline.current;
      const he = hover.current;
      if (o) {
        if (he && he.isConnected) {
          const r = he.getBoundingClientRect();
          o.style.opacity = "1";
          o.style.transform = `translate(${r.left - 4}px,${r.top - 4}px)`;
          o.style.width = `${r.width + 8}px`;
          o.style.height = `${r.height + 8}px`;
        } else o.style.opacity = "0";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targets]);

  // Sichqoncha qaysi tahrirlanadigan element ustida
  useEffect(() => {
    const els = new Set<Element>(targets.map((t) => t.el));
    const over = (e: PointerEvent) => {
      let el = e.target as Element | null;
      if (el?.closest?.("[data-oh-ui]")) return;
      while (el && el !== document.body) {
        if (els.has(el)) {
          hover.current = el;
          return;
        }
        el = el.parentElement;
      }
      hover.current = null;
    };
    document.addEventListener("pointerover", over);
    return () => document.removeEventListener("pointerover", over);
  }, [targets]);

  // Menyu: tashqariga bosish, skroll yoki Esc — yopiladi
  useEffect(() => {
    if (!menu) return;
    const close = (e: Event) => {
      if (e.type === "keydown" && (e as KeyboardEvent).key !== "Escape") return;
      if (e.type === "pointerdown" && (e.target as Element).closest?.(".oh-menu,.oh-mark")) return;
      setMenu(null);
    };
    document.addEventListener("pointerdown", close, true);
    document.addEventListener("keydown", close);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", close, true);
      document.removeEventListener("keydown", close);
      window.removeEventListener("scroll", close);
    };
  }, [menu]);

  // Qayta yuklangandan keyingi xabar (saqlandi / nashr qilindi / bekor qilindi), nashr deploy holati, qoralamalar soni
  useEffect(() => {
    try {
      const flash = JSON.parse(sessionStorage.getItem(FLASH_KEY) ?? "null") as { kind: string; mode: string } | null;
      sessionStorage.removeItem(FLASH_KEY);
      if (flash?.kind === "saved") setToast({ title: "Qoralama saqlandi", text: "Hozircha faqat sizga ko‘rinadi. Saytga chiqarish uchun pastdagi “Nashr qilish”ni bosing." });
      if (flash?.kind === "published")
        setToast(
          flash.mode === "github"
            ? { title: "Nashr qilindi", text: "Vercel saytni yangilamoqda — odatda 1–3 daqiqa. Holat pastdagi panelda." }
            : { title: "Nashr qilindi", text: "Lokal rejim: fayllar joyiga yozildi. Saytga chiqarish uchun commit qiling." },
        );
      if (flash?.kind === "discarded") setToast({ title: "Qoralama bekor qilindi", text: "Sayt nashr qilingan holatiga qaytdi." });
      const last = JSON.parse(sessionStorage.getItem(LAST_KEY) ?? "null") as (Deploy & { t: number }) | null;
      if (last && Date.now() - last.t < 15 * 60 * 1000) setDeploy(last);
    } catch {}
    api<Pending>("/api/admin/pending").then(setPending).catch(() => setPending({ count: 0, changes: [] }));
  }, []);

  useEffect(() => {
    if (!deploy?.sha || deploy.state !== "pending") return;
    let stop = false;
    const poll = async () => {
      try {
        const r = await fetch(`/api/admin/status?sha=${deploy.sha}`, { cache: "no-store" });
        const { state } = (await r.json()) as { state: string };
        if (stop || (state !== "success" && state !== "failure")) return;
        const next = { ...deploy, state } as Deploy;
        setDeploy(next);
        sessionStorage.setItem(LAST_KEY, JSON.stringify({ ...next, t: Date.now() }));
      } catch {}
    };
    const id = window.setInterval(poll, 8000);
    poll();
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [deploy]);

  useEffect(() => {
    if (!toast || toast.err) return;
    const id = window.setTimeout(() => setToast(null), 9000);
    return () => clearTimeout(id);
  }, [toast]);

  // Sayt ichidagi havolalar tahrirlash rejimida qolsin: /blog → /admin/blog
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.closest("[data-oh-ui]") || a.target === "_blank" || a.hasAttribute("download")) return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || /^\/(admin|api)(\/|$)/.test(u.pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      location.href = adminHref(u.pathname) + u.search + u.hash;
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, []);

  const openMenu = (target: Target, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(r.left, innerWidth - 330);
    const y = r.bottom + 6 + 260 > innerHeight ? Math.max(8, r.top - 266) : r.bottom + 6;
    setMenu((m) => (m?.target === target ? null : { target, x: Math.max(8, x), y }));
  };

  const start = (type: ActionType, target: Target, id?: string) => {
    setMenu(null);
    setAction({ type, target, id });
  };

  // To'liq qayta yuklash: sahifa qoralamadagi yangi holat bilan chiziladi
  const reloadWith = (flash: object) => {
    try {
      sessionStorage.setItem(FLASH_KEY, JSON.stringify(flash));
    } catch {}
    location.reload();
  };

  const onSaved = useCallback((res: SaveResult) => reloadWith({ kind: "saved", mode: res.mode }), []);

  const onPublished = (res: PublishResult) => {
    try {
      const d: Deploy = { sha: res.sha, url: res.url, mode: res.mode, state: res.mode === "github" && res.sha ? "pending" : "local" };
      sessionStorage.setItem(LAST_KEY, JSON.stringify({ ...d, t: Date.now() }));
    } catch {}
    reloadWith({ kind: "published", mode: res.mode });
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    try {
      sessionStorage.removeItem(LAST_KEY);
    } catch {}
    location.href = pagePath();
  };

  const counts = useMemo(() => targets.length, [targets]);

  return createPortal(
    <div data-oh-ui="">
      <style>{ADMIN_CSS}</style>
      <div className={`oh-layer${hidden ? " oh-hidden" : ""}`}>
        <div ref={outline} className="oh-outline" style={{ opacity: hidden ? 0 : undefined }} />
        {targets.map((t, i) => (
          <button
            key={i}
            ref={(el) => {
              marks.current[i] = el;
            }}
            type="button"
            className="oh-mark"
            data-kind={t.kind === "block" && t.tag === "img" ? "image" : t.kind}
            aria-label="Tahrirlash menyusi"
            onClick={(e) => openMenu(t, e)}
            onPointerEnter={() => (hover.current = t.el)}
            onPointerLeave={() => (hover.current = null)}
            style={{ display: "none" }}
          >
            <MoreHorizontal size={14} strokeWidth={3} />
          </button>
        ))}
      </div>

      {menu && <Menu target={menu.target} x={menu.x} y={menu.y} onPick={start} />}

      <div className="oh-bar" role="toolbar" aria-label="Admin paneli">
        <span className="oh-bar-dot" />
        <span className="oh-bar-title">
          Tahrirlash <span className="oh-bar-label">rejimi</span>
        </span>
        <span className="oh-bar-user">· {user} · {counts} ta element</span>
        {pending && pending.count > 0 && (
          <>
            <span className="oh-chip" data-s="pending" title="Saqlangan, lekin saytga hali chiqmagan o‘zgarishlar">
              {pending.count} ta qoralama
            </span>
            <button type="button" className="oh-bar-btn oh-bar-pub" onClick={() => setDialog("publish")}>
              <Send size={15} /> Nashr qilish
            </button>
            <button type="button" className="oh-bar-btn" onClick={() => setDialog("discard")} title="Qoralamani bekor qilish">
              <Undo2 size={16} />
            </button>
          </>
        )}
        {pending && pending.count === 0 && <span className="oh-chip oh-bar-label">Barchasi nashr qilingan</span>}
        <DeployChip deploy={deploy} mode={mode} />
        <a className="oh-bar-btn" href={pagePath()} target="_blank" rel="noopener" title="Sayt (nashr qilingan holat) yangi oynada">
          <ExternalLink size={15} />
        </a>
        <button type="button" className="oh-bar-btn" onClick={toggleHidden} title={hidden ? "Belgilarni ko‘rsatish" : "Belgilarni yashirish (saytni toza ko‘rish)"}>
          {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="oh-bar-label">{hidden ? "Belgilar" : "Ko‘rish"}</span>
        </button>
        <button type="button" className="oh-bar-btn" onClick={logout} title="Chiqish">
          <LogOut size={16} />
        </button>
      </div>

      {dialog && pending && (
        <PublishDialog kind={dialog} pending={pending} mode={mode} onClose={() => setDialog(null)} onPublished={onPublished} onDiscarded={() => reloadWith({ kind: "discarded" })} />
      )}

      {action && (
        <ActionModal
          action={action}
          lang={lang}
          mode={mode}
          onClose={() => setAction(null)}
          onSaved={onSaved}
        />
      )}

      {toast && (
        <div className="oh-toast" data-v={toast.err ? "err" : "ok"} role="status">
          <span className="oh-toast-ic">{toast.err ? <AlertTriangle size={18} /> : <CircleCheck size={18} />}</span>
          <div>
            <b>{toast.title}</b>
            {toast.text}
            {toast.link && (
              <>
                {" "}
                <a href={toast.link} target="_blank" rel="noopener">Commit</a>
              </>
            )}
          </div>
          <button type="button" className="oh-x" style={{ width: 30, height: 30 }} onClick={() => setToast(null)} aria-label="Yopish">
            <X size={16} />
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}

function DeployChip({ deploy, mode }: { deploy: Deploy | null; mode: AdminOverlayProps["mode"] }) {
  if (mode === "readonly") return <span className="oh-chip" data-s="failure" title="Vercel'da GITHUB_TOKEN qo‘shilmagan">Saqlash o‘chiq</span>;
  if (!deploy) return null;
  if (deploy.state === "local") return null;
  const label = deploy.state === "pending" ? "Saytga chiqmoqda…" : deploy.state === "success" ? "Saytda yangilandi" : "Deploy xatosi";
  return (
    <a className="oh-chip" data-s={deploy.state} href={deploy.url} target="_blank" rel="noopener" title="GitHub'dagi commit">
      {deploy.state === "pending" ? <Loader2 size={13} className="oh-spin" /> : deploy.state === "success" ? <Check size={13} /> : <AlertTriangle size={13} />}
      {label}
    </a>
  );
}

// "Edit dict text: faq.items.3.q" → "Tahrirlandi · Savol-javoblar › …" (commit sarlavhalari inglizcha — git qoidasi)
function humanize(msg: string): string {
  const text = msg.match(/^(Edit|Add item to|Remove item from) (dict|why|expert) text: ([\w.]+)(?: \(#(\d+)\))?/);
  if (text) {
    const verb = { Edit: "Tahrirlandi", "Add item to": "Qo‘shildi", "Remove item from": "O‘chirildi" }[text[1]];
    return `${verb} · ${pathLabel(text[2] as Source, text[3])}${text[4] ? ` (${text[4]}-element)` : ""}`;
  }
  const block = msg.match(/^(Edit|Add|Remove|Replace image) block #\d+ on (\S+)/);
  if (block) {
    const verb = { Edit: "Matn tahrirlandi", Add: "Matn qo‘shildi", Remove: "Matn o‘chirildi", "Replace image": "Rasm almashtirildi" }[block[1]];
    return `${verb} · ${block[2]}`;
  }
  const img = msg.match(/^Replace image (\S+)/);
  return img ? `Rasm almashtirildi · ${img[1].split("/").slice(-2).join("/")}` : msg;
}

function PublishDialog({
  kind, pending, mode, onClose, onPublished, onDiscarded,
}: {
  kind: "publish" | "discard"; pending: Pending; mode: AdminOverlayProps["mode"]; onClose: () => void; onPublished: (r: PublishResult) => void; onDiscarded: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const go = async () => {
    setBusy(true);
    setError(null);
    try {
      if (kind === "publish") onPublished(await api<PublishResult>("/api/admin/publish", {}));
      else {
        await api("/api/admin/discard", {});
        onDiscarded();
      }
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };
  const publish = kind === "publish";
  return (
    <Shell
      icon={publish ? <Send size={20} /> : <Undo2 size={20} />}
      variant={publish ? undefined : "del"}
      title={publish ? "Saytga nashr qilish" : "Qoralamani bekor qilish"}
      crumb={`${pending.count} ta o‘zgarish`}
      onClose={onClose}
      footer={
        <>
          <span className="oh-mf-note">
            {publish
              ? mode === "github" ? "Sayt 1–3 daqiqada yangilanadi." : "Lokal rejim: fayllar joyiga yoziladi."
              : "Bu amalni qaytarib bo‘lmaydi."}
          </span>
          <button type="button" className="oh-btn oh-btn-ghost" onClick={onClose}>Yopish</button>
          <button type="button" className={`oh-btn ${publish ? "oh-btn-main" : "oh-btn-danger"}`} disabled={busy} onClick={go}>
            {busy ? <Loader2 size={18} className="oh-spin" /> : publish ? <Send size={18} /> : <Undo2 size={18} />}
            {publish ? "Saytga chiqarish" : "Ha, bekor qilish"}
          </button>
        </>
      }
    >
      {error && <div className="oh-err">{error}</div>}
      <div className={`oh-info${publish ? "" : " oh-warn"}`}>
        {publish ? (
          <>Quyidagi o‘zgarishlar <b>barcha tashrifchilarga</b> ko‘rinadi.</>
        ) : (
          <>Quyidagi nashr qilinmagan o‘zgarishlar <b>o‘chiriladi</b>, sayt hozirgi (nashr qilingan) holatida qoladi.</>
        )}
      </div>
      <ol className="oh-changes">
        {pending.changes.map((c, i) => (
          <li key={i}>{humanize(c)}</li>
        ))}
      </ol>
    </Shell>
  );
}

// ─── Menyu ─────────────────────────────────────────────────────────────────────────────────────────

function MenuItem({ v, icon, label, note, disabled, onClick }: { v?: string; icon: React.ReactNode; label: string; note?: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" className="oh-mi" data-v={v} disabled={disabled} onClick={onClick} title={disabled ? note : undefined}>
      <span className="oh-mi-ic">{icon}</span>
      <span>
        {label}
        {note && <small>{note}</small>}
      </span>
    </button>
  );
}

function Menu({ target, x, y, onPick }: { target: Target; x: number; y: number; onPick: (t: ActionType, target: Target, id?: string) => void }) {
  let body: React.ReactNode;
  if (target.kind === "text") {
    body = target.ids.map((id, k) => {
      const p = parseId(id);
      if (!p) return null;
      const locked = isLocked(p.source, p.path);
      const li = listOf(p.source, p.path);
      return (
        <div key={id}>
          {k > 0 && <div className="oh-menu-sep" />}
          <div className="oh-menu-head">{pathLabel(p.source, p.path)}</div>
          <MenuItem icon={locked ? <Lock size={16} /> : <Pencil size={16} />} label="Tahrirlash" note={locked ? "SEO: o‘zgartirilmaydi" : "Barcha tillarda"} disabled={locked} onClick={() => onPick("edit", target, id)} />
          <MenuItem v="add" icon={<Plus size={16} />} label="Qo‘shish" note={li ? "Shu elementdan keyin" : "Bu ro‘yxatga qo‘shib bo‘lmaydi"} disabled={!li || locked} onClick={() => onPick("add", target, id)} />
          <MenuItem v="del" icon={<Trash2 size={16} />} label="O‘chirish" note={li ? "Barcha tillardan" : "Dizayn bilan bog‘langan"} disabled={!li || locked} onClick={() => onPick("delete", target, id)} />
        </div>
      );
    });
  } else if (target.kind === "block") {
    const locked = target.tag === "h1";
    const img = target.tag === "img";
    body = (
      <>
        <div className="oh-menu-head">Sahifa matni › {BLOCK_NAMES[target.tag] ?? target.tag}</div>
        {img ? (
          <MenuItem icon={<ImageUp size={16} />} label="Rasmni almashtirish" onClick={() => onPick("image", target)} />
        ) : (
          <MenuItem icon={locked ? <Lock size={16} /> : <Pencil size={16} />} label="Tahrirlash" note={locked ? "SEO: H1 o‘zgartirilmaydi" : undefined} disabled={locked} onClick={() => onPick("edit", target)} />
        )}
        <MenuItem v="add" icon={<Plus size={16} />} label="Qo‘shish" note={img ? "Rasmdan keyin qo‘shib bo‘lmaydi" : `Keyin yangi “${(BLOCK_NAMES[target.tag] ?? "blok").toLowerCase()}”`} disabled={img || locked} onClick={() => onPick("add", target)} />
        <MenuItem v="del" icon={<Trash2 size={16} />} label="O‘chirish" disabled={locked} onClick={() => onPick("delete", target)} />
      </>
    );
  } else {
    body = (
      <>
        <div className="oh-menu-head">Rasm</div>
        <MenuItem icon={<ImageUp size={16} />} label="Rasmni almashtirish" note="Barcha sahifalarda" onClick={() => onPick("image", target)} />
        <MenuItem v="add" icon={<Plus size={16} />} label="Qo‘shish" note="Rasm dizaynning bir qismi" disabled onClick={() => {}} />
        <MenuItem v="del" icon={<Trash2 size={16} />} label="O‘chirish" note="Rasm dizaynning bir qismi" disabled onClick={() => {}} />
      </>
    );
  }
  return (
    <div className="oh-menu" style={{ left: x, top: y }} role="menu">
      {body}
    </div>
  );
}

// ─── Modallar ──────────────────────────────────────────────────────────────────────────────────────

type ModalProps = { action: Action; lang: Locale; mode: AdminOverlayProps["mode"]; onClose: () => void; onSaved: (r: SaveResult) => void };

async function api<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, body ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : { cache: "no-store" });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error ?? `Xato: ${res.status}`);
  return data;
}

function ActionModal(props: ModalProps) {
  const { action } = props;
  if (action.type === "image") return <ImageModal {...props} />;
  if (action.target.kind === "block") return <BlockModal {...props} />;
  return <TextModal {...props} />;
}

function Shell({
  icon, variant, title, crumb, onClose, dirty, children, footer,
}: {
  icon: React.ReactNode; variant?: string; title: string; crumb?: string; onClose: () => void; dirty?: boolean; children: React.ReactNode; footer: React.ReactNode;
}) {
  const close = useCallback(() => {
    if (dirty && !confirm("Saqlanmagan o‘zgarishlar bor. Yopilsinmi?")) return;
    onClose();
  }, [dirty, onClose]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", k);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.documentElement.style.overflow = prev;
    };
  }, [close]);
  return (
    <div className="oh-back" onPointerDown={(e) => e.target === e.currentTarget && close()}>
      <div className="oh-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="oh-mh">
          <span className="oh-mh-ic" data-v={variant}>{icon}</span>
          <div>
            <h2>{title}</h2>
            {crumb && <div className="oh-crumb">{crumb}</div>}
          </div>
          <button type="button" className="oh-x" onClick={close} aria-label="Yopish">
            <X size={18} />
          </button>
        </div>
        <div className="oh-mb">{children}</div>
        <div className="oh-mf">{footer}</div>
      </div>
    </div>
  );
}

function AutoTextarea({ value, onChange, autoFocus, onSubmit }: { value: string; onChange: (v: string) => void; autoFocus?: boolean; onSubmit?: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight + 2, 360)}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      className="oh-ta"
      rows={1}
      value={value}
      autoFocus={autoFocus}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit?.();
      }}
    />
  );
}

function useSubmit(onSaved: (r: SaveResult) => void) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = async (body: unknown) => {
    setBusy(true);
    setError(null);
    try {
      onSaved(await api<SaveResult>("/api/admin/save", body));
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };
  return { busy, error, run, setError };
}

const SaveNote = ({ mode }: { mode: AdminOverlayProps["mode"] }) => (
  <span className="oh-mf-note">
    {mode === "readonly" ? "Saqlash sozlanmagan (GITHUB_TOKEN)." : "Qoralama sifatida saqlanadi — saytga “Nashr qilish”dan keyin chiqadi."}
  </span>
);

type TextField = {
  label: string;
  values: Partial<Record<Locale, string>>;
  locked: string | null;
  list: { list: string; index: number; label: string } | null;
  listReason: string | null;
  itemFields: string[] | null;
};

function TextModal({ action, lang, mode, onClose, onSaved }: ModalProps) {
  const id = action.id!;
  const [field, setField] = useState<TextField | null>(null);
  const [vals, setVals] = useState<Partial<Record<Locale, string>>>({});
  const [item, setItem] = useState<Record<string, Record<string, string>>>({});
  const { busy, error, run, setError } = useSubmit(onSaved);

  useEffect(() => {
    api<TextField>(`/api/admin/field?id=${encodeURIComponent(id)}`)
      .then((f) => {
        setField(f);
        setVals(f.values);
      })
      .catch((e: Error) => setError(e.message));
  }, [id, setError]);

  const type = action.type;
  const langs = LANGS.filter((l) => type === "add" || field?.values[l.id] !== undefined);
  const fields = field?.itemFields ?? [""];
  const changed = (l: Locale) => field && vals[l] !== field.values[l];
  const dirty = type === "edit" ? langs.some((l) => changed(l.id)) : type === "add" ? Object.values(item).some((f) => Object.values(f).some(Boolean)) : false;
  const addReady = type === "add" && langs.every((l) => fields.every((f) => item[l.id]?.[f]?.trim()));

  const submit = () => {
    if (busy || !field) return;
    if (type === "edit") {
      if (!dirty) return;
      if (langs.some((l) => !vals[l.id]?.trim())) return setError("Matn bo‘sh bo‘lmasligi kerak (har bir tilda).");
      const values = Object.fromEntries(langs.filter((l) => changed(l.id)).map((l) => [l.id, vals[l.id]]));
      run({ kind: "text", id, op: "edit", values });
    } else if (type === "add") {
      if (!addReady) return setError("Barcha tillardagi maydonlarni to‘ldiring.");
      const values = Object.fromEntries(langs.map((l) => [l.id, field.itemFields ? item[l.id] : item[l.id][""]]));
      run({ kind: "text", id, op: "add", values });
    } else run({ kind: "text", id, op: "delete" });
  };

  const titles = { edit: "Matnni tahrirlash", add: "Yangi element qo‘shish", delete: "Elementni o‘chirish", image: "" };
  const icon = type === "edit" ? <Pencil size={20} /> : type === "add" ? <Plus size={20} /> : <Trash2 size={20} />;

  return (
    <Shell
      icon={icon}
      variant={type === "delete" ? "del" : undefined}
      title={titles[type]}
      crumb={field ? (type === "edit" ? field.label : field.list?.label) : undefined}
      onClose={onClose}
      dirty={dirty && !busy}
      footer={
        <>
          <SaveNote mode={mode} />
          <button type="button" className="oh-btn oh-btn-ghost" onClick={onClose}>Bekor qilish</button>
          {type === "delete" ? (
            <button type="button" className="oh-btn oh-btn-danger" disabled={!field || busy} onClick={submit}>
              {busy ? <Loader2 size={18} className="oh-spin" /> : <Trash2 size={18} />} Ha, o‘chirish
            </button>
          ) : (
            <button type="button" className="oh-btn oh-btn-main" disabled={!field || busy || (type === "edit" ? !dirty : !addReady)} onClick={submit}>
              {busy ? <Loader2 size={18} className="oh-spin" /> : <Check size={18} />} {type === "add" ? "Qo‘shishni tasdiqlash" : "O‘zgarishni tasdiqlash"}
            </button>
          )}
        </>
      }
    >
      {error && <div className="oh-err">{error}</div>}
      {!field && !error && (
        <>
          <div className="oh-skel" />
          <div className="oh-skel" />
          <div className="oh-skel" />
        </>
      )}
      {field && type === "edit" && (
        <>
          {langs.map((l, k) => (
            <div key={l.id} className="oh-lang" data-changed={changed(l.id) ? "" : undefined}>
              <div className="oh-lang-h">
                <span className="oh-flag">{l.flag}</span> {l.name}
                {l.id === lang && <span className="oh-badge">Shu sahifa</span>}
                {changed(l.id) && <span className="oh-badge" data-v="changed">O‘zgardi</span>}
                <span className="oh-count">{vals[l.id]?.length ?? 0} belgi</span>
              </div>
              <AutoTextarea value={vals[l.id] ?? ""} onChange={(v) => setVals((s) => ({ ...s, [l.id]: v }))} autoFocus={k === 0} onSubmit={submit} />
            </div>
          ))}
          <div className="oh-info">Matn barcha tillarda bir joyda — tarjimalarni ham shu yerda yangilang. <b>Ctrl + Enter</b> — saqlash.</div>
        </>
      )}
      {field && type === "add" && (
        <>
          <div className="oh-info">
            Yangi element <b>{field.list?.label}</b> ro‘yxatiga <b>{(field.list?.index ?? 0) + 1}-element</b>dan keyin, barcha tillarga qo‘shiladi.
          </div>
          {langs.map((l, k) => (
            <div key={l.id} className="oh-lang">
              <div className="oh-lang-h">
                <span className="oh-flag">{l.flag}</span> {l.name}
                {l.id === lang && <span className="oh-badge">Shu sahifa</span>}
              </div>
              {fields.map((f, j) => (
                <div key={f}>
                  {f && <span className="oh-fl">{SECTION_LABELS[f] ?? f}</span>}
                  <AutoTextarea
                    value={item[l.id]?.[f] ?? ""}
                    autoFocus={k === 0 && j === 0}
                    onChange={(v) => setItem((s) => ({ ...s, [l.id]: { ...s[l.id], [f]: v } }))}
                    onSubmit={submit}
                  />
                </div>
              ))}
            </div>
          ))}
        </>
      )}
      {field && type === "delete" && (
        <>
          <div className="oh-quote">
            <small>O‘chiriladi</small>
            {field.values[lang] ?? Object.values(field.values)[0]}
          </div>
          <div className="oh-info oh-warn">
            Element <b>barcha tillardan</b> (UZ, RU, EN) o‘chiriladi — ro‘yxatlar bir xil bo‘lib qolishi uchun. Kerak bo‘lsa, keyin qaytadan qo‘shish mumkin.
          </div>
        </>
      )}
    </Shell>
  );
}

// Eski sahifalar bloki: matn ichidagi havola va qalin yozuvlar saqlanadi
function RichEditor({ initial, onChange }: { initial: string; onChange: (html: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = initial;
      ref.current.focus();
    }
  }, [initial]);
  const cmd = (c: string, v?: string) => {
    ref.current?.focus();
    document.execCommand(c, false, v);
    onChange(ref.current?.innerHTML ?? "");
  };
  const tool = (label: string, icon: React.ReactNode, fn: () => void) => (
    <button type="button" className="oh-tool" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={fn}>
      {icon}
    </button>
  );
  return (
    <>
      <div className="oh-tools">
        {tool("Qalin", <Bold size={15} />, () => cmd("bold"))}
        {tool("Kursiv", <Italic size={15} />, () => cmd("italic"))}
        {tool("Havola qo‘shish", <Link2 size={15} />, () => {
          const url = prompt("Havola manzili (masalan /blog yoki https://…)", "https://");
          if (url && url !== "https://") cmd("createLink", url);
        })}
        {tool("Havolani olib tashlash", <Unlink size={15} />, () => cmd("unlink"))}
      </div>
      <div
        ref={ref}
        className="oh-rich"
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        onPaste={(e) => {
          // Boshqa saytdan nusxalangan uslublar tushmasin — faqat matn
          e.preventDefault();
          document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
        }}
      />
    </>
  );
}

type BlockField = { name: string; html: string; src?: string; alt?: string; lang: Locale; locked: string | null };

function BlockModal({ action, mode, onClose, onSaved }: ModalProps) {
  const t = action.target as BlockTarget;
  const type = action.type;
  const [block, setBlock] = useState<BlockField | null>(null);
  const [html, setHtml] = useState("");
  const { busy, error, run, setError } = useSubmit(onSaved);

  useEffect(() => {
    api<BlockField>(`/api/admin/field?page=${encodeURIComponent(pagePath())}&n=${t.n}`)
      .then((b) => {
        setBlock(b);
        setHtml(type === "edit" ? b.html : "");
      })
      .catch((e: Error) => setError(e.message));
  }, [t.n, type, setError]);

  const lang = LANGS.find((l) => l.id === block?.lang);
  const name = BLOCK_NAMES[t.tag] ?? t.tag;
  const empty = !html.replace(/<[^>]+>|&nbsp;|\s/g, "");
  const dirty = type !== "delete" && !!block && html !== (type === "edit" ? block.html : "");
  const submit = () => {
    if (busy || !block) return;
    if (type !== "delete" && empty) return setError("Matn bo‘sh bo‘lmasligi kerak.");
    run({ kind: "block", page: pagePath(), n: t.n, op: type, html });
  };
  const plain = (s: string) => {
    const d = document.createElement("div");
    d.innerHTML = s;
    return d.textContent ?? "";
  };

  return (
    <Shell
      icon={type === "edit" ? <Pencil size={20} /> : type === "add" ? <Plus size={20} /> : <Trash2 size={20} />}
      variant={type === "delete" ? "del" : undefined}
      title={type === "edit" ? "Matnni tahrirlash" : type === "add" ? `Yangi ${name.toLowerCase()} qo‘shish` : `${name}ni o‘chirish`}
      crumb={`Sahifa matni › ${name}${lang ? ` · ${lang.flag} ${lang.name}` : ""}`}
      onClose={onClose}
      dirty={dirty && !busy}
      footer={
        <>
          <SaveNote mode={mode} />
          <button type="button" className="oh-btn oh-btn-ghost" onClick={onClose}>Bekor qilish</button>
          {type === "delete" ? (
            <button type="button" className="oh-btn oh-btn-danger" disabled={!block || busy} onClick={submit}>
              {busy ? <Loader2 size={18} className="oh-spin" /> : <Trash2 size={18} />} Ha, o‘chirish
            </button>
          ) : (
            <button type="button" className="oh-btn oh-btn-main" disabled={!block || busy || !dirty || empty} onClick={submit}>
              {busy ? <Loader2 size={18} className="oh-spin" /> : <Check size={18} />} {type === "add" ? "Qo‘shishni tasdiqlash" : "O‘zgarishni tasdiqlash"}
            </button>
          )}
        </>
      }
    >
      {error && <div className="oh-err">{error}</div>}
      {!block && !error && <div className="oh-skel" />}
      {block && type !== "delete" && (
        <div className="oh-lang">
          <div className="oh-lang-h">
            <span className="oh-flag">{lang?.flag}</span> {lang?.name}
            <span className="oh-count">{plain(html).length} belgi</span>
          </div>
          <RichEditor initial={type === "edit" ? block.html : ""} onChange={setHtml} />
        </div>
      )}
      {block && type === "delete" && (
        <div className="oh-quote">
          <small>O‘chiriladi</small>
          {block.name === "img" ? "Rasm" : plain(block.html)}
        </div>
      )}
      {block && (
        <div className="oh-info">
          Bu sahifa matni faqat <b>{lang?.name}</b> tilida. Boshqa tillardagi tarjimasi o‘z sahifasida alohida tahrirlanadi.
          {type === "add" && <> Yangi {name.toLowerCase()} tanlangan blokdan <b>keyin</b> qo‘shiladi.</>}
        </div>
      )}
    </Shell>
  );
}

// ─── Rasm ──────────────────────────────────────────────────────────────────────────────────────────

type Prepared = { name: string; type: string; data: string; width: number; height: number; preview: string; size: number };

const toBase64 = (blob: Blob) =>
  new Promise<string>((ok, fail) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",")[1] ?? "");
    r.onerror = () => fail(r.error);
    r.readAsDataURL(blob);
  });

/** Brauzerda kichraytirish: eng uzun tomoni 1600px, WebP (sayt tez qolsin, Vercel limitiga sig'sin) */
async function prepareImage(file: File): Promise<Prepared> {
  if (!file.type.startsWith("image/")) throw new Error("Faqat rasm fayli tanlang");
  const preview = URL.createObjectURL(file);
  if (file.type === "image/svg+xml") {
    const img = new Image();
    img.src = preview;
    await img.decode().catch(() => {});
    return { name: file.name, type: file.type, data: await toBase64(file), width: img.naturalWidth || 300, height: img.naturalHeight || 300, preview, size: file.size };
  }
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  let blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/webp", 0.86));
  if (!blob || blob.type !== "image/webp") blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, file.type === "image/png" ? "image/png" : "image/jpeg", 0.88));
  if (!blob) throw new Error("Rasmni o‘qib bo‘lmadi");
  return { name: file.name, type: blob.type, data: await toBase64(blob), width: w, height: h, preview: URL.createObjectURL(blob), size: blob.size };
}

function ImageModal({ action, mode, onClose, onSaved }: ModalProps) {
  const t = action.target;
  const isBlock = t.kind === "block";
  const current = (t.el as HTMLImageElement).currentSrc || (t.el as HTMLImageElement).src;
  const [file, setFile] = useState<Prepared | null>(null);
  const [alt, setAlt] = useState("");
  const [over, setOver] = useState(false);
  const [reading, setReading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const { busy, error, run, setError } = useSubmit(onSaved);

  useEffect(() => {
    if (t.kind !== "block") return;
    api<BlockField>(`/api/admin/field?page=${encodeURIComponent(pagePath())}&n=${t.n}`)
      .then((b) => setAlt(b.alt ?? ""))
      .catch(() => {});
  }, [t]);

  const pick = async (f: File | undefined) => {
    if (!f) return;
    setError(null);
    setReading(true);
    try {
      setFile(await prepareImage(f));
    } catch (e) {
      setError((e as Error).message);
    }
    setReading(false);
  };

  const submit = () => {
    if (!file || busy) return;
    const upload = { name: file.name, type: file.type, data: file.data, width: file.width, height: file.height };
    if (t.kind === "block") run({ kind: "block", page: pagePath(), n: t.n, op: "image", alt, upload });
    else if (t.kind === "image") run({ kind: "image", key: t.key, upload });
  };

  return (
    <Shell
      icon={<ImageUp size={20} />}
      title="Rasmni almashtirish"
      crumb={isBlock ? "Sahifa rasmi" : `Rasm · ${(t as ImageTarget).key.split("/").slice(-2).join("/")}`}
      onClose={onClose}
      dirty={!!file && !busy}
      footer={
        <>
          <SaveNote mode={mode} />
          <button type="button" className="oh-btn oh-btn-ghost" onClick={onClose}>Bekor qilish</button>
          <button type="button" className="oh-btn oh-btn-main" disabled={!file || busy} onClick={submit}>
            {busy ? <Loader2 size={18} className="oh-spin" /> : <Check size={18} />} O‘zgarishni tasdiqlash
          </button>
        </>
      }
    >
      {error && <div className="oh-err">{error}</div>}
      <div className="oh-img-row">
        <div className="oh-img-box">
          <span className="oh-img-cap">Hozirgi</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current} alt="" />
        </div>
        <ArrowRight size={22} color="#8aa3b2" />
        <div
          className={`oh-img-box${file ? "" : " oh-drop"}`}
          data-over={over ? "" : undefined}
          role="button"
          tabIndex={0}
          onClick={() => input.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            pick(e.dataTransfer.files[0]);
          }}
        >
          {file ? (
            <>
              <span className="oh-img-cap">Yangi</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={file.preview} alt="" />
            </>
          ) : reading ? (
            <Loader2 size={26} className="oh-spin" />
          ) : (
            <span>
              <ImageUp size={28} />
              <br />
              Rasmni shu yerga tashlang
              <br />
              yoki bosib tanlang
            </span>
          )}
        </div>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      {file && (
        <div className="oh-info">
          {file.width}×{file.height}px · {Math.round(file.size / 1024)} KB · {file.type.replace("image/", "").toUpperCase()}{" "}
          <button type="button" className="oh-tool" style={{ marginLeft: 8 }} onClick={() => input.current?.click()}>Boshqasini tanlash</button>
        </div>
      )}
      {isBlock && (
        <label>
          <span className="oh-fl">Rasm tavsifi (alt) — ko‘rish imkoniyati cheklanganlar va Google uchun</span>
          <input className="oh-input" value={alt} onChange={(e) => setAlt(e.target.value)} />
        </label>
      )}
      {!isBlock && (
        <div className="oh-info">
          Rasm saytning <b>barcha</b> joylarida almashadi. Shakli va o‘lchami eskisiga yaqin bo‘lgani ma’qul (dizayn kesib ko‘rsatadi).
        </div>
      )}
    </Shell>
  );
}
