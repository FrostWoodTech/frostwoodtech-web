import { describe, expect, it } from "vitest";
import type {
  ApiArticle,
  ApiProduct,
  ApiProject,
  ApiProjectImage,
  ApiService,
  ApiTag,
} from "@/client/types";
import {
  mapApiArticleToBlogPost,
  mapApiFaqToFaq,
  mapApiProductToProduct,
  mapApiProjectToProject,
  mapApiServiceToService,
} from "@/client/lib/mappers";

function image(overrides: Partial<ApiProjectImage> = {}): ApiProjectImage {
  return {
    id: "img",
    objectKey: "key",
    url: "https://cdn.example.com/img.webp",
    altText: "",
    width: 800,
    height: 600,
    isPrimary: false,
    sortOrder: 0,
    ...overrides,
  };
}

function tag(name: string, isTechnology: boolean): ApiTag {
  return { id: name, name, slug: name.toLowerCase(), isTechnology };
}

function apiProject(overrides: Partial<ApiProject> = {}): ApiProject {
  return {
    id: "p1",
    slug: "harbour-app",
    title: "Harbour app",
    year: 2025,
    shortDescription: "Short",
    description: "Long",
    featured: false,
    sortOrder: 0,
    tags: [],
    images: [],
    ...overrides,
  };
}

function apiProduct(overrides: Partial<ApiProduct> = {}): ApiProduct {
  return {
    id: "pr1",
    slug: "frost-cms",
    name: "Frost CMS",
    tagline: "Tagline",
    description: "Description",
    featured: false,
    sortOrder: 0,
    images: [],
    ...overrides,
  };
}

function apiArticle(overrides: Partial<ApiArticle> = {}): ApiArticle {
  return {
    id: "a1",
    title: "Title",
    excerpt: "Excerpt",
    updatedAt: "2026-01-10T12:00:00Z",
    featured: false,
    sortOrder: 0,
    tags: [],
    ...overrides,
  };
}

describe("mapApiProjectToProject", () => {
  it("splits tags into categories and technologies, categories first", () => {
    const project = mapApiProjectToProject(
      apiProject({
        tags: [
          tag("React", true),
          tag("E-commerce", false),
          tag("Node", true),
          tag("SaaS", false),
        ],
      }),
      3,
    );
    expect(project.categories).toEqual(["E-commerce", "SaaS"]);
    expect(project.technologies).toEqual(["React", "Node"]);
    expect(project.tags).toEqual(["E-commerce", "SaaS", "React", "Node"]);
    expect(project.index).toBe(3);
  });

  it("builds the href from the slug and maps renamed fields", () => {
    const project = mapApiProjectToProject(
      apiProject({
        shortDescription: "Marina bookings",
        clientName: "Harbour Co",
      }),
      0,
    );
    expect(project.href).toBe("/work/harbour-app");
    expect(project.tagline).toBe("Marina bookings");
    expect(project.clientName).toBe("Harbour Co");
  });

  it("uses the primary image, else the first, else the placeholder", () => {
    const primary = mapApiProjectToProject(
      apiProject({
        images: [
          image({ id: "a", url: "a.webp" }),
          image({ id: "b", url: "b.webp", isPrimary: true }),
        ],
      }),
      0,
    );
    expect(primary.imagePlaceholder).toBe("b.webp");

    const first = mapApiProjectToProject(
      apiProject({
        images: [image({ url: "first.webp" }), image({ url: "second.webp" })],
      }),
      0,
    );
    expect(first.imagePlaceholder).toBe("first.webp");

    const none = mapApiProjectToProject(apiProject(), 0);
    expect(none.imagePlaceholder).toBe("/images/projects/placeholder.webp");
  });

  it("sorts images by sortOrder without mutating the API response", () => {
    const images = [
      image({ id: "c", sortOrder: 2 }),
      image({ id: "a", sortOrder: 0 }),
      image({ id: "b", sortOrder: 1 }),
    ];
    const project = mapApiProjectToProject(apiProject({ images }), 0);
    expect(project.images?.map((img) => img.id)).toEqual(["a", "b", "c"]);
    expect(images.map((img) => img.id)).toEqual(["c", "a", "b"]);
    expect(project.images?.[0]).not.toHaveProperty("objectKey");
  });
});

