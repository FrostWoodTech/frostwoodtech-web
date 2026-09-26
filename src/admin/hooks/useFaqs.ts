import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as faqsService from "@/admin/services/faqsService";
import type { GetFaqsParams } from "@/admin/services/faqsService";
import { faqKeys } from "@/admin/hooks/queryKeys";
import type { FaqReorderRequest, FaqWriteRequest } from "@/admin/types";

/** Pass `enabled: false` when no site is selected — there's no "match no site" query. */
export function useFaqs(params: GetFaqsParams, enabled = true) {
  return useQuery({
    queryKey: faqKeys.list(params),
    queryFn: ({ signal }) => faqsService.getFaqs(params, signal),
    placeholderData: (previous) => previous,
    enabled,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FaqWriteRequest) => faqsService.createFaq(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: FaqWriteRequest }) =>
      faqsService.updateFaq(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => faqsService.deleteFaq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqKeys.lists() });
    },
  });
}

/** No invalidation: the caller's optimistic cache write already matches the server. */
export function useReorderFaqs() {
  return useMutation({
    mutationFn: (body: FaqReorderRequest) => faqsService.reorderFaqs(body),
  });
}
