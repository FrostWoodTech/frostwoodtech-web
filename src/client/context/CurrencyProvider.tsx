import { useCallback, useMemo, useState } from "react";
import { useCurrencies } from "@/client/hooks/useCurrencies";
import { currencyFromLocale } from "@/client/utils/localeCurrency";
import {
  BASE_CURRENCY,
  CURRENCY_STORAGE_KEY,
  CurrencyContext,
} from "@/client/context/currencyContext";

interface CurrencyProviderProps {
  readonly children: React.ReactNode;
}

function readStoredCurrency(): string | null {
  try {
    return localStorage.getItem(CURRENCY_STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode).
    return null;
  }
}

function persistCurrency(code: string) {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // Not persisted; the choice lasts until reload.
  }
}

export default function CurrencyProvider({ children }: CurrencyProviderProps) {
  const { data } = useCurrencies();
  const [chosen, setChosen] = useState<string | null>(readStoredCurrency);

  const currencies = useMemo(() => data ?? [BASE_CURRENCY], [data]);

  // Picked → locale guess → USD, each only if that currency is still active.
  const currency = useMemo(() => {
    const find = (code: string | null) =>
      code ? currencies.find((item) => item.code === code) : undefined;

    return (
      find(chosen) ??
      find(currencyFromLocale()) ??
      find(BASE_CURRENCY.code) ??
      BASE_CURRENCY
    );
  }, [chosen, currencies]);

  const setCurrency = useCallback((code: string) => {
    setChosen(code);
    persistCurrency(code);
  }, []);

  const value = useMemo(
    () => ({ currency, currencies, setCurrency }),
    [currency, currencies, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
