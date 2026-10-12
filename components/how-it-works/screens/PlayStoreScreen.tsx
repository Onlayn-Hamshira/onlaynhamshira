"use client";

import { useRef } from "react";
import s from "../HowItWorks.module.css";
import { Logo } from "../icons";
import { useSceneState, useSceneTimeline } from "../useSceneTimeline";
import { screenCls, type ScreenProps } from "./types";
import { fill } from "@/lib/i18n/format";

type St = { st: "idle" | "loading" | "done"; pct: number };
const INITIAL: St = { st: "idle", pct: 0 };

export function PlayStoreScreen(p: ScreenProps) {
  const t = p.t.ps;
  const [v, set] = useSceneState(p.runKey, INITIAL);
  const install = useRef<HTMLButtonElement>(null);
  const open = useRef<HTMLButtonElement>(null);

  useSceneTimeline(p.runKey, p.reduced, ({ at, every }) => {
    at(900, () => p.tap(install.current));
    at(1150, () => {
      set((x) => ({ ...x, st: "loading" }));
      let n = 0;
      const id = every(100, () => {
        n = Math.min(100, n + Math.ceil(Math.random() * 6 + 2));
        set((x) => ({ ...x, pct: n }));
        if (n >= 100) clearInterval(id);
      });
    });
    at(3700, () => set((x) => ({ ...x, st: "done" })));
    at(4700, () => p.tap(open.current));
  });

  // Reset: transition'siz 220 · loading: 2.4s davomida 0 gacha
  const ring: React.CSSProperties | undefined =
    p.runKey === null
      ? undefined
      : v.st === "idle"
        ? { transition: "none", strokeDashoffset: 220 }
        : { transition: "stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)", strokeDashoffset: 0 };

  return (
    <div className={screenCls(p, s.s0)} id="s0" data-st={v.st} role="tabpanel" aria-label={p.panel}>
      <div className={s.sb}><span>02:33</span><span className={s.ic}><span className={s.bat} /></span></div>
      <div className={s["ps-top"]}>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M20 12H4m6-6-6 6 6 6" /></svg>
        <svg viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round"><path d="M12 5h.01M12 12h.01M12 19h.01" /></svg>
      </div>
      <div className={s["ps-app"]}>
        <div className={s["ps-icon"]}>
          <svg className={s.ring} viewBox="0 0 74 74"><circle cx="37" cy="37" r="35" style={ring} /></svg>
          <div className={s.ic}><Logo className={s.logo} /></div>
        </div>
        <div>
          <div className={s["ps-name"]}>Onlayn Hamshira</div>
          <div className={s["ps-dev"]}>ONLAYN HAMSHIRA LLC</div>
          <div className={s["ps-pct"]}>{fill(t.pct, { n: v.pct })}</div>
        </div>
      </div>
      <div className={s["ps-stats"]}>
        <div><b>4.8 ★</b>{t.reviews}</div>
        <div><b>3+</b>{t.rated}</div>
        <div><b>10K+</b>{t.downloads}</div>
      </div>
      <div className={s["ps-btns"]}>
        <button ref={install} className={`${s["b-install"]} ${s.fill}`} tabIndex={-1}>{t.install}</button>
        <button className={s["b-cancel"]} tabIndex={-1}>{t.cancel}</button>
        <button className={`${s["b-open-dis"]} ${s.dis}`} tabIndex={-1}>{t.open}</button>
        <button className={s["b-un"]} tabIndex={-1}>{t.uninstall}</button>
        <button ref={open} className={`${s["b-open"]} ${s.fill}`} tabIndex={-1}>{t.open}</button>
      </div>
      <div className={s["ps-rate"]}>
        <h4>{t.rate}</h4>
        <p>{t.rateSub}</p>
        <div className={s["ps-stars"]}><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div>
      </div>
      <div className={s["ps-about"]}>{t.about}</div>
    </div>
  );
}
