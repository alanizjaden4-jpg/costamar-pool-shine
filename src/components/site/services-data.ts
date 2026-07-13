import {
  CalendarCheck,
  Filter,
  Leaf,
  Sparkles,
  Sun,
  FlaskConical,
  CloudRain,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  price: string;
  features: string[];
};

export const services: Service[] = [
  {
    slug: "weekly-pool-maintenance",
    title: "Weekly Pool Maintenance",
    description:
      "Regular visits to keep your pool pristine, balanced, and ready to swim every day.",
    icon: CalendarCheck,
    price: "Custom quote",
    features: [
      "Skimming",
      "Brushing",
      "Vacuuming",
      "Emptying baskets",
      "Water testing",
      "Chemical balancing",
      "Equipment inspection",
      "Service report",
    ],
  },
  {
    slug: "filter-cleaning",
    title: "Filter Cleaning",
    description:
      "Deep cleaning for cartridge, DE, sand, and salt cell filter systems.",
    icon: Filter,
    price: "Custom quote",
    features: [
      "Cartridge filter cleaning",
      "DE filter cleaning",
      "Sand filter backwashing/deep cleaning",
      "Salt cell cleaning",
    ],
  },
  {
    slug: "green-pool-cleanup",
    title: "Green Pool Cleanup",
    description:
      "Algae treatment, shocking, and balancing to restore cloudy green pools to clear.",
    icon: Leaf,
    price: "Custom quote",
    features: [
      "Algae treatment",
      "Shocking",
      "Brushing",
      "Vacuuming",
      "Filter cleaning",
      "Water balancing",
      "Follow-up visits",
    ],
  },
  {
    slug: "one-time-pool-cleaning",
    title: "One-Time Pool Cleaning",
    description:
      "A single deep clean for events, neglected pools, or a seasonal refresh.",
    icon: Sparkles,
    price: "Custom quote",
    features: [
      "Heavy debris removal",
      "Full vacuum",
      "Full brushing",
      "Water balancing",
      "Equipment check",
    ],
  },
  {
    slug: "new-pool-startup",
    title: "New Pool Startups",
    description:
      "Proper startup care for new plaster pools to protect the finish and balance chemistry.",
    icon: Sun,
    price: "Custom quote",
    features: [
      "Plaster dust removal",
      "Startup brushing",
      "Water balancing",
      "Filter maintenance",
      "Startup chemistry",
    ],
  },
  {
    slug: "specialty-water-treatments",
    title: "Specialty Water Treatments",
    description:
      "Targeted treatments for phosphates, stains, algae, and cloudy water.",
    icon: FlaskConical,
    price: "Custom quote",
    features: [
      "Pool shocking",
      "Phosphate removal",
      "Clarifier",
      "Flocculant",
      "Stain treatment",
      "Algae treatments",
    ],
  },
  {
    slug: "storm-cleanup",
    title: "Storm Cleanup",
    description:
      "Post-storm debris removal, vacuuming, and water restoration to get you swimming again.",
    icon: CloudRain,
    price: "Custom quote",
    features: [
      "Leaf removal",
      "Debris cleanup",
      "Vacuuming",
      "Filter cleaning",
      "Water restoration",
    ],
  },
];
