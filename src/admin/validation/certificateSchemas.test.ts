import { describe, expect, it } from "vitest";
import { issuesOf } from "@/test/issuesOf";
import {
  CERTIFICATE_CATEGORIES,
  certificateSchema,
  type CertificateFormValues,
} from "@/admin/validation/certificateSchemas";

function validCertificate(
  overrides: Partial<CertificateFormValues> = {},
): CertificateFormValues {
  return {
    name: "AZ-204 Azure Developer",
    issuedBy: "Microsoft",
    category: "exam",
    issuedDate: "2025-11-02",
    objectKey: "certificates/az-204.pdf",
    url: "https://cdn.example.com/certificates/az-204.pdf",
    mimeType: "application/pdf",
    altText: "AZ-204 certificate",
    isPublished: true,
    featured: false,
    ...overrides,
  };
}

describe("certificateSchema", () => {
  it("accepts a valid certificate", () => {
    expect(certificateSchema.safeParse(validCertificate()).success).toBe(true);
  });

  it.each(CERTIFICATE_CATEGORIES)("accepts the %s category", (category) => {
    expect(
      certificateSchema.safeParse(validCertificate({ category })).success,
    ).toBe(true);
  });

  it("only offers the API's two categories", () => {
    expect(CERTIFICATE_CATEGORIES).toEqual(["course", "exam"]);
  });

  it("rejects a missing or unknown category", () => {
    const missing = certificateSchema.safeParse({
      ...validCertificate(),
      category: undefined,
    });
    expect(issuesOf(missing).category).toBe("Category is required.");

    const unknown = certificateSchema.safeParse({
      ...validCertificate(),
      category: "workshop",
    });
    expect(issuesOf(unknown).category).toBe("Category is required.");
  });

  it("requires name, issuer, date, file and alt text", () => {
    const issues = issuesOf(
      certificateSchema.safeParse(
        validCertificate({
          name: " ",
          issuedBy: "",
          issuedDate: "",
          objectKey: "",
          altText: "",
        }),
      ),
    );
    expect(issues).toEqual({
      name: "Name is required.",
      issuedBy: "Issued by is required.",
      issuedDate: "Issue date is required.",
      objectKey: "Upload a certificate file first.",
      altText: "Alt text is required.",
    });
  });

  it("treats marks as optional free text", () => {
    expect(
      certificateSchema.safeParse(validCertificate({ marks: "95%" })).success,
    ).toBe(true);
    expect(
      certificateSchema.safeParse(validCertificate({ marks: "" })).success,
    ).toBe(true);
  });
});
