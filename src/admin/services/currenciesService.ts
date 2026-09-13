import type {
  AdminCurrency,
  CurrencyWriteRequest,
  PagedResult,
  RefreshCurrencyRatesResponse,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetCurrenciesParams {
  readonly isActive?: boolean;
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getCurrencies(
  { isActive, search, page, pageSize }: GetCurrenciesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminCurrency>> {
  const { data } = await httpClient.get<PagedResult<AdminCurrency>>(
    "/admin/currencies",
    { params: { isActive, search, page, pageSize }, signal },
  );
  return data;
}

export async function createCurrency(
  body: CurrencyWriteRequest,
): Promise<AdminCurrency> {
  const { data } = await httpClient.post<AdminCurrency>(
    "/admin/currencies",
    body,
  );
  return data;
}

/** Full replacement — send every field. */
export async function updateCurrency(
  id: string,
  body: CurrencyWriteRequest,
): Promise<AdminCurrency> {
  const { data } = await httpClient.put<AdminCurrency>(
    `/admin/currencies/${id}`,
    body,
  );
  return data;
}

/** Refused for USD and for currencies still used by a pricing plan. */
export async function deleteCurrency(id: string): Promise<void> {
  await httpClient.delete(`/admin/currencies/${id}`);
}

export async function refreshCurrencyRates(): Promise<RefreshCurrencyRatesResponse> {
  const { data } = await httpClient.post<RefreshCurrencyRatesResponse>(
    "/admin/currencies/refresh-rates",
  );
  return data;
}
