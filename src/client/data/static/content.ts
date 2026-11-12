import type {
  ApiArticle,
  ApiCurrency,
  ApiFaq,
  ApiProduct,
  ApiReview,
} from "@/client/types";
import { TAGS } from "./tags";

/** No products yet; the Products page shows its empty state. */
export const PRODUCTS: readonly ApiProduct[] = [];

// TODO: invented reviews for layout only; replace with real ones before launch.
export const REVIEWS: readonly ApiReview[] = [
  {
    id: "review-maya",
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
    id: "review-tom",
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
    id: "review-priya",
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
    id: "review-leo",
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
    id: "review-ana",
    name: "Ana M.",
    position: "Marketing manager, Solar Casa",
    country: "Portugal",
    countryCode: "PT",
    rating: 5,
    reviewText:
      "Our new website looks beautiful and loads in a blink. Enquiries doubled in the first two months, and we can update pages ourselves.",
    createdAt: "2026-06-18T00:00:00Z",
  },
  {
    id: "review-james",
    name: "James O.",
    position: "Practice manager, Clearview Dental",
    country: "Australia",
    countryCode: "AU",
    rating: 5,
    reviewText:
      "FrostBook was set up in an afternoon. Patients love booking online and the reminders have made a real difference.",
    createdAt: "2026-05-27T00:00:00Z",
  },
  {
    id: "review-sofia",
    name: "Sofia L.",
    position: "Co-founder, Petal & Pine",
    country: "Sweden",
    countryCode: "SE",
    rating: 4,
    reviewText:
      "Great communication from start to finish. One feature took a week longer than planned, but they kept us updated the whole way.",
    createdAt: "2026-04-11T00:00:00Z",
  },
  {
    id: "review-kasun",
    name: "Kasun P.",
    position: "CEO, Lanka Fresh",
    country: "Sri Lanka",
    countryCode: "LK",
    rating: 5,
    reviewText:
      "Our online shop finally works on every phone, and orders have grown every month since launch.",
    createdAt: "2026-03-05T00:00:00Z",
  },
];

export const FAQS: readonly ApiFaq[] = [
  {
    id: "faq-cost",
    question: "How much does a project cost?",
    answer:
      "It depends on what you need, but you'll always get a fixed price in writing before we start. Websites start from $1,500 and most business systems land between $6,000 and $20,000.",
    sortOrder: 0,
  },
  {
    id: "faq-time",
    question: "How long will it take?",
    answer:
      "Most websites go live in four to six weeks, and a first version of an app or system in eight to twelve weeks.",
    sortOrder: 1,
  },
  {
    id: "faq-tech",
    question: "I'm not technical. Is that a problem?",
    answer:
      "Not at all. We explain everything in plain English and handle the technical side, so you can focus on your business.",
    sortOrder: 2,
  },
  {
    id: "faq-own",
    question: "Who owns what you build?",
    answer:
      "You do. The code, designs and accounts are yours, and you can take them with you at any time.",
    sortOrder: 3,
  },
  {
    id: "faq-after",
    question: "What happens after launch?",
    answer:
      "Every project includes a support window. After that, you can choose a monthly care plan or simply call us when you need something.",
    sortOrder: 4,
  },
];

export const ARTICLES: readonly ApiArticle[] = [
  {
    id: "article-website-cost",
    slug: "how-much-does-a-website-cost",
    title: "How much does a business website really cost?",
    excerpt:
      "A plain-English guide to website prices, what drives them up, and how to avoid paying for things you don't need.",
    publishedAt: "2026-09-18T00:00:00Z",
    updatedAt: "2026-09-18T00:00:00Z",
    featured: true,
    sortOrder: 0,
    tags: [TAGS.guides],
    contentMarkdown:
      "## The short answer\n\nA good small-business website usually costs between **$1,500 and $6,000**. Online shops and custom features cost more.\n\n## What changes the price\n\n- **Number of pages.** Five pages is very different from fifty.\n- **Online payments.** Selling online adds checkout, stock and delivery settings.\n- **Custom features.** Calculators, bookings and member areas take extra work.\n\n## How to keep costs down\n\nStart with the pages your customers actually visit, and launch. You can always add more once you see what works.\n\n> Ask for a fixed price in writing. If a studio can't give you one, ask why.",
  },
  {
    id: "article-spreadsheets",
    slug: "signs-you-have-outgrown-spreadsheets",
    title: "Five signs your business has outgrown spreadsheets",
    excerpt:
      "Spreadsheets are a great start. Here's how to tell when they've started costing you more time than they save.",
    publishedAt: "2026-08-02T00:00:00Z",
    updatedAt: "2026-08-02T00:00:00Z",
    featured: true,
    sortOrder: 1,
    tags: [TAGS.guides],
    contentMarkdown:
      "## 1. Nobody trusts the numbers\n\nWhen three people keep three copies, nobody knows which one is right.\n\n## 2. Copying and pasting is a job\n\nIf someone spends hours a week moving data between files, that's a cost.\n\n## 3. Mistakes reach customers\n\nWrong stock, double bookings, missed orders.\n\n## 4. You can't see the big picture\n\nAnswering \"how did we do this month?\" takes a day.\n\n## 5. Only one person understands it\n\nAnd when they're on holiday, things stop.\n\nIf two or more sound familiar, a simple custom system could save you hours every week.",
  },
  {
    id: "article-app-or-website",
    slug: "do-you-need-an-app-or-a-website",
    title: "Do you need an app, or just a better website?",
    excerpt:
      "Apps are exciting, but they're not always the right first step. A simple way to decide.",
    publishedAt: "2026-06-21T00:00:00Z",
    updatedAt: "2026-06-21T00:00:00Z",
    featured: false,
    sortOrder: 2,
    tags: [TAGS.guides],
    contentMarkdown:
      "## Start with how often customers come back\n\nIf customers use your service **every week**, an app can be worth it: notifications, saved details and one-tap ordering.\n\nIf they visit **a few times a year**, a fast mobile website is usually the better investment.\n\n## Our rule of thumb\n\nBuild a great website first. Add an app when customers start asking for one.",
  },
];

export const CURRENCIES: readonly ApiCurrency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rateFromUsd: 1 },
  { code: "EUR", name: "Euro", symbol: "€", rateFromUsd: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rateFromUsd: 0.79 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rateFromUsd: 1.52 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rateFromUsd: 83.2 },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", rateFromUsd: 300 },
];
