import { apiClient } from "../lib/axios";
import type {
  Product,
  ProductListResponse,
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/products";

/**
 * Product Service
 * Handles all product-related API calls
 */
export const productService = {
  /**
   * Get all products with optional filters
   */
  async getAll(filters?: {
    search?: string;
    category?: string;
  }): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : "/products";

    const response = await apiClient.get<ProductListResponse>(url);
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<ProductResponse>(`/products/${id}`);
    return response.data.product;
  },

  /**
   * Create a new product
   */
  async create(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<ProductResponse>("/products", data);
    return response.data.product;
  },

  /**
   * Update a product
   */
  async update(id: string, data: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put<ProductResponse>(
      `/products/${id}`,
      data
    );
    return response.data.product;
  },

  /**
   * Delete a product
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
