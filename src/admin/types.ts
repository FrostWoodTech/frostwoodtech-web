/** Mirrors the Web.API DTOs. JSON is camelCase; enums are snake_case strings; null members are omitted. */

export type UserRole = "super_admin" | "admin";

export type UserStatus =
  | "email_verification_required"
  | "pending"
  | "approved"
  | "rejected"
  | "disabled";

/** `DTOs/Admin/AdminUserResponse.cs` */
export interface AdminUser {
  readonly id: string;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly lastLoginAt?: string;
  readonly approvedAt?: string;
  readonly rejectionReason?: string;
  readonly createdAt: string;
}

/** `DTOs/Admin/RejectUserRequest.cs` */
export interface RejectUserRequest {
  readonly reason: string;
}

/** `DTOs/Admin/AuthResponse.cs`. The refresh token is never here — it's an httpOnly cookie. */
export interface AuthResponse {
  readonly accessToken: string;
  readonly expiresAt: string;
  readonly user: AdminUser;
}

/** `DTOs/Admin/GoogleSignInRequest.cs` */
export interface GoogleSignInRequest {
  readonly idToken: string;
}

export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

/** `DTOs/Admin/VerifyEmailRequest.cs` */
export interface VerifyEmailRequest {
  readonly token: string;
}

/** `DTOs/Admin/ResendVerificationRequest.cs` */
export interface ResendVerificationRequest {
  readonly email: string;
}

/** `DTOs/Admin/ResendVerificationResponse.cs` — always a generic message (no account enumeration). */
export interface ResendVerificationResponse {
  readonly message: string;
}

export interface ChangePasswordRequest {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmNewPassword: string;
}

/** `DTOs/Admin/ForgotPasswordRequest.cs` */
export interface ForgotPasswordRequest {
  readonly email: string;
}

/** `DTOs/Admin/ForgotPasswordResponse.cs` — always a generic message (no account enumeration). */
export interface ForgotPasswordResponse {
  readonly message: string;
}

