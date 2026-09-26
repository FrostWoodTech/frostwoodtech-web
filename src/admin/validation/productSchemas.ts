import { z } from "zod";

/**
 * Mirrors `Services/ProductService.cs` checks and wording. The show/featured flags are carried
 * through unchanged; the reorder screen edits and validates them.
 */

const optionalText = z.string().trim().optional();

/** Matches `Uri.TryCreate(..., UriKind.Absolute)` plus the scheme check. */
function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export const productSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    slug: optionalText,
    tagline: z.string().trim().min(1, "Tagline is required."),
    description: z.string().trim().min(1, "Description is required."),
    priceDetails: optionalText,
    productUrl: optionalText,
    isPublished: z.boolean(),
    seoTitle: optionalText,
    seoDescription: optionalText,
    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.productUrl && !isAbsoluteHttpUrl(values.productUrl)) {
      ctx.addIssue({
        code: "custom",
        path: ["productUrl"],
        message: "productUrl must be an absolute http(s) URL.",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productSchema>;
