import { Cloud, Globe, Smartphone, Workflow } from "lucide-react";
import type { Service, EmphasisHeaderData } from "@/client/types";

export const SERVICES_HEADER: EmphasisHeaderData = {
  eyebrow: "What we do",
  titleLead: "Everything you need,",
  titleEmphasis: "built by one team.",
  description:
    "From your first website to the systems that run your business, we design it, build it and look after it, so you never have to juggle five different companies.",
} as const;

// TODO: placeholder until the API is running; remove once home featured services are set in the CMS.
export const PLACEHOLDER_SERVICES: readonly Service[] = [
  {
    id: "placeholder-websites",
    title: "Websites",
    description:
      "Fast, good-looking websites that tell people what you do and turn visitors into customers.",
    icon: Globe,
    visual: "website",
    highlights: ["Design", "Online shops", "Found on Google"],
    href: "/services",
  },
  {
    id: "placeholder-apps",
    title: "Mobile apps",
    description:
      "Apps for iPhone and Android that your customers enjoy using, from first idea to the app store.",
    icon: Smartphone,
    visual: "mobile",
    highlights: ["iPhone", "Android"],
    href: "/services",
  },
  {
    id: "placeholder-systems",
    title: "Business systems",
    description:
      "Custom tools that replace spreadsheets and paperwork, so your team spends less time on admin.",
    icon: Workflow,
    visual: "systems",
    highlights: ["Bookings", "Dashboards"],
    href: "/services",
  },
  {
    id: "placeholder-cloud",
    title: "Cloud & support",
    description:
      "We host, watch over and update your software, so it stays fast, safe and online day and night.",
    icon: Cloud,
    visual: "cloud",
    highlights: ["Hosting", "Backups", "24/7 monitoring"],
    href: "/services",
  },
];
