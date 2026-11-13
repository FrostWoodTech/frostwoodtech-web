import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
import type { ApiProject, PagedResult, Site } from "@/client/types";

export interface GetProjectsParams {
  readonly site?: Site;
  /** Tag slug. */
  readonly tag?: string;
  /** Category tag slug. */
  readonly category?: string;
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

const SITE: Site = "agency";

export async function getProjects(
  {
    site = SITE,
    tag,
    category,
    featured,
    page = 1,
    pageSize = 20,
  }: GetProjectsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiProject>> {
  if (USE_STATIC_DATA)
    return staticApi.getProjects({ tag, category, featured, page, pageSize });
  const { data } = await httpClient.get<PagedResult<ApiProject>>(
    "/public/projects",
    { params: { site, tag, category, featured, page, pageSize }, signal },
  );
  return data;
}

export async function getProject(
  slug: string,
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiProject> {
  if (USE_STATIC_DATA) return staticApi.getProject(slug);
  const { data } = await httpClient.get<ApiProject>(
    `/public/projects/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
