import {
  BadgeCheck, Bandage, BedDouble, BriefcaseMedical, CalendarCheck, CircleCheckBig, Clock, Dna, Download,
  Droplet, HandHeart, Handshake, Headset, HeartPulse, Hospital, House, IdCard, MapPin, MessageCircleMore,
  Microscope, MousePointerClick, PhoneCall, ShieldCheck, Smartphone, Star, Stethoscope, Syringe, Tag,
  TestTube, Thermometer, UsersRound, Wallet, type LucideIcon,
} from "lucide-react";

// Yagona vektor ikonka tizimi (lucide) — brend ranglarida
const ICONS = {
  bandage: Bandage, bed: BedDouble, calendar: CalendarCheck, chat: MessageCircleMore, check: BadgeCheck,
  check2: CircleCheckBig, clock: Clock, download: Download, drop: Droplet, handshake: Handshake,
  headphone: Headset, heart: HeartPulse, hospital: Hospital, house: House, id: IdCard, label: Tag,
  massage: HandHeart, nurse: BriefcaseMedical, people: UsersRound, phone: Smartphone, pin: MapPin,
  point: MousePointerClick, shield: ShieldCheck, star: Star, stethoscope: Stethoscope, syringe: Syringe,
  telephone: PhoneCall, testtube: TestTube, wallet: Wallet, microscope: Microscope,
  thermometer: Thermometer, dna: Dna,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/**
 * tone:
 *  - "brand"   — brend yashil chiziqli ikonka (matn yonida, plitka ichida)
 *  - "current" — ota elementning rangini oladi
 *  - "tile"    — logo gradientidagi plitka ichida oq ikonka (mustaqil / suzuvchi)
 */
export function Icon({
  name, size = 24, className = "", tone = "brand",
}: { name: IconName; size?: number; className?: string; tone?: "brand" | "current" | "tile" }) {
  const Glyph = ICONS[name];
  if (tone === "tile") {
    return (
      <span
        aria-hidden
        className={`icon3d grid shrink-0 place-items-center rounded-[30%] bg-brand-grad text-white shadow-[0_14px_30px_-12px_rgb(0_182_243/0.7)] ring-4 ring-white/70 ${className}`}
        style={{ width: size, height: size }}
      >
        <Glyph size={Math.round(size * 0.5)} strokeWidth={2} />
      </span>
    );
  }
  const star = name === "star";
  return (
    <Glyph
      aria-hidden
      size={size}
      strokeWidth={size <= 24 ? 2 : 1.75}
      fill={star ? "currentColor" : "none"}
      className={`icon3d shrink-0 ${star ? "text-[#f5b301]" : tone === "brand" ? "text-brand-deep" : ""} ${className}`}
    />
  );
}

/** Logo gradientidagi plitka — kartalarda bir xil ko'rinish uchun */
export function IconTile({
  name, size = 64, icon, className = "",
}: { name: IconName; size?: number; icon?: number; className?: string }) {
  const Glyph = ICONS[name];
  return (
    <span
      aria-hidden
      className={`icon3d grid shrink-0 place-items-center rounded-[22px] bg-brand-grad text-white shadow-[0_14px_28px_-14px_rgb(0_182_243/0.75)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Glyph size={icon ?? Math.round(size * 0.46)} strokeWidth={1.9} />
    </span>
  );
}
