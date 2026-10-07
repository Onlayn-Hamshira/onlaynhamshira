"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Banknote, Bell, BookMarked, ChevronDown, ClipboardList, Clock, CreditCard, FilePlus2, Gamepad2, Home as HomeIcon, LayoutGrid, MapPin, Mic, MoreVertical, Newspaper, Search, Star, Stethoscope, User,
} from "lucide-react";
import { formatNum } from "@/lib/i18n/format";
import type { ExpertDemoDict } from "@/lib/expert";
import { useTapDot } from "../how-it-works/useTapDot";
import s from "./ExpertDemo.module.css";
import { editableImage } from "@/lib/edit/edits";

/*
 * Mutaxassis ilovasining ish oqimi (avtomatik, cheksiz):
 * 0 Play Market → 1 ro'yxatdan o'tish → 2 onlayn bo'lish → 3 yangi buyurtma → 4 yakunlash → 5 to'lov
 */
const SCENES = 6;
const PHONE = "12 345 67 89";
const CODE = "481526".split("");
const START_BALANCE = 307000;
const ORDER_PRICE = 300000;
// "Xizmat standarti / narxlari / qanday ishlaydi" kartochkalaridagi rasmlar (sayt mutaxassislar rasmlari)
const STORY_IMG = [
  "/img/specialists/78b8f24c-c269-44cb-96a9-62da661bea34.webp",
  "/img/specialists/349ede49-2f31-4af9-8a42-369bdbaf6029.webp",
  "/img/specialists/b113e253-1138-4194-981a-a96581bb245b.webp",
].map(editableImage);

/** iOS status bar: soat, signal, Wi-Fi, batareya */
function StatusBar({ dark }: { dark?: boolean }) {
  const c = dark ? "#111" : "#fff";
  return (
    <div className={s.sb} style={{ color: c }}>
      <span>21:40</span>
      <span className={s.sbIcons}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill={c}><path d="M7.5 2.2c2.2 0 4.2.9 5.6 2.3l1.1-1.1A9.4 9.4 0 0 0 7.5.6 9.4 9.4 0 0 0 .8 3.4l1.1 1.1a7.8 7.8 0 0 1 5.6-2.3Zm0 3.2c1.3 0 2.5.5 3.4 1.4l1.1-1.1a6.3 6.3 0 0 0-9 0l1.1 1.1c.9-.9 2.1-1.4 3.4-1.4Zm0 3.2c-.5 0-.9.2-1.2.5L7.5 10.3l1.2-1.2c-.3-.3-.7-.5-1.2-.5Z" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke={c} strokeOpacity=".45" /><rect x="2" y="2" width="16" height="8" rx="2" fill={c} /><path d="M24 4v4c.8-.3 1.3-1 1.3-2s-.5-1.7-1.3-2Z" fill={c} fillOpacity=".5" /></svg>
      </span>
    </div>
  );
}

type V = {
  pct: number; st: "search" | "idle" | "loading" | "done";
  typed: string; focus: boolean; codeView: boolean; otp: string[]; verifying: boolean;
  online: boolean; timer: number; stage: number; done: boolean; earned: number; toast: boolean;
};
const INIT: V = {
  pct: 0, st: "search", typed: "", focus: false, codeView: false, otp: ["", "", "", "", "", ""], verifying: false,
  online: false, timer: 59, stage: 0, done: false, earned: 0, toast: false,
};

