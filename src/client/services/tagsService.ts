import { httpClient } from "@/client/services/httpClient";
import type { ApiTag, TechCategory } from "@/client/types";

export interface GetTagsParams {
  /** Omit for both; `false` for categories only. */
  readonly isTechnology?: boolean;
  readonly category?: TechCategory;
}

/** Not paged and not site-scoped; ordered by name. */
export async function getTags(
  { isTechnology, category }: GetTagsParams = {},
  signal?: AbortSignal,
): Promise<readonly ApiTag[]> {
  const { data } = await httpClient.get<readonly ApiTag[]>("/public/tags", {
    params: { isTechnology, category },
    signal,
  });
  return data;
}
