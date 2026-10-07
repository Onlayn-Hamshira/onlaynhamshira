// Admin o'zgarishlarini saqlash joyi. O'zgarishlar avval QORALAMA bo'lib saqlanadi (faqat admin ko'radi),
// "Nashr qilish" bosilganda asosiy versiyaga o'tadi va Vercel saytni qayta yasaydi.
//  • github — GITHUB_TOKEN bor bo'lsa: qoralama — admin-drafts branch'idagi BITTA commit (har saqlashda yangilanadi),
//    nashr — main'ga BITTA commit (1 ta yoki 10 ta o'zgarish — bitta deploy). admin-drafts Vercel'da deploy qilinmaydi (vercel.json).
//  • local  — lokal ishlab chiqish (next dev): qoralama — .admin-drafts/ papkasi, nashr — fayllarni joyiga ko'chirish.
//  • readonly — Vercel'da token yo'q: o'qish mumkin, saqlab bo'lmaydi.

import fs from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO ?? "AsilbekXoliyorov441/onlaynhamshira-demo";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const DRAFT = process.env.GITHUB_DRAFT_BRANCH ?? "admin-drafts";
// GITHUB_API — GitHub Enterprise yoki sinov uchun (standart: api.github.com)
const API = `${process.env.GITHUB_API ?? "https://api.github.com"}/repos/${REPO}`;
const LOCAL_DRAFT_DIR = ".admin-drafts";
const LOCAL_LOG = `${LOCAL_DRAFT_DIR}/.log.json`;

export type StoreMode = "github" | "local" | "readonly";
export const storeMode = (): StoreMode => (TOKEN ? "github" : process.env.VERCEL ? "readonly" : "local");

export class StoreError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
  }
}

