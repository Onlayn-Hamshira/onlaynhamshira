"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowBigUp, Bell, Check, ChevronLeft, ChevronRight, ClipboardList, Delete, FilePlus2, Files, Globe, Heart, House, Mic, MoreVertical, Paperclip, Send, Smile,
} from "lucide-react";
import s from "./AppPhoneDemo.module.css";

/*
 * Mijoz ilovasi animatsiyasi (20 soniya, cheksiz) — avvalgi videoning kod bilan qilingan nusxasi:
 * bosh sahifa → karusel → xizmat sahifasi → AI chat → karusel → buyurtma (1–2-qadam) → qo'shimcha xizmatlar.
 * Ekran 390×844 "tekis" koordinatalarda chiziladi, so'ng matrix3d bilan videodagi burchakka qiyshaytiriladi.
 * Ilova interfeysi o'zbekcha (ilovaning o'zi kabi), barcha tillarda bir xil.
 */
const IMG = "/img/app/demo";
const CYCLE = 20000;
const BANNERS = [
  ["b1", "Ayollar uchun massaj", "#efb0b5"],
  ["b2", "Bolalar massaji", "#e9acde"],
  ["b3", "Enaga", "#30d3d1"],
  ["b4", "Chaqaloq parvarishi", "#f7d676"],
  ["b5", "Davolovchi massaj", "#e88a85"],
  ["b6", "Vitamin terapiya", "#c2a8d7"],
  ["b7", "Kardiolog", "#dca772"],
  ["b8", "Terapevt", "#71bfb7"],
] as const;
// Chap chetdagi yarim karta uchun oxirgisi boshiga, o'ng chet uchun dastlabki ikkitasi oxiriga
const TRACK = [BANNERS[7], ...BANNERS, BANNERS[0], BANNERS[1]];
const SERVICES = [
  ["svc1", "Sistema (kapelnitsa)", "30 000 so'm"],
  ["svc2", "Teri ostiga inyeksiya", "20 000 so'm"],
  ["svc3", "Mushak ichiga inyeksiya", "20 000 so'm"],
  ["svc4", "Tomir ichiga ukol (dori bilan)", "30 000 so'm"],
  ["svc5", "Bog'lam almashtirish", "25 000 so'm"],
  ["svc6", "Uyda statsionar", "150 000 so'm"],
  ["svc7", "Bolalar hamshirasi", "40 000 so'm"],
] as const;
const QUESTION = "isitma 38.5 bo'lsa nima qilay?";
const ANSWER = "Ko'proq suyuqlik iching va dam oling. Isitma 3 kundan oshsa yoki 39° dan baland bo'lsa, hamshira chaqiring — biz uyingizga boramiz.".split(" ");
const KEYS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

type Tap = { x: number; y: number; n: number };
type Swipe = { y: number; n: number };
type V = {
  car: number; detail: boolean; chat: boolean; order: boolean; list: boolean;
  robot: boolean; wave: boolean; typed: string; key: string; sent: boolean; typing: boolean; words: number;
  checked: boolean; step: 1 | 2; added: boolean; cta: boolean;
  tap: Tap | null; swipe: Swipe | null; instant: boolean;
};
const INIT: V = {
  car: 0, detail: false, chat: false, order: false, list: false,
  robot: false, wave: false, typed: "", key: "", sent: false, typing: false, words: 0,
  checked: false, step: 1, added: false, cta: false,
  tap: null, swipe: null, instant: false,
};

function StatusBar({ light }: { light: boolean }) {
  return (
    <div className={s.sb} style={{ color: light ? "#fff" : "#141414" }}>
      <span>15:51</span>
      <span className={s.sbIcons}>
        <svg width="20" height="13" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <b>4G</b>
        <svg width="29" height="14" viewBox="0 0 26 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke="currentColor" strokeOpacity=".45" /><rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor" /><path d="M24 4v4c.8-.3 1.3-1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" fillOpacity=".5" /></svg>
      </span>
    </div>
  );
}

