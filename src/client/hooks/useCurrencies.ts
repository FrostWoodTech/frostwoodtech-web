import { useQuery } from "@tanstack/react-query";
import { getCurrencies } from "@/client/services/currenciesService";

export function useCurrencies() {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: ({ signal }) => getCurrencies(signal),
    staleTime: 60 * 60 * 1000,
  });
}
