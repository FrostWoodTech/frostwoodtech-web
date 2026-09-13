import { httpClient } from "@/client/services/httpClient";
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
  const { data } = await httpClient.get<ApiService>(
    `/public/services/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
