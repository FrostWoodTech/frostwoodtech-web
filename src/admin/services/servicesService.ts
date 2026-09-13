import type {
  AdminService,
  PagedResult,
  ReorderRequest,
  ServiceWriteRequest,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetServicesParams {
  readonly site?: Site;
  readonly isPublished?: boolean;
  readonly search?: string;
  /** Skip the show-on-site filter (used by the reorder screen). */
  readonly includeHidden?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by name, not by the per-site sort order. */
export async function getServices(
  {
    site,
    isPublished,
    search,
    includeHidden,
    page,
    pageSize,
  }: GetServicesParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminService>> {
  const { data } = await httpClient.get<PagedResult<AdminService>>(
    "/admin/services",
    {
      params: { site, isPublished, search, includeHidden, page, pageSize },
      signal,
    },
  );
  return data;
}

export async function getService(
  id: string,
  signal?: AbortSignal,
): Promise<AdminService> {
  const { data } = await httpClient.get<AdminService>(`/admin/services/${id}`, {
    signal,
  });
  return data;
}

export async function createService(
  body: ServiceWriteRequest,
): Promise<AdminService> {
  const { data } = await httpClient.post<AdminService>("/admin/services", body);
  return data;
}

/** Full replacement — send every field. */
export async function updateService(
  id: string,
  body: ServiceWriteRequest,
): Promise<AdminService> {
  const { data } = await httpClient.put<AdminService>(
    `/admin/services/${id}`,
    body,
  );
  return data;
}

export async function setServicePublished(
  id: string,
  isPublished: boolean,
): Promise<AdminService> {
  const { data } = await httpClient.post<AdminService>(
    `/admin/services/${id}/publish`,
    { isPublished },
  );
  return data;
}

/** Soft delete. */
export async function deleteService(id: string): Promise<void> {
  await httpClient.delete(`/admin/services/${id}`);
}

/** Renumbers for one site; every id must exist. */
export async function reorderServices(body: ReorderRequest): Promise<void> {
  await httpClient.post("/admin/services/reorder", body);
}
