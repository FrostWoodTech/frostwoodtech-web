import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
import type { ApiCurrency } from "@/client/types";

/** Active currencies only; not site-scoped. */
export async function getCurrencies(
  signal?: AbortSignal,
): Promise<readonly ApiCurrency[]> {
  if (USE_STATIC_DATA) return staticApi.getCurrencies();
  const { data } = await httpClient.get<readonly ApiCurrency[]>(
    "/public/currencies",
    { signal },
  );
  return data;
}
