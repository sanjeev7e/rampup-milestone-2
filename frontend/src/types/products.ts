/**
 * Product entity - full product model
 */
export interface Product {
  id: string;
  productName: string;
  productCategory: string;
  productDescription: string;

  // Additional Product Attributes
  form: string;
  safety: string;
  uom: string;

  // Pricing and Rate Settings
  ratePerUnit: number;
  marketSellingPrice: number;
  saleProfitMargin: number;

  // Other Details (optional)
  productType?: string;
  productSize?: string;
  productColor?: string;
  productVariant?: string;

  // Flags
  ecoFriendly: boolean;
  handleWithCare: boolean;

  // Image and Brochure URLs
  productImage?: string;
  additionalImages?: string[];
  productBrochure?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Product list item - optimized for grid view
 */
export interface ProductListItem {
  id: string;
  productName: string;
  productCategory: string;
  productImage?: string;
  marketSellingPrice: number;
}

/**
 * API response for product list
 */
export interface ProductListResponse {
  products: ProductListItem[];
  count: number;
}

/**
 * API response for single product
 */
export interface ProductResponse {
  product: Product;
}

/**
 * Request body for creating a product
 */
export interface CreateProductRequest {
  productName: string;
  productCategory: string;
  productDescription: string;
  form: string;
  safety: string;
  uom: string;
  ratePerUnit: number;
  marketSellingPrice: number;
  saleProfitMargin: number;
  productType?: string;
  productSize?: string;
  productColor?: string;
  productVariant?: string;
  ecoFriendly: boolean;
  handleWithCare: boolean;
  productImage?: string;
  additionalImages?: string[];
  productBrochure?: string;
}

/**
 * Request body for updating a product
 */
export type UpdateProductRequest = Partial<CreateProductRequest>;
