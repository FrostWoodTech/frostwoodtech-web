import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/client/services/productsService";
import { mapApiProductToProduct } from "@/client/lib/mappers";

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async ({ signal }) => {
      const api = await getProduct(slug!, undefined, signal);
      return mapApiProductToProduct(api);
    },
    enabled: Boolean(slug),
    retry: false,
  });
}
