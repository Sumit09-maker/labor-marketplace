import {
  AirVent,
  BrickWall,
  Flame,
  Hammer,
  Hand,
  LayoutGrid,
  Paintbrush,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  mason: BrickWall,
  carpenter: Hammer,
  electrician: Zap,
  plumber: Wrench,
  painter: Paintbrush,
  welder: Flame,
  helper: Hand,
  ac_mechanic: AirVent,
  tile_fitter: LayoutGrid,
};

export default function SkillIcon({
  skill,
  className = "h-5 w-5",
}: {
  skill: string;
  className?: string;
}) {
  const Icon = ICONS[skill] ?? Hammer;
  return <Icon className={className} strokeWidth={2} />;
}
