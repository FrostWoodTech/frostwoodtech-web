import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
import type { ApiService, PagedResult, Site } from "@/client/types";

export interface GetServicesParams {
  readonly site?: Site;
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

const SITE: Site = "agency";

export async function getServices(
  { site = SITE, featured, page = 1, pageSize = 20 }: GetServicesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiService>> {
  if (USE_STATIC_DATA)
    return staticApi.getServices({ featured, page, pageSize });
  const { data } = await httpClient.get<PagedResult<ApiService>>(
    "/public/services",
    { params: { site, featured, page, pageSize }, signal },
  );
  return data;
}

/** Unlike the list, includes `projects` and `faqs`. */
export async function getService(
  slug: string,
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiService> {
  if (USE_STATIC_DATA) return staticApi.getService(slug);
  const { data } = await httpClient.get<ApiService>(
    `/public/services/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
