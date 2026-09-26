import type {
  AdminProduct,
  ImageReorderRequest,
  PagedResult,
  ProductImage,
  ProductImageWriteRequest,
  ProductWriteRequest,
  ReorderRequest,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetProductsParams {
  readonly site?: Site;
  /** Omit for both; `false` for drafts only. */
  readonly isPublished?: boolean;
  readonly search?: string;
  /** Skip the show-on-site filter (used by the reorder screen). */
  readonly includeHidden?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by the site's sort order when `site` is given, otherwise most recently updated first. */
export async function getProducts(
  {
    site,
    isPublished,
    search,
    includeHidden,
    page,
    pageSize,
  }: GetProductsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminProduct>> {
  const { data } = await httpClient.get<PagedResult<AdminProduct>>(
    "/admin/products",
    {
      params: { site, isPublished, search, includeHidden, page, pageSize },
      signal,
    },
  );
  return data;
}

export async function getProduct(
  id: string,
  signal?: AbortSignal,
): Promise<AdminProduct> {
  const { data } = await httpClient.get<AdminProduct>(`/admin/products/${id}`, {
    signal,
  });
  return data;
}

export async function createProduct(
  body: ProductWriteRequest,
): Promise<AdminProduct> {
  const { data } = await httpClient.post<AdminProduct>("/admin/products", body);
  return data;
}

/** Full replacement — send every field. */
export async function updateProduct(
  id: string,
  body: ProductWriteRequest,
): Promise<AdminProduct> {
  const { data } = await httpClient.put<AdminProduct>(
    `/admin/products/${id}`,
    body,
  );
  return data;
}

/** Soft delete. */
export async function deleteProduct(id: string): Promise<void> {
  await httpClient.delete(`/admin/products/${id}`);
}

export async function setProductPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminProduct> {
  const { data } = await httpClient.post<AdminProduct>(
    `/admin/products/${id}/publish`,
    { isPublished },
  );
  return data;
}

/** Sort order is per site, so `site` is required. */
export async function reorderProducts(body: ReorderRequest): Promise<void> {
  await httpClient.post("/admin/products/reorder", body);
}

export async function addProductImage(
  productId: string,
  body: ProductImageWriteRequest,
): Promise<ProductImage> {
  const { data } = await httpClient.post<ProductImage>(
    `/admin/products/${productId}/images`,
    body,
  );
  return data;
}

/** Full replacement — send every field. */
export async function updateProductImage(
  productId: string,
  imageId: string,
  body: ProductImageWriteRequest,
): Promise<ProductImage> {
  const { data } = await httpClient.put<ProductImage>(
    `/admin/products/${productId}/images/${imageId}`,
    body,
  );
  return data;
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  await httpClient.delete(`/admin/products/${productId}/images/${imageId}`);
}

/** Images have one global order, not per site. */
export async function reorderProductImages(
  productId: string,
  body: ImageReorderRequest,
): Promise<void> {
  await httpClient.post(`/admin/products/${productId}/images/reorder`, body);
}
