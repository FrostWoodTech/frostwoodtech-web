import type { IconType } from "react-icons";
import {
  SiApacheairflow,
  SiClaude,
  SiCloudflare,
  SiDocker,
  SiDotnet,
  SiExpo,
  SiFastapi,
  SiFirebase,
  SiGooglebigquery,
  SiGooglecloud,
  SiGrafana,
  SiGraphql,
  SiHuggingface,
  SiJupyter,
  SiKubernetes,
  SiLangchain,
  SiLinux,
  SiLooker,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPandas,
  SiPhp,
  SiPostgresql,
  SiPrisma,
  SiPwa,
  SiPython,
  SiPytorch,
  SiReact,
  SiReactquery,
  SiRedis,
  SiScrapy,
  SiShopify,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTerraform,
  SiTypescript,
  SiWoocommerce,
  SiWordpress,
} from "react-icons/si";
import {
  TbBrandAws,
  TbBrandAzure,
  TbBrandCSharp,
  TbBrandOpenai,
} from "react-icons/tb";

export interface StackItem {
  readonly name: string;
  readonly icon: IconType;
}

export interface StackGroup {
  readonly title: string;
  readonly items: readonly StackItem[];
}

export const STACK_INTRO = {
  label: "Our stack",
  lineOne: "The tools we build with.",
  lineTwo: "Proven, not trendy.",
  description:
    "Mature, well-supported technologies, so the software we build stays fast, secure and easy for us to maintain for years.",
} as const;

/** Grouped to match the services. Brand icons come from Simple Icons, with Tabler for the gaps. */
export const STACK: readonly StackGroup[] = [
  {
    title: "Frontend",
    items: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "TanStack Query", icon: SiReactquery },
    ],
  },
  {
    title: "Backend & APIs",
    items: [
      { name: ".NET", icon: SiDotnet },
      { name: "C#", icon: TbBrandCSharp },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "NestJS", icon: SiNestjs },
      { name: "FastAPI", icon: SiFastapi },
      { name: "GraphQL", icon: SiGraphql },
      { name: "Stripe", icon: SiStripe },
    ],
  },
  {
    title: "Databases",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Redis", icon: SiRedis },
      { name: "Supabase", icon: SiSupabase },
      { name: "Prisma", icon: SiPrisma },
    ],
  },
  {
    title: "Mobile",
    items: [
      { name: "React Native", icon: SiReact },
      { name: "Expo", icon: SiExpo },
      { name: "Progressive web apps", icon: SiPwa },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    title: "AI & automation",
    items: [
      { name: "OpenAI", icon: TbBrandOpenai },
      { name: "Claude", icon: SiClaude },
      { name: "LangChain", icon: SiLangchain },
      { name: "Hugging Face", icon: SiHuggingface },
      { name: "PyTorch", icon: SiPytorch },
    ],
  },
  {
    title: "Data & analytics",
    items: [
      { name: "Python", icon: SiPython },
      { name: "pandas", icon: SiPandas },
      { name: "Scrapy", icon: SiScrapy },
      { name: "Jupyter", icon: SiJupyter },
      { name: "BigQuery", icon: SiGooglebigquery },
      { name: "Airflow", icon: SiApacheairflow },
      { name: "Looker Studio", icon: SiLooker },
    ],
  },
  {
    title: "WordPress & e-commerce",
    items: [
      { name: "WordPress", icon: SiWordpress },
      { name: "WooCommerce", icon: SiWoocommerce },
      { name: "Shopify", icon: SiShopify },
      { name: "PHP", icon: SiPhp },
    ],
  },
  {
    title: "Cloud & DevOps",
    items: [
      { name: "AWS", icon: TbBrandAws },
      { name: "Azure", icon: TbBrandAzure },
      { name: "Google Cloud", icon: SiGooglecloud },
      { name: "Docker", icon: SiDocker },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "Terraform", icon: SiTerraform },
      { name: "Nginx", icon: SiNginx },
      { name: "Linux", icon: SiLinux },
      { name: "Cloudflare", icon: SiCloudflare },
      { name: "Grafana", icon: SiGrafana },
    ],
  },
];
