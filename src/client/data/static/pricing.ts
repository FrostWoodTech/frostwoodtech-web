import type { ApiPricingPlan, PriceType } from "@/client/types";

interface PlanSeed {
  readonly key: string;
  readonly name: string;
  readonly tagline: string;
  readonly price?: number;
  readonly priceType: PriceType;
  readonly delivery?: string;
  readonly description: string;
  readonly popular?: boolean;
  readonly features: readonly string[];
  readonly excluded?: readonly string[];
}

const plan = (
  seed: PlanSeed,
  sortOrder: number,
  serviceId?: string,
): ApiPricingPlan => ({
  id: `plan-${serviceId ? `${serviceId}-` : ""}${seed.key}`,
  serviceId,
  name: seed.name,
  tagline: seed.tagline,
  priceAmount: seed.price,
  currency: "USD",
  priceType: seed.priceType,
  deliveryText: seed.delivery,
  description: seed.description,
  isPopular: seed.popular ?? false,
  ctaLabel: seed.priceType === "custom" ? "Talk to us" : "Get started",
  ctaUrl: "/contact",
  featured: !serviceId,
  sortOrder,
  features: [
    ...seed.features.map((text, index) => ({
      id: `${seed.key}-f${index}`,
      text,
      isIncluded: true,
      sortOrder: index,
    })),
    ...(seed.excluded ?? []).map((text, index) => ({
      id: `${seed.key}-x${index}`,
      text,
      isIncluded: false,
      sortOrder: seed.features.length + index,
    })),
  ],
});

const COMBO_SEEDS: readonly PlanSeed[] = [
  {
    key: "starter",
    name: "Starter",
    tagline: "Get online, properly",
    price: 1500,
    priceType: "starting_from",
    delivery: "Live in about 4 weeks",
    description: "A fast, good-looking website for a small business.",
    features: [
      "Up to 5 pages",
      "Works on phones and computers",
      "Contact form",
      "Google basics set up",
      "30 days of support",
    ],
    excluded: ["Online shop", "Custom features"],
  },
  {
    key: "business",
    name: "Business",
    tagline: "Website plus the tools you run on",
    price: 4500,
    priceType: "starting_from",
    delivery: "Live in about 6–8 weeks",
    description:
      "A website and one custom tool, such as bookings or an online shop.",
    popular: true,
    features: [
      "Everything in Starter",
      "Online shop or booking system",
      "Card payments",
      "Edit everything yourself",
      "90 days of support",
    ],
  },
  {
    key: "custom",
    name: "Custom",
    tagline: "Apps and business systems",
    priceType: "custom",
    delivery: "First release in 8–12 weeks",
    description:
      "Mobile apps and custom systems, scoped with you and priced in writing.",
    features: [
      "Free discovery workshop",
      "iPhone, Android and web",
      "Connections to your tools",
      "Released in small stages",
      "Dedicated team",
    ],
  },
];

export const COMBO_PLANS: readonly ApiPricingPlan[] = COMBO_SEEDS.map(
  (seed, index) => plan(seed, index),
);

const SERVICE_TIERS: readonly PlanSeed[] = [
  {
    key: "essential",
    name: "Essential",
    tagline: "The essentials, done well",
    price: 1500,
    priceType: "starting_from",
    delivery: "About 4 weeks",
    description: "The core of the service at a fixed price.",
    features: ["Free first chat", "Fixed price", "30 days of support"],
  },
  {
    key: "growth",
    name: "Growth",
    tagline: "For growing businesses",
    price: 4500,
    priceType: "starting_from",
    delivery: "About 6–8 weeks",
    description: "More features and a longer support window.",
    popular: true,
    features: [
      "Everything in Essential",
      "Custom features",
      "Training for your team",
      "90 days of support",
    ],
  },
  {
    key: "care",
    name: "Care plan",
    tagline: "We look after it for you",
    price: 149,
    priceType: "monthly",
    description: "Hosting, backups, updates and help whenever you need it.",
    features: [
      "Secure hosting",
      "Daily backups",
      "Security updates",
      "Monthly report",
    ],
  },
];

export function servicePlans(serviceId: string): ApiPricingPlan[] {
  return SERVICE_TIERS.map((seed, index) => plan(seed, index, serviceId));
}
