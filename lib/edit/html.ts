// Eski Tilda sahifalari (content/legacy/*.json → html) uchun blok darajasida tahrirlash.
// Har bir matn bloki (p, h2, li, …) va rasm HTML'dagi tartib raqami bilan aniqlanadi: admin rejimida
// unga data-oh="N" qo'yiladi, saqlashda xuddi shu N-blok asl HTML'da topilib almashtiriladi.

const BLOCKS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "figcaption", "blockquote", "td", "th", "dt", "dd", "img"]);
const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;

type Block = { n: number; name: string; start: number; openEnd: number; closeStart: number; end: number };

function* openings(html: string) {
  let n = 0;
  for (const m of html.matchAll(TAG_RE)) {
    const name = m[2].toLowerCase();
    if (m[1] || !BLOCKS.has(name)) continue;
    yield { n: n++, name, start: m.index!, openEnd: m.index! + m[0].length };
  }
}

function locate(html: string, n: number): Block | null {
  for (const o of openings(html)) {
    if (o.n !== n) continue;
    if (o.name === "img") return { ...o, closeStart: o.openEnd, end: o.openEnd };
    // Mos yopuvchi teg (ichma-ich bir xil teglar hisobga olinadi: <li> ichida <ul><li>)
    let depth = 1;
    const re = new RegExp(`<(/?)${o.name}\\b(?:[^>"']|"[^"]*"|'[^']*')*>`, "gi");
    re.lastIndex = o.openEnd;
    for (let m; (m = re.exec(html)); ) {
      depth += m[1] ? -1 : 1;
      if (!depth) return { ...o, closeStart: m.index, end: m.index + m[0].length };
    }
    return null;
  }
  return null;
}

/** Admin rejimi: har bir blokka data-oh="N" */
export function annotate(html: string): string {
  let out = "", last = 0;
  for (const o of openings(html)) {
    const at = o.start + 1 + o.name.length;
    out += html.slice(last, at) + ` data-oh="${o.n}"`;
    last = at;
  }
  return out + html.slice(last);
}

const attrs = (tag: string) => {
  const map = new Map<string, string>();
  for (const m of tag.replace(/^<\w+|\/?>$/g, "").matchAll(/([\w:-]+)(?:\s*=\s*"([^"]*)")?/g)) map.set(m[1].toLowerCase(), m[2] ?? "");
  return map;
};
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export type BlockInfo = { name: string; html: string; src?: string; alt?: string; width?: number; height?: number };

export function getBlock(html: string, n: number): BlockInfo | null {
  const b = locate(html, n);
  if (!b) return null;
  if (b.name === "img") {
    const a = attrs(html.slice(b.start, b.openEnd));
    return { name: "img", html: "", src: a.get("src"), alt: a.get("alt") ?? "", width: Number(a.get("width")) || undefined, height: Number(a.get("height")) || undefined };
  }
  return { name: b.name, html: html.slice(b.openEnd, b.closeStart).trim() };
}

export type BlockOp =
  | { op: "edit"; html: string }
  | { op: "add"; html: string }
  | { op: "delete" }
  | { op: "image"; src: string; alt: string; width: number; height: number };

export function applyBlockOp(html: string, n: number, action: BlockOp): string {
  const b = locate(html, n);
  if (!b) throw new Error("Blok topilmadi — sahifa boshqa joyda o‘zgargan bo‘lishi mumkin. Sahifani yangilang.");
  if (b.name === "h1") throw new Error("SEO: sahifa H1 sarlavhasi Tilda bilan bir xil bo‘lishi shart — o‘zgartirilmaydi.");
  const before = html.slice(0, b.start), after = html.slice(b.end);
  switch (action.op) {
    case "delete":
      return before + after;
    case "edit":
      if (b.name === "img") throw new Error("Rasm uchun 'image' amalidan foydalaning");
      return html.slice(0, b.openEnd) + sanitize(action.html) + html.slice(b.closeStart);
    case "add": {
      if (b.name === "img") throw new Error("Rasmdan keyin matn qo‘shib bo‘lmaydi");
      // Xuddi shu turdagi yangi blok (id'siz — langarlar takrorlanmasin)
      const open = html.slice(b.start, b.openEnd).replace(/\s(id|data-oh)="[^"]*"/g, "");
      return html.slice(0, b.end) + ` ${open}${sanitize(action.html)}</${b.name}>` + after;
    }
    case "image": {
      if (b.name !== "img") throw new Error("Bu blok rasm emas");
      const a = attrs(html.slice(b.start, b.openEnd));
      // srcset/sizes eski rasmga tegishli; o'lcham — yangi rasmniki (CLS bo'lmasin)
      for (const k of ["srcset", "sizes", "src", "alt", "width", "height", "style"]) a.delete(k);
      a.set("src", action.src);
      a.set("alt", action.alt);
      a.set("width", String(action.width));
      a.set("height", String(action.height));
      a.set("style", `aspect-ratio:${action.width}/${action.height};max-width:min(100%,840px)`);
      if (!a.has("loading") && !a.has("fetchpriority")) a.set("loading", "lazy");
      if (!a.has("decoding")) a.set("decoding", "async");
      const tag = `<img ${[...a].map(([k, v]) => `${k}="${esc(v)}"`).join(" ")}>`;
      return before + tag + after;
    }
  }
}

// Ruxsat etilgan ichki teglar: havola va matn bezaklari. Qolganlari olib tashlanadi (matni qoladi).
const INLINE = new Set(["a", "strong", "b", "em", "i", "u", "s", "br", "span", "sup", "sub", "code", "mark"]);

export function sanitize(html: string): string {
  return html
    .replace(/[⁣⁤​‌‍⁠]/g, "")
    .replace(/<(script|style|iframe|object|embed|template)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(TAG_RE, (tag, close: string, rawName: string) => {
      const name = rawName.toLowerCase();
      if (!INLINE.has(name)) return name === "div" || name === "p" ? (close ? "<br>" : "") : "";
      if (close) return name === "br" ? "" : `</${name}>`;
      if (name !== "a") return `<${name}>`;
      const a = attrs(tag);
      const href = (a.get("href") ?? "").trim();
      if (!/^(https?:|\/|#|tel:|mailto:)/i.test(href)) return "<a>";
      const ext = /^https?:/i.test(href) && !/^https?:\/\/(www\.)?onlaynhamshira\.uz/i.test(href);
      return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>`;
    })
    .replace(/(<br>\s*)+$/g, "")
    .trim();
}
