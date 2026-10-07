// Namunadagi <symbol>'lar — yo'lma-yo'l ko'chirilgan
export function SpriteDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#54DE62" /><stop offset="1" stopColor="#1BB3F7" /></linearGradient>
        <symbol id="logo" viewBox="0 0 100 100">
          <path d="M50 16C31 16 20 31 20 47c0 19 19 32 30 45 11-13 30-26 30-45 0-16-11-31-30-31z" fill="url(#lg)" />
          <ellipse cx="50" cy="52" rx="18" ry="19" fill="#fff" />
          <path d="M32 46c4-9 10-12 18-12s14 3 18 12c-6-4-12-5-18-5s-12 1-18 5z" fill="url(#lg)" />
          <path d="M40 54q3-3 6 0M54 54q3-3 6 0" stroke="#1FAE9A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M45 61q5 4 10 0" stroke="#1FAE9A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M33 14q17-7 34 0v9q-17-5-34 0z" fill="#fff" stroke="url(#lg)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 13v6M47 16h6" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round" />
        </symbol>
        <symbol id="back" viewBox="0 0 24 24"><path d="M20 12H4m6-6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="tick" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      </defs>
    </svg>
  );
}

type P = { className?: string; width?: number; height?: number; style?: React.CSSProperties };

export const Logo = (p: P) => <svg {...p}><use href="#logo" /></svg>;
export const Back = (p: P) => <svg {...p}><use href="#back" /></svg>;
export const Tick = (p: P) => <svg {...p}><use href="#tick" /></svg>;