function TabBar() {
  return (
    <div className={s.tabbar}>
      {([["Asosiy", House], ["Xizmatlar", Heart], ["Buyurtmalar", Files], ["Yangiliklar", ClipboardList]] as const).map(([l, I], i) => (
        <span key={l} className={i === 0 ? s.on : undefined}><I size={24} strokeWidth={i === 0 ? 2.4 : 1.8} fill={i === 0 ? "currentColor" : "none"} fillOpacity={0.25} />{l}</span>
      ))}
    </div>
  );
}

/** play=false — statik bosh sahifa (reduced-motion yoki ekrandan tashqarida) */
export function AppPhoneDemo({ play, onReady }: { play: boolean; onReady?: () => void }) {
  const [v, setV] = useState<V>(INIT);
  const [cycle, setCycle] = useState(0);
  const set = (p: Partial<V> | ((x: V) => Partial<V>)) => setV((x) => ({ ...x, ...(typeof p === "function" ? p(x) : p) }));

  useEffect(() => {
    if (!play) {
      setV(INIT);
      return;
    }
    const T: number[] = [];
    const at = (ms: number, fn: () => void) => T.push(window.setTimeout(fn, ms));
    const tap = (ms: number, x: number, y: number) => at(ms, () => set((o) => ({ tap: { x, y, n: (o.tap?.n ?? 0) + 1 } })));
    const swipe = (ms: number) => at(ms, () => set((o) => ({ swipe: { y: 215, n: (o.swipe?.n ?? 0) + 1 } })));

    // Yangi aylanish: ekranlar o'tishsiz joyiga qaytadi (video ham shunday kesiladi)
    setV({ ...INIT, instant: true });
    at(60, () => set({ instant: false }));

    // Karusel
    swipe(1850); at(1950, () => set({ car: 2 }));
    // Xizmat sahifasi
    tap(3550, 100, 450); at(3750, () => set({ detail: true }));
    tap(4350, 28, 88); at(4500, () => set({ detail: false }));
    // AI chat
    tap(5250, 70, 718); at(5450, () => set({ chat: true }));
    at(5950, () => set({ robot: true }));
    [...QUESTION].forEach((ch, i) => at(6100 + i * 20, () => set((o) => ({ typed: o.typed + ch, key: ch }))));
    at(6100 + QUESTION.length * 20 + 80, () => set({ key: "" }));
    tap(6800, 358, 522); at(6850, () => set({ sent: true, typed: "" }));
    at(7100, () => set({ typing: true }));
    at(7550, () => set({ wave: true }));
    ANSWER.forEach((_, i) => at(7950 + i * 38, () => set({ typing: false, words: i + 1 })));
    tap(9000, 32, 82); at(9150, () => set({ chat: false }));
    at(9700, () => set({ robot: false, wave: false, sent: false, words: 0 }));
    // Karusel yana
    swipe(10300); at(10400, () => set({ car: 3 }));
    swipe(11150); at(11250, () => set({ car: 5 }));
    // Buyurtma
    tap(12250, 275, 450); at(12450, () => set({ order: true }));
    tap(13050, 345, 314); at(13150, () => set({ checked: true }));
    tap(14050, 196, 772); at(14250, () => set({ step: 2 }));
    tap(15700, 196, 772);
    tap(16600, 196, 772); at(16800, () => set({ list: true }));
    // Qo'shimcha xizmat
    tap(19000, 318, 290); at(19100, () => set({ added: true }));
    at(19300, () => set({ cta: true }));
    tap(19700, 196, 772);
    at(CYCLE, () => setCycle((n) => n + 1));
    return () => T.forEach(clearTimeout);
  }, [play, cycle]);

  // Rasmlar yuklanib bo'lgach poster yashiriladi (bo'sh kartalar ko'rinmasin)
  useEffect(() => {
    let alive = true;
    const srcs = [...BANNERS.map((b) => b[0]), "nurse1", "nurse2", "robot-home"];
    Promise.all(srcs.map((n) => { const i = new Image(); i.src = `${IMG}/${n}.webp`; return i.decode().catch(() => {}); }))
      .then(() => alive && onReady?.());
    return () => { alive = false; };
  }, [onReady]);

  const top = v.list || v.order ? "order" : v.chat ? "chat" : v.detail ? "detail" : "home";

  return (
    <div className={`${s.stage} ${v.instant ? s.instant : ""}`} aria-hidden>
      <span className={s.side} />
      <span className={s.sideBtn} />
      <div className={s.body}>
        <div className={s.bezel}>
          <div className={s.screen}>
            {/* ───── Bosh sahifa ───── */}
            <div className={s.home}>
              <div className={s.homeHead} />
              <span className={s.avatar}><svg viewBox="0 0 60 60"><circle cx="30" cy="23" r="10" fill="#a9a9a9" /><path d="M10 52c3-11 11-16 20-16s17 5 20 16" fill="#a9a9a9" /></svg></span>
              <span className={s.roundBtn} style={{ left: 275 }}><FilePlus2 size={20} /></span>
              <span className={s.roundBtn} style={{ left: 326 }}><Bell size={20} /></span>
              <div className={s.carousel}>
                <div className={s.track} style={{ transform: `translateX(${-v.car * 111}px)` }}>
                  {TRACK.map(([img, label, bg], k) => (
                    <div key={k} className={s.banner} style={{ left: 30 + (k - 1) * 111, background: bg }}>
                      <img src={`${IMG}/${img}.webp`} alt="" width={100} height={132} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={s.dots}>{BANNERS.map((_, i) => <i key={i} className={i === v.car % 8 ? s.on : undefined} />)}</div>

              <div className={s.panel}>
                <div className={s.head}><b>Xizmatlar</b><span>Barchasi</span></div>
                <div className={`${s.svc} ${s.green}`} style={{ left: 20 }}>
                  <img src={`${IMG}/nurse1.webp`} alt="" width={159} height={194} />
                  <span className={s.svcLabel}>Umumiy<br />hamshira</span>
                </div>
                <div className={`${s.svc} ${s.blue}`} style={{ left: 195 }}>
                  <img src={`${IMG}/nurse2.webp`} alt="" width={159} height={194} />
                  <span className={s.svcLabel}>Oliy toifali<br />hamshira</span>
                </div>
                <div className={`${s.svc} ${s.purple}`} style={{ left: 370 }} />
                <b className={s.aiTitle}>Sun&apos;iy intellekt</b>
                <div className={s.aiCard}>
                  <b>AI chat</b>
                  <p>Sog&apos;liq bo&apos;yicha asosiy<br />savollarga javob beradi</p>
                  <span className={s.askBtn}>So&apos;rash</span>
                  <span className={s.tri} />
                  <span className={s.cube} />
                  <img className={s.robotHome} src={`${IMG}/robot-home.webp`} alt="" width={110} height={150} />
                </div>
              </div>
              <TabBar />
            </div>

            {/* ───── Xizmat sahifasi ───── */}
            <div className={`${s.over} ${s.detail} ${v.detail ? s.in : ""}`}>
              <div className={s.detailHead}>
                <ChevronLeft size={30} strokeWidth={2.2} className={s.dBack} />
                <b>Xizmatlar</b>
                <Bell size={22} className={s.dBell} />
              </div>
              <div className={s.dCard}>
                <span className={s.dPhoto}><img src={`${IMG}/nurse-thumb.webp`} alt="" width={98} height={98} /><i><Check size={15} strokeWidth={3.5} /></i></span>
                <div>
                  <b>Umumiy hamshira</b>
                  <em>★ 4.9 · 9 yil tajriba</em>
                  <span>Oliy toifali</span>
                  <small>Uyda parvarish</small>
                </div>
              </div>
              <b className={s.dH}>Xizmat tarkibi</b>
              <div className={s.dList}>
                <div className={s.dRowHead}>Umumiy hamshira <ChevronRight size={18} /></div>
                {["Ukol va tomchi qo'yish", "Bosim va qand o'lchash", "Yarani parvarishlash"].map((x) => (
                  <div key={x} className={s.dRow}><i />{x}<ChevronRight size={18} /></div>
                ))}
                <p>Hamshira uyingizga 30–60 daqiqada keladi, barcha vositalar o&apos;zi bilan. <span>Batafsil</span></p>
              </div>
              <b className={`${s.dH} ${s.dH2}`}>Narxi</b>
              <div className={s.dCheck}><i><Check size={15} strokeWidth={3.5} /></i>30 000 so&apos;mdan</div>
              <div className={s.dNote}><Files size={17} /> Bekor qilish bepul</div>
              <div className={s.dBtn}>Buyurtma berish</div>
              <div className={s.dBtn2}>Savol berish</div>
            </div>

            {/* ───── AI chat ───── */}
            <div className={`${s.over} ${s.chat} ${v.chat ? s.in : ""}`}>
              <div className={s.chatHead}>
                <ArrowLeft size={26} className={s.cBack} />
                <span className={s.cAva}><img src={`${IMG}/robot-home.webp`} alt="" width={34} height={34} /><i /></span>
                <div><b>AI chat</b><small>Onlayn · 24/7 javob beradi</small></div>
                <MoreVertical size={22} className={s.cMore} />
              </div>
              <div className={s.chatBody}>
                <div className={`${s.bigRobot} ${v.robot ? s.on : ""} ${v.wave ? s.wave : ""}`}>
                  <img src={`${IMG}/robot-chat.webp`} alt="" width={180} height={184} />
                  <img src={`${IMG}/robot-wave.webp`} alt="" width={180} height={184} />
                </div>
                <span className={s.today}>Bugun</span>
                {v.sent && (
                  <div className={s.me}>
                    Isitma 38.5 bo&apos;lsa nima qilay?
                    <small>15:51 ✓✓</small>
                  </div>
                )}
                {(v.typing || v.words > 0) && (
                  <div className={s.bot}>
                    <img src={`${IMG}/robot-home.webp`} alt="" width={30} height={30} />
                    <div>{v.typing ? <span className={s.dotsTyping}><i /><i /><i /></span> : ANSWER.slice(0, v.words).join(" ")}</div>
                  </div>
                )}
              </div>
              <div className={s.inputBar}>
                <Paperclip size={22} className={s.clip} />
                <div className={s.input}>{v.typed ? <span>{v.typed}</span> : <span className={s.ph}>Xabar yozing...</span>}<i className={s.caret} /><Smile size={20} className={s.smile} /></div>
                <span className={s.send}><Send size={18} fill="#fff" /></span>
              </div>
              <div className={s.kb}>
                <div className={s.sugg}><span>Ha</span><span>Rahmat</span><span>Salom</span></div>
                {KEYS.map((row, r) => (
                  <div key={row} className={s.kRow}>
                    {r === 2 && <span className={`${s.k} ${s.kFn}`}><ArrowBigUp size={18} /></span>}
                    {[...row].map((c) => <span key={c} className={`${s.k} ${v.key === c ? s.kOn : ""}`}>{c}</span>)}
                    {r === 2 && <span className={`${s.k} ${s.kFn}`}><Delete size={18} /></span>}
                  </div>
                ))}
                <div className={s.kRow}>
                  <span className={`${s.k} ${s.kFn} ${s.k123}`}>123</span>
                  <span className={`${s.k} ${s.kFn}`}><Smile size={18} /></span>
                  <span className={`${s.k} ${s.space} ${v.key === " " ? s.kOn : ""}`}>bo&apos;sh joy</span>
                  <span className={`${s.k} ${s.kFn} ${s.ret}`}>return</span>
                </div>
                <div className={s.kBottom}><Globe size={22} /><Mic size={22} /></div>
              </div>
            </div>

            {/* ───── Buyurtma ───── */}
            <div className={`${s.over} ${s.order} ${v.order ? s.in : ""}`}>
              <ArrowLeft size={26} className={s.oBack} />
              <span className={`${s.oSmall} ${v.step === 2 ? s.hide : ""}`}>Buyurtma tafsilotlari</span>
              <b className={s.oTitle}>{v.step === 1 ? "Buyurtma · 1-qadam" : "Oliy toifali hamshira"}</b>
              <div className={`${s.stepper} ${v.step === 2 ? s.s2 : ""}`}>
                <i className={s.on}>1</i><span /><i className={v.step === 1 ? s.on : ""}>2</i><span /><i>3</i><span /><i>4</i>
              </div>
              <div className={`${s.oSvc} ${v.step === 2 ? s.flat : ""}`}>
                <div><span>Oliy toifali hamshira</span>{v.step === 2 && <small>Mutaxassis chaqiruvi</small>}</div>
                <b>30 000 so&apos;m{v.step === 1 && <ChevronRight size={16} />}</b>
              </div>
              <span className={s.oLbl}>Saqlangan bemorlar</span>
              <div className={s.oCard}>
                <div className={s.oRow}>
                  <span className={s.pAva}><svg viewBox="0 0 60 60"><circle cx="30" cy="23" r="10" fill="#a9a9a9" /><path d="M10 52c3-11 11-16 20-16s17 5 20 16" fill="#a9a9a9" /></svg></span>
                  <div><b>Asilbek Xoliyorov</b><small>{v.step === 1 ? "Erkak, 28 yosh" : "Qo'shimcha: retsept"}</small></div>
                  <span className={`${s.radio} ${v.checked ? s.on : ""}`}><Check size={20} strokeWidth={2.6} /></span>
                </div>
                <div className={s.oRow}>
                  <img src={`${IMG}/inj.webp`} alt="" width={52} height={44} />
                  <div><b>Tomir ichiga ukol (V/V)</b><small>1 marta</small></div>
                </div>
              </div>
              <div className={`${s.oCard} ${s.oRow} ${s.single}`}>
                <img src={`${IMG}/doc.webp`} alt="" width={44} height={44} />
                <div><b>Tahlil topshirish</b><small>Qo&apos;shish mumkin</small></div>
                <ChevronRight size={18} className={s.chev} />
              </div>
              <div className={s.oFoot}><span className={s.next}>Keyingi</span></div>
            </div>

            {/* ───── Qo'shimcha xizmatlar ───── */}
            <div className={`${s.over} ${s.list} ${v.list ? s.in : ""}`}>
              <ArrowLeft size={26} className={s.oBack} />
              <b className={s.lTitle}>Qo&apos;shimcha xizmatlar</b>
              <Bell size={24} className={s.lBell} />
              <div className={s.tabs}><span className={s.on}>Barchasi</span><span>Ukollar</span><span>Parvarish</span></div>
              <div className={s.items}>
                {SERVICES.map(([img, name, price], i) => (
                  <div key={img} className={s.item}>
                    <img src={`${IMG}/${img}.webp`} alt="" width={52} height={54} />
                    <div><b>{name}</b><small>{price}</small></div>
                    <span className={`${s.add} ${i === 1 && v.added ? s.added : ""}`}>{i === 1 && v.added ? <><Check size={14} strokeWidth={3} /> Qo&apos;shildi</> : "Qo'shish"}</span>
                  </div>
                ))}
              </div>
              <TabBar />
              <div className={`${s.cta} ${v.cta ? s.in : ""}`}>Davom etish · 1 ta xizmat</div>
            </div>

            <StatusBar light={top === "detail"} />
            <span className={s.island} />
            <span className={s.homeBar} />
            {v.tap && <span key={v.tap.n} className={s.tap} style={{ left: v.tap.x, top: v.tap.y }} />}
            {v.swipe && <span key={`sw${v.swipe.n}`} className={s.swipe} style={{ top: v.swipe.y }} />}
          </div>
        </div>
      </div>
    </div>
  );
}