describe("mapApiProductToProduct", () => {
  it("maps fields and builds the href", () => {
    const product = mapApiProductToProduct(
      apiProduct({
        priceDetails: "From $9/mo",
        productUrl: "https://frost.cms",
      }),
    );
    expect(product).toMatchObject({
      id: "pr1",
      slug: "frost-cms",
      name: "Frost CMS",
      priceDetails: "From $9/mo",
      productUrl: "https://frost.cms",
      href: "/products/frost-cms",
      imagePlaceholder: "/images/projects/placeholder.webp",
      images: [],
    });
  });

  it("prefers the primary image and sorts images", () => {
    const product = mapApiProductToProduct(
      apiProduct({
        images: [
          image({
            id: "late",
            url: "late.webp",
            sortOrder: 5,
            isPrimary: true,
          }),
          image({ id: "early", url: "early.webp", sortOrder: 1 }),
        ],
      }),
    );
    expect(product.imagePlaceholder).toBe("late.webp");
    expect(product.images.map((img) => img.id)).toEqual(["early", "late"]);
  });
});

describe("mapApiServiceToService", () => {
  const service = (shortDescription: string): ApiService => ({
    id: "s1",
    slug: "web-apps",
    name: "Web apps",
    shortDescription,
    iconUrl: "https://cdn.example.com/icon.svg",
    featured: false,
    sortOrder: 0,
  });

  it("maps name to title and builds the href", () => {
    const mapped = mapApiServiceToService(service("Plain"));
    expect(mapped).toMatchObject({
      id: "s1",
      title: "Web apps",
      description: "Plain",
      iconUrl: "https://cdn.example.com/icon.svg",
      href: "/services/web-apps",
    });
  });

  it.each([
    ["**Fast** and _clean_", "Fast and clean"],
    ["See [our work](/work) now", "See our work now"],
    ["![logo](x.png) Brand", "logo Brand"],
    ["## Heading\n- item one\n* item two", "Heading item one item two"],
    ["Uses `React` and ~~jQuery~~", "Uses React and jQuery"],
    ["  lots\n\n of   space ", "lots of space"],
  ])("strips markdown from %j", (input, expected) => {
    expect(mapApiServiceToService(service(input)).description).toBe(expected);
  });
});

describe("mapApiFaqToFaq", () => {
  it("drops sortOrder", () => {
    expect(
      mapApiFaqToFaq({ id: "f1", question: "Q?", answer: "A.", sortOrder: 4 }),
    ).toEqual({
      id: "f1",
      question: "Q?",
      answer: "A.",
    });
  });
});

describe("mapApiArticleToBlogPost", () => {
  it("uses the slug for the href, falling back to the id", () => {
    expect(mapApiArticleToBlogPost(apiArticle({ slug: "hello" })).href).toBe(
      "/blog/hello",
    );
    const noSlug = mapApiArticleToBlogPost(apiArticle());
    expect(noSlug.slug).toBe("a1");
    expect(noSlug.href).toBe("/blog/a1");
  });

  it("uses the first tag as the category, else 'General'", () => {
    expect(
      mapApiArticleToBlogPost(
        apiArticle({ tags: [tag("Design", false), tag("React", true)] }),
      ).category,
    ).toBe("Design");
    expect(mapApiArticleToBlogPost(apiArticle()).category).toBe("General");
  });

  it("estimates read time at ~200 words per minute, minimum one minute", () => {
    const words = (count: number) =>
      Array.from({ length: count }, () => "word").join(" ");
    expect(mapApiArticleToBlogPost(apiArticle()).readTime).toBe("1 min read");
    expect(
      mapApiArticleToBlogPost(apiArticle({ contentMarkdown: words(10) }))
        .readTime,
    ).toBe("1 min read");
    expect(
      mapApiArticleToBlogPost(apiArticle({ contentMarkdown: words(1000) }))
        .readTime,
    ).toBe("5 min read");
    expect(
      mapApiArticleToBlogPost(
        apiArticle({ contentMarkdown: `  ${words(700)}\n\n` }),
      ).readTime,
    ).toBe("4 min read");
  });

  it("formats publishedAt, falling back to updatedAt", () => {
    expect(
      mapApiArticleToBlogPost(
        apiArticle({ publishedAt: "2026-03-15T12:00:00Z" }),
      ).date,
    ).toBe("March 15, 2026");
    expect(mapApiArticleToBlogPost(apiArticle()).date).toBe("January 10, 2026");
  });

  it("passes an unparseable date through as-is", () => {
    expect(
      mapApiArticleToBlogPost(apiArticle({ publishedAt: "soon" })).date,
    ).toBe("soon");
  });

  it("only uses coverImageKey when it is already an http(s) URL", () => {
    expect(
      mapApiArticleToBlogPost(
        apiArticle({ coverImageKey: "https://cdn.example.com/c.webp" }),
      ).imagePlaceholder,
    ).toBe("https://cdn.example.com/c.webp");
    expect(
      mapApiArticleToBlogPost(
        apiArticle({ coverImageKey: "media://articles/c.webp" }),
      ).imagePlaceholder,
    ).toBe("/images/blog/placeholder.webp");
    expect(mapApiArticleToBlogPost(apiArticle()).imagePlaceholder).toBe(
      "/images/blog/placeholder.webp",
    );
  });
});
