import {
  Droplets,
  FlaskConical,
  Filter,
  Wrench,
  Leaf,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "weekly-cleaning",
    title: "Weekly Pool Cleaning",
    description: "Skimming, vacuuming, brushing and water testing every week so your pool stays pristine.",
    icon: Droplets,
  },
  {
    slug: "chemical-balancing",
    title: "Chemical Testing & Balancing",
    description: "Precise pH, chlorine, and alkalinity adjustments to keep water safe and crystal clear.",
    icon: FlaskConical,
  },
  {
    slug: "filter-cleaning",
    title: "Filter Cleaning",
    description: "Deep cleaning of cartridge, sand, or DE filters for maximum circulation and clarity.",
    icon: Filter,
  },
  {
    slug: "equipment-inspection",
    title: "Equipment Inspection",
    description: "Full inspection of pumps, heaters, and plumbing to catch issues before they cost you.",
    icon: Wrench,
  },
  {
    slug: "green-pool-recovery",
    title: "Green Pool Recovery",
    description: "Algae-ridden water restored to sparkling blue with our proven recovery process.",
    icon: Leaf,
  },
  {
    slug: "one-time-cleanup",
    title: "One-Time Pool Cleanups",
    description: "Hosting an event? A single deep clean to get your pool guest-ready fast.",
    icon: Sparkles,
  },
];