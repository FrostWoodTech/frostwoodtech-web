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

// TODO: placeholder reviews for layout only — replace with real client reviews before launch.
// Reviews show anonymously (text and a generic avatar); `name` is kept for the admin only.
export const REVIEWS: readonly ApiReview[] = [
  {
    id: "review-nuwan",
    name: "Nuwan Perera",
    country: "Sri Lanka",
    countryCode: "LK",
    rating: 5,
    reviewText:
      "We used to take bookings over the phone and in a notebook. Now people pick their own seats and pay online, and on busy nights there are no more mix-ups at the door.",
    createdAt: "2026-09-18T00:00:00Z",
  },
  {
    id: "review-sarah",
    name: "Sarah Mitchell",
    country: "United Kingdom",
    countryCode: "GB",
    rating: 5,
    reviewText:
      "Leave requests and attendance were spread across emails and spreadsheets. Teamora put it all in one place, and the weekly demos meant there were no surprises at the end.",
    createdAt: "2026-08-27T00:00:00Z",
  },
  {
    id: "review-daniel",
    name: "Daniel Fernando",
    country: "Sri Lanka",
    countryCode: "LK",
    rating: 4,
    reviewText:
      "The transfer booking system works well and our drivers find it easy. One part took a little longer than planned, but they told us early and kept us updated throughout.",
    createdAt: "2026-07-22T00:00:00Z",
  },
  {
    id: "review-emma",
    name: "Emma Collins",
    country: "Australia",
    countryCode: "AU",
    rating: 5,
    reviewText:
      "Quick to reply and straightforward about cost. When we asked for a feature we didn't really need, they said so and suggested something simpler.",
    createdAt: "2026-06-30T00:00:00Z",
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
    question: "Do we need our own developers or servers?",
    answer:
      "No. We keep the software, host it and look after it — updates, security and fixes included — so you can simply use it and get on with running your business.",
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
