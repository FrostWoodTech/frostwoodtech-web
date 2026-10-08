import type { EmphasisHeaderData, FAQ, PricingPromise } from "@/client/types";

export const PRICING_TEASER_HEADER: EmphasisHeaderData = {
  eyebrow: "Pricing",
  titleLead: "Transparent pricing,",
  titleEmphasis: "for every project.",
  description:
    "Whether you need a website, an app or a ready-made product, you'll always know the price before you commit.",
} as const;

export const PRICING_PROMISES: readonly PricingPromise[] = [
  {
    id: "free-quote",
    value: "Free",
    title: "First chat & quote",
    description:
      "Tell us your idea and get a clear, written price, with no cost and no commitment.",
  },
  {
    id: "fixed-price",
    value: "Fixed",
    title: "Price agreed upfront",
    description:
      "The price we quote is the price you pay. No hourly meter running.",
  },
  {
    id: "no-hidden-fees",
    value: "$0",
    title: "Hidden fees",
    description:
      "Hosting, support and extras are listed up front, never added later.",
  },
  {
    id: "products-from",
    value: "$19",
    suffix: "/mo",
    title: "Products from",
    description:
      "Ready-made products on simple monthly plans. Cancel any time.",
  },
] as const;

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
