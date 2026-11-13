import { useQuery } from "@tanstack/react-query";
import { getHome } from "@/client/services/homeService";

export function useHome() {
  return useQuery({
    queryKey: ["home"],
    queryFn: ({ signal }) => getHome(undefined, signal),
  });
}
