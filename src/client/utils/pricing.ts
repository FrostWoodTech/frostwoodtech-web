import type { ApiCurrency, ApiPricingPlan } from "@/client/types";
import { formatMoney } from "@/client/utils/money";

export interface PlanPrice {
  /** `null` for a custom "Contact us" price. */
  readonly amount: string | null;
  /** Shown before the amount, e.g. "From". */
  readonly prefix?: string;
  /** Shown after the amount, e.g. "/mo". */
  readonly suffix?: string;
}

const SUFFIX: Partial<Record<ApiPricingPlan["priceType"], string>> = {
  hourly: "/hr",
  monthly: "/mo",
};

/** USD plans are converted to the visitor's currency; any other currency is shown as authored. */
export function formatPlanPrice(
  plan: Pick<ApiPricingPlan, "priceAmount" | "currency" | "priceType">,
  visitorCurrency: ApiCurrency,
): PlanPrice {
  if (plan.priceAmount == null || plan.priceType === "custom") {
    return { amount: null };
  }

  const amount =
    plan.currency.toUpperCase() === "USD"
      ? formatMoney(plan.priceAmount, visitorCurrency)
      : formatInCurrency(plan.priceAmount, plan.currency);

  return {
    amount,
    prefix: plan.priceType === "starting_from" ? "From" : undefined,
    suffix: SUFFIX[plan.priceType],
  };
}

function formatInCurrency(amount: number, code: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${code.toUpperCase()} ${Math.round(amount).toLocaleString()}`;
  }
}
