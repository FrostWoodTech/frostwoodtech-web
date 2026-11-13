import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
import type { ApiArticle, PagedResult, Site } from "@/client/types";

export interface GetArticlesParams {
  readonly site?: Site;
  readonly tag?: string;
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

const SITE: Site = "agency";

export async function getArticles(
  {
    site = SITE,
    tag,
    featured,
    page = 1,
    pageSize = 20,
  }: GetArticlesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiArticle>> {
  if (USE_STATIC_DATA)
    return staticApi.getArticles({ tag, featured, page, pageSize });
  const { data } = await httpClient.get<PagedResult<ApiArticle>>(
    "/public/articles",
    { params: { site, tag, featured, page, pageSize }, signal },
  );
  return data;
}

export async function getArticle(
  slug: string,
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiArticle> {
  if (USE_STATIC_DATA) return staticApi.getArticle(slug);
  const { data } = await httpClient.get<ApiArticle>(
    `/public/articles/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
