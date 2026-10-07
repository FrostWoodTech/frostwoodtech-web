import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface SocialLink {
  readonly platform: string;
  readonly href: string;
  readonly icon: LucideIcon | IconType;
  readonly ariaLabel: string;
}

export interface BrandInfo {
  readonly name: string;
  readonly tagline: string;
}

export interface HeroData {
  readonly kicker: string;
  /** Headline renders as two lines; `headlineEmphasis` is set in italic. */
  readonly headlineFirstLine: string;
  readonly headlineLead: string;
  readonly headlineEmphasis: string;
  readonly headlineTail: string;
  readonly description: string;
  readonly quote: string;
  readonly quoteNote: string;
}

export interface Metric {
  readonly id: string;
  readonly value: string;
  readonly suffix?: string;
  readonly suffixTone?: "ice" | "forest";
  readonly label: string;
}

export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
  readonly initials: string;
  readonly rating?: number;
}

export interface ProcessStep {
  readonly id: string;
  readonly step: string;
  readonly title: string;
  readonly description: string;
}

export interface Service {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly iconUrl?: string;
  readonly iconAltText?: string;
  readonly href: string;
}

export interface Project {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly year: number;
  readonly index: number;
  readonly tags: readonly string[];
  readonly categories: readonly string[];
  readonly technologies: readonly string[];
  readonly imagePlaceholder: string;
  readonly href: string;
  // Detail-page fields, only present for API projects.
  readonly websiteUrl?: string;
  readonly clientName?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly images?: readonly ProjectImage[];
}

export interface ProjectImage {
  readonly id: string;
  readonly url: string;
  readonly altText: string;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly priceDetails?: string;
  readonly productUrl?: string;
  readonly imagePlaceholder: string;
  readonly href: string;
  readonly images: readonly ProductImage[];
}

