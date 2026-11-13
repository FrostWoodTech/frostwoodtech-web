import type { EmphasisHeaderData, ProjectScreenKind } from "@/client/types";

export const WORK_SHOWCASE_HEADER: EmphasisHeaderData = {
  eyebrow: "Our work",
  titleLead: "Real software,",
  titleEmphasis: "for real businesses.",
  description:
    "A few of the systems we've designed and built, from ticket booking to the tools that run a team.",
} as const;

/** The illustrated screen shown for a project (by slug) until it has screenshots. */
export const PROJECT_SCREENS: Readonly<Record<string, ProjectScreenKind>> = {
  "theatre-booking": "theatre",
  teamora: "people",
  aurora: "transfers",
};