async function gh(url: string, init: RequestInit = {}) {
  return fetch(url.startsWith("http") ? url : API + url, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

function ghError(status: number, body: string) {
  if (status === 401) return new StoreError("GitHub token yaroqsiz yoki muddati tugagan (GITHUB_TOKEN).", 502);
  if (status === 403 || status === 404)
    return new StoreError(`GitHub token ${REPO} repoga yoza olmaydi: tokenga shu repo va "Contents: Read and write" ruxsatini bering.`, 502);
  return new StoreError(`GitHub ${status}: ${body.slice(0, 200)}`, 502);
}

async function ghJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await gh(url, init);
  if (!res.ok) throw ghError(res.status, await res.text());
  return res.json() as Promise<T>;
}

// turbopackIgnore: diskdan o'qish/yozish faqat lokal rejimda — butun loyiha serverless funksiyaga tushmasin
const abs = (rel: string) => path.join(/*turbopackIgnore: true*/ process.cwd(), rel);

/** Repo ildizidan nisbiy yo'l ("content/edits/text.json"): qoralamadagi holat, bo'lmasa asosiy versiya */
export async function readFile(rel: string): Promise<Buffer> {
  if (storeMode() !== "github") {
    if (storeMode() === "local") {
      const draft = await fs.readFile(abs(`${LOCAL_DRAFT_DIR}/${rel}`)).catch(() => null);
      if (draft) return draft;
    }
    return fs.readFile(abs(rel));
  }
  for (const ref of [DRAFT, BRANCH]) {
    const res = await gh(`/contents/${rel}?ref=${ref}`, { headers: { Accept: "application/vnd.github.raw" } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status !== 404) throw ghError(res.status, await res.text());
  }
  throw new StoreError(`Fayl topilmadi: ${rel}`, 404);
}

export const readJson = async <T,>(rel: string): Promise<T> => JSON.parse((await readFile(rel)).toString("utf8")) as T;

export type FileChange = { path: string; content: string | Buffer };

const refSha = async (branch: string) => {
  const res = await gh(`/git/ref/heads/${branch}`);
  if (res.status === 404) return null;
  if (!res.ok) throw ghError(res.status, await res.text());
  return ((await res.json()) as { object: { sha: string } }).object.sha;
};

type GitCommit = { sha: string; message: string; tree: { sha: string }; parents: { sha: string }[] };
const getCommit = (sha: string) => ghJson<GitCommit>(`/git/commits/${sha}`);

type TreeEntry = { path: string; mode: "100644"; type: "blob"; sha: string | null };
const createTree = async (base: string, tree: TreeEntry[]) =>
  tree.length ? (await ghJson<{ sha: string }>("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: base, tree }) })).sha : base;

/** Qoralama yozuvidagi o'zgarishlar ro'yxati: commit xabaridagi "- ..." qatorlar */
const changeLog = (message: string) => message.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2));

/**
 * Qoralama — main ustidagi BITTA commit (har saqlashda almashtiriladi, GitHub'da o'zgarishlar bittadan tushmaydi).
 * main oldinga ketgan bo'lsa (dasturchi push qilgan), qoralamadagi fayllar yangi main ustiga ko'chiriladi.
 */
async function draftState() {
  const main = await refSha(BRANCH);
  if (!main) throw new StoreError(`${BRANCH} branch topilmadi`, 502);
  const mainCommit = await getCommit(main);
  const draftSha = await refSha(DRAFT);
  if (!draftSha) return { main, tree: mainCommit.tree.sha, log: [] as string[] };
  const draft = await getCommit(draftSha);
  const log = changeLog(draft.message);
  const parent = draft.parents[0]?.sha;
  if (parent === main) return { main, tree: draft.tree.sha, log };
  const cmp = await ghJson<{ files: { filename: string; sha: string; status: string }[] }>(`/compare/${parent}...${draftSha}`);
  const tree = await createTree(
    mainCommit.tree.sha,
    cmp.files.map((f) => ({ path: f.filename, mode: "100644", type: "blob", sha: f.status === "removed" ? null : f.sha })),
  );
  return { main, tree, log };
}

const draftMessage = (log: string[]) => `Admin draft: ${log.length} unpublished change(s)\n\n${log.map((l) => `- ${l}`).join("\n")}`;

/** Fayllarni qoralamaga yozadi (saytga chiqmaydi — publish() kerak) */
export async function commit(build: () => Promise<FileChange[]>, message: string): Promise<void> {
  const mode = storeMode();
  if (mode === "readonly") throw new StoreError("Saqlash sozlanmagan: Vercel'da GITHUB_TOKEN muhit o'zgaruvchisini qo'shing.", 503);
  if (mode === "local") {
    for (const f of await build()) {
      const file = abs(`${LOCAL_DRAFT_DIR}/${f.path}`);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, f.content);
    }
    const log = JSON.parse(await fs.readFile(abs(LOCAL_LOG), "utf8").catch(() => "[]")) as string[];
    await fs.writeFile(abs(LOCAL_LOG), JSON.stringify([...log, message]));
    return;
  }

  const state = await draftState();
  const files = await build();
  const blobs = await Promise.all(
    files.map(async (f): Promise<TreeEntry> => {
      const blob = await ghJson<{ sha: string }>("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: Buffer.from(f.content).toString("base64"), encoding: "base64" }),
      });
      return { path: f.path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );
  const tree = await createTree(state.tree, blobs);
  const c = await ghJson<{ sha: string }>("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message: draftMessage([...state.log, message.split("\n")[0]]), tree, parents: [state.main] }),
  });
  const exists = await refSha(DRAFT);
  const res = exists
    ? await gh(`/git/refs/heads/${DRAFT}`, { method: "PATCH", body: JSON.stringify({ sha: c.sha, force: true }) })
    : await gh("/git/refs", { method: "POST", body: JSON.stringify({ ref: `refs/heads/${DRAFT}`, sha: c.sha }) });
  if (!res.ok) throw ghError(res.status, await res.text());
}

export type Pending = { count: number; changes: string[] };

/** Nashr qilinmagan o'zgarishlar ro'yxati */
export async function pending(): Promise<Pending> {
  const mode = storeMode();
  if (mode === "readonly") return { count: 0, changes: [] };
  if (mode === "local") {
    const log = JSON.parse(await fs.readFile(abs(LOCAL_LOG), "utf8").catch(() => "[]")) as string[];
    return { count: log.length, changes: log.map((m) => m.split("\n")[0]) };
  }
  const draft = await refSha(DRAFT);
  if (!draft) return { count: 0, changes: [] };
  const changes = changeLog((await getCommit(draft)).message);
  return { count: changes.length, changes };
}

export type PublishResult = { sha?: string; url?: string };

/** Qoralamadagi barcha o'zgarishlarni saytga chiqarish: main'ga BITTA commit → Vercel bitta deploy */
export async function publish(user: string): Promise<PublishResult> {
  const mode = storeMode();
  if (mode === "readonly") throw new StoreError("Saqlash sozlanmagan: Vercel'da GITHUB_TOKEN muhit o'zgaruvchisini qo'shing.", 503);
  if (mode === "local") {
    const walk = async (dir: string): Promise<string[]> => {
      const out: string[] = [];
      for (const e of await fs.readdir(abs(dir), { withFileTypes: true }).catch(() => [])) {
        const rel = `${dir}/${e.name}`;
        if (e.isDirectory()) out.push(...(await walk(rel)));
        else if (rel !== LOCAL_LOG) out.push(rel);
      }
      return out;
    };
    for (const f of await walk(LOCAL_DRAFT_DIR)) {
      const target = abs(f.slice(LOCAL_DRAFT_DIR.length + 1));
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.copyFile(abs(f), target);
    }
    await fs.rm(abs(LOCAL_DRAFT_DIR), { recursive: true, force: true });
    return {};
  }
  for (let attempt = 0; ; attempt++) {
    if (!(await refSha(DRAFT))) throw new StoreError("Nashr qilinadigan o‘zgarish yo‘q.", 400);
    const state = await draftState();
    if (!state.log.length) throw new StoreError("Nashr qilinadigan o‘zgarish yo‘q.", 400);
    const c = await ghJson<{ sha: string; html_url: string }>("/git/commits", {
      method: "POST",
      body: JSON.stringify({
        message: `Publish ${state.log.length} content change(s) from the admin panel\n\n${state.log.map((l) => `- ${l}`).join("\n")}\n\nPublished by ${user}.`,
        tree: state.tree,
        parents: [state.main],
      }),
    });
    const upd = await gh(`/git/refs/heads/${BRANCH}`, { method: "PATCH", body: JSON.stringify({ sha: c.sha, force: false }) });
    if (upd.ok) {
      await gh(`/git/refs/heads/${DRAFT}`, { method: "DELETE" });
      return { sha: c.sha, url: c.html_url };
    }
    // Oraliqda main o'zgargan — qayta urinish
    if (upd.status !== 422 || attempt >= 2) throw ghError(upd.status, await upd.text());
  }
}

/** Nashr qilinmagan barcha o'zgarishlarni bekor qilish */
export async function discard(): Promise<void> {
  const mode = storeMode();
  if (mode === "readonly") return;
  if (mode === "local") return fs.rm(abs(LOCAL_DRAFT_DIR), { recursive: true, force: true });
  const res = await gh(`/git/refs/heads/${DRAFT}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404 && res.status !== 422) throw ghError(res.status, await res.text());
}

export type DeployState = "pending" | "success" | "failure" | "unknown";

/** Commit uchun Vercel deploy holati (Vercel GitHub'ga deployment status yozadi) */
export async function deployState(sha: string): Promise<DeployState> {
  if (storeMode() !== "github") return "unknown";
  const deps = await ghJson<{ id: number; environment: string }[]>(`/deployments?sha=${sha}&per_page=10`);
  const dep = deps.find((d) => /production/i.test(d.environment)) ?? deps[0];
  if (dep) {
    const [st] = await ghJson<{ state: string }[]>(`/deployments/${dep.id}/statuses?per_page=1`);
    if (!st) return "pending";
    if (st.state === "success") return "success";
    if (st.state === "failure" || st.state === "error") return "failure";
    return "pending";
  }
  // Deployment hali yaratilmagan bo'lsa — commit status (Vercel check)
  const s = await ghJson<{ state: string; total_count: number }>(`/commits/${sha}/status`);
  if (!s.total_count) return "pending";
  return s.state === "success" ? "success" : s.state === "failure" || s.state === "error" ? "failure" : "pending";
}
