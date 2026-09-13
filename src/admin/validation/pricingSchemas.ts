import { z } from "zod";

/** Mirrors `Services/PricingService.cs` checks and wording. A `custom` price carries no amount. */

const ISO_CURRENCY = /^[A-Za-z]{3}$/;

const optionalText = z.string().trim().optional();

/** Registered with a `setValueAs` that maps a blank field to `undefined`. */
const optionalNumber = (label: string) =>
  z.number({ message: `${label} must be a number.` }).optional();

export const PRICE_TYPES = [
  "fixed",
  "starting_from",
  "hourly",
  "monthly",
  "custom",
] as const;

/** `id` is set only for saved features, so the modal can tell inserts from updates. */
export const pricingFeatureSchema = z.object({
  id: z.string().optional(),
  text: z.string().trim().min(1, "Text is required."),
  isIncluded: z.boolean(),
});

export const pricingPlanSchema = z
  .object({
    // Form-only: decides whether `serviceId` is sent.
    kind: z.enum(["combo", "service"]),
    serviceId: optionalText,
    name: z.string().trim().min(1, "Name is required."),
    tagline: optionalText,
    description: z.string().trim().min(1, "Description is required."),

    priceType: z.enum(PRICE_TYPES),
    priceAmount: optionalNumber("Price"),
    currency: z.string().trim().min(1, "Currency is required."),
    deliveryText: optionalText,

    ctaLabel: optionalText,
    ctaUrl: optionalText,

    isPublished: z.boolean(),
    isPopular: z.boolean(),
    featured: z.boolean(),

    features: z.array(pricingFeatureSchema),
  })
  .superRefine((values, ctx) => {
    if (values.kind === "service" && !values.serviceId) {
      ctx.addIssue({
        code: "custom",
        path: ["serviceId"],
        message: "Pick a service, or switch the plan to a combo pack.",
      });
    }

    if (values.currency && !ISO_CURRENCY.test(values.currency)) {
      ctx.addIssue({
        code: "custom",
        path: ["currency"],
        message: "Currency must be a 3-letter ISO 4217 code, e.g. 'LKR'.",
      });
    }

    if (values.priceAmount !== undefined) {
      if (values.priceAmount < 0) {
        ctx.addIssue({
          code: "custom",
          path: ["priceAmount"],
          message: "priceAmount cannot be negative.",
        });
      }

      if (values.priceType === "custom") {
        ctx.addIssue({
          code: "custom",
          path: ["priceAmount"],
          message:
            "A custom price cannot carry a priceAmount — leave it null for 'Contact us'.",
        });
      }
    }
  });

export type PricingFeatureValues = z.infer<typeof pricingFeatureSchema>;
export type PricingPlanFormValues = z.infer<typeof pricingPlanSchema>;
