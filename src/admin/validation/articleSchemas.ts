import { z } from "zod";
import { extractMarkdownImages } from "@/admin/utils/markdownImages";

/** The show/featured flags are carried through unchanged; the reorder screen edits and validates them. */

const optionalText = z.string().trim().optional();

export const articleSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required."),
    excerpt: z.string().trim().min(1, "Excerpt is required."),
    slug: optionalText,
    coverImageKey: z
      .string()
      .trim()
      .min(1, "Pick a cover image from the images in your content."),
    contentMarkdown: optionalText,
    isPublished: z.boolean(),
    showOnAgency: z.boolean(),
    featuredOnAgency: z.boolean(),
    showOnPersonal: z.boolean(),
    featuredOnPersonal: z.boolean(),
    tagIds: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    // The API stores the cover verbatim, so it must be an image the body actually contains.
    if (
      values.coverImageKey &&
      !extractMarkdownImages(values.contentMarkdown).includes(
        values.coverImageKey,
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["coverImageKey"],
        message: "The cover must be one of the images used in the content.",
      });
    }
  });

export type ArticleFormValues = z.infer<typeof articleSchema>;
