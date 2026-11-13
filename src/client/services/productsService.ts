import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
import type { ApiProduct, PagedResult, Site } from "@/client/types";

export interface GetProductsParams {
  readonly site?: Site;
  readonly featured?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

const SITE: Site = "agency";

export async function getProducts(
  { site = SITE, featured, page = 1, pageSize = 20 }: GetProductsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiProduct>> {
  if (USE_STATIC_DATA)
    return staticApi.getProducts({ featured, page, pageSize });
  const { data } = await httpClient.get<PagedResult<ApiProduct>>(
    "/public/products",
    { params: { site, featured, page, pageSize }, signal },
  );
  return data;
}

export async function getProduct(
  slug: string,
  site: Site = SITE,
  signal?: AbortSignal,
): Promise<ApiProduct> {
  if (USE_STATIC_DATA) return staticApi.getProduct(slug);
  const { data } = await httpClient.get<ApiProduct>(
    `/public/products/${slug}`,
    { params: { site }, signal },
  );
  return data;
}
