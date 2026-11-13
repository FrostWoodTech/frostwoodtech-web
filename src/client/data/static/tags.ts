import type { ApiTag, TechCategory } from "@/client/types";

const category = (name: string, slug: string): ApiTag => ({
  id: `tag-${slug}`,
  name,
  slug,
  isTechnology: false,
});

const tech = (
  name: string,
  slug: string,
  technologyCategory: TechCategory,
): ApiTag => ({
  id: `tag-${slug}`,
  name,
  slug,
  isTechnology: true,
  technologyCategory,
});

export const TAGS = {
  booking: category("Booking system", "booking-system"),
  system: category("Business system", "business-system"),
  ticketing: category("Ticket booking", "ticket-booking"),
  hr: category("Employee management", "employee-management"),
  transport: category("Chauffeur transport", "chauffeur-transport"),
  guides: category("Guides", "guides"),
  news: category("Studio news", "studio-news"),
  react: tech("React", "react", "frontend"),
  nextjs: tech("Next.js", "nextjs", "frontend"),
  tailwind: tech("Tailwind CSS", "tailwind-css", "frontend"),
  reactNative: tech("React Native", "react-native", "frontend"),
  dotnet: tech(".NET", "dotnet", "backend"),
  node: tech("Node.js", "nodejs", "backend"),
  typescript: tech("TypeScript", "typescript", "language"),
  csharp: tech("C#", "csharp", "language"),
  postgres: tech("PostgreSQL", "postgresql", "database"),
  redis: tech("Redis", "redis", "database"),
  azure: tech("Azure", "azure", "cloud_devops"),
  aws: tech("AWS", "aws", "cloud_devops"),
  docker: tech("Docker", "docker", "cloud_devops"),
  stripe: tech("Stripe", "stripe", "tool_or_platform"),
  figma: tech("Figma", "figma", "design"),
  openai: tech("OpenAI", "openai", "ai_ml_dl"),
} as const satisfies Record<string, ApiTag>;

export const ALL_TAGS: readonly ApiTag[] = Object.values(TAGS).sort((a, b) =>
  a.name.localeCompare(b.name),
);
