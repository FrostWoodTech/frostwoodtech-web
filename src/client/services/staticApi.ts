import ApiError from "@/client/services/ApiError";
import type {
  ApiArticle,
  ApiCurrency,
  ApiFaq,
  ApiHome,
  ApiPricingPlan,
  ApiProduct,
  ApiProject,
  ApiReview,
  ApiService,
  ApiTag,
  PagedResult,
  ReviewSort,
  TechCategory,
} from "@/client/types";
import { ALL_TAGS } from "@/client/data/static/tags";
import { PROJECTS } from "@/client/data/static/projects";
import { SERVICES } from "@/client/data/static/services";
import {
  ARTICLES,
  CURRENCIES,
  FAQS,
  PRODUCTS,
  REVIEWS,
} from "@/client/data/static/content";
import { COMBO_PLANS, servicePlans } from "@/client/data/static/pricing";

/**
 * Stand-ins for the `/public/*` endpoints, used while `USE_STATIC_DATA` is on. They mirror the
 * API's filtering, paging and 404s, so pages behave the same when the real API is switched back on.
 */
export const USE_STATIC_DATA = import.meta.env.VITE_USE_STATIC_DATA !== "false";

const resolve = <T>(value: T): Promise<T> => Promise.resolve(value);

function notFound(what: string): Promise<never> {
  return Promise.reject(
    new ApiError(404, `That ${what} could not be found.`, { status: 404 }),
  );
}

interface PageParams {
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

function paged<T extends { featured: boolean; sortOrder: number }>(
  source: readonly T[],
  { featured, page = 1, pageSize = 20 }: PageParams,
): Promise<PagedResult<T>> {
  const items = source
    .filter((item) => featured === undefined || item.featured === featured)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return resolve({
    items: items.slice((page - 1) * pageSize, page * pageSize),
    page,
    pageSize,
    total: items.length,
  });
}

const hasTag = (tags: readonly ApiTag[], slug?: string) =>
  !slug || tags.some((tag) => tag.slug === slug);

const bySlug = <T extends { slug?: string }>(
  source: readonly T[],
  slug: string,
) => source.find((item) => item.slug === slug);

const featured = <T extends { featured: boolean; sortOrder: number }>(
  source: readonly T[],
) =>
  source
    .filter((item) => item.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder);

export const staticApi = {
  getHome: (): Promise<ApiHome> =>
    resolve({
      featuredProjects: featured(PROJECTS),
      featuredArticles: featured(ARTICLES),
      featuredServices: featured(SERVICES),
      featuredPricingPlans: featured(COMBO_PLANS),
      faqs: FAQS,
      featuredReviews: REVIEWS.slice(0, 5),
    }),

  getServices: (params: PageParams) =>
    // The list omits `projects` and `faqs`, as the API does.
    paged(
      SERVICES.map((service) => ({
        ...service,
        projects: undefined,
        faqs: undefined,
      })),
      params,
    ),
  getService: (slug: string): Promise<ApiService> => {
    const service = bySlug(SERVICES, slug);
    return service ? resolve(service) : notFound("service");
  },

  getProjects: (params: PageParams & { tag?: string; category?: string }) =>
    paged(
      PROJECTS.filter(
        (p) => hasTag(p.tags, params.tag) && hasTag(p.tags, params.category),
      ),
      params,
    ),
  getProject: (slug: string): Promise<ApiProject> => {
    const project = bySlug(PROJECTS, slug);
    return project ? resolve(project) : notFound("project");
  },

  getProducts: (params: PageParams) => paged(PRODUCTS, params),
  getProduct: (slug: string): Promise<ApiProduct> => {
    const product = bySlug(PRODUCTS, slug);
    return product ? resolve(product) : notFound("product");
  },

  getArticles: (params: PageParams & { tag?: string }) =>
    paged(
      ARTICLES.filter((a) => hasTag(a.tags, params.tag)),
      params,
    ),
  getArticle: (slug: string): Promise<ApiArticle> => {
    const article = bySlug(ARTICLES, slug);
    return article ? resolve(article) : notFound("article");
  },

  getReviews: ({
    sort = "latest",
    page = 1,
    pageSize = 20,
  }: {
    sort?: ReviewSort;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<ApiReview>> => {
    const compare: Record<ReviewSort, (a: ApiReview, b: ApiReview) => number> =
      {
        latest: (a, b) => b.createdAt.localeCompare(a.createdAt),
        rating: (a, b) => b.rating - a.rating,
        country: (a, b) => a.country.localeCompare(b.country),
      };
    const items = [...REVIEWS].sort(compare[sort]);
    return resolve({
      items: items.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total: items.length,
    });
  },

  getFaqs: (): Promise<readonly ApiFaq[]> => resolve(FAQS),

  getTags: ({
    isTechnology,
    category,
  }: {
    isTechnology?: boolean;
    category?: TechCategory;
  }): Promise<readonly ApiTag[]> =>
    resolve(
      ALL_TAGS.filter(
        (tag) =>
          (isTechnology === undefined || tag.isTechnology === isTechnology) &&
          (!category || tag.technologyCategory === category),
      ),
    ),

  getCurrencies: (): Promise<readonly ApiCurrency[]> => resolve(CURRENCIES),

  getComboPricingPlans: (
    params: PageParams,
  ): Promise<PagedResult<ApiPricingPlan>> => paged(COMBO_PLANS, params),
  getServicePricingPlans: (
    serviceId: string,
  ): Promise<PagedResult<ApiPricingPlan>> => {
    const plans = servicePlans(serviceId);
    return resolve({
      items: plans,
      page: 1,
      pageSize: plans.length,
      total: plans.length,
    });
  },

  /** Forms "succeed" without sending anything while the site runs on static data. */
  submit: (): Promise<{ id: string }> =>
    new Promise((done) => setTimeout(() => done({ id: "static" }), 600)),
};
