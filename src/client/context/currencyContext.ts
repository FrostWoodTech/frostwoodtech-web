import { createContext } from "react";
import type { ApiCurrency } from "@/client/types";

export const CURRENCY_STORAGE_KEY = "fwt-currency";

/** The base all rates are expressed against, and the fallback currency. */
export const BASE_CURRENCY: ApiCurrency = {
  code: "USD",
  name: "US Dollar",
  symbol: "$",
  rateFromUsd: 1,
};

export interface CurrencyContextValue {
  readonly currency: ApiCurrency;
  readonly currencies: readonly ApiCurrency[];
  readonly setCurrency: (code: string) => void;
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null);
