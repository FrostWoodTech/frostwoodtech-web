import { httpClient } from "@/client/services/httpClient";
import type { ApiPricingPlan, PagedResult } from "@/client/types";

export interface GetPricingPlansParams {
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Combo packs (plans with no service). Pricing is agency-only, so there's no `site`. */
export async function getComboPricingPlans(
  { featured, page = 1, pageSize = 20 }: GetPricingPlansParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiPricingPlan>> {
  const { data } = await httpClient.get<PagedResult<ApiPricingPlan>>(
    "/public/pricing/combos",
    { params: { featured, page, pageSize }, signal },
  );
  return data;
}

/** The pricing tiers of one service. */
export async function getServicePricingPlans(
  serviceId: string,
  { page = 1, pageSize = 20 }: Omit<GetPricingPlansParams, "featured"> = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiPricingPlan>> {
  const { data } = await httpClient.get<PagedResult<ApiPricingPlan>>(
    `/public/pricing/services/${serviceId}`,
    { params: { page, pageSize }, signal },
  );
  return data;
}
