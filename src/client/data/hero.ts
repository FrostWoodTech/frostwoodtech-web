import type { HeroData, Metric } from "@/client/types";

export const HERO_DATA: HeroData = {
  kicker: "Software studio · Products & platforms",
  headlineFirstLine: "Software made",
  headlineLead: "for a ",
  headlineEmphasis: "clearer",
  headlineTail: " future.",
  description:
    "We create products of our own—and digital platforms for organisations that want to move with more confidence, not more complexity.",
  quote:
    "The person you meet to talk through the work is the person who builds it.",
  quoteNote: "A small, senior team. Founded in 2019.",
} as const;

/** TODO: invented placeholder names — replace with real client logos before launch. */
export const TRUSTED_BY: readonly string[] = [
  "Horizon",
  "VELA",
  "Northline",
  "meridian",
  "ORA",
  "taper.",
] as const;

export const HOME_METRICS: readonly Metric[] = [
  {
    id: "shipped",
    value: "40",
    suffix: "+",
    suffixTone: "forest",
    label: "Products & platforms shipped",
  },
  {
    id: "retention",
    value: "98",
    suffix: "%",
    suffixTone: "forest",
    label: "Clients who come back",
  },
  {
    id: "uptime",
    value: "99.98",
    suffix: "%",
    suffixTone: "ice",
    label: "SaaS uptime, trailing 90 days",
  },
  {
    id: "time-to-release",
    value: "6",
    suffix: "wk",
    suffixTone: "ice",
    label: "Median time to first release",
  },
] as const;
