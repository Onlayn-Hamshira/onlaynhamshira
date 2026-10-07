// Admin o'zgarishlarini saqlash joyi.
//  • github — GITHUB_TOKEN bor bo'lsa: fayllar bitta commit bilan repoga yoziladi, Vercel avtomatik qayta yasaydi.
//  • local  — lokal ishlab chiqish (next dev): fayllar diskka yoziladi.
//  • readonly — Vercel'da token yo'q: o'qish mumkin, saqlab bo'lmaydi.

import fs from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO ?? "AsilbekXoliyorov441/onlaynhamshira-demo";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const API = `https://api.github.com/repos/${REPO}`;

export type StoreMode = "github" | "local" | "readonly";
export const storeMode = (): StoreMode => (TOKEN ? "github" : process.env.VERCEL ? "readonly" : "local");

async function gh(url: string, init: RequestInit = {}) {
  const res = await fetch(url.startsWith("http") ? url : API + url, {
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
  return res;
}

async function ghJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await gh(url, init);
  if (!res.ok) throw new StoreError(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`, res.status);
  return res.json() as Promise<T>;
}

export class StoreError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
  }
}

/** Repo ildizidan nisbiy yo'l: "content/edits/text.json" */
export async function readFile(rel: string): Promise<Buffer> {
  // turbopackIgnore: diskdan o'qish/yozish faqat lokal rejimda — butun loyiha serverless funksiyaga tushmasin
  if (storeMode() !== "github") return fs.readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), rel));
  const res = await gh(`/contents/${rel}?ref=${BRANCH}`, { headers: { Accept: "application/vnd.github.raw" } });
  if (!res.ok) throw new StoreError(`GitHub ${res.status}: ${rel}`, res.status);
  return Buffer.from(await res.arrayBuffer());
}

export const readJson = async <T,>(rel: string): Promise<T> => JSON.parse((await readFile(rel)).toString("utf8")) as T;

export type FileChange = { path: string; content: string | Buffer };
export type CommitResult = { sha?: string; url?: string };

/**
 * Fayllarni bitta commit bilan yozadi. build() har urinishda qaytadan chaqiriladi: oraliqda boshqa
 * o'zgarish tushgan bo'lsa (fast-forward bo'lmasa) eng so'nggi holat ustidan qayta quriladi.
 */
export async function commit(build: () => Promise<FileChange[]>, message: string): Promise<CommitResult> {
  const mode = storeMode();
  if (mode === "readonly") throw new StoreError("Saqlash sozlanmagan: Vercel'da GITHUB_TOKEN muhit o'zgaruvchisini qo'shing.", 503);
  if (mode === "local") {
    for (const f of await build()) {
      const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), f.path);
      await fs.mkdir(path.dirname(abs), { recursive: true });
      await fs.writeFile(abs, f.content);
    }
    return {};
  }

  for (let attempt = 0; ; attempt++) {
    const ref = await ghJson<{ object: { sha: string } }>(`/git/ref/heads/${BRANCH}`);
    const parent = ref.object.sha;
    const base = await ghJson<{ tree: { sha: string } }>(`/git/commits/${parent}`);
    const files = await build();
    const tree = await Promise.all(
      files.map(async (f) => {
        const blob = await ghJson<{ sha: string }>("/git/blobs", {
          method: "POST",
          body: JSON.stringify({ content: Buffer.from(f.content).toString("base64"), encoding: "base64" }),
        });
        return { path: f.path, mode: "100644", type: "blob", sha: blob.sha };
      }),
    );
    const newTree = await ghJson<{ sha: string }>("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: base.tree.sha, tree }) });
    const c = await ghJson<{ sha: string; html_url: string }>("/git/commits", {
      method: "POST",
      body: JSON.stringify({ message, tree: newTree.sha, parents: [parent] }),
    });
    const upd = await gh(`/git/refs/heads/${BRANCH}`, { method: "PATCH", body: JSON.stringify({ sha: c.sha, force: false }) });
    if (upd.ok) return { sha: c.sha, url: c.html_url };
    if (upd.status !== 422 || attempt >= 2) throw new StoreError(`GitHub ${upd.status}: ${(await upd.text()).slice(0, 200)}`, upd.status);
  }
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
