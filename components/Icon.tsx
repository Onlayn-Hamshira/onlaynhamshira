import {
  BadgeCheck, Bandage, BedDouble, BriefcaseMedical, CalendarCheck, CircleCheckBig, Clock, Dna, Download,
  Droplet, HandHeart, Handshake, Headset, HeartPulse, Hospital, House, HousePlus, IdCard, MapPin, MessageCircleMore,
  Microscope, MousePointerClick, PhoneCall, ShieldCheck, Smartphone, Star, Stethoscope, Syringe, Tag,
  TestTube, Thermometer, UsersRound, Wallet, createLucideIcon, type LucideIcon,
} from "lucide-react";

// lucide'da yo'q xizmat ikonkalari — o'sha uslubda (24×24, chiziqli) chizilgan
const Catheter = createLucideIcon("Catheter", [
  ["path", { d: "M12 22v-4", key: "tip" }],
  ["rect", { x: "9.5", y: "10", width: "5", height: "8", rx: "1.5", key: "hub" }],
  ["path", { d: "M9.5 13.5 4 16l5.5 1", key: "wing-l" }],
  ["path", { d: "M14.5 13.5 20 16l-5.5 1", key: "wing-r" }],
  ["path", { d: "M12 10V7.5C12 5 13.8 3 16.5 3H21", key: "line" }],
]);
const Enema = createLucideIcon("Enema", [
  ["path", { d: "M10 9.5c-2.1 1.3-4.5 3.2-4.5 6.3 0 3.5 2.5 6.2 6.5 6.2s6.5-2.7 6.5-6.2c0-3.1-2.4-5-4.5-6.3", key: "bulb" }],
  ["path", { d: "M9.5 7h5v2.5h-5z", key: "collar" }],
  ["path", { d: "M11 7 11.6 2h.8L13 7", key: "nozzle" }],
  ["path", { d: "M8.8 15.5a3.4 3.4 0 0 0 1.7 3", key: "shine" }],
]);

// Yagona vektor ikonka tizimi (lucide) — brend ranglarida
const ICONS = {
  bandage: Bandage, bed: BedDouble, calendar: CalendarCheck, chat: MessageCircleMore, check: BadgeCheck,
  check2: CircleCheckBig, clock: Clock, download: Download, drop: Droplet, handshake: Handshake,
  headphone: Headset, heart: HeartPulse, hospital: Hospital, house: House, id: IdCard, label: Tag,
  massage: HandHeart, nurse: BriefcaseMedical, people: UsersRound, phone: Smartphone, pin: MapPin,
  point: MousePointerClick, shield: ShieldCheck, star: Star, stethoscope: Stethoscope, syringe: Syringe,
  telephone: PhoneCall, testtube: TestTube, wallet: Wallet, microscope: Microscope,
  thermometer: Thermometer, dna: Dna, catheter: Catheter, enema: Enema, homeVisit: HousePlus,
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
