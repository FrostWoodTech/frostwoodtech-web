import type {
  AdminFaq,
  FaqReorderRequest,
  FaqWriteRequest,
  PagedResult,
  Site,
} from "@/admin/types";
import { httpClient } from "@/admin/services/httpClient";

export interface GetFaqsParams {
  readonly search?: string;
  readonly site?: Site;
  /** Wins over `globalOnly`. */
  readonly serviceId?: string;
  /** Only FAQs with no service. */
  readonly globalOnly?: boolean;
  readonly isPublished?: boolean;
  readonly page?: number;
  readonly pageSize?: number;
}

export async function getFaqs(
  {
    search,
    site,
    serviceId,
    globalOnly,
    isPublished,
    page,
    pageSize,
  }: GetFaqsParams = {},
  signal?: AbortSignal,
): Promise<PagedResult<AdminFaq>> {
  const { data } = await httpClient.get<PagedResult<AdminFaq>>("/admin/faqs", {
    params: {
      search,
      site,
      serviceId,
      globalOnly,
      isPublished,
      page,
      pageSize,
    },
    signal,
  });
  return data;
}

export async function createFaq(body: FaqWriteRequest): Promise<AdminFaq> {
  const { data } = await httpClient.post<AdminFaq>("/admin/faqs", body);
  return data;
}

/** Full replacement — send every field. */
export async function updateFaq(
  id: string,
  body: FaqWriteRequest,
): Promise<AdminFaq> {
  const { data } = await httpClient.put<AdminFaq>(`/admin/faqs/${id}`, body);
  return data;
}

export async function deleteFaq(id: string): Promise<void> {
  await httpClient.delete(`/admin/faqs/${id}`);
}

export async function reorderFaqs(body: FaqReorderRequest): Promise<void> {
  await httpClient.post("/admin/faqs/reorder", body);
}
