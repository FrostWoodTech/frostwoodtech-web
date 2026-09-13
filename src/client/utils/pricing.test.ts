import { describe, expect, it } from "vitest";
import type { ApiCurrency, PriceType } from "@/client/types";
import { formatMoney } from "@/client/utils/money";
import { formatPlanPrice } from "@/client/utils/pricing";

const USD: ApiCurrency = {
  code: "USD",
  name: "US Dollar",
  symbol: "$",
  rateFromUsd: 1,
};
const LKR: ApiCurrency = {
  code: "LKR",
  name: "Sri Lankan Rupee",
  symbol: "Rs",
  rateFromUsd: 300,
};

const plan = (
  priceType: PriceType,
  priceAmount?: number,
  currency = "USD",
) => ({
  priceType,
  priceAmount,
  currency,
});

describe("formatPlanPrice", () => {
  it("returns no amount for a custom plan or a missing amount", () => {
    expect(formatPlanPrice(plan("custom"), USD)).toEqual({ amount: null });
    expect(formatPlanPrice(plan("fixed"), USD)).toEqual({ amount: null });
    expect(formatPlanPrice(plan("custom", 500), USD)).toEqual({ amount: null });
  });

  it("converts USD plans into the visitor's currency", () => {
    expect(formatPlanPrice(plan("fixed", 1000), LKR).amount).toBe(
      formatMoney(1000, LKR),
    );
  });

  it("adds a prefix or suffix per price type", () => {
    expect(formatPlanPrice(plan("fixed", 100), USD)).toMatchObject({
      prefix: undefined,
      suffix: undefined,
    });
    expect(formatPlanPrice(plan("starting_from", 100), USD).prefix).toBe(
      "From",
    );
    expect(formatPlanPrice(plan("hourly", 40), USD).suffix).toBe("/hr");
    expect(formatPlanPrice(plan("monthly", 99), USD).suffix).toBe("/mo");
  });

  it("keeps a zero amount", () => {
    expect(formatPlanPrice(plan("fixed", 0), USD).amount).toBe(
      formatMoney(0, USD),
    );
  });

  it("shows a non-USD plan in its own currency without converting", () => {
    const amount = formatPlanPrice(plan("fixed", 5000, "EUR"), LKR).amount;
    expect(amount).toContain("5");
    expect(amount).not.toBe(formatMoney(5000, LKR));
  });
});