export interface ProductImage {
  readonly id: string;
  readonly url: string;
  readonly altText: string;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

export interface BlogPost {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: string;
  readonly date: string;
  readonly readTime: string;
  readonly imagePlaceholder: string;
  readonly href: string;
  readonly contentMarkdown?: string;
}

export type ReviewSort = "latest" | "rating" | "country";

export interface SubmitReviewPayload {
  readonly name: string;
  readonly country: string;
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
}

// Public API DTOs
export type Site = "agency" | "personal";

export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

/** `Enums/TechCategory.cs` */
export type TechCategory =
  | "frontend"
  | "backend"
  | "language"
  | "database"
  | "tool_or_platform"
  | "cloud_devops"
  | "ai_ml_dl"
  | "agentic_ai"
  | "design"
  | "other";

/** `DTOs/Public/TagResponse.cs` */
export interface ApiTag {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly isTechnology: boolean;
  readonly technologyCategory?: TechCategory;
}

export interface ApiProjectImage {
  readonly id: string;
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

export interface ApiProject {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly year: number;
  readonly shortDescription: string;
  readonly description: string;
  readonly websiteUrl?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly clientName?: string;
  readonly publishedAt?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly tags: readonly ApiTag[];
  readonly images: readonly ApiProjectImage[];
}

/** `DTOs/Public/ProductImageResponse.cs` — same shape as `ApiProjectImage`. */
export interface ApiProductImage {
  readonly id: string;
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Public/ProductResponse.cs` */
export interface ApiProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly priceDetails?: string;
  readonly productUrl?: string;
  readonly publishedAt?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly images: readonly ApiProductImage[];
}

export interface ApiArticle {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly slug?: string;
  readonly publishedAt?: string;
  readonly updatedAt: string;
  readonly coverImageKey?: string;
  readonly contentMarkdown?: string;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly tags: readonly ApiTag[];
}

/** `DTOs/Public/ServiceProjectResponse.cs` */
export interface ApiServiceProject {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly shortDescription: string;
  readonly year: number;
  readonly imageUrl?: string;
  readonly imageAltText?: string;
}

/** `DTOs/Public/FaqResponse.cs` */
export interface ApiFaq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly sortOrder: number;
}

/** `DTOs/Public/ServiceResponse.cs`. `projects`/`faqs` are only populated by the by-slug endpoint. */
export interface ApiService {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly deck?: string;
  readonly whoThisIsFor?: string;
  readonly outcomes?: string;
  readonly capabilities?: string;
  readonly inDepth?: string;
  readonly primaryCtaLabel?: string;
  readonly primaryCtaUrl?: string;
  readonly secondaryCtaLabel?: string;
  readonly secondaryCtaUrl?: string;
  readonly iconUrl?: string;
  readonly iconAltText?: string;
  readonly heroImageUrl?: string;
  readonly heroImageAltText?: string;
  readonly depthImageUrl?: string;
  readonly depthImageAltText?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly projects?: readonly ApiServiceProject[];
  readonly faqs?: readonly ApiFaq[];
  readonly featured: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Public/ReviewResponse.cs` */
export interface ApiReview {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
  readonly createdAt: string;
}

/** `Enums/PriceType.cs` */
export type PriceType =
  "fixed" | "starting_from" | "hourly" | "monthly" | "custom";

/** `DTOs/Public/PricingPlanFeatureResponse.cs` */
export interface ApiPricingPlanFeature {
  readonly id: string;
  readonly text: string;
  readonly isIncluded: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Public/PricingPlanResponse.cs`. No `serviceId` = combo pack; no `priceAmount` = "Contact us". */
export interface ApiPricingPlan {
  readonly id: string;
  readonly serviceId?: string;
  readonly name: string;
  readonly tagline?: string;
  readonly priceAmount?: number;
  readonly currency: string;
  readonly priceType: PriceType;
  readonly deliveryText?: string;
  readonly description: string;
  readonly isPopular: boolean;
  readonly ctaLabel?: string;
  readonly ctaUrl?: string;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly features: readonly ApiPricingPlanFeature[];
}

/** `DTOs/Public/HomeResponse.cs` — featured slices for one site. */
export interface ApiHome {
  readonly featuredProjects: readonly ApiProject[];
  readonly featuredArticles: readonly ApiArticle[];
  readonly featuredServices: readonly ApiService[];
  readonly featuredPricingPlans: readonly ApiPricingPlan[];
  readonly faqs: readonly ApiFaq[];
  readonly featuredReviews: readonly ApiReview[];
}

/** `Enums/ContactBudgetRange.cs` */
export type ContactBudgetRange =
  | "under_one_k"
  | "one_to_five_k"
  | "five_to_fifteen_k"
  | "over_fifteen_k"
  | "not_sure";

/** `DTOs/Public/CreateContactSubmissionRequest.cs`. `website` is a honeypot and must stay empty. */
export interface SubmitContactPayload {
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly company?: string;
  readonly subject?: string;
  readonly message: string;
  readonly serviceId?: string;
  readonly budgetRange?: ContactBudgetRange;
  readonly site: Site;
  readonly website?: string;
}

export type ApiErrorCode =
  "validation_failed" | "site_required" | "not_found" | "forbidden" | string;

export interface ApiProblem {
  readonly status?: number;
  readonly title?: string;
  readonly detail?: string;
  readonly code?: ApiErrorCode;
}

export interface FAQ {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

/** `DTOs/Public/CurrencyResponse.cs` */
export interface ApiCurrency {
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  /** Units of this currency per 1 USD. */
  readonly rateFromUsd: number;
}

export interface AboutHeroData {
  readonly badge: string;
  readonly title: string;
  readonly description: string;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly initials: string;
  /** Renders the dashed "we are hiring" tile instead of a person. */
  readonly isOpenRole?: boolean;
}

export interface Experience {
  readonly id: string;
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly description: string;
}

export interface StoryData {
  readonly badge: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface Highlight {
  readonly id: string;
  readonly metric: string;
  readonly label: string;
}

export interface CoreValue {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
}

export interface ContactData {
  readonly badge: string;
  readonly title: string;
  readonly description: string;
  readonly email: string;
  readonly phone: string;
  readonly location: string;
  readonly availability: string;
  readonly formFields: readonly FormFieldConfig[];
}

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface FormFieldConfig {
  /** Matches a `SubmitContactPayload` key. */
  readonly id:
    "name" | "email" | "phone" | "company" | "budgetRange" | "message";
  readonly label: string;
  readonly type: "text" | "email" | "tel" | "textarea" | "select";
  readonly placeholder: string;
  readonly required: boolean;
  readonly halfWidth?: boolean;
  /** Required when `type` is "select". */
  readonly options?: readonly SelectOption[];
}

export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly isAccent?: boolean;
}

export interface FooterLinkGroup {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

export interface FooterData {
  readonly blurb: string;
  readonly email: string;
  readonly linkGroups: readonly FooterLinkGroup[];
  readonly copyright: string;
  readonly legalLinks: readonly FooterLink[];
}

export interface SectionHeaderConfig {
  readonly badge?: string;
  readonly title: string;
  readonly subtitle?: string;
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant = "default" | "outline" | "subtle";
