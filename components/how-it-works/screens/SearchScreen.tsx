"use client";

import s from "../HowItWorks.module.css";
import { useSceneState, useSceneTimeline } from "../useSceneTimeline";
import { screenCls, type ScreenProps } from "./types";

type St = { title: string; sub: string; sec: number; line: boolean; pg2: boolean };


function MapSvg() {
  return (
    <svg viewBox="0 0 290 390" preserveAspectRatio="xMidYMid slice">
      <rect width="290" height="390" fill="#F1F0EC" />
      <path d="M190 330 L260 250 L290 262 L290 390 L170 390Z" fill="#DDEFC9" />
      <path d="M30 290 L110 300 L130 390 L40 390Z" fill="#DDEFC9" />
      <g stroke="#fff" strokeWidth="5" fill="none" transform="rotate(-38 145 190)">
        <path d="M-80 60H380M-80 110H380M-80 160H380M-80 210H380M-80 260H380M-80 310H380" />
        <path d="M20 -40V440M75 -40V440M130 -40V440M185 -40V440M240 -40V440M295 -40V440" />
      </g>
      <g stroke="#D5D8DC" strokeWidth="1" fill="none" transform="rotate(-38 145 190)">
        <path d="M-80 85H380M-80 135H380M-80 185H380M-80 235H380M-80 285H380M48 -40V440M158 -40V440M268 -40V440" />
      </g>
      <path d="M-10 120 L120 30 L200 -10" stroke="#F5DE8A" strokeWidth="7" fill="none" />
      <path d="M40 150 L80 250 L290 90" stroke="#F5DE8A" strokeWidth="6" fill="none" opacity=".8" />
      <path d="M290 130 L200 390" stroke="#9CCBEF" strokeWidth="2" fill="none" />
      <g fontFamily="Onest,sans-serif" fontSize="9" fontWeight="700" fill="#A3A8B8" letterSpacing=".5">
        <text x="160" y="60">IQBOL MAHALLA</text><text x="190" y="235">ZIYOLILAR</text><text x="150" y="300">IYKOTA MAHALLA</text>
      </g>
      <circle className={s.pulse} cx="150" cy="150" r="90" fill="#43C98A" opacity=".35" />
      <circle className={`${s.pulse} ${s.p2}`} cx="150" cy="150" r="90" fill="#43C98A" opacity=".35" />
      <circle className={`${s.pulse} ${s.p3}`} cx="150" cy="150" r="90" fill="#43C98A" opacity=".35" />
      <g className={s.pin}>
        <path d="M150 148V168" stroke="#2BB59A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="150" cy="138" r="13" fill="url(#lg)" />
        <circle cx="150" cy="138" r="5" fill="#fff" />
      </g>
    </svg>
  );
}

function Illustration() {
  return (
    <svg viewBox="0 0 120 70">
      <rect x="30" y="4" width="60" height="62" rx="4" fill="#E3F6EF" />
      <path d="M38 16h26M38 22h18M38 38h22M38 52h26" stroke="#9FDCC6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="76" cy="18" r="8" fill="#fff" stroke="#1BB3F7" strokeWidth="1.5" /><circle cx="76" cy="16" r="3" fill="#1E2328" /><path d="M71 23q5-5 10 0" fill="#1E2328" />
      <circle cx="46" cy="36" r="8" fill="#fff" stroke="#1BB3F7" strokeWidth="1.5" /><circle cx="46" cy="34" r="3" fill="#B0523A" /><path d="M41 41q5-5 10 0" fill="#2BB59A" />
      <circle cx="72" cy="50" r="8" fill="#fff" stroke="#1BB3F7" strokeWidth="1.5" /><circle cx="72" cy="48" r="3" fill="#1E2328" /><path d="M67 55q5-5 10 0" fill="#2BB59A" />
      <g className={s.mag}>
        <circle cx="70" cy="48" r="11" fill="rgba(0,182,243,.12)" stroke="#2BB59A" strokeWidth="2.5" />
        <path d="M62 56 50 64" stroke="#2BB59A" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function SearchScreen(p: ScreenProps) {
  const t = p.t.search;
  const [v, set] = useSceneState<St>(p.runKey, { title: t.searching, sub: t.starting, sec: 0, line: false, pg2: false });

  useSceneTimeline(p.runKey, p.reduced, ({ at, every }) => {
    const id = every(1000, () => set((x) => ({ ...x, sec: x.sec + 1 })));
    at(1800, () => set((x) => ({ ...x, sub: t.nearby })));
    at(4300, () => {
      clearInterval(id);
      set((x) => ({ ...x, line: true }));
    });
    at(5200, () => set((x) => ({ ...x, pg2: true, title: t.found, sub: t.accepted })));
  });

  return (
    <div className={screenCls(p, s.s3)} id="s3" role="tabpanel" aria-label={p.panel}>
      <div className={s.map}><MapSvg /></div>
      <div className={s.sb}><span>02:36</span><span className={s.ic}><span className={s.bat} /></span></div>
      <div className={s.xbtn}>
        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" stroke="#1E2328" strokeWidth="2.6" strokeLinecap="round" /></svg>
      </div>
      <div className={s.bsheet}>
        <div className={s.handle} />
        <div className={s["st-row"]}>
          <span className={s["st-t"]}>{v.title}</span>
          <span className={s["st-time"]}>00:{String(v.sec).padStart(2, "0")}</span>
        </div>
        <div className={s["st-s"]}>{v.sub}</div>
        <div className={s.prog}>
          <i style={{ width: v.line ? "calc(25% - 9px)" : "0" }} />
          <span className={s.on}><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg></span>
          <span className={v.pg2 ? s.on : undefined}><svg viewBox="0 0 24 24"><rect x="6" y="3" width="11" height="18" rx="2" /><path d="M10 18h3M14 7l1.5 1.5L19 5" /></svg></span>
          <span><svg viewBox="0 0 24 24"><path d="M4 7l5 5-5 5M12 7h8M13 12h2m3 0h2M12 17h8" /></svg></span>
          <span><svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" /><path d="m9 12 2 2 4-4" /></svg></span>
          <span><svg viewBox="0 0 24 24"><path d="M2 13l4 4L16 7M11 16l1 1L22 7" /></svg></span>
        </div>
        <div className={s.illu}><Illustration /></div>
        <div className={s.acts}>
          <div>
            <span><svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" stroke="#E53935" strokeWidth="2.6" strokeLinecap="round" /></svg></span>
            {t.cancel}
          </div>
          <div>
            <span><svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="#1E2328" strokeWidth="2.4" strokeLinecap="round" /></svg></span>
            {t.details}
          </div>
        </div>
      </div>
    </div>
  );
}
