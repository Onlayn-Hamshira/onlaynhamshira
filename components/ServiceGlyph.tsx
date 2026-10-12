import type { ServiceIcon } from "@/lib/data";
import { Icon, type IconName } from "./Icon";

const MAP: Record<ServiceIcon, IconName> = {
  syringe: "syringe",
  droplet: "drop",
  bandage: "bandage",
  gauge: "heart",
  bed: "bed",
  stethoscope: "stethoscope",
  flask: "testtube",
  hand: "massage",
  catheter: "catheter",
  enema: "enema",
  homeVisit: "homeVisit",
};

export function ServiceGlyph({
  icon, size = 24, className, tone,
}: { icon: ServiceIcon; size?: number; className?: string; tone?: "brand" | "current" }) {
  return <Icon name={MAP[icon]} size={size} className={className} tone={tone} />;
}
