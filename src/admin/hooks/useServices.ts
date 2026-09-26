import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as servicesService from "@/admin/services/servicesService";
import type { GetServicesParams } from "@/admin/services/servicesService";
import { serviceKeys } from "@/admin/hooks/queryKeys";
import type { ReorderRequest, ServiceWriteRequest } from "@/admin/types";

export function useServices(params: GetServicesParams) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: ({ signal }) => servicesService.getServices(params, signal),
    placeholderData: (previous) => previous,
  });
}

export function useService(id: string | undefined) {
  return useQuery({
    queryKey: serviceKeys.detail(id ?? ""),
    queryFn: ({ signal }) => servicesService.getService(id as string, signal),
    enabled: id !== undefined,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ServiceWriteRequest) =>
      servicesService.createService(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ServiceWriteRequest }) =>
      servicesService.updateService(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(id) });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

export function useSetServicePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      servicesService.setServicePublished(id, isPublished),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
    },
  });
}

/** No invalidation: the optimistic write matches the server, and a refetch would jolt dnd-kit. */
export function useReorderServices() {
  return useMutation({
    mutationFn: (body: ReorderRequest) => servicesService.reorderServices(body),
  });
}
