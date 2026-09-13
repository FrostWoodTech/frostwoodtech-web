import type {
  AdminProject,
  ImageReorderRequest,
  PagedResult,
  ProjectImage,
  ProjectImageWriteRequest,
  ProjectWriteRequest,
  ReorderRequest,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetProjectsParams {
  readonly site?: Site;
  /** Omit for both; `false` for drafts only. */
  readonly isPublished?: boolean;
  readonly search?: string;
  /** Skip the show-on-site filter (used by the reorder screen). */
  readonly includeHidden?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

/** Ordered by the site's sort order when `site` is given. */
export async function getProjects(
  {
    site,
    isPublished,
    search,
    includeHidden,
    page,
    pageSize,
  }: GetProjectsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminProject>> {
  const { data } = await httpClient.get<PagedResult<AdminProject>>(
    "/admin/projects",
    {
      params: { site, isPublished, search, includeHidden, page, pageSize },
      signal,
    },
  );
  return data;
}

export async function getProject(
  id: string,
  signal?: AbortSignal,
): Promise<AdminProject> {
  const { data } = await httpClient.get<AdminProject>(`/admin/projects/${id}`, {
    signal,
  });
  return data;
}

export async function createProject(
  body: ProjectWriteRequest,
): Promise<AdminProject> {
  const { data } = await httpClient.post<AdminProject>("/admin/projects", body);
  return data;
}

/** Full replacement — send every field. */
export async function updateProject(
  id: string,
  body: ProjectWriteRequest,
): Promise<AdminProject> {
  const { data } = await httpClient.put<AdminProject>(
    `/admin/projects/${id}`,
    body,
  );
  return data;
}

/** Soft delete. */
export async function deleteProject(id: string): Promise<void> {
  await httpClient.delete(`/admin/projects/${id}`);
}

export async function setProjectPublished(
  id: string,
  isPublished: boolean,
): Promise<AdminProject> {
  const { data } = await httpClient.post<AdminProject>(
    `/admin/projects/${id}/publish`,
    { isPublished },
  );
  return data;
}

/** Sort order is per site, so `site` is required. */
export async function reorderProjects(body: ReorderRequest): Promise<void> {
  await httpClient.post("/admin/projects/reorder", body);
}

export async function addProjectImage(
  projectId: string,
  body: ProjectImageWriteRequest,
): Promise<ProjectImage> {
  const { data } = await httpClient.post<ProjectImage>(
    `/admin/projects/${projectId}/images`,
    body,
  );
  return data;
}

/** Full replacement — send every field. */
export async function updateProjectImage(
  projectId: string,
  imageId: string,
  body: ProjectImageWriteRequest,
): Promise<ProjectImage> {
  const { data } = await httpClient.put<ProjectImage>(
    `/admin/projects/${projectId}/images/${imageId}`,
    body,
  );
  return data;
}

export async function deleteProjectImage(
  projectId: string,
  imageId: string,
): Promise<void> {
  await httpClient.delete(`/admin/projects/${projectId}/images/${imageId}`);
}

/** Images have one global order, not per site. */
export async function reorderProjectImages(
  projectId: string,
  body: ImageReorderRequest,
): Promise<void> {
  await httpClient.post(`/admin/projects/${projectId}/images/reorder`, body);
}