export function ExpertPhoneDemo({ t }: { t: ExpertDemoDict }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState(0);
  const [run, setRun] = useState(0); // har kirishda sahna jadvalini qayta boshlash
  const [v, setV] = useState<V>(INIT);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const { boxRef, dot, tap } = useTapDot(s.pressed, reduced);
  const set = useCallback((p: Partial<V> | ((x: V) => Partial<V>)) => setV((x) => ({ ...x, ...(typeof p === "function" ? p(x) : p) })), []);
  const r = {
    result: useRef<HTMLDivElement>(null), install: useRef<HTMLDivElement>(null), getCode: useRef<HTMLDivElement>(null), verify: useRef<HTMLDivElement>(null),
    knob: useRef<HTMLDivElement>(null), accept: useRef<HTMLSpanElement>(null), flowBtn: useRef<HTMLDivElement>(null),
  };
  const money = (n: number) => `${formatNum(n, " ")} ${t.currency}`;

  // Ekranda bo'lsa o'ynaydi; reduced-motion'da — statik "onlayn" bosh sahifa
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      setScene(2);
      setV({ ...INIT, online: true });
      return;
    }
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPlaying(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const T: number[] = [];
    const I: number[] = [];
    const at = (ms: number, fn: () => void) => T.push(window.setTimeout(fn, ms));
    const every = (ms: number, fn: () => void) => { const id = window.setInterval(fn, ms); I.push(id); return id; };
    const next = (ms: number) => at(ms, () => { setScene((n) => (n + 1) % SCENES); setRun((n) => n + 1); });

    switch (scene) {
      case 0: // Play Market: qidiruv natijalari → ilova sahifasi → O'rnatish → yuklanish → Ochish
        set({ ...INIT });
        at(1300, () => tap(r.result.current));
        at(1550, () => set({ st: "idle" }));
        at(2500, () => tap(r.install.current));
        at(2750, () => {
          set({ st: "loading" });
          const id = every(90, () => set((x) => {
            const pct = Math.min(100, x.pct + 7);
            if (pct >= 100) clearInterval(id);
            return { pct };
          }));
        });
        at(4500, () => set({ st: "done" }));
        at(5200, () => tap(r.install.current));
        next(5600);
        break;
      case 1: { // Ro'yxatdan o'tish: raqam → kod → tasdiqlash
        let k = 0;
        at(350, () => {
          set({ focus: true });
          const id = every(75, () => { k++; set({ typed: PHONE.slice(0, k) }); if (k >= PHONE.length) clearInterval(id); });
        });
        at(1500, () => tap(r.getCode.current));
        at(1750, () => set({ codeView: true }));
        CODE.forEach((d, i) => at(2200 + i * 170, () => set((x) => ({ otp: x.otp.map((o, j) => (j === i ? d : o)) }))));
        at(3500, () => { tap(r.verify.current); set({ verifying: true }); });
        next(4200);
        break;
      }
      case 2: // Bosh sahifa: onlayn bo'lish
        set({ online: false, timer: 59, stage: 0, done: false, toast: false });
        at(1100, () => tap(r.knob.current));
        at(1250, () => set({ online: true }));
        next(3300);
        break;
      case 3: // Yangi buyurtma: taymer → Qabul qilish
        every(1000, () => set((x) => ({ timer: Math.max(0, x.timer - 1) })));
        at(2600, () => tap(r.accept.current));
        next(3000);
        break;
      case 4: // Jarayon: Yetib keldim → Xizmatni boshlash → Yakunlash
        set({ stage: 0, done: false });
        at(1100, () => { tap(r.flowBtn.current); set({ stage: 1 }); });
        at(2300, () => { tap(r.flowBtn.current); set({ stage: 2 }); });
        at(3500, () => tap(r.flowBtn.current));
        at(3700, () => set({ done: true }));
        next(5000);
        break;
      case 5: { // To'lov: bildirishnoma + daromad hisoblagichi
        set({ toast: true, earned: 0 });
        const steps = 24;
        let i = 0;
        at(500, () => {
          const id = every(40, () => { i++; set({ earned: Math.round((ORDER_PRICE * i) / steps) }); if (i >= steps) clearInterval(id); });
        });
        next(4300);
        break;
      }
    }
    return () => { T.forEach(clearTimeout); I.forEach(clearInterval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, run, playing, reduced]);


  // Oddiy JSX (ichki komponent emas) — har renderda qayta yaratilmasin
  const homeView = (
    <div key={`home-${scene === 5 ? "paid" : "on"}`} className={`${s.scene} ${s.home} ${v.online ? s.online : ""}`}>
      <div className={s.homeTop} />
      <StatusBar />
      <div className={s.homeHead}>
        <img className={s.avatar} src={editableImage("/img/app/specialist-avatar.webp")} alt="" width={40} height={40} />
        <b>{t.home.name}</b>
        <span className={s.roundBtn}><FilePlus2 size={17} /></span>
        <span className={`${s.roundBtn} ${s.bell}`}><Bell size={17} /></span>
      </div>
      <div className={s.stories}>{t.home.stories.map((x, i) => <span key={x}>{x}<img src={STORY_IMG[i]} alt="" width={64} height={64} /></span>)}</div>
      <div className={s.panel}>
        <h6>{t.home.balance}</h6>
        <div className={s.balance}>
          {/* To'lov sahnasida balans daromad bilan birga o'sadi */}
          <div className={s.row}><strong>{money(START_BALANCE + (scene === 5 ? v.earned : 0))}</strong><small>ID:817180586</small></div>
          <span className={s.pill}>{t.home.topUp}</span>
        </div>
        <h6>{t.home.status}</h6>
        <div className={s.slider}>
          <div className={s.track}>{v.online ? t.home.goOffline : t.home.goOnline}</div>
          <div ref={r.knob} className={s.knob} style={{ top: 5, left: v.online ? "calc(100% - 45px)" : 5 }}>{v.online ? "«" : "»"}</div>
        </div>
        {scene === 5 ? (
          <div className={s.earn}><span>{t.home.earned}</span><strong>+{money(v.earned)}</strong></div>
        ) : (
          <div className={s.cardWarn}><CreditCard size={18} color="#f2a915" /> <span>{t.order.payment}: {t.order.cash}</span></div>
        )}
        <div className={s.tabbar}>
          {t.home.nav.map((x, i) => {
            const I = [HomeIcon, ClipboardList, Newspaper][i];
            return <span key={x} className={i === 0 ? s.on : undefined}><I size={20} />{x}</span>;
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={wrap} className={s.wrap} aria-hidden>
      <div className={s.device}>
        <span className={`${s.btn} ${s.btnAction}`} />
        <span className={`${s.btn} ${s.btnVolUp}`} />
        <span className={`${s.btn} ${s.btnVolDown}`} />
        <span className={`${s.btn} ${s.btnPower}`} />
        <div className={s.frame}>
        <div className={s.bezel}>
        <span className={s.island} />
        <div ref={boxRef} className={s.screen}>
          <span key={dot?.n ?? 0} className={dot ? `${s.tap} ${s.go}` : s.tap} style={dot ? { left: dot.x, top: dot.y } : undefined} />

          {scene === 0 && v.st === "search" && (
            <div key={`s0s-${run}`} className={`${s.scene} ${s.store}`}>
              <StatusBar dark />
              <div className={s.psSearch}>
                <ArrowLeft size={20} />
                <span>onlaynhamshira</span>
                <Search size={19} />
                <Mic size={19} />
              </div>
              <div className={s.psChips}>
                <b>Rating <ChevronDown size={12} /></b><b>New</b><b>Medical</b><b>Widgets</b>
              </div>
              <div className={s.psList}>
                <div ref={r.result} className={s.psRow}>
                  <span className={s.psIcon}><img src={editableImage("/img/app-icon-mark.svg")} alt="" width={26} height={33} /></span>
                  <div>
                    <p>Onlayn Hamshira Mutaxassis</p>
                    <small>ONLAYN HAMSHIRA LLC • Productivity</small>
                    <em>4.6 <Star size={9} fill="currentColor" /> &nbsp; 2.2 MB</em>
                  </div>
                </div>
                <div className={s.psRow}>
                  <span className={`${s.psIcon} ${s.psClient}`}><img src={editableImage("/img/app-icon-mark.svg")} alt="" width={26} height={33} /></span>
                  <div>
                    <p>Onlayn Hamshira</p>
                    <small>ONLAYN HAMSHIRA LLC • Medical</small>
                    <em>4.8 <Star size={9} fill="currentColor" /> &nbsp; 10K+</em>
                  </div>
                </div>
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`${s.psRow} ${s.psSkel}`}>
                    <span className={s.psIcon} />
                    <div><i /><i /><i /></div>
                  </div>
                ))}
              </div>
              <div className={s.psNav}>
                {[["Games", Gamepad2], ["Apps", LayoutGrid], ["Search", Search], ["Books", BookMarked], ["You", User]].map(([l, I]) => {
                  const Ico = I as typeof Search;
                  return <span key={l as string} className={l === "Search" ? s.on : undefined}><i><Ico size={18} /></i>{l as string}</span>;
                })}
              </div>
            </div>
          )}

          {scene === 0 && v.st !== "search" && (
            <div key={`s0-${run}`} className={`${s.scene} ${s.store} ${v.st === "loading" ? s.loading : ""}`}>
              <StatusBar dark />
              <div className={s.storeTop}><ArrowLeft size={20} /><MoreVertical size={20} /></div>
              <div className={s.storeApp}>
                <div className={s.storeIcon}>
                  <svg className={s.ring} viewBox="0 0 76 76"><circle cx="38" cy="38" r="35" style={{ strokeDashoffset: 220 - (220 * v.pct) / 100 }} /></svg>
                  <div className={s.ic}><img src={editableImage("/img/app-icon-mark.svg")} alt="" width={40} height={51} /></div>
                </div>
                <div>
                  <div className={s.storeName}>Onlayn Hamshira Mutaxassis</div>
                  <div className={s.storeDev}>{v.st === "loading" ? `${t.store.downloading} · ${v.pct}%` : t.store.dev}</div>
                </div>
              </div>
              <div className={s.storeStats}>
                <div><b>4.6 ★</b>{t.store.reviews}</div>
                <div><b>3+</b>Rated 3+</div>
                <div><b>2.2 MB</b>&nbsp;</div>
              </div>
              <div ref={r.install} className={`${s.storeBtn} ${v.st === "loading" ? s.ghost : ""}`}>
                {v.st === "done" ? t.store.open : t.store.install}
              </div>
              <div className={s.storeMeta}><b>Medical</b><b>Productivity</b><b>Uzbek</b></div>
              <div className={s.storeShots}>
                {t.home.stories.map((x) => <span key={x}>{x}<i /></span>)}
              </div>
            </div>
          )}

          {scene === 1 && (
            <div key={`s1-${run}`} className={`${s.scene} ${s.reg}`}>
              <StatusBar dark />
              <div className={s.regHead}>
                <img src={editableImage("/img/map-pin.svg")} alt="" width={54} height={67} />
                <p>{v.codeView ? t.reg.sms : t.reg.title}</p>
              </div>
              <div className={s.regCard}>
                {v.codeView ? (
                  <div className={s.otp}>{v.otp.map((d, i) => <span key={i} className={d ? s.on : undefined}>{d}</span>)}</div>
                ) : (
                  <>
                    <div className={s.lbl}>{t.reg.phone}</div>
                    <div className={`${s.inp} ${v.focus ? s.focus : ""}`}><span className={s.cc}>+998</span><span>{v.typed}</span><span className={s.caret} /></div>
                  </>
                )}
              </div>
              {v.codeView ? (
                <div ref={r.verify} className={s.gbtn}>{v.verifying ? <span className={s.spin} /> : t.reg.verify}</div>
              ) : (
                <div ref={r.getCode} className={s.gbtn}>{t.reg.getCode}</div>
              )}
            </div>
          )}

          {(scene === 2 || scene === 3 || scene === 5) && homeView}

          {scene === 3 && (
            <>
              <div className={s.dim} />
              <div className={s.modal}>
                <h5>{t.order.title}</h5>
                <div className={s.timer}>00:{String(v.timer).padStart(2, "0")}</div>
                <div className={s.mrow}><span className={`${s.em} ${s.red}`}><MapPin size={17} /></span><span className={s.grow}>{t.order.address}</span></div>
                <div className={s.mrow}><span className={`${s.em} ${s.blue}`}><Stethoscope size={17} /></span><span className={s.grow}>{t.order.service}</span><span className={s.right} style={{ color: "#8ea2b3", fontWeight: 500 }}>{t.order.services} ›</span></div>
                <div className={s.mrow}><span className={`${s.em} ${s.amber}`}><Clock size={17} /></span><span className={s.grow}>{t.order.time}<small>{t.order.arrive}</small></span><span className={s.right}>12.10<br />01:45</span></div>
                <div className={s.mrow}><span className={`${s.em} ${s.green}`}><Banknote size={17} /></span><span className={s.grow}>{t.order.payment}<small>{t.order.cash}</small></span><span className={`${s.right} ${s.price}`}>{money(ORDER_PRICE)}</span></div>
                <div className={s.mbtns}>
                  <span className={s.no}>{t.order.skip}</span>
                  <span ref={r.accept} className={s.yes}>{t.order.accept}</span>
                </div>
              </div>
            </>
          )}

          {scene === 4 && (
            <div key={`s4-${run}`} className={`${s.scene} ${s.flow}`}>
              <div className={s.map}>
                <StatusBar dark />
                <span className={s.route} />
                <span className={s.me} />
                <img className={s.mapPin} src={editableImage("/img/map-pin.svg")} alt="" width={28} height={35} />
              </div>
              <div className={s.flowCard}>
                <h6>{t.flow.title}</h6>
                <div className={s.mrow}><span className={`${s.em} ${s.blue}`}><Stethoscope size={17} /></span><span className={s.grow}>{t.order.service}<small>{t.order.address}</small></span></div>
                <div className={s.mrow}><span className={`${s.em} ${s.green}`}><Banknote size={17} /></span><span className={s.grow}>{t.order.cash}</span><span className={`${s.right} ${s.price}`}>{money(ORDER_PRICE)}</span></div>
                <div className={s.stages}>{t.flow.stages.map((x, i) => <span key={x} className={i <= v.stage ? s.on : undefined}>{x}</span>)}</div>
              </div>
              <div ref={r.flowBtn} className={s.flowBtn}>{t.flow.buttons[v.stage]}</div>
              {v.done && (
                <div className={s.doneWrap}>
                  <div>
                    <span className={s.check}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg></span>
                    {t.flow.done}
                  </div>
                </div>
              )}
            </div>
          )}

          {scene === 5 && v.toast && (
            <div className={s.toast}>
              <span className={s.coin}>✓</span>
              <div><b>{t.flow.paid}</b><span>+{money(ORDER_PRICE)}</span></div>
            </div>
          )}
          <span className={s.homeBar} />
        </div>
        <span className={s.glare} />
        </div>
        </div>
      </div>

      {/* Hozirgi bosqich */}
      <div className={s.caption}>
        <span className={s.num}>{scene + 1}</span>
        {t.captions[scene]}
        <span className={s.bar}>{Array.from({ length: SCENES }, (_, i) => <i key={i} className={i === scene ? s.on : undefined} />)}</span>
      </div>
    </div>
  );
}
