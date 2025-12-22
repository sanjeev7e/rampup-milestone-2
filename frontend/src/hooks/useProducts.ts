import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/productService";
import type {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
} from "../types/products";
import type { ApiError } from "../lib/errors";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: { search?: string; category?: string }) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

/**
 * Hook to fetch products list with filters
 */
export function useProducts(
  filters: { search?: string; category?: string } = {}
) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getAll(filters),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single product details
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

/**
 * Options for mutation hooks
 */
interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Hook to create a product
 */
export function useCreateProduct(options?: MutationOptions<Product>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      options?.onError?.(error);
    },
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct(options?: MutationOptions<Product>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options?.onSuccess?.(data);
    },
    onError: (error: ApiError) => {
      options?.onError?.(error);
    },
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct(options?: MutationOptions<void>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      options?.onSuccess?.(undefined as void);
    },
    onError: (error: ApiError) => {
      options?.onError?.(error);
    },
  });
}

// Re-export ApiError for convenience
export type { ApiError } from "../lib/errors";
