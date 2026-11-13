import type { CtaData } from "@/client/types";

export const HOME_CTA: CtaData = {
  eyebrow: "Free first chat · Reply within one working day",
  titleLead: "Let’s build something",
  titleEmphasis: "that lasts a decade.",
  description:
    "Tell us what you're building. You'll get a scoped proposal and a fixed price within three working days.",
  primary: { label: "Start a project", href: "/contact" },
  secondary: { label: "See our work", href: "/work" },
  promises: ["Fixed price", "Proposal in 3 days", "No commitment"],
} as const;
