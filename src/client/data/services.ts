import { Cloud, Globe, Smartphone, Workflow } from "lucide-react";
import type { EmphasisHeaderData, Service } from "@/client/types";

export const SERVICES_HEADER: EmphasisHeaderData = {
  eyebrow: "What we do",
  titleLead: "Everything you need,",
  titleEmphasis: "built by one team.",
  description:
    "From your first website to the systems that run your business, we design it, build it and look after it, so you never have to juggle five different companies.",
} as const;

/** Home card extras by service slug: drawing, icon and floating tags. Other slugs fall back to an icon. */
export const SERVICE_EXTRAS: Readonly<
  Record<string, Pick<Service, "icon" | "visual" | "highlights">>
> = {
  websites: {
    icon: Globe,
    visual: "website",
    highlights: ["Design", "Online shops", "Found on Google"],
  },
  "mobile-apps": {
    icon: Smartphone,
    visual: "mobile",
    highlights: ["iPhone", "Android"],
  },
  "business-systems": {
    icon: Workflow,
    visual: "systems",
    highlights: ["Bookings", "Dashboards"],
  },
  "cloud-support": {
    icon: Cloud,
    visual: "cloud",
    highlights: ["Hosting", "Backups", "24/7 monitoring"],
  },
};
