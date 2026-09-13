import type { ApiCurrency } from "@/client/types";

/** A USD amount in the visitor's currency, rounded to whole units (these are "from" prices). */
export function formatMoney(amountUsd: number, currency: ApiCurrency): string {
  const converted = amountUsd * currency.rateFromUsd;

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    // Intl throws on unknown codes, which admins can create.
    return `${currency.symbol}${Math.round(converted).toLocaleString()}`;
  }
}
