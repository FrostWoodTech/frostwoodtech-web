import type { ApiFaq, ApiService, ApiServiceProject } from "@/client/types";
import { PROJECTS } from "./projects";

const projectLinks = (...slugs: string[]): ApiServiceProject[] =>
  slugs.flatMap((slug) => {
    const project = PROJECTS.find((p) => p.slug === slug);
    return project
      ? [
          {
            id: project.id,
            slug: project.slug,
            title: project.title,
            shortDescription: project.shortDescription,
            year: project.year,
          },
        ]
      : [];
  });

const faqs = (
  prefix: string,
  items: readonly (readonly [string, string])[],
): ApiFaq[] =>
  items.map(([question, answer], index) => ({
    id: `${prefix}-faq-${index + 1}`,
    question,
    answer,
    sortOrder: index,
  }));

const CONTACT_CTA = {
  primaryCtaLabel: "Get a free quote",
  primaryCtaUrl: "/contact",
  secondaryCtaLabel: "See our work",
  secondaryCtaUrl: "/work",
} as const;

/** The first four are featured; their slugs match the Home service drawings in `data/services.ts`. */
export const SERVICES: readonly ApiService[] = [
  {
    id: "service-websites",
    slug: "websites",
    name: "Websites",
    shortDescription:
      "Fast, good-looking websites that tell people what you do and turn visitors into customers.",
    eyebrow: "Websites & online shops",
    headline: "A website that works as hard as you do.",
    deck: "We design and build fast, clear websites and online shops that are easy to find on Google and easy for you to update.",
    whoThisIsFor:
      "- Small and growing businesses whose website is out of date\n- Shops that want to sell online\n- Teams launching a new brand or product",
    outcomes:
      "- More enquiries and sales from the same visitors\n- Pages that load in under two seconds\n- A site you can update yourself, without calling us",
    capabilities:
      "- **Design** that fits your brand\n- **Online shops** with secure card payments\n- **Search engine basics** so people can find you\n- **Simple editing** of pages, posts and products\n- **Analytics** so you can see what's working",
    inDepth:
      "## How a website project runs\n\nWe start with a free chat about your business and what the website needs to do. You get a fixed-price proposal within three working days.\n\nThen we design the key pages and share them with you before writing any code. Once you're happy, we build, test on phones and computers, and launch. Most websites go live in **four to six weeks**.\n\nAfter launch we keep an eye on speed and security, and we're one message away if you need a hand.",
    ...CONTACT_CTA,
    projects: projectLinks("theatre-booking", "aurora"),
    faqs: faqs("websites", [
      [
        "Can I update the website myself?",
        "Yes. Every site comes with a simple editor for pages, posts and products, and we show you how to use it.",
      ],
      [
        "Do you write the text and find the photos?",
        "We can. Copywriting and stock photography can be added to any website package.",
      ],
      [
        "Will my website show up on Google?",
        "We set up the technical basics for search engines on every site, and offer ongoing SEO if you want to grow further.",
      ],
    ]),
    featured: true,
    sortOrder: 0,
  },
  {
    id: "service-mobile-apps",
    slug: "mobile-apps",
    name: "Mobile apps",
    shortDescription:
      "Apps for iPhone and Android that your customers enjoy using, from first idea to the app store.",
    eyebrow: "iPhone & Android",
    headline: "An app your customers keep coming back to.",
    deck: "One team designs, builds and publishes your app on both the App Store and Google Play, and keeps it running smoothly after launch.",
    whoThisIsFor:
      "- Businesses whose customers book, order or check in often\n- Startups turning an idea into a first version\n- Teams replacing paper forms in the field",
    outcomes:
      "- One app for both iPhone and Android\n- Published in the app stores under your name\n- Notifications that bring customers back",
    capabilities:
      "- **App design** tested with real users\n- **iPhone and Android** from one codebase\n- **Logins, payments and notifications**\n- **App store publishing** handled for you\n- **Updates** when new phones and systems arrive",
    inDepth:
      "## From idea to app store\n\nWe help you decide what the first version really needs, so you launch sooner and spend less. You'll try a clickable design before we build anything.\n\nA typical first version takes **eight to twelve weeks**. We handle the app store paperwork, and you own the app, the code and the accounts.",
    ...CONTACT_CTA,
    projects: [],
    faqs: faqs("mobile-apps", [
      [
        "Do I need separate apps for iPhone and Android?",
        "No. We build one app that runs on both, which keeps the cost and the upkeep down.",
      ],
      [
        "Who owns the app?",
        "You do. The app is published under your developer accounts, and the code is yours.",
      ],
    ]),
    featured: true,
    sortOrder: 1,
  },
  {
    id: "service-business-systems",
    slug: "business-systems",
    name: "Business systems",
    shortDescription:
      "Custom tools that replace spreadsheets and paperwork, so your team spends less time on admin.",
    eyebrow: "Custom software",
    headline: "Less admin. More of the work that matters.",
    deck: "Bookings, stock, orders, staff rotas, reports: we turn the spreadsheets and paperwork that slow you down into one simple system.",
    whoThisIsFor:
      "- Teams juggling spreadsheets, emails and paper forms\n- Businesses that outgrew off-the-shelf software\n- Owners who want clear numbers at a glance",
    outcomes:
      "- Hours saved every week on repetitive admin\n- Everyone working from the same, up-to-date information\n- Dashboards that show how the business is doing",
    capabilities:
      "- **Booking and scheduling** systems\n- **Stock and order** tracking\n- **Dashboards and reports**\n- **Connections** to the tools you already use\n- **Secure logins** with the right access for each person",
    inDepth:
      "## Built around how you work\n\nWe spend time with the people who'll use the system, so it fits the way your team really works. We release it in small stages, so you see value within weeks instead of waiting months for everything at once.",
    ...CONTACT_CTA,
    projects: projectLinks("teamora", "theatre-booking"),
    faqs: faqs("business-systems", [
      [
        "Can it work with the software we already use?",
        "Usually, yes. We connect to accounting, payment and email tools so information only has to be entered once.",
      ],
      [
        "What happens to our existing data?",
        "We move it across for you and check it with your team before the old system is switched off.",
      ],
    ]),
    featured: true,
    sortOrder: 2,
  },
  {
    id: "service-cloud-support",
    slug: "cloud-support",
    name: "Cloud & support",
    shortDescription:
      "We host, watch over and update your software, so it stays fast, safe and online day and night.",
    eyebrow: "Hosting & care",
    headline: "Software that stays fast, safe and online.",
    deck: "We host your website, app or system, back it up every day, watch it around the clock and fix problems before your customers notice.",
    whoThisIsFor:
      "- Businesses that can't afford to go offline\n- Teams without their own IT department\n- Anyone whose old system keeps breaking",
    outcomes:
      "- 99.98% uptime on the software we look after\n- Daily backups you can restore at any time\n- A real person answering within one working hour",
    capabilities:
      "- **Secure hosting** on trusted cloud providers\n- **24/7 monitoring** and alerts\n- **Daily backups**\n- **Security updates** applied for you\n- **Monthly report** in plain English",
    inDepth:
      "## Peace of mind, every month\n\nSupport plans are a simple monthly price. We move your software onto reliable hosting, set up monitoring and backups, and send you a short monthly report on how everything is running.",
    ...CONTACT_CTA,
    projects: [],
    faqs: faqs("cloud-support", [
      [
        "Can you look after software you didn't build?",
        "Yes. We start with a health check, then move it onto reliable hosting and fix the most urgent issues.",
      ],
    ]),
    featured: true,
    sortOrder: 3,
  },
  {
    id: "service-design",
    slug: "design",
    name: "Design & branding",
    shortDescription:
      "Logos, colours and screens that make your business look as good as it is.",
    eyebrow: "Design",
    headline: "Look as good as you are.",
    deck: "Brand identities and screen designs that are clear, consistent and easy to use.",
    whoThisIsFor:
      "- New businesses that need a brand\n- Teams whose website and app look different everywhere",
    outcomes:
      "- A consistent look across everything you make\n- Designs tested with real customers",
    capabilities:
      "- **Logo and brand** identity\n- **Website and app** screen design\n- **Design systems** your team can reuse",
    ...CONTACT_CTA,
    projects: [],
    faqs: [],
    featured: false,
    sortOrder: 4,
  },
  {
    id: "service-seo-growth",
    slug: "seo-growth",
    name: "SEO & growth",
    shortDescription:
      "Get found on Google and turn more visitors into customers, month after month.",
    eyebrow: "Search & growth",
    headline: "Be the business people find first.",
    deck: "We improve how your website ranks on Google and how many visitors become customers, and we report the results in plain English.",
    whoThisIsFor:
      "- Businesses with a good website but few visitors\n- Local businesses competing in their area",
    outcomes:
      "- More visitors from Google every month\n- More of those visitors getting in touch",
    capabilities:
      "- **Search engine optimisation**\n- **Google Business profile** set-up\n- **Monthly results report**",
    ...CONTACT_CTA,
    projects: projectLinks("theatre-booking", "aurora"),
    faqs: [],
    featured: false,
    sortOrder: 5,
  },
];
