import { useQuery } from "@tanstack/react-query";
import * as mediaService from "@/admin/services/mediaService";
import { mediaKeys } from "@/admin/hooks/queryKeys";

/** Base URL for resolving `media://` tokens; fetched once per session. */
export function useMediaConfig() {
  return useQuery({
    queryKey: mediaKeys.config,
    queryFn: mediaService.getMediaConfig,
    staleTime: Infinity,
  });
}
