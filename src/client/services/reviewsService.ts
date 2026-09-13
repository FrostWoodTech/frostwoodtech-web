import { httpClient } from "@/client/services/httpClient";
import type {
  ApiReview,
  PagedResult,
  ReviewSort,
  SubmitReviewPayload,
} from "@/client/types";

export interface GetReviewsParams {
  readonly sort?: ReviewSort;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Reviews aren't site-scoped. */
export async function getReviews(
  { sort = "latest", page = 1, pageSize = 20 }: GetReviewsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<ApiReview>> {
  const { data } = await httpClient.get<PagedResult<ApiReview>>(
    "/public/reviews",
    { params: { sort, page, pageSize }, signal },
  );
  return data;
}

/** Created unpublished; an admin must approve it. */
export async function submitReview(
  payload: SubmitReviewPayload,
): Promise<{ id: string }> {
  const { data } = await httpClient.post<{ id: string }>(
    "/public/reviews",
    payload,
  );
  return data;
}
