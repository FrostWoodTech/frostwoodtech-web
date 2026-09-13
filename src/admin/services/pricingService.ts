import type {
  AdminPricingPlan,
  FeatureReorderRequest,
  PagedResult,
  PricingFeatureWriteRequest,
  PricingPlanWriteRequest,
  PricingReorderRequest,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetPricingPlansParams {
  /** Wins over `tiersOnly`; ignored when `comboOnly` is set. */
  readonly serviceId?: string;
  /** Combo packs only. Wins over `serviceId`/`tiersOnly`. */
  readonly comboOnly?: boolean;
  /** Tiers of any service. */
  readonly tiersOnly?: boolean;
  readonly isPublished?: boolean;
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by name, not `sortOrder`. */
export async function getPricingPlans(
  {
    serviceId,
    comboOnly,
    tiersOnly,
    isPublished,
    search,
    page,
    pageSize,
  }: GetPricingPlansParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminPricingPlan>> {
  const { data } = await httpClient.get<PagedResult<AdminPricingPlan>>(
    "/admin/pricing-plans",
    {
      params: {
        serviceId,
        comboOnly,
        tiersOnly,
        isPublished,
        search,
        page,
        pageSize,
      },
      signal,
    },
  );
  return data;
}

export async function getPricingPlan(
  id: string,
  signal?: AbortSignal,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.get<AdminPricingPlan>(
    `/admin/pricing-plans/${id}`,
    { signal },
  );
  return data;
}

export async function createPricingPlan(
  body: PricingPlanWriteRequest,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.post<AdminPricingPlan>(
    "/admin/pricing-plans",
    body,
  );
  return data;
}

/** Full replacement — send every field. */
export async function updatePricingPlan(
  id: string,
  body: PricingPlanWriteRequest,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.put<AdminPricingPlan>(
    `/admin/pricing-plans/${id}`,
    body,
  );
  return data;
}

export async function setPricingPlanPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminPricingPlan> {
  const { data } = await httpClient.post<AdminPricingPlan>(
    `/admin/pricing-plans/${id}/publish`,
    { isPublished },
  );
  return data;
}

/** Soft delete. */
export async function deletePricingPlan(id: string): Promise<void> {
  await httpClient.delete(`/admin/pricing-plans/${id}`);
}

/** Every id must exist. */
export async function reorderPricingPlans(
  body: PricingReorderRequest,
): Promise<void> {
  await httpClient.post("/admin/pricing-plans/reorder", body);
}

export async function addPricingPlanFeature(
  planId: string,
  body: PricingFeatureWriteRequest,
): Promise<void> {
  await httpClient.post(`/admin/pricing-plans/${planId}/features`, body);
}

export async function updatePricingPlanFeature(
  planId: string,
  featureId: string,
  body: PricingFeatureWriteRequest,
): Promise<void> {
  await httpClient.put(
    `/admin/pricing-plans/${planId}/features/${featureId}`,
    body,
  );
}

/** Hard delete. */
export async function deletePricingPlanFeature(
  planId: string,
  featureId: string,
): Promise<void> {
  await httpClient.delete(
    `/admin/pricing-plans/${planId}/features/${featureId}`,
  );
}

export async function reorderPricingPlanFeatures(
  planId: string,
  body: FeatureReorderRequest,
): Promise<void> {
  await httpClient.post(
    `/admin/pricing-plans/${planId}/features/reorder`,
    body,
  );
}
