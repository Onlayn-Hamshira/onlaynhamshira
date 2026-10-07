// Admin amallarini bajarish: tahrirlash, qo'shish, o'chirish, rasm almashtirish → bitta commit.

import { LOCALES, type Locale } from "@/lib/i18n/config";
import { getRawDictionary } from "@/lib/i18n/get-dictionary";
import { WHY } from "@/lib/why";
import { EXPERT } from "@/lib/expert";
import { legacyFile, type LegacyPage } from "@/lib/seo/legacy";
import { EDITABLE_IMAGE_PREFIXES } from "./edits";
import { applyBlockOp, getBlock, type BlockOp } from "./html";
import { IMAGES_FILE, TEXT_FILE } from "./admin";
import { commit, readJson, type FileChange } from "./store";
import {
  LIST_REASON, LOCK_REASON, applyOverrides, getPath, isLocked, isSource, listOf, pathLabel, stegaStrip,
  type Source, type TextEdits,
} from "./shared";

export class InputError extends Error {}

const rawSource = async (source: Source, lang: Locale): Promise<unknown> =>
  source === "dict" ? getRawDictionary(lang) : source === "why" ? WHY[lang] : EXPERT[lang];

/** "dict:uz:faq.items.3.q" → manba va yo'l (til ID'da bor, lekin amallar uch tilga birdan) */
export function parseId(id: unknown): { source: Source; path: string } {
  const m = typeof id === "string" ? id.match(/^(\w+):(\w+):([\w.]+)$/) : null;
  if (!m || !isSource(m[1])) throw new InputError("Noto‘g‘ri matn manzili");
  return { source: m[1], path: m[3] };
}

const clean = (v: unknown, max = 10000) => {
  if (typeof v !== "string") throw new InputError("Matn kutilgan edi");
  const s = stegaStrip(v);
  if (s.length > max) throw new InputError(`Matn juda uzun (${max} belgidan oshmasin)`);
  return s;
};

// ─── O'qish (modal uchun) ─────────────────────────────────────────────────────────────────────────

export async function readTextField(id: string) {
  const { source, path } = parseId(id);
  const edits = await readJson<TextEdits>(TEXT_FILE);
  const values: Partial<Record<Locale, string>> = {};
  let item: unknown;
  for (const l of LOCALES) {
    const cur = applyOverrides(await rawSource(source, l), edits[source]?.[l], source);
    const v = getPath(cur, path);
    if (typeof v === "string") values[l] = v;
    const li = listOf(source, path);
    if (li && l === "uz") item = (getPath(cur, li.list) as unknown[] | undefined)?.[li.index];
  }
  if (!Object.keys(values).length) throw new InputError("Matn topilmadi");
  const li = listOf(source, path);
  return {
    kind: "text" as const,
    id,
    label: pathLabel(source, path),
    values,
    locked: isLocked(source, path) ? LOCK_REASON : null,
    list: li ? { ...li, label: pathLabel(source, li.list) } : null,
    listReason: li ? null : LIST_REASON,
    // Yangi element shakli: matnli ro'yxat — null, obyektlar — maydon nomlari
    itemFields: item && typeof item === "object" ? Object.keys(item).filter((k) => typeof (item as Record<string, unknown>)[k] === "string") : null,
  };
}

export async function readBlock(page: string, n: number) {
  const file = legacyFile(page);
  if (!file) throw new InputError("Sahifa topilmadi");
  const pg = await readJson<LegacyPage>(file);
  const b = getBlock(pg.html, n);
  if (!b) throw new InputError("Blok topilmadi — sahifani yangilang");
  return {
    kind: "block" as const,
    ...b,
    lang: pg.contentLang,
    locked: b.name === "h1" ? "SEO: sahifa H1 sarlavhasi Tilda bilan bir xil bo‘lishi shart — o‘zgartirilmaydi." : null,
  };
}

// ─── Saqlash ──────────────────────────────────────────────────────────────────────────────────────

export type Upload = { name: string; type: string; data: string; width: number; height: number };

const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/svg+xml": "svg", "image/avif": "avif", "image/gif": "gif" };

function prepareUpload(u: Upload | undefined): { file: FileChange; publicPath: string; width: number; height: number } {
  if (!u || typeof u.data !== "string") throw new InputError("Rasm yuklanmadi");
  const ext = EXT[u.type];
  if (!ext) throw new InputError("Faqat WebP, JPG, PNG, SVG, AVIF yoki GIF rasm");
  const buf = Buffer.from(u.data, "base64");
  if (buf.length > 4 * 1024 * 1024) throw new InputError("Rasm 4 MB dan katta");
  if (ext === "svg" && /<script|\son\w+\s*=|javascript:/i.test(buf.toString("utf8"))) throw new InputError("SVG ichida skript bor");
  const slug = (u.name || "rasm").toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "rasm";
  const d = new Date();
  // Nomi har safar yangi: /uploads keshda 30 kun turadi (next.config.ts)
  const rel = `uploads/${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}/${Date.now().toString(36)}-${slug}.${ext}`;
  const width = Math.round(Number(u.width)), height = Math.round(Number(u.height));
  if (!(width > 0 && height > 0)) throw new InputError("Rasm o‘lchami aniqlanmadi");
  return { file: { path: `public/${rel}`, content: buf }, publicPath: `/${rel}`, width, height };
}

const json = (v: unknown) => JSON.stringify(v, null, 2) + "\n";

