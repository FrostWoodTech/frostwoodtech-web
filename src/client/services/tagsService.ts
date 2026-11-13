import { httpClient } from "@/client/services/httpClient";
import { USE_STATIC_DATA, staticApi } from "@/client/services/staticApi";
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
  if (USE_STATIC_DATA) return staticApi.getTags({ isTechnology, category });
  const { data } = await httpClient.get<readonly ApiTag[]>("/public/tags", {
    params: { isTechnology, category },
    signal,
  });
  return data;
}
