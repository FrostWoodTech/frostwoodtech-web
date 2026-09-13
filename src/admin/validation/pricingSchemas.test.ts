import { describe, expect, it } from "vitest";
import { issuesOf } from "@/test/issuesOf";
import {
  pricingFeatureSchema,
  pricingPlanSchema,
  type PricingPlanFormValues,
} from "@/admin/validation/pricingSchemas";

function validPlan(
  overrides: Partial<PricingPlanFormValues> = {},
): PricingPlanFormValues {
  return {
    kind: "combo",
    name: "Starter",
    description: "Everything you need to launch.",
    priceType: "fixed",
    priceAmount: 1200,
    currency: "USD",
    isPublished: true,
    isPopular: false,
    featured: false,
    features: [{ text: "Landing page", isIncluded: true }],
    ...overrides,
  };
}

describe("pricingPlanSchema", () => {
  it("accepts a valid combo plan", () => {
    expect(pricingPlanSchema.safeParse(validPlan()).success).toBe(true);
  });

  it("requires a serviceId for a service plan", () => {
    const issues = issuesOf(
      pricingPlanSchema.safeParse(validPlan({ kind: "service" })),
    );
    expect(issues.serviceId).toBe(
      "Pick a service, or switch the plan to a combo pack.",
    );

    expect(
      pricingPlanSchema.safeParse(
        validPlan({ kind: "service", serviceId: "svc-1" }),
      ).success,
    ).toBe(true);
  });

  it.each(["LKR", "usd"])("accepts currency %j", (currency) => {
    expect(pricingPlanSchema.safeParse(validPlan({ currency })).success).toBe(
      true,
    );
  });

  it.each(["US", "USDT", "U$D"])("rejects currency %j", (currency) => {
    const issues = issuesOf(
      pricingPlanSchema.safeParse(validPlan({ currency })),
    );
    expect(issues.currency).toBe(
      "Currency must be a 3-letter ISO 4217 code, e.g. 'LKR'.",
    );
  });

  it("requires a currency", () => {
    const issues = issuesOf(
      pricingPlanSchema.safeParse(validPlan({ currency: "" })),
    );
    expect(issues.currency).toBe("Currency is required.");
  });

  it("rejects a negative amount but allows zero", () => {
    const issues = issuesOf(
      pricingPlanSchema.safeParse(validPlan({ priceAmount: -1 })),
    );
    expect(issues.priceAmount).toBe("priceAmount cannot be negative.");
    expect(
      pricingPlanSchema.safeParse(validPlan({ priceAmount: 0 })).success,
    ).toBe(true);
  });

  it("rejects a custom price that carries an amount", () => {
    const issues = issuesOf(
      pricingPlanSchema.safeParse(
        validPlan({ priceType: "custom", priceAmount: 500 }),
      ),
    );
    expect(issues.priceAmount).toBe(
      "A custom price cannot carry a priceAmount — leave it null for 'Contact us'.",
    );
  });

  it("accepts a custom price with no amount", () => {
    expect(
      pricingPlanSchema.safeParse(
        validPlan({ priceType: "custom", priceAmount: undefined }),
      ).success,
    ).toBe(true);
  });

  it("rejects a non-numeric amount", () => {
    const result = pricingPlanSchema.safeParse({
      ...validPlan(),
      priceAmount: Number.NaN,
    });
    expect(issuesOf(result).priceAmount).toBe("Price must be a number.");
  });

  it("validates nested feature rows", () => {
    const issues = issuesOf(
      pricingPlanSchema.safeParse(
        validPlan({ features: [{ text: "  ", isIncluded: true }] }),
      ),
    );
    expect(issues["features.0.text"]).toBe("Text is required.");
  });
});

describe("pricingFeatureSchema", () => {
  it("allows an id for an existing feature and omits it for a new one", () => {
    expect(
      pricingFeatureSchema.safeParse({
        id: "f1",
        text: "SEO",
        isIncluded: false,
      }).success,
    ).toBe(true);
    expect(
      pricingFeatureSchema.safeParse({ text: "SEO", isIncluded: true }).success,
    ).toBe(true);
  });
});