type SaveBody = Record<string, unknown>;

export async function save(body: SaveBody, user: string) {
  const kind = body.kind;
  if (kind === "text") return saveText(body, user);
  if (kind === "block") return saveBlock(body, user);
  if (kind === "image") return saveImage(body, user);
  throw new InputError("Noma’lum amal");
}

async function saveText(body: SaveBody, user: string) {
  const { source, path } = parseId(body.id);
  const op = body.op;
  if (isLocked(source, path)) throw new InputError(LOCK_REASON);
  const li = listOf(source, path);
  if ((op === "add" || op === "delete") && !li) throw new InputError(LIST_REASON);
  if (op !== "edit" && op !== "add" && op !== "delete") throw new InputError("Noma’lum amal");

  const values = (body.values ?? {}) as Record<string, unknown>;
  const build = async (): Promise<FileChange[]> => {
    const edits = await readJson<TextEdits>(TEXT_FILE);
    edits[source] ??= { uz: {}, ru: {}, en: {} };
    for (const l of LOCALES) {
      const ov = (edits[source][l] ??= {});
      const raw = await rawSource(source, l);
      const cur = applyOverrides(raw, ov, source);
      if (op === "edit") {
        if (!(l in values)) continue;
        if (typeof getPath(cur, path) !== "string") continue;
        const v = clean(values[l]);
        // Asl qiymatga qaytarilsa yozuv o'chadi (ro'yxat butunlay almashtirilmagan bo'lsa)
        const ancestor = Object.keys(ov).some((k) => k !== path && path.startsWith(k + "."));
        if (getPath(raw, path) === v && !ancestor) delete ov[path];
        else ov[path] = v;
        continue;
      }
      const list = getPath(cur, li!.list);
      if (!Array.isArray(list)) continue;
      const arr = structuredClone(list) as unknown[];
      if (op === "delete") {
        if (arr.length <= 1) throw new InputError("Ro‘yxatda kamida bitta element qolishi kerak");
        arr.splice(li!.index, 1);
      } else {
        const v = values[l];
        const tpl = arr[li!.index];
        if (typeof tpl === "string") arr.splice(li!.index + 1, 0, clean(v));
        else if (tpl && typeof tpl === "object" && v && typeof v === "object") {
          const item: Record<string, unknown> = {};
          for (const [k, x] of Object.entries(tpl)) if (typeof x === "string") item[k] = clean((v as Record<string, unknown>)[k] ?? "");
          arr.splice(li!.index + 1, 0, item);
        } else throw new InputError(`${l.toUpperCase()}: yangi element matni yo‘q`);
      }
      for (const k of Object.keys(ov)) if (k.startsWith(li!.list + ".")) delete ov[k];
      ov[li!.list] = arr;
    }
    return [{ path: TEXT_FILE, content: json(edits) }];
  };
  const verb = op === "edit" ? "Edit" : op === "add" ? "Add item to" : "Remove item from";
  const target = op === "edit" ? path : `${li!.list} (#${li!.index + 1})`;
  return commit(build, `${verb} ${source} text: ${target}\n\nSaved from the admin panel by ${user}.`);
}

async function saveBlock(body: SaveBody, user: string) {
  const page = String(body.page ?? "");
  const n = Number(body.n);
  const file = legacyFile(page);
  if (!file || !Number.isInteger(n) || n < 0) throw new InputError("Sahifa yoki blok noto‘g‘ri");
  const op = body.op;
  let action: BlockOp;
  let extra: FileChange[] = [];
  if (op === "edit" || op === "add") {
    const html = clean(body.html, 20000);
    if (!html.replace(/<[^>]+>|&nbsp;|\s/g, "")) throw new InputError("Matn bo‘sh");
    action = { op, html };
  } else if (op === "delete") action = { op };
  else if (op === "image") {
    const up = prepareUpload(body.upload as Upload);
    extra = [up.file];
    action = { op, src: up.publicPath, alt: clean(body.alt ?? "", 300), width: up.width, height: up.height };
  } else throw new InputError("Noma’lum amal");

  const build = async (): Promise<FileChange[]> => {
    const pg = await readJson<LegacyPage>(file);
    let html: string;
    try {
      html = applyBlockOp(pg.html, n, action);
    } catch (e) {
      throw new InputError((e as Error).message);
    }
    // Fayl formati o'zgarmaydi (bir qatorli JSON) — git diff kichik bo'ladi
    return [...extra, { path: file, content: JSON.stringify({ ...pg, html }) }];
  };
  const verb = { edit: "Edit", add: "Add", delete: "Remove", image: "Replace image" }[op];
  return commit(build, `${verb} block #${n} on ${page}\n\nSaved from the admin panel by ${user}.`);
}

async function saveImage(body: SaveBody, user: string) {
  const key = String(body.key ?? "");
  if (!EDITABLE_IMAGE_PREFIXES.some((p) => key.startsWith(p)) || key.includes("..")) throw new InputError("Bu rasmni almashtirib bo‘lmaydi");
  const up = prepareUpload(body.upload as Upload);
  const build = async (): Promise<FileChange[]> => {
    const images = await readJson<Record<string, string>>(IMAGES_FILE);
    images[key] = up.publicPath;
    return [up.file, { path: IMAGES_FILE, content: json(images) }];
  };
  return commit(build, `Replace image ${key}\n\nSaved from the admin panel by ${user}.`);
}
