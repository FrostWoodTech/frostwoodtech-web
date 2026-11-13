import type { NavItem, BrandInfo } from "@/client/types";

export const BRAND: BrandInfo = {
  name: "FrostWoodTech",
  tagline: "SaaS & Custom Platforms",
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/blog" },
  { label: "About", href: "/about" },
] as const;
