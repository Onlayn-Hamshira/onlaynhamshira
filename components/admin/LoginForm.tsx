"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, User } from "lucide-react";

const CSS = `
.al{min-height:100dvh;display:grid;place-items:center;padding:24px 16px;color:#0d2f44;
  background:radial-gradient(1200px 600px at 10% -10%,#d8fbdd 0,transparent 60%),radial-gradient(900px 500px at 110% 110%,#baecf9 0,transparent 55%),#f4fbfd}
.al-card{width:100%;max-width:420px;background:#fff;border-radius:28px;padding:36px 32px 28px;
  box-shadow:0 1px 0 #d8edf5,0 24px 60px -24px rgba(13,47,68,.28)}
.al-logo{height:38px;display:block}
.al h1{margin:26px 0 6px;font-size:26px;letter-spacing:-.02em;line-height:1.15}
.al-sub{margin:0 0 24px;color:#4a6577;font-size:15px;line-height:1.5}
.al-field{display:block;margin-bottom:14px}
.al-label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#4a6577}
.al-input{position:relative;display:flex;align-items:center}
.al-input svg.ic{position:absolute;left:14px;color:#8aa3b2;pointer-events:none}
.al-input input{width:100%;box-sizing:border-box;height:50px;border-radius:14px;border:1.5px solid #d8edf5;background:#f7fcfe;
  padding:0 46px 0 42px;font:inherit;font-size:16px;color:inherit;outline:none;transition:border-color .15s,box-shadow .15s,background .15s}
.al-input input:focus{border-color:#2ec9b0;background:#fff;box-shadow:0 0 0 4px rgba(46,201,176,.15)}
.al-eye{position:absolute;right:6px;width:38px;height:38px;border:0;background:none;border-radius:10px;color:#4a6577;cursor:pointer;display:grid;place-items:center}
.al-eye:hover{background:#eefbff}
.al-btn{margin-top:8px;width:100%;height:52px;border:0;border-radius:999px;cursor:pointer;color:#fff;font:inherit;font-weight:700;font-size:16px;
  display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(100deg,#1bb3f7,#2ec9b0 55%,#54de62);
  box-shadow:0 10px 24px -10px rgba(46,201,176,.8);transition:transform .15s,filter .15s}
.al-btn:hover{transform:translateY(-1px);filter:brightness(1.04)}
.al-btn:disabled{opacity:.6;cursor:wait;transform:none}
.al-err{margin:0 0 14px;padding:10px 14px;border-radius:12px;background:#fdecec;color:#b42323;font-size:14px}
.al-note{margin:18px 0 0;padding:12px 14px;border-radius:14px;background:#eefbff;color:#4a6577;font-size:13px;line-height:1.5}
.al-note b{color:#0d2f44}
.al-warn{background:#fff7e0;color:#7a5600}
`;

export function LoginForm({ next, configured, devHint, readonly }: { next: string; configured: boolean; devHint: boolean; readonly: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Kirib bo‘lmadi");
      // To'liq yuklash: sahifa tahrirlash rejimida (draft) qayta chiziladi
      location.href = next;
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="al">
      <style>{CSS}</style>
      <form className="al-card" onSubmit={submit}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="al-logo" src="/logo-v2.svg" alt="Onlayn Hamshira" />
        <h1>Tahrirlash paneli</h1>
        <p className="al-sub">Kirgandan so‘ng sayt o‘zi ochiladi — har bir matn va rasm yonidagi <b>⋯</b> tugmasi orqali tahrirlaysiz.</p>
        {error && <p className="al-err" role="alert">{error}</p>}
        <label className="al-field">
          <span className="al-label">Login</span>
          <span className="al-input">
            <User className="ic" size={18} />
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required autoFocus disabled={!configured} />
          </span>
        </label>
        <label className="al-field">
          <span className="al-label">Parol</span>
          <span className="al-input">
            <Lock className="ic" size={18} />
            <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required disabled={!configured} />
            <button type="button" className="al-eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Parolni yashirish" : "Parolni ko‘rsatish"}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        <button className="al-btn" disabled={busy || !configured}>
          <LogIn size={18} /> {busy ? "Kirilmoqda…" : "Kirish"}
        </button>
        {!configured && <p className="al-note al-warn">Login sozlanmagan: Vercel'da <b>ADMIN_USERNAME</b> va <b>ADMIN_PASSWORD</b> muhit o‘zgaruvchilarini qo‘shing.</p>}
        {readonly && <p className="al-note al-warn">Saqlash sozlanmagan: o‘zgarishlar saytga chiqishi uchun <b>GITHUB_TOKEN</b> kerak.</p>}
        {devHint && <p className="al-note">Lokal sinov: login <b>admin</b>, parol <b>admin12345</b></p>}
      </form>
    </main>
  );
}
