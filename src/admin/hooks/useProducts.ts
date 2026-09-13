import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productsService from "@/admin/services/productsService";
import type { GetProductsParams } from "@/admin/services/productsService";
import { productKeys } from "@/admin/hooks/queryKeys";
import type {
  ImageReorderRequest,
  ProductImageWriteRequest,
  ProductWriteRequest,
  ReorderRequest,
} from "@/admin/types";

export function useProducts(params: GetProductsParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: ({ signal }) => productsService.getProducts(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: ({ signal }) => productsService.getProduct(id as string, signal),
    enabled: id !== undefined,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ProductWriteRequest) =>
      productsService.createProduct(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ProductWriteRequest }) =>
      productsService.updateProduct(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useSetProductPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      productsService.setProductPublished(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

/** No invalidation: the caller's optimistic cache write already matches the server. */
export function useReorderProducts() {
  return useMutation({
    mutationFn: (body: ReorderRequest) => productsService.reorderProducts(body),
  });
}

function invalidateProduct(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: string,
) {
  queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
  queryClient.invalidateQueries({ queryKey: productKeys.lists() });
}

export function useAddProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      body,
    }: {
      productId: string;
      body: ProductImageWriteRequest;
    }) => productsService.addProductImage(productId, body),
    onSuccess: (_data, { productId }) =>
      invalidateProduct(queryClient, productId),
  });
}

export function useUpdateProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      imageId,
      body,
    }: {
      productId: string;
      imageId: string;
      body: ProductImageWriteRequest;
    }) => productsService.updateProductImage(productId, imageId, body),
    onSuccess: (_data, { productId }) =>
      invalidateProduct(queryClient, productId),
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      imageId,
    }: {
      productId: string;
      imageId: string;
    }) => productsService.deleteProductImage(productId, imageId),
    onSuccess: (_data, { productId }) =>
      invalidateProduct(queryClient, productId),
  });
}

/** No invalidation: the optimistic write matches the server, and a refetch would jolt dnd-kit. */
export function useReorderProductImages() {
  return useMutation({
    mutationFn: ({
      productId,
      body,
    }: {
      productId: string;
      body: ImageReorderRequest;
    }) => productsService.reorderProductImages(productId, body),
  });
}
