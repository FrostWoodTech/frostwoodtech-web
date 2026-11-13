/**
 * Marketing copy for the four-page site (Home, Services, About, Contact). Services, reviews and
 * FAQs come from the API; everything here is copy the API doesn't model.
 */

export interface NumberedItem {
  readonly title: string;
  readonly description: string;
}

export interface ContrastItem {
  readonly usual: string;
  readonly title: string;
  readonly description: string;
}

export interface Stat {
  readonly value: string;
  readonly label: string;
}

export const SITE = {
  name: "FrostWoodTech",
  descriptor: "Software studio · Working worldwide",
  email: "frostwoodtech@gmail.com",
  /** Both numbers take calls and WhatsApp; links open a WhatsApp chat. */
  phones: [
    { display: "+94 76 936 8102", whatsapp: "https://wa.me/94769368102" },
    { display: "+94 71 380 5613", whatsapp: "https://wa.me/94713805613" },
  ],
  responseTime: "Within one working day",
  /** Prefilled into the WhatsApp chat so the first message is never blank. */
  whatsappGreeting: "Hi FrostWoodTech, I'd like to talk about a project.",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const PRIMARY_CTA = {
  label: "Start a project",
  href: "/contact",
} as const;

export const HOME_HERO = {
  eyebrow: "Web · APIs · Mobile · AI · Data · E-commerce · Cloud",
  lineOne: "We build software.",
  lineTwo: "Your business runs on it.",
  description:
    "FrostWoodTech is a software development studio. We build web apps, APIs, mobile apps, AI and data solutions for growing companies — one senior engineering team from the first call to launch and beyond.",
  secondary: { label: "Our services", href: "/services" },
} as const;

/** The scrolling strip under the hero. */
export const MARQUEE_WORDS = [
  "Full-stack web",
  "Backend & APIs",
  "Mobile apps",
  "AI chatbots",
  "RAG assistants",
  "Data & analytics",
  "WordPress & Shopify",
  "Cloud & DevOps",
] as const;

export const HOME_SERVICES_INTRO = {
  label: "What we do",
  lineOne: "Everything you need to launch.",
  lineTwo: "One team that owns it.",
  hint: "Open a service to see what's inside it.",
} as const;

export const PROCESS = {
  label: "How we work",
  lineOne: "Four steps.",
  lineTwo: "No surprises.",
  steps: [
    {
      title: "Talk",
      description:
        "A free 30-minute call about your business, your customers and what success looks like.",
    },
    {
      title: "Plan",
      description:
        "A written proposal with scope, timeline and a fixed price — within three working days.",
    },
    {
      title: "Build",
      description:
        "We plan the architecture, then ship working software you can click through every week. No black box.",
    },
    {
      title: "Launch & grow",
      description:
        "We launch, watch it closely and stay on hand for improvements, updates and support.",
    },
  ] satisfies readonly NumberedItem[],
} as const;

export const WHY_US = {
  label: "Why FrostWoodTech",
  lineOne: "Built for businesses",
  lineTwo: "that can't afford to guess.",
  items: [
    {
      usual: "The usual — an account manager relays your message.",
      title: "You talk to the people who build it.",
      description:
        "No layers. The person on the call is the person writing the code.",
    },
    {
      usual: "The usual — hourly billing that keeps growing.",
      title: "A fixed price, agreed up front.",
      description:
        "You know the cost before we start. Changes are priced before they're made.",
    },
    {
      usual: "The usual — you only see it at the end.",
      title: "Working software every week.",
      description:
        "Short weekly demos, so you can steer early instead of fixing late.",
    },
    {
      usual: "The usual — handed the code and left to run it yourself.",
      title: "Fully managed, for as long as you use it.",
      description:
        "Hosting, updates, security and fixes are handled by the team that built it. No servers or developers needed on your side.",
    },
    {
      usual: "The usual — gone the day after launch.",
      title: "We stay for what comes next.",
      description:
        "Support, updates and new features when your business needs them.",
    },
  ] satisfies readonly ContrastItem[],
} as const;

export const RESULTS = {
  label: "Results",
  lineOne: "Good software,",
  lineTwo: "measured.",
  stats: [
    { value: "5+", label: "Products & platforms shipped" },
    { value: "98%", label: "Clients who come back" },
    { value: "6 wk", label: "Median time to first release" },
  ] satisfies readonly Stat[],
} as const;

export const TESTIMONIALS_INTRO = {
  label: "Client stories",
  lineOne: "What clients say",
  lineTwo: "when we're not in the room.",
} as const;

export const CLOSING_CTA = {
  label: "Let's talk",
  lineOne: "Got something",
  lineTwo: "worth building?",
  description:
    "Tell us about it. A free 30-minute call, then a fixed-price proposal within three working days — or an honest “we're not the right fit”.",
  secondary: { label: "See our projects", href: "/projects" },
} as const;

export const SERVICES_HERO = {
  label: "Services",
  lineOne: "What we build.",
  lineTwo: "How it helps you grow.",
  description:
    "From a fast new website to the system your whole team works in, every project gets the same senior team, a fixed price and weekly demos.",
} as const;

export const ABOUT_HERO = {
  label: "About",
  lineOne: "A small studio",
  lineTwo: "for software that lasts.",
  description:
    "We're a senior engineering team that builds and looks after software for growing businesses — and runs products of our own.",
} as const;

export const ABOUT_STORY = {
  label: "Our story",
  title: "Named for the two things good software needs.",
  paragraphs: [
    "Frost, for clarity — a system you can see through, where nothing is hidden. Wood, for growth — something that keeps standing and keeps adding rings, instead of being replaced every few years.",
    "We started with client work, got tired of watching good ideas fail on weak foundations, and began building our own products too. Today we take on a deliberately small number of client projects — enough to stay sharp, few enough to give each one our full attention.",
  ],
} as const;

export const MISSION_VISION = [
  {
    label: "Mission",
    title: "Make software a business can rely on.",
    description:
      "Clear scope, honest timelines and code that keeps working long after launch.",
  },
  {
    label: "Vision",
    title: "The studio businesses grow up with.",
    description:
      "A long-term technology partner, from the first website to the systems that run the company.",
  },
] as const;

export const TEAM = {
  label: "The team",
  lineOne: "Senior people.",
  lineTwo: "Direct lines.",
  members: [
    {
      initials: "OC",
      name: "Oshitha Costa",
      role: "Co-founder · Lead engineer",
      bio: "Builds products and platforms end to end, and works directly with every client.",
    },
    {
      initials: "CN",
      name: "Chamod Neluhena",
      role: "Co-founder · Lead engineer",
      bio: "Builds and ships client systems end to end, from the first call to launch.",
    },
  ],
} as const;

export const CONTACT_HERO = {
  label: "Contact",
  lineOne: "Let's build",
  lineTwo: "something good.",
  description:
    "Three quick steps. A real person reads every message and replies within one working day.",
} as const;

export const NEXT_STEPS = {
  label: "What happens next",
  steps: [
    {
      title: "You tell us about the project",
      description: "The form takes about two minutes. Rough ideas are fine.",
    },
    {
      title: "We reply within one working day",
      description: "With a few questions, or a time for a free 30-minute call.",
    },
    {
      title: "You get a clear plan and price",
      description:
        "Scope, timeline and a fixed price within three working days of the call.",
    },
  ] satisfies readonly NumberedItem[],
} as const;

export const PROJECTS_HERO = {
  label: "Projects",
  lineOne: "Work that runs",
  lineTwo: "real businesses.",
  description:
    "A selection of the systems we've built — what the problem was, what we made, and what it does for the people who use it every day.",
} as const;

export const HOME_PROJECTS_INTRO = {
  label: "Selected projects",
  lineOne: "Built by us.",
  lineTwo: "Used every day.",
} as const;

/**
 * The seasonal offer. It shows only between `startsAt` and `endsAt` (local time), so it switches
 * itself off after the season; move the dates to run it again.
 */
export const PROMO = {
  startsAt: "2026-11-01T00:00:00",
  endsAt: "2027-01-01T00:00:00",
  season: "Seasonal offer",
  occasion: "Christmas 2026",
  discount: "15% off",
  endsLabel: "Ends 31 December",
  short: "15% off new projects booked before 31 December.",
  headline: "Start the new year with software that works for you.",
  description:
    "Book any project before 31 December — a web app, mobile app, AI assistant, online store or cloud set-up — and we'll take 15% off the agreed fixed price. Work can start in the new year.",
  perks: [
    "15% off the fixed price",
    "Any of our seven services",
    "Start now or in January",
  ],
  terms:
    "For new projects confirmed by 31 December 2026. One offer per project.",
  cta: "Claim 15% off",
  /** Sent as the enquiry's `subject` so the team can see the offer was claimed. */
  enquirySubject: "Seasonal offer (Christmas 2026) — 15% off",
} as const;
