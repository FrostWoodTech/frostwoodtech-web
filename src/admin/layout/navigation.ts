import {
  Award,
  Coins,
  CreditCard,
  FolderKanban,
  HelpCircle,
  KeyRound,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Package,
  Tags,
  UserCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly end: boolean;
  readonly superAdminOnly?: boolean;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

/** Sidebar navigation; also used by `Topbar` for breadcrumbs. */
export const NAV_GROUPS: readonly NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "People",
    items: [
      {
        to: "/admin/users",
        label: "Users",
        icon: Users,
        end: false,
        superAdminOnly: true,
      },
      {
        to: "/admin/approvals",
        label: "Approvals",
        icon: UserCheck,
        end: false,
        superAdminOnly: true,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        to: "/admin/projects",
        label: "Projects",
        icon: FolderKanban,
        end: false,
      },
      { to: "/admin/articles", label: "Articles", icon: Newspaper, end: false },
      { to: "/admin/products", label: "Products", icon: Package, end: false },
      { to: "/admin/tags", label: "Tags", icon: Tags, end: false },
      { to: "/admin/services", label: "Services", icon: Wrench, end: false },
      { to: "/admin/pricing", label: "Pricing", icon: CreditCard, end: false },
      { to: "/admin/currencies", label: "Currencies", icon: Coins, end: false },
      { to: "/admin/faqs", label: "FAQs", icon: HelpCircle, end: false },
      {
        to: "/admin/certificates",
        label: "Certificates",
        icon: Award,
        end: false,
      },
      {
        to: "/admin/reviews",
        label: "Reviews",
        icon: MessageSquareQuote,
        end: false,
      },
      {
        to: "/admin/contact-submissions",
        label: "Contact",
        icon: Mail,
        end: false,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/admin/change-password",
        label: "Change password",
        icon: KeyRound,
        end: false,
      },
    ],
  },
];

/** Path segment → breadcrumb label. */
export const ROUTE_LABELS: Readonly<Record<string, string>> = {
  admin: "Dashboard",
  users: "Users",
  approvals: "Approvals",
  projects: "Projects",
  products: "Products",
  articles: "Articles",
  tags: "Tags",
  services: "Services",
  pricing: "Pricing",
  currencies: "Currencies",
  faqs: "FAQs",
  certificates: "Certificates",
  reviews: "Reviews",
  "contact-submissions": "Contact",
  "change-password": "Change password",
  new: "New",
};
