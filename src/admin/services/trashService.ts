import type { PagedResult, TrashedItem } from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

/**
 * Every content type that has a trash. `id` is the API path segment under `/admin`; users
 * have no trash.
 */
export const TRASH_ENTITIES = [
  { id: "projects", label: "Projects", noun: "project" },
  { id: "products", label: "Products", noun: "product" },
  { id: "articles", label: "Articles", noun: "article" },
  { id: "services", label: "Services", noun: "service" },
  { id: "pricing-plans", label: "Pricing plans", noun: "pricing plan" },
  { id: "faqs", label: "FAQs", noun: "FAQ" },
  { id: "certificates", label: "Certificates", noun: "certificate" },
  { id: "tags", label: "Tags", noun: "tag" },
  { id: "currencies", label: "Currencies", noun: "currency" },
  { id: "reviews", label: "Reviews", noun: "review" },
  {
    id: "contact-submissions",
    label: "Contact",
    noun: "contact submission",
  },
] as const;

export type TrashEntityId = (typeof TRASH_ENTITIES)[number]["id"];

export interface GetTrashParams {
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Soft-deleted rows only, newest first. */
export async function getTrash(
  entity: TrashEntityId,
  { search, page, pageSize }: GetTrashParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<TrashedItem>> {
  const { data } = await httpClient.get<PagedResult<TrashedItem>>(
    `/admin/${entity}/trash`,
    { params: { search, page, pageSize }, signal },
  );
  return data;
}

/** Puts the row back in its live list. 409 when it depends on a deleted parent (`service_deleted`, `currency_deleted`). */
export async function restoreTrashed(
  entity: TrashEntityId,
  id: string,
): Promise<void> {
  await httpClient.post(`/admin/${entity}/${id}/restore`);
}

/** Super admin only. Removes the row and its stored files; blocked while live rows still link it (`*_in_use`). */
export async function purgeTrashed(
  entity: TrashEntityId,
  id: string,
): Promise<void> {
  await httpClient.delete(`/admin/${entity}/${id}/permanent`);
}
