import type {
  AdminTag,
  PagedResult,
  TagWriteRequest,
  TechCategory,
  TechCategoryOption,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetTagsParams {
  readonly search?: string;
  /** Omit for both; `false` for categories. */
  readonly isTechnology?: boolean;
  readonly category?: TechCategory;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getTags(
  { search, isTechnology, category, page, pageSize }: GetTagsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminTag>> {
  const { data } = await httpClient.get<PagedResult<AdminTag>>("/admin/tags", {
    params: { search, isTechnology, category, page, pageSize },
    signal,
  });
  return data;
}

export async function createTag(body: TagWriteRequest): Promise<AdminTag> {
  const { data } = await httpClient.post<AdminTag>("/admin/tags", body);
  return data;
}

/** Full replacement — send every field. */
export async function updateTag(
  id: string,
  body: TagWriteRequest,
): Promise<AdminTag> {
  const { data } = await httpClient.put<AdminTag>(`/admin/tags/${id}`, body);
  return data;
}

/** Refused with 409 `tag_in_use` while content still uses the tag. */
export async function deleteTag(id: string): Promise<void> {
  await httpClient.delete(`/admin/tags/${id}`);
}

export async function getTechCategories(
  signal?: AbortSignal,
): Promise<TechCategoryOption[]> {
  const { data } = await httpClient.get<TechCategoryOption[]>(
    "/admin/tags/categories",
    { signal },
  );
  return data;
}
