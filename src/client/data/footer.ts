import type { FooterData } from "@/client/types";

export const FOOTER_DATA: FooterData = {
  headlineLead: "Clear, dependable software",
  headlineEmphasis: "for growing businesses.",
  status: "Taking new projects",
  email: "[hello@frostwoodtech.com]",
  copyright: "© 2026 FrostWoodTech. All rights reserved.",
  linkGroups: [
    {
      title: "Products",
      links: [
        { label: "All products", href: "/products" },
        { label: "Pricing", href: "/pricing" },
        { label: "Reviews", href: "/reviews" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "SaaS & web apps", href: "/services" },
        { label: "Web & e-commerce", href: "/services" },
        { label: "Design systems", href: "/services" },
        { label: "SEO & growth", href: "/services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Case studies", href: "/work" },
        { label: "Insights", href: "/blog" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
  // TODO: point these at real pages once they exist.
  legalLinks: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
} as const;
