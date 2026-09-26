import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as trashService from "@/admin/services/trashService";
import type {
  GetTrashParams,
  TrashEntityId,
} from "@/admin/services/trashService";
import { authKeys, mediaKeys, trashKeys } from "@/admin/hooks/queryKeys";

export function useTrash(entity: TrashEntityId, params: GetTrashParams) {
  return useQuery({
    queryKey: trashKeys.list(entity, params),
    queryFn: ({ signal }) => trashService.getTrash(entity, params, signal),
    // Rows arrive from other screens' deletes, so always refetch when the page opens.
    staleTime: 0,
    // Keep the pager steady while paging or searching, but never show another type's rows.
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[1] === entity ? previous : undefined,
  });
}

export function useRestoreTrashed(entity: TrashEntityId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trashService.restoreTrashed(entity, id),
    onSuccess: () => {
      // A restored row can show up in related lists (tags on projects, a service's FAQs), so refresh all content.
      const skip = new Set<unknown>([authKeys.all[0], mediaKeys.config[0]]);
      queryClient.invalidateQueries({
        predicate: (query) => !skip.has(query.queryKey[0]),
      });
    },
  });
}

export function usePurgeTrashed(entity: TrashEntityId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => trashService.purgeTrashed(entity, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trashKeys.lists(entity) });
    },
  });
}
