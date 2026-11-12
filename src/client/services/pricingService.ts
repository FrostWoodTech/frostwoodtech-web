import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
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
  if (USE_STATIC_DATA)
    return staticApi.getComboPricingPlans({ featured, page, pageSize });
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
  if (USE_STATIC_DATA) return staticApi.getServicePricingPlans(serviceId);
  const { data } = await httpClient.get<PagedResult<ApiPricingPlan>>(
    `/public/pricing/services/${serviceId}`,
    { params: { page, pageSize }, signal },
  );
  return data;
}
