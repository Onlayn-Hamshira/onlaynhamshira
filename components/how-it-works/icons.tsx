import { editableImage } from "@/lib/edit/edits";

// Namunadagi <symbol>'lar — yo'lma-yo'l ko'chirilgan
export function SpriteDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#54DE62" /><stop offset="1" stopColor="#1BB3F7" /></linearGradient>
        <symbol id="back" viewBox="0 0 24 24"><path d="M20 12H4m6-6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        <symbol id="tick" viewBox="0 0 24 24"><path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      </defs>
    </svg>
  );
}

type P = { className?: string; width?: number; height?: number; style?: React.CSSProperties };

// Rasmiy logo belgisi (public/img/logo-mark.svg) — qo'lda chizilmaydi
// eslint-disable-next-line @next/next/no-img-element -- kichik SVG logo
export const Logo = ({ className }: { className?: string }) => <img src={editableImage("/img/logo-mark.svg")} alt="" width={37} height={51} className={className} />;
export const Back = (p: P) => <svg {...p}><use href="#back" /></svg>;
export const Tick = (p: P) => <svg {...p}><use href="#tick" /></svg>;
