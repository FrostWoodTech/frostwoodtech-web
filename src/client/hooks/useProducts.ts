import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  type GetProductsParams,
} from "@/client/services/productsService";
import { mapApiProductToProduct } from "@/client/lib/mappers";

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async ({ signal }) => {
      const result = await getProducts(params, signal);
      return result.items.map(mapApiProductToProduct);
    },
  });
}
