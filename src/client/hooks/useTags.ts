import { useQuery } from "@tanstack/react-query";
import { getTags, type GetTagsParams } from "@/client/services/tagsService";

export function useTags(params: GetTagsParams = {}) {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: ({ signal }) => getTags(params, signal),
    staleTime: 10 * 60 * 1000,
  });
}
