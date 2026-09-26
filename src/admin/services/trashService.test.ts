import { beforeEach, describe, expect, it, vi } from "vitest";

const { get, post, del } = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  del: vi.fn(),
}));

vi.mock("@/admin/services/httpClient", () => ({
  httpClient: { get, post, delete: del },
}));

import {
  TRASH_ENTITIES,
  getTrash,
  purgeTrashed,
  restoreTrashed,
} from "@/admin/services/trashService";

/** The API's trash routes, one per content type (users have none). */
const BACKEND_TRASH_SEGMENTS = [
  "articles",
  "certificates",
  "contact-submissions",
  "currencies",
  "faqs",
  "pricing-plans",
  "products",
  "projects",
  "reviews",
  "services",
  "tags",
];

describe("TRASH_ENTITIES", () => {
  it("covers every content type the API keeps a trash for", () => {
    expect(TRASH_ENTITIES.map((entity) => entity.id).sort()).toEqual(
      BACKEND_TRASH_SEGMENTS,
    );
  });

  it("has unique ids and labels", () => {
    expect(new Set(TRASH_ENTITIES.map((e) => e.id)).size).toBe(
      TRASH_ENTITIES.length,
    );
    expect(new Set(TRASH_ENTITIES.map((e) => e.label)).size).toBe(
      TRASH_ENTITIES.length,
    );
  });
});

describe("trash requests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists the trash of one type with search and paging", async () => {
    const page = { items: [], page: 2, pageSize: 20, total: 0 };
    get.mockResolvedValue({ data: page });
    const signal = new AbortController().signal;

    const result = await getTrash(
      "pricing-plans",
      { search: "starter", page: 2, pageSize: 20 },
      signal,
    );

    expect(result).toBe(page);
    expect(get).toHaveBeenCalledWith("/admin/pricing-plans/trash", {
      params: { search: "starter", page: 2, pageSize: 20 },
      signal,
    });
  });

  it("restores with POST .../restore", async () => {
    post.mockResolvedValue({ data: {} });
    await restoreTrashed("faqs", "abc");
    expect(post).toHaveBeenCalledWith("/admin/faqs/abc/restore");
  });

  it("purges with DELETE .../permanent", async () => {
    del.mockResolvedValue({ data: undefined });
    await purgeTrashed("certificates", "abc");
    expect(del).toHaveBeenCalledWith("/admin/certificates/abc/permanent");
  });

  it("lets API errors (e.g. purge blocked while in use) reach the caller", async () => {
    const error = new Error("tag_in_use");
    del.mockRejectedValue(error);
    await expect(purgeTrashed("tags", "abc")).rejects.toBe(error);
  });
});
