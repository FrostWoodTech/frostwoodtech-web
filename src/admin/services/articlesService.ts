import type {
  AdminArticle,
  ArticleWriteRequest,
  PagedResult,
  ReorderRequest,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetArticlesParams {
  readonly site?: Site;
  /** Omit for both; `false` for drafts only. */
  readonly isPublished?: boolean;
  readonly search?: string;
  /** Skip the show-on-site filter (used by the reorder screen). */
  readonly includeHidden?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by most recently updated, then title. */
export async function getArticles(
  {
    site,
    isPublished,
    search,
    includeHidden,
    page,
    pageSize,
  }: GetArticlesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminArticle>> {
  const { data } = await httpClient.get<PagedResult<AdminArticle>>(
    "/admin/articles",
    {
      params: { site, isPublished, search, includeHidden, page, pageSize },
      signal,
    },
  );
  return data;
}

export async function getArticle(
  id: string,
  signal?: AbortSignal,
): Promise<AdminArticle> {
  const { data } = await httpClient.get<AdminArticle>(`/admin/articles/${id}`, {
    signal,
  });
  return data;
}

export async function createArticle(
  body: ArticleWriteRequest,
): Promise<AdminArticle> {
  const { data } = await httpClient.post<AdminArticle>("/admin/articles", body);
  return data;
}

/** Full replacement — send every field. */
export async function updateArticle(
  id: string,
  body: ArticleWriteRequest,
): Promise<AdminArticle> {
  const { data } = await httpClient.put<AdminArticle>(
    `/admin/articles/${id}`,
    body,
  );
  return data;
}

/** Soft delete. */
export async function deleteArticle(id: string): Promise<void> {
  await httpClient.delete(`/admin/articles/${id}`);
}

/** Sort order is per site, so `site` is required. */
export async function reorderArticles(body: ReorderRequest): Promise<void> {
  await httpClient.post("/admin/articles/reorder", body);
}
