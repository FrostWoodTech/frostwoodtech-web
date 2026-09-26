import { describe, expect, it } from "vitest";
import { issuesOf } from "@/test/issuesOf";
import {
  currencySchema,
  type CurrencyFormValues,
} from "@/admin/validation/currencySchemas";

function validCurrency(
  overrides: Partial<CurrencyFormValues> = {},
): CurrencyFormValues {
  return {
    code: "LKR",
    name: "Sri Lankan rupee",
    symbol: "Rs",
    manualRateFromUsd: 300,
    isActive: true,
    ...overrides,
  };
}

describe("currencySchema", () => {
  it("accepts a valid currency", () => {
    expect(currencySchema.safeParse(validCurrency()).success).toBe(true);
  });

  it("treats a missing rate as 'use the live rate'", () => {
    expect(
      currencySchema.safeParse(validCurrency({ manualRateFromUsd: undefined }))
        .success,
    ).toBe(true);
  });

  it.each(["LK", "LKRS", "L1R"])("rejects code %j", (code) => {
    const issues = issuesOf(currencySchema.safeParse(validCurrency({ code })));
    expect(issues.code).toBe(
      "Code must be a 3-letter ISO 4217 code, e.g. 'LKR'.",
    );
  });

  it.each([0, -5])("rejects a rate of %d", (manualRateFromUsd) => {
    const issues = issuesOf(
      currencySchema.safeParse(validCurrency({ manualRateFromUsd })),
    );
    expect(issues.manualRateFromUsd).toBe(
      "manualRateFromUsd must be greater than zero.",
    );
  });

  it("requires name and symbol", () => {
    const issues = issuesOf(
      currencySchema.safeParse(validCurrency({ name: "", symbol: " " })),
    );
    expect(issues).toEqual({
      name: "Name is required.",
      symbol: "Symbol is required.",
    });
  });

  describe("base currency (USD)", () => {
    const usd = { code: "USD", name: "US dollar", symbol: "$" };

    it("accepts USD at rate 1 and active", () => {
      expect(
        currencySchema.safeParse(
          validCurrency({ ...usd, manualRateFromUsd: 1 }),
        ).success,
      ).toBe(true);
    });

    it.each(["USD", "usd", " Usd "])(
      "requires rate exactly 1 for %j",
      (code) => {
        const issues = issuesOf(
          currencySchema.safeParse(
            validCurrency({ ...usd, code, manualRateFromUsd: 1.1 }),
          ),
        );
        expect(issues.manualRateFromUsd).toBe(
          "USD is the base currency, so its rate must be exactly 1.",
        );
      },
    );

    it("rejects USD with no manual rate", () => {
      const issues = issuesOf(
        currencySchema.safeParse(
          validCurrency({ ...usd, manualRateFromUsd: undefined }),
        ),
      );
      expect(issues.manualRateFromUsd).toBe(
        "USD is the base currency, so its rate must be exactly 1.",
      );
    });

    it("cannot be deactivated", () => {
      const issues = issuesOf(
        currencySchema.safeParse(
          validCurrency({ ...usd, manualRateFromUsd: 1, isActive: false }),
        ),
      );
      expect(issues.isActive).toBe(
        "USD is the fallback every visitor sees and cannot be deactivated.",
      );
    });
  });
});
