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
  secondaryCtaLabel: "See our projects",
  secondaryCtaUrl: "/projects",
} as const;

/** Seven development services (no design or SEO). The first four are featured. */
export const SERVICES: readonly ApiService[] = [
  {
    id: "service-full-stack-web",
    slug: "full-stack-web",
    name: "Full-stack web",
    shortDescription:
      "Web apps, SaaS platforms, portals and business systems built end to end — from the database to the screen.",
    eyebrow: "Web apps, SaaS & business systems",
    headline: "Web software that's fast, secure and built to last.",
    deck: "One team builds the whole thing: the database, the server logic and the interface people use. From a customer portal to a full SaaS product or the system that replaces your spreadsheets — typed, tested and easy to grow.",
    whoThisIsFor:
      "- Founders launching a SaaS product or first version\n- Teams that need a customer portal, booking flow or dashboard\n- Businesses replacing spreadsheets, paperwork or an old web app",
    outcomes:
      "- Pages that load in under two seconds\n- One system everyone works from, with the right access for each person\n- Clean, documented code that's easy to extend as you grow",
    capabilities:
      "- **Next.js, React and TypeScript** front ends\n- **SaaS platforms** with teams, roles and Stripe subscriptions\n- **Customer portals and admin dashboards**\n- **Business systems** for bookings, stock, orders and staff\n- **PostgreSQL databases** designed to keep data consistent\n- **Performance, security and accessibility** built in",
    inDepth:
      "## How a web project runs\n\nWe start with a free call about what the software needs to do, then send a fixed-price proposal within three working days.\n\nWe plan the data and architecture first, then build in short cycles with a working version you can click through every week. A focused first version usually takes **six to twelve weeks**.",
    ...CONTACT_CTA,
    projects: projectLinks("teamora", "theatre-booking", "aurora"),
    faqs: faqs("full-stack-web", [
      [
        "Which technologies do you use?",
        "Mostly Next.js, React and TypeScript for the interface, with .NET or Node.js and PostgreSQL behind it. We pick what fits your project, not what's fashionable.",
      ],
      [
        "Can you build a SaaS product from scratch?",
        "Yes — accounts and teams, subscriptions and billing, admin tools and the product itself. We run SaaS products of our own, so we know what a first version needs.",
      ],
    ]),
    featured: true,
    sortOrder: 0,
  },
  {
    id: "service-backend-apis",
    slug: "backend-apis",
    name: "Backend & APIs",
    shortDescription:
      "The engine behind your software: APIs, business rules and integrations that handle the complicated parts reliably.",
    eyebrow: "Server-side development",
    headline: "The reliable engine behind your product.",
    deck: "We build the APIs and business logic behind your apps — multi-step workflows, approvals, payments, background jobs and connections to other services — so every app and partner works from the same rules.",
    whoThisIsFor:
      "- Products with complex, multi-step processes\n- Businesses connecting several systems or partners\n- Teams whose current backend is slow, fragile or undocumented",
    outcomes:
      "- One source of truth for your data and rules\n- APIs your web, mobile and partner apps can all use\n- Fewer manual steps and fewer errors between systems",
    capabilities:
      "- **REST and GraphQL APIs** with clear documentation\n- **Business logic** for multi-step workflows and approvals\n- **Integrations** with payments, CRMs, email and SMS\n- **Webhooks, queues and background jobs**\n- **Secure sign-in** with SSO, roles and audit logs\n- **Web3 and smart contract** integrations",
    inDepth:
      "## Built to be depended on\n\nWe map the process step by step, design the data and rules around it, and cover the tricky cases with automated tests — so the backend keeps behaving correctly as you add features.",
    ...CONTACT_CTA,
    projects: projectLinks("teamora", "theatre-booking"),
    faqs: faqs("backend-apis", [
      [
        "Can you build an API for our existing app?",
        "Yes. We can add an API alongside your current system, or gradually replace an old backend without stopping the business.",
      ],
      [
        "Will other developers be able to use it?",
        "Yes. Every API comes with documentation and examples, so your team or partners can integrate with it quickly.",
      ],
    ]),
    featured: true,
    sortOrder: 1,
  },
  {
    id: "service-mobile-apps",
    slug: "mobile-apps",
    name: "Mobile applications",
    shortDescription:
      "iPhone and Android apps, or installable web apps, connected securely to your backend.",
    eyebrow: "iPhone, Android & web apps",
    headline: "An app your customers keep coming back to.",
    deck: "We build cross-platform apps with React Native — or installable progressive web apps when an app store isn't needed — connect them securely to your systems, and keep them working as phones change.",
    whoThisIsFor:
      "- Businesses whose customers book, order or check in often\n- Startups turning an idea into a first version\n- Teams replacing paper forms in the field",
    outcomes:
      "- One app for both iPhone and Android\n- Published on the App Store and Google Play\n- Notifications that bring customers back",
    capabilities:
      "- **iPhone and Android** from one React Native codebase\n- **Progressive web apps** that install from the browser\n- **Logins, payments and push notifications**\n- **Offline mode** for work in the field\n- **Secure connection** to your backend APIs\n- **App store publishing** and ongoing updates",
    inDepth:
      "## From idea to app store\n\nWe help you decide what the first version needs, build it in weekly steps you can test on your own phone, and handle the app store paperwork.",
    ...CONTACT_CTA,
    projects: [],
    faqs: faqs("mobile-apps", [
      [
        "Do I need separate apps for iPhone and Android?",
        "No. We build one app that runs on both, which keeps the cost and the upkeep down.",
      ],
      [
        "Who looks after the app after launch?",
        "We do. We publish it, keep it working as new phones and system updates arrive, and fix issues — so you never need an app developer of your own.",
      ],
    ]),
    featured: true,
    sortOrder: 2,
  },
  {
    id: "service-ai-automation",
    slug: "ai-automation",
    name: "AI & automation",
    shortDescription:
      "Chatbots, recommendation and personalisation systems, and RAG assistants that answer from your own data.",
    eyebrow: "Applied AI",
    headline: "AI that does real work in your business.",
    deck: "We build AI where it pays off: chatbots that answer customers, assistants that search your own documents with RAG, recommendations and personalisation that lift sales, and automations that take repetitive work off your team.",
    whoThisIsFor:
      "- Businesses answering the same customer questions every day\n- Online stores and platforms that want smarter recommendations\n- Teams buried in documents, tickets or manual admin",
    outcomes:
      "- Instant, accurate answers for customers and staff\n- More sales from relevant, personal suggestions\n- Hours of manual work saved every week",
    capabilities:
      "- **AI chatbots** for your website, WhatsApp or support desk\n- **RAG assistants** that answer from your documents, with sources\n- **Recommendation systems** for products and content\n- **Personalisation** of content, offers and search\n- **Document processing** and workflow automation\n- **Guardrails** for privacy, cost and accuracy",
    inDepth:
      "## Start small, prove it, then scale\n\nWe pick one use case where AI clearly helps, build a working pilot in a few weeks with OpenAI, Claude or open-source models, measure the results against real questions, and only then roll it out further.",
    ...CONTACT_CTA,
    projects: [],
    faqs: faqs("ai-automation", [
      [
        "What is RAG?",
        "Retrieval-augmented generation: the AI looks up the relevant parts of your own documents before answering, so its answers are based on your information — and can show where they came from.",
      ],
      [
        "Is our data safe?",
        "Yes. We use business-grade AI services that don't train on your data, and keep sensitive information inside your own systems.",
      ],
    ]),
    featured: true,
    sortOrder: 3,
  },
  {
    id: "service-data-analytics",
    slug: "data-analytics",
    name: "Data & analytics",
    shortDescription:
      "Python scrapers, data pipelines and dashboards that turn scattered data into clear trends.",
    eyebrow: "Python, pipelines & dashboards",
    headline: "Turn scattered data into clear answers.",
    deck: "We collect data from your systems, spreadsheets and the web with Python, clean it in layered pipelines, model it with SQL in BigQuery or PostgreSQL, and turn it into dashboards that show what's changing.",
    whoThisIsFor:
      "- Owners who want clear numbers without chasing spreadsheets\n- Teams tracking prices, competitors or market trends\n- Businesses with data spread across many tools",
    outcomes:
      "- One trusted place for your business data\n- Dashboards and reports that update on their own\n- Decisions based on trends, not guesses",
    capabilities:
      "- **Web scraping** with Python, Scrapy and Playwright\n- **Data pipelines** that clean data step by step on a schedule\n- **Data warehouses** on Google BigQuery or PostgreSQL\n- **SQL data models** your reports can rely on\n- **Dashboards** in Looker Studio, Power BI or your own app\n- **Automated reports and alerts** when numbers change",
    inDepth:
      "## From raw data to decisions\n\nWe start with the questions you want answered, find where the data lives, and build pipelines that keep raw, cleaned and reporting-ready data in separate layers — so every number on a dashboard can be traced back to its source.",
    ...CONTACT_CTA,
    projects: [],
    faqs: faqs("data-analytics", [
      [
        "Can you collect data from websites?",
        "Yes, where it's allowed. We build Python scrapers that respect each site's terms and gather the data on a schedule.",
      ],
      [
        "Do we need a lot of data to start?",
        "No. Most businesses already have enough in their sales, booking or accounting tools to see useful trends.",
      ],
    ]),
    featured: false,
    sortOrder: 4,
  },
  {
    id: "service-wordpress-shopify",
    slug: "wordpress-shopify",
    name: "WordPress & Shopify",
    shortDescription:
      "WordPress sites and Shopify or WooCommerce stores that are fast, secure and easy for your team to run.",
    eyebrow: "WordPress, Shopify & WooCommerce",
    headline: "Websites and online stores, built properly.",
    deck: "Custom WordPress sites, Shopify stores and WooCommerce shops set up by developers — clean themes, the right apps and plugins, and connections to your other tools — so you can sell and update content without calling us.",
    whoThisIsFor:
      "- Businesses that want to edit their own pages and products\n- Shops starting or growing an online store\n- Owners of a slow, broken or hard-to-update site or store",
    outcomes:
      "- A site or store your team can run day to day\n- Fast pages that work on every screen size\n- Payments, shipping and stock that just work",
    capabilities:
      "- **Custom WordPress** themes and plugins\n- **Shopify stores** with themes, apps and custom features\n- **WooCommerce shops** with payments and shipping\n- **Integrations** with CRMs, email, booking and inventory tools\n- **Migrations** between platforms without losing data\n- **Speed and security** fixes for existing sites",
    inDepth:
      "## Pick the right platform, then build it well\n\nWe help you choose between WordPress, WooCommerce and Shopify based on how you sell and who updates the site, then set it up with as few plugins and apps as possible so it stays fast and safe.",
    ...CONTACT_CTA,
    projects: [],
    faqs: faqs("wordpress-shopify", [
      [
        "Shopify or WooCommerce — which should we use?",
        "Shopify is simplest to run and great for most stores; WooCommerce gives more control if you already use WordPress. We'll recommend one after a short call.",
      ],
      [
        "Can you fix our existing site or store?",
        "Yes. We start with a health check covering speed, security and plugins or apps, then fix the most important issues first.",
      ],
    ]),
    featured: false,
    sortOrder: 5,
  },
  {
    id: "service-cloud-devops",
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    shortDescription:
      "Hosting, automated deployments, monitoring and maintenance that keep your software fast, safe and online.",
    eyebrow: "Cloud, hosting & care",
    headline: "Software that stays fast, safe and online.",
    deck: "We set up and run your infrastructure on AWS, Azure or Google Cloud: containers, automated deployments, monitoring, daily backups and security updates — so releases are boring and outages are rare.",
    whoThisIsFor:
      "- Businesses that can't afford to go offline\n- Teams without their own DevOps engineer\n- Anyone whose old server keeps breaking or costs too much",
    outcomes:
      "- 99.98% uptime on the software we look after\n- Releases in minutes, with one-click rollback\n- Daily backups you can restore at any time",
    capabilities:
      "- **Cloud hosting** on AWS, Azure or Google Cloud\n- **Docker containers** and managed databases\n- **CI/CD pipelines** for safe, automatic releases\n- **Infrastructure as code** with Terraform\n- **24/7 monitoring**, logs and alerts\n- **Cloud cost** reviews and savings",
    inDepth:
      "## Peace of mind, every month\n\nCare plans are a simple monthly price. We move your software onto reliable hosting, automate deployments, and send a short monthly report on how everything is running.",
    ...CONTACT_CTA,
    projects: [],
    faqs: faqs("cloud-devops", [
      [
        "Can you look after software you didn't build?",
        "Yes. We start with a health check, then move it onto reliable hosting and fix the most urgent issues.",
      ],
      [
        "Can you lower our cloud bill?",
        "Often, yes. We review what you're running, remove waste and right-size servers, which often cuts the monthly bill noticeably.",
      ],
    ]),
    featured: false,
    sortOrder: 6,
  },
];
