import type { Metric, ProcessStep, SectionHeaderConfig } from "@/client/types";

export const SERVICES_PAGE_HEADER: SectionHeaderConfig = {
  badge: "Services",
  title: "Everything it takes\nto ship, and keep shipping.",
  subtitle:
    "Six disciplines, one team. We scope, design, build, launch and maintain — so there is never a handoff where the quality drops.",
} as const;

export const SERVICES_PAGE_STATS: readonly Metric[] = [
  {
    id: "proposal",
    value: "3 days",
    label: "From enquiry to written proposal",
  },
  { id: "release", value: "6 weeks", label: "Median time to first release" },
] as const;

export const PROCESS_HEADER: SectionHeaderConfig = {
  badge: "How we work",
  title: "Four steps. No surprises.",
} as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "scope",
    step: "01",
    title: "Scope",
    description:
      "A working session to pin down the problem, the users and the must-haves. You leave with a written scope and a fixed price.",
  },
  {
    id: "design",
    step: "02",
    title: "Design",
    description:
      "Flows and screens you can click through before we build them — plus the token system the whole product inherits.",
  },
  {
    id: "build",
    step: "03",
    title: "Build",
    description:
      "Two-week increments on a staging URL you can watch. Typed, tested, reviewed — no black box, no surprise invoice.",
  },
  {
    id: "launch",
    step: "04",
    title: "Launch & keep",
    description:
      "We ship it, monitor it, and hand over documentation. Stay on a support plan or take the keys — entirely your call.",
  },
] as const;
