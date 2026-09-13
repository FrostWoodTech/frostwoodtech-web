import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { issuesOf } from "@/test/issuesOf";
import {
  projectSchema,
  type ProjectFormValues,
} from "@/admin/validation/projectSchemas";

function validProject(
  overrides: Partial<ProjectFormValues> = {},
): ProjectFormValues {
  return {
    title: "Harbour booking app",
    year: 2025,
    shortDescription: "Booking for a marina.",
    description: "Longer write-up.",
    isPublished: true,
    showOnAgency: true,
    featuredOnAgency: false,
    showOnPersonal: false,
    featuredOnPersonal: false,
    tagIds: [],
    ...overrides,
  };
}

describe("projectSchema", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts a valid project", () => {
    expect(projectSchema.safeParse(validProject()).success).toBe(true);
  });

  it.each([1990, 2026, 2027])("accepts boundary year %i", (year) => {
    expect(projectSchema.safeParse(validProject({ year })).success).toBe(true);
  });

  it.each([1989, 2028])("rejects out-of-range year %i", (year) => {
    const issues = issuesOf(projectSchema.safeParse(validProject({ year })));
    expect(issues.year).toBe("Year must be between 1990 and 2027.");
  });

  it("derives the upper bound from the current date", () => {
    vi.setSystemTime(new Date("2030-01-01T00:00:00Z"));
    expect(projectSchema.safeParse(validProject({ year: 2031 })).success).toBe(
      true,
    );
  });

  it("rejects a non-integer year", () => {
    const issues = issuesOf(
      projectSchema.safeParse(validProject({ year: 2024.5 })),
    );
    expect(issues.year).toBe("Year must be a whole number.");
  });

  it("requires title, shortDescription and description", () => {
    const issues = issuesOf(
      projectSchema.safeParse(
        validProject({ title: "", shortDescription: " ", description: "" }),
      ),
    );
    expect(issues).toMatchObject({
      title: "Title is required.",
      shortDescription: "shortDescription is required.",
      description: "Description is required.",
    });
  });

  it("accepts a blank websiteUrl and rejects a non-http one", () => {
    expect(
      projectSchema.safeParse(validProject({ websiteUrl: "" })).success,
    ).toBe(true);
    const issues = issuesOf(
      projectSchema.safeParse(validProject({ websiteUrl: "harbour.app" })),
    );
    expect(issues.websiteUrl).toBe(
      "websiteUrl must be an absolute http(s) URL.",
    );
  });
});
