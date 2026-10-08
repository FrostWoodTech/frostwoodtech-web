import type { ApiReview, EmphasisHeaderData } from "@/client/types";

export const REVIEWS_WALL_HEADER: EmphasisHeaderData = {
  eyebrow: "Client reviews",
  titleLead: "Loved by the people",
  titleEmphasis: "we build for.",
  description:
    "Real feedback from the businesses we work with, from the first chat to long after launch.",
} as const;

// TODO: fabricated dummy content for layout only — replace before launch. Shown only until the
// API returns featured reviews.
export const PLACEHOLDER_REVIEWS: readonly ApiReview[] = [
  {
    id: "placeholder-maya",
    name: "Maya R.",
    position: "Owner, Bloom Hair Studio",
    country: "United Kingdom",
    countryCode: "GB",
    rating: 5,
    reviewText:
      "They rebuilt our booking system in six weeks. Clients book online at midnight now, no-shows dropped by half, and I finally get my evenings back.",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "placeholder-tom",
    name: "Tom B.",
    position: "Operations lead, Harbour Coffee",
    country: "Germany",
    countryCode: "DE",
    rating: 5,
    reviewText:
      "Everything was explained in plain English, and the price never moved. Our stock app saves the team hours every week.",
    createdAt: "2026-08-14T00:00:00Z",
  },
  {
    id: "placeholder-priya",
    name: "Priya S.",
    position: "Founder, Kindred Learning",
    country: "India",
    countryCode: "IN",
    rating: 5,
    reviewText:
      "It felt like having our own tech team. Quick replies, honest advice, and they told us when an idea wasn't worth the money.",
    createdAt: "2026-07-30T00:00:00Z",
  },
  {
    id: "placeholder-leo",
    name: "Leo K.",
    position: "Director, Northline Logistics",
    country: "Poland",
    countryCode: "PL",
    rating: 5,
    reviewText:
      "Our old system went down every Monday. Since the move we haven't had a single outage, and support answers within minutes.",
    createdAt: "2026-07-02T00:00:00Z",
  },
  {
    id: "placeholder-ana",
    name: "Ana M.",
    position: "Marketing manager, Solar Casa",
    country: "Portugal",
    countryCode: "PT",
    rating: 5,
    reviewText:
      "Our new website looks beautiful and loads in a blink. Enquiries doubled in the first two months, and we can update pages ourselves.",
    createdAt: "2026-06-18T00:00:00Z",
  },
];
