import { describe, expect, it } from "vitest";
import { issuesOf } from "@/test/issuesOf";
import {
  productSchema,
  type ProductFormValues,
} from "@/admin/validation/productSchemas";

function validProduct(
  overrides: Partial<ProductFormValues> = {},
): ProductFormValues {
  return {
    name: "Frost CMS",
    tagline: "Headless content for small teams",
    description: "A longer description.",
    isPublished: true,
    showOnAgency: true,
    featuredOnAgency: false,
    showOnPersonal: false,
    featuredOnPersonal: false,
    ...overrides,
  };
}

describe("productSchema", () => {
  it("accepts a minimal valid product", () => {
    expect(productSchema.safeParse(validProduct()).success).toBe(true);
  });

  it("requires name, tagline and description, treating whitespace as empty", () => {
    const issues = issuesOf(
      productSchema.safeParse(
        validProduct({ name: " ", tagline: "", description: "\n\t" }),
      ),
    );
    expect(issues).toEqual({
      name: "Name is required.",
      tagline: "Tagline is required.",
      description: "Description is required.",
    });
  });

  it("treats a blank productUrl as absent", () => {
    expect(
      productSchema.safeParse(validProduct({ productUrl: "" })).success,
    ).toBe(true);
  });

  it.each(["https://frostwood.tech/cms", "http://localhost:3000"])(
    "accepts productUrl %j",
    (productUrl) => {
      expect(
        productSchema.safeParse(validProduct({ productUrl })).success,
      ).toBe(true);
    },
  );

  it.each([
    "ftp://files.example.com",
    "/products/cms",
    "frostwood.tech",
    "not a url",
    "javascript:alert(1)",
  ])("rejects productUrl %j", (productUrl) => {
    const issues = issuesOf(
      productSchema.safeParse(validProduct({ productUrl })),
    );
    expect(issues.productUrl).toBe(
      "productUrl must be an absolute http(s) URL.",
    );
  });
});
