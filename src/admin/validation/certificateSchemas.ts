import { z } from "zod";

/** Mirrors `Services/CertificateService.cs`. */

export const CERTIFICATE_CATEGORIES = ["course", "exam"] as const;

export const certificateSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  issuedBy: z.string().trim().min(1, "Issued by is required."),
  category: z.enum(CERTIFICATE_CATEGORIES, {
    message: "Category is required.",
  }),
  /** `YYYY-MM-DD` from `<input type="date">`. */
  issuedDate: z.string().min(1, "Issue date is required."),
  marks: z.string().trim().optional(),

  objectKey: z.string().min(1, "Upload a certificate file first."),
  url: z.string().min(1),
  mimeType: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
  altText: z.string().trim().min(1, "Alt text is required."),

  isPublished: z.boolean(),
  featured: z.boolean(),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;
