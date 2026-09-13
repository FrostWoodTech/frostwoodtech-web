import { z } from "zod";

/** Mirrors `Services/TagService.cs` checks and wording. A technology tag needs a category; a category tag has none. */

const optionalText = z.string().trim().optional();

export const tagSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    slug: optionalText,
    isTechnology: z.boolean(),
    technologyCategory: optionalText,
  })
  .superRefine((values, ctx) => {
    if (values.isTechnology && !values.technologyCategory) {
      ctx.addIssue({
        code: "custom",
        path: ["technologyCategory"],
        message: "A category is required for a technology tag.",
      });
    }
  });

export type TagFormValues = z.infer<typeof tagSchema>;
