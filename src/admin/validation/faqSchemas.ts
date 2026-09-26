import { z } from "zod";

/** Mirrors `Services/FaqService.cs`. */

export const faqSchema = z.object({
  /** Empty means a general FAQ. */
  serviceId: z.string().trim().optional(),
  question: z.string().trim().min(1, "Question is required."),
  answer: z.string().trim().min(1, "Answer is required."),

  isPublished: z.boolean(),

  showOnAgency: z.boolean(),
  showOnPersonal: z.boolean(),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
