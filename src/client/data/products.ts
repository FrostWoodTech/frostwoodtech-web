import type { EmphasisHeaderData, Product } from "@/client/types";

export const PRODUCTS_HEADER: EmphasisHeaderData = {
  eyebrow: "Our products",
  titleLead: "Ready-made software,",
  titleEmphasis: "ready when you are.",
  description:
    "Products we built, run and keep improving. Sign up and start using them today, with no project needed.",
} as const;

// TODO: placeholder until the API is running; remove once featured products are set in the CMS.
export const PLACEHOLDER_PRODUCTS: readonly Product[] = [
  {
    id: "placeholder-frostbook",
    slug: "frostbook",
    name: "FrostBook",
    tagline: "Online bookings that fill your calendar",
    description:
      "Let customers book and pay for appointments online, any time of day. Reminders go out on their own, so fewer people forget to turn up.",
    priceDetails: "From $29 / month",
    imagePlaceholder: "",
    href: "/products",
    screen: "bookings",
    images: [],
  },
  {
    id: "placeholder-froststock",
    slug: "froststock",
    name: "FrostStock",
    tagline: "Always know what's on your shelves",
    description:
      "Track stock across your shops and warehouses in one place, and get a heads-up before anything runs out.",
    priceDetails: "From $49 / month",
    imagePlaceholder: "",
    href: "/products",
    screen: "inventory",
    images: [],
  },
  {
    id: "placeholder-frostdesk",
    slug: "frostdesk",
    name: "FrostDesk",
    tagline: "Every customer question in one inbox",
    description:
      "Emails, chats and messages from every channel land in one shared inbox, so nothing slips through and replies go out faster.",
    priceDetails: "From $19 / month",
    imagePlaceholder: "",
    href: "/products",
    screen: "support",
    images: [],
  },
];
