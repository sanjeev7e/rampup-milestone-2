/**
 * Product Entity Types
 */

export interface Product {
  id: string; // Primary key (UUID)
  type: string; // GSI Partition Key (e.g., "products")
  productName: string;
  productCategory: string;
  productDescription: string;

  // Additional Product Attributes
  form: string; // e.g., "Powder", "Liquid", "Solid"
  safety: string; // e.g., "Flammable", "Non-Flammable"
  uom: string; // Unit of Measurement, e.g., "Per Unit", "Per Kg"

  // Pricing and Rate Settings
  ratePerUnit: number;
  marketSellingPrice: number;
  saleProfitMargin: number; // Percentage

  // Other Details (optional)
  productType?: string;
  productSize?: string; // e.g., "12*12*12"
  productColor?: string;
  productVariant?: string;

  // Flags
  ecoFriendly: boolean;
  handleWithCare: boolean;

  // Image and Brochure URLs (S3 paths or URLs)
  productImage?: string; // Main product image URL
  additionalImages?: string[]; // Array of additional image URLs
  productBrochure?: string; // PDF or document URL

  // Metadata
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

// Response for Product List (Grid View) - Optimized with only required fields
export interface ProductListItem {
  id: string;
  productName: string;
  productCategory: string;
  productImage?: string;
  marketSellingPrice: number;
}

// Response for Product Detail View - Full details
export interface ProductDetail extends Product {
  // All fields from Product interface
}

// Request body for creating a product
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

// Request body for updating a product
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  // All fields are optional for updates
}
