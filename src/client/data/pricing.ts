import type { FAQ, SectionHeaderConfig } from "@/client/types";

export const PRICING_HEADER: SectionHeaderConfig = {
  badge: "Transparent pricing",
  title: "Investment that pays off.",
  subtitle:
    "Clear starting prices, fixed-scope quotes, and a written proposal before a line of code.",
} as const;

export const PRICING_FAQS: readonly FAQ[] = [
  {
    id: "from-prices",
    question: "Why are these starting prices?",
    answer:
      "Because quoting a flat number for work we have not scoped would be guessing. The floor is real — most Business projects land between $3,500 and $6,000.",
  },
  {
    id: "payments",
    question: "How do payments work?",
    answer:
      "Half to start, half on launch, for projects under $10k. Larger builds are billed against milestones you sign off on.",
  },
  {
    id: "changes",
    question: "What if we need changes later?",
    answer:
      "Small changes are covered by your support window. Anything larger gets its own small fixed-price scope — no open-ended hourly billing.",
  },
  {
    id: "equity",
    question: "Do you take equity instead?",
    answer:
      "Occasionally, as part of a blended deal for products we would use ourselves. Ask on the call — the answer is usually no, but it is worth asking.",
  },
] as const;
