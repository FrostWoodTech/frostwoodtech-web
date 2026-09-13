import { describe, expect, it } from "vitest";
import { issuesOf } from "@/test/issuesOf";
import {
  articleSchema,
  type ArticleFormValues,
} from "@/admin/validation/articleSchemas";

const COVER_ERROR = "The cover must be one of the images used in the content.";

function validArticle(
  overrides: Partial<ArticleFormValues> = {},
): ArticleFormValues {
  return {
    title: "Shipping a CMS in a weekend",
    excerpt: "What we learned.",
    coverImageKey: "media://articles/cover.webp",
    contentMarkdown: "Intro\n\n![Cover](media://articles/cover.webp)\n\nBody.",
    isPublished: true,
    showOnAgency: true,
    featuredOnAgency: false,
    showOnPersonal: false,
    featuredOnPersonal: false,
    tagIds: [],
    ...overrides,
  };
}

describe("articleSchema", () => {
  it("accepts a cover that is a media:// image in the body", () => {
    expect(articleSchema.safeParse(validArticle()).success).toBe(true);
  });

  it("accepts a legacy absolute URL cover that is in the body", () => {
    const url = "https://cdn.example.com/old.png";
    const result = articleSchema.safeParse(
      validArticle({ coverImageKey: url, contentMarkdown: `![old](${url})` }),
    );
    expect(result.success).toBe(true);
  });

  it("requires a cover", () => {
    const issues = issuesOf(
      articleSchema.safeParse(validArticle({ coverImageKey: "" })),
    );
    expect(issues).toEqual({
      coverImageKey: "Pick a cover image from the images in your content.",
    });
  });

  it("rejects a cover the body doesn't contain", () => {
    const issues = issuesOf(
      articleSchema.safeParse(
        validArticle({ coverImageKey: "media://articles/other.webp" }),
      ),
    );
    expect(issues.coverImageKey).toBe(COVER_ERROR);
  });

  it("rejects a cover when the body has no content", () => {
    const issues = issuesOf(
      articleSchema.safeParse(validArticle({ contentMarkdown: undefined })),
    );
    expect(issues.coverImageKey).toBe(COVER_ERROR);
  });

  it("requires title and excerpt", () => {
    const issues = issuesOf(
      articleSchema.safeParse(validArticle({ title: " ", excerpt: "" })),
    );
    expect(issues).toMatchObject({
      title: "Title is required.",
      excerpt: "Excerpt is required.",
    });
  });
});
