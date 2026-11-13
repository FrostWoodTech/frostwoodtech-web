import { useQuery } from "@tanstack/react-query";
import {
  getComboPricingPlans,
  getServicePricingPlans,
  type GetPricingPlansParams,
} from "@/client/services/pricingService";

export function useComboPricingPlans(params: GetPricingPlansParams = {}) {
  return useQuery({
    queryKey: ["pricing", "combos", params],
    queryFn: async ({ signal }) =>
      (await getComboPricingPlans(params, signal)).items,
  });
}

export function useServicePricingPlans(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["pricing", "service", serviceId],
    queryFn: async ({ signal }) =>
      (await getServicePricingPlans(serviceId!, {}, signal)).items,
    enabled: Boolean(serviceId),
  });
}