/** `DTOs/Admin/SetPasswordRequest.cs` — used by both password-reset and account-setup links. */
export interface SetPasswordRequest {
  readonly token: string;
  readonly password: string;
  readonly confirmPassword: string;
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

/** `DTOs/Admin/TechCategoryOption.cs` */
export interface TechCategoryOption {
  readonly value: TechCategory;
  readonly label: string;
}

/** `DTOs/Admin/AdminTagResponse.cs` — categories and technologies share one table, split by `isTechnology`. */
export interface AdminTag {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly isTechnology: boolean;
  /** Required by the API when `isTechnology`, absent otherwise. */
  readonly technologyCategory?: TechCategory;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** `DTOs/Admin/CreateTagRequest.cs` / `UpdateTagRequest.cs`. PUT is a full replacement. */
export interface TagWriteRequest {
  readonly name: string;
  /** Generated from the name by the API when omitted. */
  readonly slug?: string;
  readonly isTechnology: boolean;
  readonly technologyCategory?: TechCategory;
}

/** `Common/PagedResult.cs` — pageSize is clamped to 1..100 server-side. */
export interface PagedResult<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}

/** Stable `code` member on the API's RFC 7807 problem responses. */
export type ApiErrorCode =
  | "validation_failed"
  | "invalid_credentials"
  | "unauthenticated"
  | "invalid_token"
  | "account_disabled"
  | "email_verification_required"
  | "account_pending"
  | "account_rejected"
  | "invalid_verification_token"
  | "verification_token_expired"
  | "invalid_setup_token"
  | "setup_token_already_used"
  | "setup_token_expired"
  | "email_taken"
  | "cannot_delete_self"
  | "user_not_found"
  | "site_required"
  | "slug_taken"
  | "tag_in_use"
  | "not_found"
  | "cannot_modify_self"
  | "cannot_modify_super_admin"
  | "forbidden";

/** `Common/ProblemResults.cs` */
export interface ApiProblem {
  readonly status?: number;
  readonly title?: string;
  readonly detail?: string;
  readonly code?: ApiErrorCode | string;
}

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

/** `Enums/Site.cs` — the two public frontends. */
export type Site = "agency" | "personal";

/** `DTOs/Admin/AdminArticleResponse.cs` — visibility is a show/featured flag pair per site. */
export interface AdminArticle {
  readonly id: string;
  readonly title: string;
  readonly excerpt: string;
  readonly slug?: string;
  /** Set on first publish; never cleared. */
  readonly publishedAt?: string;
  readonly coverImageKey?: string;
  /** Raw Markdown with unresolved `media://` tokens. */
  readonly contentMarkdown?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly tags: readonly AdminTag[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateArticleRequest.cs` (update is identical). PUT is a full replacement:
 * omitted booleans become `false` and an omitted `tagIds` wipes every tag.
 */
export interface ArticleWriteRequest {
  readonly title: string;
  readonly excerpt: string;
  /** Generated from the title by the API when omitted. */
  readonly slug?: string;
  readonly coverImageKey?: string;
  readonly contentMarkdown?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  /** Replaces the article's tags outright. */
  readonly tagIds: readonly string[];
}

/** `Enums/PriceType.cs` */
export type PriceType =
  "fixed" | "starting_from" | "hourly" | "monthly" | "custom";

/** `DTOs/Public/PricingPlanFeatureResponse.cs` */
export interface PricingPlanFeature {
  readonly id: string;
  readonly text: string;
  readonly isIncluded: boolean;
  readonly sortOrder: number;
}

/**
 * `DTOs/Admin/AdminPricingPlanResponse.cs`. No `serviceId` = combo pack; no `priceAmount` =
 * "Contact us". Agency-only, so one `featured` flag and one drag-set `sortOrder`.
 */
export interface AdminPricingPlan {
  readonly id: string;
  readonly serviceId?: string;
  readonly name: string;
  readonly tagline?: string;
  readonly priceAmount?: number;
  /** ISO 4217, upper-cased by the API. */
  readonly currency: string;
  readonly priceType: PriceType;
  readonly deliveryText?: string;
  readonly description: string;
  readonly isPopular: boolean;
  readonly ctaLabel?: string;
  readonly ctaUrl?: string;
  readonly isPublished: boolean;
  readonly featured: boolean;
  /** Drag-and-drop order — never a typed number on create/update. */
  readonly sortOrder: number;
  readonly features: readonly PricingPlanFeature[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreatePricingPlanRequest.cs` (update is identical). PUT is a full replacement.
 * Features are a separate sub-resource; order only changes via `reorderPricingPlans`.
 */
export interface PricingPlanWriteRequest {
  readonly serviceId?: string;
  readonly name: string;
  readonly tagline?: string;
  /** Must be omitted when `priceType` is `custom`. */
  readonly priceAmount?: number;
  readonly currency: string;
  readonly priceType: PriceType;
  readonly deliveryText?: string;
  readonly description: string;
  readonly isPopular: boolean;
  readonly ctaLabel?: string;
  readonly ctaUrl?: string;
  readonly isPublished: boolean;
  readonly featured: boolean;
}

/** `DTOs/Admin/PricingReorderRequest.cs` — no `site`: pricing is agency-only. */
export interface PricingReorderRequest {
  readonly items: readonly ReorderItem[];
}

/** `DTOs/Admin/AddPricingPlanFeatureRequest.cs` (update is identical). */
export interface PricingFeatureWriteRequest {
  readonly text: string;
  readonly isIncluded: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Admin/ReorderRequest.cs` */
export interface ReorderItem {
  readonly id: string;
  readonly sortOrder: number;
}

/** Sort order is kept per site, so the caller has to name the site. */
export interface ReorderRequest {
  readonly site: Site;
  readonly items: readonly ReorderItem[];
}

/** Features carry a single order, so their reorder body has no site. */
export interface FeatureReorderRequest {
  readonly items: readonly ReorderItem[];
}

/** `DTOs/Admin/ServiceProjectSummary.cs` */
export interface ServiceProjectSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly year: number;
  readonly isPublished: boolean;
}

/**
 * `DTOs/Admin/AdminServiceResponse.cs` — show/featured flags per site plus an `isPublished` draft
 * switch. Each image's fields are set together or not at all.
 */
export interface AdminService {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  /** Markdown — the card blurb, and the fallback body when the page fields are empty. */
  readonly shortDescription: string;
  readonly eyebrow?: string;
  /** The page's H1; falls back to `name`. */
  readonly headline?: string;
  readonly deck?: string;
  /** Markdown bullet list. */
  readonly whoThisIsFor?: string;
  /** Markdown bullet list. */
  readonly outcomes?: string;
  /** Markdown bullet list. */
  readonly capabilities?: string;
  /** Markdown. */
  readonly inDepth?: string;
  readonly primaryCtaLabel?: string;
  readonly primaryCtaUrl?: string;
  readonly secondaryCtaLabel?: string;
  readonly secondaryCtaUrl?: string;
  readonly iconObjectKey?: string;
  readonly iconUrl?: string;
  readonly iconWidth?: number;
  readonly iconHeight?: number;
  readonly iconAltText?: string;
  readonly heroImageObjectKey?: string;
  readonly heroImageUrl?: string;
  readonly heroImageWidth?: number;
  readonly heroImageHeight?: number;
  readonly heroImageAltText?: string;
  readonly depthImageObjectKey?: string;
  readonly depthImageUrl?: string;
  readonly depthImageWidth?: number;
  readonly depthImageHeight?: number;
  readonly depthImageAltText?: string;
  readonly projects: readonly ServiceProjectSummary[];
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly isPublished: boolean;
  /** Set on first publish; never cleared. */
  readonly publishedAt?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateServiceRequest.cs` (update is identical). PUT is a full replacement, so
 * show/featured/sort are carried over from the loaded service.
 */
export interface ServiceWriteRequest {
  readonly name: string;
  /** Generated from the name by the API when omitted. */
  readonly slug?: string;
  readonly shortDescription: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly deck?: string;
  readonly whoThisIsFor?: string;
  readonly outcomes?: string;
  readonly capabilities?: string;
  readonly inDepth?: string;
  /** Set together with primaryCtaUrl or not at all (same for secondary and each image group). */
  readonly primaryCtaLabel?: string;
  readonly primaryCtaUrl?: string;
  readonly secondaryCtaLabel?: string;
  readonly secondaryCtaUrl?: string;
  readonly iconObjectKey?: string;
  readonly iconUrl?: string;
  readonly iconWidth?: number;
  readonly iconHeight?: number;
  readonly iconAltText?: string;
  readonly heroImageObjectKey?: string;
  readonly heroImageUrl?: string;
  readonly heroImageWidth?: number;
  readonly heroImageHeight?: number;
  readonly heroImageAltText?: string;
  readonly depthImageObjectKey?: string;
  readonly depthImageUrl?: string;
  readonly depthImageWidth?: number;
  readonly depthImageHeight?: number;
  readonly depthImageAltText?: string;
  /** Replaces the service's linked projects outright. */
  readonly projectIds: readonly string[];
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
}

/** `DTOs/Public/ProjectImageResponse.cs` — object storage metadata only, no per-size URLs. */
export interface ProjectImage {
  readonly id: string;
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  /** Exactly one per project. */
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Admin/AdminProjectResponse.cs` — show/featured flags per site plus an `isPublished` draft switch. */
export interface AdminProject {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly year: number;
  readonly shortDescription: string;
  /** Markdown, long form. */
  readonly description: string;
  readonly websiteUrl?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly clientName?: string;
  readonly isPublished: boolean;
  /** Set on first publish; never cleared. */
  readonly publishedAt?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly tags: readonly AdminTag[];
  readonly images: readonly ProjectImage[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateProjectRequest.cs` (update is identical). PUT is a full replacement: omitted
 * fields reset and an omitted `tagIds` wipes every tag. Images are a separate sub-resource.
 */
export interface ProjectWriteRequest {
  readonly title: string;
  /** Generated from the title by the API when omitted. */
  readonly slug?: string;
  /** Bounded 1990..currentYear + 1 by the API. */
  readonly year: number;
  readonly shortDescription: string;
  readonly description: string;
  /** Must be an absolute http(s) URL when given. */
  readonly websiteUrl?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly whatWeDelivered?: string;
  readonly proof?: string;
  readonly clientName?: string;
  readonly isPublished: boolean;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  /** Replaces the project's tags outright. */
  readonly tagIds: readonly string[];
}

/** `DTOs/Admin/SetPublishedRequest.cs` — toggles publish without sending the full record. */
export interface SetPublishedRequest {
  readonly isPublished: boolean;
}

/** `DTOs/Admin/AddProjectImageRequest.cs`. Setting `isPrimary` clears the previous primary. */
export interface ProjectImageWriteRequest {
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Admin/ImageReorderRequest.cs` — one global order, no site. */
export interface ImageReorderRequest {
  readonly items: readonly ReorderItem[];
}

/** `DTOs/Public/ProductImageResponse.cs` — same shape as `ProjectImage`. */
export interface ProductImage {
  readonly id: string;
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  /** Exactly one per product. */
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

/** `DTOs/Admin/AdminProductResponse.cs` — like a project, but without tags. */
export interface AdminProduct {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  /** Markdown. */
  readonly description: string;
  /** Markdown — free-form pricing copy, not a converted amount. */
  readonly priceDetails?: string;
  readonly productUrl?: string;
  readonly isPublished: boolean;
  /** Set on first publish; never cleared. */
  readonly publishedAt?: string;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly agencySortOrder: number;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
  readonly personalSortOrder: number;
  readonly images: readonly ProductImage[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** `DTOs/Admin/CreateProductRequest.cs` (update is identical). PUT is a full replacement; images are separate. */
export interface ProductWriteRequest {
  readonly name: string;
  /** Generated from the name by the API when omitted. */
  readonly slug?: string;
  readonly tagline: string;
  readonly description: string;
  readonly priceDetails?: string;
  /** Must be an absolute http(s) URL when given. */
  readonly productUrl?: string;
  readonly isPublished: boolean;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly showOnAgency: boolean;
  readonly featuredOnAgency: boolean;
  readonly showOnPersonal: boolean;
  readonly featuredOnPersonal: boolean;
}

/** `DTOs/Admin/AddProductImageRequest.cs`. Setting `isPrimary` clears the previous primary. */
export interface ProductImageWriteRequest {
  readonly objectKey: string;
  readonly url: string;
  readonly altText: string;
  readonly width: number;
  readonly height: number;
  readonly isPrimary: boolean;
  readonly sortOrder: number;
}

/** `Enums/MediaTarget.cs` — picks the upload folder and validation rules. */
export type MediaTarget =
  "projects" | "products" | "services" | "tags" | "articles" | "certificates";

/** `DTOs/Admin/PresignedUploadRequest.cs`. `slug` is required for `projects`, `products` and `articles`. */
export interface PresignedUploadRequest {
  readonly target: MediaTarget;
  readonly slug?: string;
  /** Set to overwrite one specific object instead of adding a new one. */
  readonly objectKey?: string;
}

/** `DTOs/Admin/PresignedUploadResponse.cs` — PUT the file straight to `uploadUrl` with a matching content type. */
export interface PresignedUploadResponse {
  readonly uploadUrl: string;
  readonly objectKey: string;
  readonly publicUrl: string;
  readonly expiresAt: string;
}

/** `DTOs/Admin/MediaConfigResponse.cs` — replaces the `media://` prefix to make a loadable URL. */
export interface MediaConfigResponse {
  readonly publicBaseUrl: string;
}

/**
 * `DTOs/Admin/AdminFaqResponse.cs` — no featured flag and no publish endpoint (`isPublished` flips
 * via a full update). One `sortOrder` shared by both sites.
 */
export interface AdminFaq {
  readonly id: string;
  /** Absent means a general FAQ. */
  readonly serviceId?: string;
  /** Present exactly when `serviceId` is. */
  readonly serviceName?: string;
  readonly question: string;
  /** Markdown. */
  readonly answer: string;
  readonly sortOrder: number;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly showOnPersonal: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** `DTOs/Admin/CreateFaqRequest.cs` (update is identical). PUT is a full replacement; order changes via `reorderFaqs`. */
export interface FaqWriteRequest {
  /** Omit for a general FAQ; otherwise scopes it to that service's page. */
  readonly serviceId?: string;
  readonly question: string;
  readonly answer: string;
  readonly isPublished: boolean;
  readonly showOnAgency: boolean;
  readonly showOnPersonal: boolean;
}

/** `DTOs/Admin/FaqReorderRequest.cs` — no `site`: FAQs share one order. */
export interface FaqReorderRequest {
  readonly items: readonly ReorderItem[];
}

/** `DTOs/Admin/AdminReviewResponse.cs` — not split per site. */
export interface AdminReview {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  /** ISO 3166-1 alpha-2. */
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
  readonly isPublished: boolean;
  readonly isFeatured: boolean;
  readonly sortOrder: number;
  /** Only set for public submissions. */
  readonly submitterIp?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * `DTOs/Admin/CreateReviewRequest.cs` (update is identical). PUT is a full replacement — also how
 * publish and featuring change. Order changes via `reorderReviews`.
 */
export interface ReviewWriteRequest {
  readonly name: string;
  readonly country: string;
  readonly countryCode: string;
  readonly position?: string;
  readonly rating: number;
  readonly reviewText: string;
  readonly isPublished: boolean;
  readonly isFeatured: boolean;
}

/** `DTOs/Admin/ReviewReorderRequest.cs` — one order, no site. */
export interface ReviewReorderRequest {
  readonly items: readonly ReorderItem[];
}

/** `DTOs/Admin/AdminCertificateResponse.cs` — personal-site only. `width`/`height` are absent for PDFs. */
export interface AdminCertificate {
  readonly id: string;
  readonly name: string;
  readonly issuedBy: string;
  /** Date-only, `YYYY-MM-DD`. */
  readonly issuedDate: string;
  readonly marks?: string;
  readonly objectKey: string;
  readonly url: string;
  readonly mimeType: string;
  readonly width?: number;
  readonly height?: number;
  readonly altText: string;
  readonly isPublished: boolean;
  readonly featured: boolean;
  /** Set by drag-and-drop only. */
  readonly sortOrder: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** `DTOs/Admin/CreateCertificateRequest.cs` (update is identical). Order changes via `reorderCertificates`. */
export interface CertificateWriteRequest {
  readonly name: string;
  readonly issuedBy: string;
  readonly issuedDate: string;
  readonly marks?: string;
  readonly objectKey: string;
  readonly url: string;
  readonly mimeType: string;
  readonly width?: number;
  readonly height?: number;
  readonly altText: string;
  readonly isPublished: boolean;
  readonly featured: boolean;
}

/** `DTOs/Admin/CertificateReorderRequest.cs` — no `site`: personal-site only. */
export interface CertificateReorderRequest {
  readonly items: readonly ReorderItem[];
}

/**
 * `DTOs/Admin/AdminCurrencyResponse.cs`. A manual rate overrides the live one; `effectiveRateFromUsd`
 * is what visitors convert at. USD is the base: rate pinned to 1, can't be deactivated or deleted.
 */
export interface AdminCurrency {
  readonly id: string;
  /** ISO 4217, upper-cased by the API. */
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly manualRateFromUsd?: number;
  /** Absent until the first refresh has run. */
  readonly liveRateFromUsd?: number;
  readonly liveRateFetchedAt?: string;
  readonly effectiveRateFromUsd?: number;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** `DTOs/Admin/CreateCurrencyRequest.cs` (update is identical). The live rate only changes via `refreshCurrencyRates`. */
export interface CurrencyWriteRequest {
  readonly code: string;
  readonly name: string;
  readonly symbol: string;
  readonly manualRateFromUsd?: number;
  readonly isActive: boolean;
}

/** `DTOs/Admin/RefreshCurrencyRatesResponse.cs`. */
export interface RefreshCurrencyRatesResponse {
  readonly updatedCount: number;
  readonly fetchedAt: string;
}

/** `spam` is set server-side by the honeypot. */
export type ContactSubmissionStatus =
  "new" | "read" | "replied" | "archived" | "spam";

export type ContactBudgetRange =
  | "under_one_k"
  | "one_to_five_k"
  | "five_to_fifteen_k"
  | "over_fifteen_k"
  | "not_sure";

/** `DTOs/Admin/AdminContactSubmissionResponse.cs` — admin-only; the public side can only POST. */
export interface AdminContactSubmission {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly phone?: string;
  readonly company?: string;
  readonly subject?: string;
  readonly message: string;
  /** Absent means a general enquiry. */
  readonly serviceId?: string;
  readonly serviceName?: string;
  readonly budgetRange?: ContactBudgetRange;
  readonly site: Site;
  readonly status: ContactSubmissionStatus;
  readonly adminNotes?: string;
  readonly repliedAt?: string;
  readonly repliedBy?: string;
  readonly submitterIp?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** `DTOs/Admin/UpdateContactSubmissionRequest.cs` — triage fields only. */
export interface ContactSubmissionUpdateRequest {
  readonly status: ContactSubmissionStatus;
  readonly adminNotes?: string;
}
