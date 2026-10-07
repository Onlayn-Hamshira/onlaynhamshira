// Tahrirlash qatlami uslublari — <style> orqali faqat admin rejimida qo'shiladi (sayt CSS'iga tushmaydi).
// Barcha klasslar "oh-" bilan boshlanadi: sayt uslublari bilan to'qnashmasin.

export const ADMIN_CSS = `
[data-oh-ui]{--oh-ink:#0d2f44;--oh-soft:#4a6577;--oh-line:#d8edf5;--oh-teal:#2ec9b0;--oh-green:#3cdc6d;--oh-blue:#1bb3f7;--oh-red:#d93a3a;
  --oh-grad:linear-gradient(100deg,#1bb3f7,#2ec9b0 55%,#54de62);font-family:var(--font-onest),ui-sans-serif,system-ui,sans-serif;color:var(--oh-ink);
  font-size:15px;line-height:1.45;letter-spacing:normal;text-align:left}
[data-oh-ui] *,[data-oh-ui] *::before,[data-oh-ui] *::after{box-sizing:border-box}
.oh-layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000}
.oh-outline{position:fixed;left:0;top:0;border:2px dashed var(--oh-teal);border-radius:8px;background:rgba(46,201,176,.06);
  pointer-events:none;transition:opacity .12s;will-change:transform}
.oh-mark{position:fixed;left:0;top:0;width:24px;height:24px;border-radius:999px;border:2px solid #fff;padding:0;cursor:pointer;pointer-events:auto;
  display:grid;place-items:center;color:#fff;background:var(--oh-teal);box-shadow:0 2px 8px rgba(13,47,68,.28);opacity:.82;
  transition:opacity .12s,transform .12s,background .12s;will-change:transform}
.oh-mark:hover,.oh-mark[data-on]{opacity:1;background:#12a08e}
.oh-mark[data-kind=image]{background:var(--oh-blue)}
.oh-mark[data-kind=image]:hover{background:#0a70a8}
.oh-mark[data-kind=block]{background:#22a65a}
.oh-mark:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}
.oh-hidden .oh-mark{display:none!important}

.oh-bar{position:fixed;left:16px;bottom:16px;z-index:2147483002;display:flex;align-items:center;gap:6px;padding:6px 6px 6px 14px;border-radius:999px;
  background:rgba(13,47,68,.94);color:#fff;box-shadow:0 12px 32px -8px rgba(13,47,68,.5);backdrop-filter:blur(8px);font-size:14px;max-width:calc(100vw - 32px)}
.oh-bar-dot{width:9px;height:9px;border-radius:99px;background:var(--oh-green);box-shadow:0 0 0 4px rgba(60,220,109,.25);flex:none}
.oh-bar-title{font-weight:700;white-space:nowrap}
.oh-bar-user{opacity:.65;white-space:nowrap}
.oh-bar-btn{height:34px;min-width:34px;padding:0 10px;border-radius:999px;border:0;background:rgba(255,255,255,.1);color:#fff;cursor:pointer;
  display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13px;font-weight:600;white-space:nowrap}
.oh-bar-btn:hover{background:rgba(255,255,255,.2)}
.oh-bar-pub{background:linear-gradient(100deg,#1bb3f7,#2ec9b0 55%,#54de62)!important;box-shadow:0 6px 16px -8px rgba(46,201,176,.9)}
.oh-bar-pub:hover{filter:brightness(1.06)}
a.oh-bar-btn{text-decoration:none}
.oh-changes{margin:0;padding:4px 0 4px 22px;display:grid;gap:8px;font-size:14.5px;line-height:1.45;max-height:46vh;overflow:auto}
.oh-changes li::marker{color:#2ec9b0;font-weight:700}
.oh-chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:999px;font-size:12.5px;font-weight:600;white-space:nowrap;
  background:rgba(255,255,255,.1);color:#d9f7ef;text-decoration:none}
.oh-chip[data-s=pending]{background:rgba(255,213,74,.16);color:#ffe28a}
.oh-chip[data-s=success]{background:rgba(60,220,109,.18);color:#9ff0b9}
.oh-chip[data-s=failure]{background:rgba(217,58,58,.25);color:#ffb3b3}
.oh-spin{animation:oh-spin 1s linear infinite}
@keyframes oh-spin{to{transform:rotate(360deg)}}
@media (max-width:640px){.oh-bar{left:8px;right:8px;bottom:auto;top:calc(8px + env(safe-area-inset-top));justify-content:space-between}.oh-bar-user,.oh-bar-label{display:none}}

.oh-menu{position:fixed;z-index:2147483003;min-width:230px;max-width:320px;padding:6px;border-radius:16px;background:#fff;
  box-shadow:0 1px 0 var(--oh-line),0 18px 48px -12px rgba(13,47,68,.35);animation:oh-pop .14s ease-out}
.oh-menu-head{padding:8px 10px 6px;font-size:12px;color:var(--oh-soft);font-weight:600;line-height:1.35}
.oh-menu-sep{height:1px;background:var(--oh-line);margin:4px 6px}
.oh-mi{width:100%;display:flex;align-items:center;gap:10px;padding:9px 10px;border:0;border-radius:10px;background:none;color:var(--oh-ink);
  font:inherit;font-size:14.5px;font-weight:600;cursor:pointer;text-align:left}
.oh-mi:hover:not(:disabled){background:#eefbff}
.oh-mi:disabled{opacity:.4;cursor:not-allowed}
.oh-mi-ic{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;flex:none;background:#e7f9f5;color:#12a08e}
.oh-mi[data-v=add] .oh-mi-ic{background:#e6f6ff;color:#0a86c2}
.oh-mi[data-v=del] .oh-mi-ic{background:#fdecec;color:var(--oh-red)}
.oh-mi[data-v=del]{color:#b42323}
.oh-mi small{display:block;font-weight:500;font-size:12px;color:var(--oh-soft);margin-top:1px}
@keyframes oh-pop{from{opacity:0;transform:translateY(-4px) scale(.98)}}

.oh-back{position:fixed;inset:0;z-index:2147483004;background:rgba(13,47,68,.42);backdrop-filter:blur(6px);display:grid;place-items:center;padding:16px;
  animation:oh-fade .16s ease-out}
@keyframes oh-fade{from{opacity:0}}
.oh-modal{width:100%;max-width:680px;max-height:calc(100dvh - 32px);display:flex;flex-direction:column;background:#fff;border-radius:26px;
  box-shadow:0 30px 80px -20px rgba(13,47,68,.55);animation:oh-pop .18s ease-out;overflow:hidden}
.oh-mh{display:flex;align-items:flex-start;gap:14px;padding:22px 22px 14px}
.oh-mh-ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;flex:none;color:#fff;background:var(--oh-grad)}
.oh-mh-ic[data-v=del]{background:linear-gradient(135deg,#ff7a7a,#d93a3a)}
.oh-mh h2{margin:0;font-size:20px;letter-spacing:-.01em;line-height:1.25}
.oh-crumb{margin-top:3px;font-size:13px;color:var(--oh-soft)}
.oh-x{margin-left:auto;width:38px;height:38px;border-radius:12px;border:0;background:#f2f8fa;color:var(--oh-soft);cursor:pointer;display:grid;place-items:center;flex:none}
.oh-x:hover{background:#e6f1f5;color:var(--oh-ink)}
.oh-mb{padding:4px 22px 18px;overflow:auto;display:grid;gap:12px}
.oh-mf{display:flex;align-items:center;gap:10px;padding:14px 22px;border-top:1px solid var(--oh-line);background:#fbfdfe}
.oh-mf-note{font-size:12.5px;color:var(--oh-soft);margin-right:auto;line-height:1.35}
.oh-btn{height:46px;padding:0 20px;border-radius:999px;border:0;cursor:pointer;font:inherit;font-weight:700;font-size:15px;display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.oh-btn-ghost{background:#eef5f8;color:var(--oh-ink)}
.oh-btn-ghost:hover{background:#e2eef3}
.oh-btn-main{background:var(--oh-grad);color:#fff;box-shadow:0 10px 22px -10px rgba(46,201,176,.9)}
.oh-btn-main:hover:not(:disabled){filter:brightness(1.05)}
.oh-btn-danger{background:var(--oh-red);color:#fff}
.oh-btn:disabled{opacity:.5;cursor:not-allowed}

.oh-lang{border:1.5px solid var(--oh-line);border-radius:18px;padding:12px 14px 14px;background:#fff;transition:border-color .15s,box-shadow .15s}
.oh-lang:focus-within{border-color:var(--oh-teal);box-shadow:0 0 0 4px rgba(46,201,176,.12)}
.oh-lang[data-changed]{border-color:#9be6d6;background:#fbfffe}
.oh-lang-h{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:13.5px;font-weight:700}
.oh-flag{font-size:18px;line-height:1}
.oh-badge{font-size:11px;font-weight:700;padding:3px 8px;border-radius:999px;background:#e7f9f5;color:#12a08e}
.oh-badge[data-v=changed]{background:#fff3cf;color:#8a6200}
.oh-count{margin-left:auto;font-size:12px;color:#8aa3b2;font-weight:500}
.oh-fl{display:block;font-size:12px;font-weight:600;color:var(--oh-soft);margin:8px 0 4px}
.oh-ta{width:100%;min-height:46px;resize:vertical;border:0;border-radius:12px;background:#f5fafc;padding:11px 12px;font:inherit;font-size:15.5px;
  line-height:1.5;color:var(--oh-ink);outline:none}
.oh-ta:focus{background:#f0f9fb}
.oh-rich{min-height:120px;max-height:50vh;overflow:auto;border-radius:12px;background:#f5fafc;padding:12px 14px;font-size:16px;line-height:1.6;outline:none}
.oh-rich:focus{background:#f0f9fb}
.oh-rich a{color:#0a86c2;text-decoration:underline}
.oh-tools{display:flex;gap:4px;margin-bottom:8px}
.oh-tool{height:32px;min-width:32px;padding:0 8px;border-radius:9px;border:1px solid var(--oh-line);background:#fff;color:var(--oh-ink);cursor:pointer;
  display:inline-grid;place-items:center;font:inherit;font-size:13px}
.oh-tool:hover{background:#eefbff}
.oh-info{padding:12px 14px;border-radius:14px;background:#eefbff;color:var(--oh-soft);font-size:13.5px;line-height:1.5}
.oh-info b{color:var(--oh-ink)}
.oh-warn{background:#fff7e0;color:#7a5600}
.oh-err{padding:11px 14px;border-radius:14px;background:#fdecec;color:#b42323;font-size:14px}
.oh-quote{padding:12px 14px;border-radius:14px;background:#fff5f5;border:1px solid #f7d4d4;font-size:14.5px;line-height:1.5;white-space:pre-wrap;max-height:40vh;overflow:auto}
.oh-quote small{display:block;font-weight:700;color:#b42323;margin-bottom:4px;font-size:12px}
.oh-skel{height:96px;border-radius:18px;background:linear-gradient(90deg,#f1f7f9,#e6f1f5,#f1f7f9);background-size:200% 100%;animation:oh-sh 1.1s infinite}
@keyframes oh-sh{to{background-position:-200% 0}}
.oh-img-row{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center}
.oh-img-box{aspect-ratio:4/3;border-radius:16px;background:#f2f8fa repeating-conic-gradient(#e9f2f6 0 25%,#f6fafc 0 50%) 0 0/20px 20px;
  display:grid;place-items:center;overflow:hidden;border:1.5px solid var(--oh-line);position:relative}
.oh-img-box img{max-width:100%;max-height:100%;object-fit:contain}
.oh-img-cap{position:absolute;left:8px;top:8px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:99px;background:rgba(255,255,255,.9)}
.oh-drop{border:2px dashed #9be6d6;background:#f6fffc;cursor:pointer;color:#12a08e;text-align:center;font-size:13.5px;font-weight:600;padding:12px}
.oh-drop[data-over]{background:#e7f9f5;border-color:var(--oh-teal)}
.oh-input{width:100%;height:44px;border-radius:12px;border:1.5px solid var(--oh-line);padding:0 12px;font:inherit;font-size:15px;color:var(--oh-ink);outline:none;background:#f7fcfe}
.oh-input:focus{border-color:var(--oh-teal);background:#fff}

.oh-toast{position:fixed;right:16px;bottom:16px;z-index:2147483005;max-width:380px;display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:18px;
  background:#fff;box-shadow:0 18px 48px -12px rgba(13,47,68,.4);animation:oh-pop .2s ease-out;font-size:14px;line-height:1.45}
.oh-toast b{display:block;font-size:15px;margin-bottom:2px}
.oh-toast-ic{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;flex:none;background:#e7f9f5;color:#12a08e}
.oh-toast[data-v=err] .oh-toast-ic{background:#fdecec;color:var(--oh-red)}
.oh-toast a{color:#0a86c2}
@media (max-width:640px){.oh-toast{left:8px;right:8px;bottom:8px;max-width:none}.oh-mf{flex-wrap:wrap}.oh-mf-note{width:100%}.oh-img-row{grid-template-columns:1fr}.oh-img-row>svg{display:none}}
`;
