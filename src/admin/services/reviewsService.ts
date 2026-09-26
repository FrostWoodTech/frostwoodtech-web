import type {
  AdminReview,
  PagedResult,
  ReviewReorderRequest,
  ReviewWriteRequest,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetReviewsParams {
  readonly isPublished?: boolean;
  readonly isFeatured?: boolean;
  readonly country?: string;
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getReviews(
  {
    isPublished,
    isFeatured,
    country,
    search,
    page,
    pageSize,
  }: GetReviewsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminReview>> {
  const { data } = await httpClient.get<PagedResult<AdminReview>>(
    "/admin/reviews",
    {
      params: { isPublished, isFeatured, country, search, page, pageSize },
      signal,
    },
  );
  return data;
}

export async function createReview(
  body: ReviewWriteRequest,
): Promise<AdminReview> {
  const { data } = await httpClient.post<AdminReview>("/admin/reviews", body);
  return data;
}

/** Full replacement — send every field. */
export async function updateReview(
  id: string,
  body: ReviewWriteRequest,
): Promise<AdminReview> {
  const { data } = await httpClient.put<AdminReview>(
    `/admin/reviews/${id}`,
    body,
  );
  return data;
}

/** Soft delete. */
export async function deleteReview(id: string): Promise<void> {
  await httpClient.delete(`/admin/reviews/${id}`);
}

/** Reviews have one order, so no site. */
export async function reorderReviews(
  body: ReviewReorderRequest,
): Promise<void> {
  await httpClient.post("/admin/reviews/reorder", body);
}
