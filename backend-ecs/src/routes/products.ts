import { Router } from "express";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { dynamoDb } from "../utils/dynamodb";
import { sendResponse } from "../utils/response";
import { uploadToS3 } from "../utils/s3";
import type {
  Product,
  ProductListItem,
  CreateProductRequest,
  UpdateProductRequest,
} from "../entities/Product";

const router = Router();

/**
 * GET /products
 * Get all products (optimized for grid view)
 * Query params: search, category
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    console.log("Get All Products Request");

    // Extract query parameters
    const search = req.query.search?.toString().toLowerCase();
    const category = req.query.category?.toString();

    // Fetch all products from DynamoDB
    let products = (await dynamoDb.scan()) as Product[];

    // Filter by category
    if (category) {
      products = products.filter((p) => p.productCategory === category);
    }

    // Filter by search term (product name)
    if (search) {
      products = products.filter((p) =>
        p.productName.toLowerCase().includes(search)
      );
    }

    // Transform to optimized list items (only required fields for grid view)
    const productListItems: ProductListItem[] = products.map((product) => ({
      id: product.id,
      productName: product.productName,
      productCategory: product.productCategory,
      productImage: product.productImage,
      marketSellingPrice: product.marketSellingPrice,
    }));

    console.log(`Retrieved ${productListItems.length} products`);

    return sendResponse.success(res, {
      products: productListItems,
      count: productListItems.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return sendResponse.error(
      res,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
});

/**
 * GET /products/:id
 * Get a specific product by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    console.log("Get Product By ID:", productId);

    if (!productId) {
      return sendResponse.error(res, "Product ID is required", 400);
    }

    // Fetch product from DynamoDB
    const product = (await dynamoDb.get(productId)) as Product | undefined;

    if (!product) {
      return sendResponse.error(res, "Product not found", 404);
    }

    console.log("Product retrieved:", product.id);

    return sendResponse.success(res, { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return sendResponse.error(
      res,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
});

/**
 * POST /products
 * Create a new product
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("Create Product Request");

    const requestBody: CreateProductRequest = req.body;

    // Validate required fields
    const errors = validateProduct(requestBody);
    if (errors.length > 0) {
      return sendResponse.validationError(res, errors);
    }

    // Create product object
    const now = new Date().toISOString();
    const product: Product = {
      id: uuidv4(),
      productName: requestBody.productName,
      productCategory: requestBody.productCategory,
      productDescription: requestBody.productDescription,
      form: requestBody.form,
      safety: requestBody.safety,
      uom: requestBody.uom,
      ratePerUnit: requestBody.ratePerUnit,
      marketSellingPrice: requestBody.marketSellingPrice,
      saleProfitMargin: requestBody.saleProfitMargin,
      productType: requestBody.productType,
      productSize: requestBody.productSize,
      productColor: requestBody.productColor,
      productVariant: requestBody.productVariant,
      ecoFriendly: requestBody.ecoFriendly || false,
      handleWithCare: requestBody.handleWithCare || false,
      productImage: "",
      additionalImages: [],
      productBrochure: "",
      createdAt: now,
      updatedAt: now,
    };

    // Upload files to S3
    if (requestBody.productImage) {
      const mimeType =
        requestBody.productImage.match(/^data:([A-Za-z-+\/]+);base64,/)?.[1] ||
        "image/png";
      product.productImage = await uploadToS3(
        requestBody.productImage,
        mimeType,
        "products/images"
      );
    }

    if (
      requestBody.additionalImages &&
      requestBody.additionalImages.length > 0
    ) {
      product.additionalImages = await Promise.all(
        requestBody.additionalImages.map(async (img) => {
          const mimeType =
            img.match(/^data:([A-Za-z-+\/]+);base64,/)?.[1] || "image/png";
          return await uploadToS3(img, mimeType, "products/images");
        })
      );
    }

    if (requestBody.productBrochure) {
      const mimeType =
        requestBody.productBrochure.match(
          /^data:([A-Za-z-+\/]+);base64,/
        )?.[1] || "application/octet-stream";
      product.productBrochure = await uploadToS3(
        requestBody.productBrochure,
        mimeType,
        "products/brochures"
      );
    }

    // Save to DynamoDB
    await dynamoDb.put(product);

    console.log("Product created successfully:", product.id);

    return sendResponse.success(
      res,
      {
        message: "Product created successfully",
        product,
      },
      201
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return sendResponse.error(
      res,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
});

/**
 * PUT /products/:id
 * Update a product
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    console.log("Update Product:", productId);

    if (!productId) {
      return sendResponse.error(res, "Product ID is required", 400);
    }

    const requestBody: UpdateProductRequest = req.body;

    // Check if product exists
    const existingProduct = (await dynamoDb.get(productId)) as
      | Product
      | undefined;

    if (!existingProduct) {
      return sendResponse.error(res, "Product not found", 404);
    }

    // Prepare updates (only include fields that are provided)
    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    // Add all provided fields to updates
    if (requestBody.productName !== undefined)
      updates.productName = requestBody.productName;
    if (requestBody.productCategory !== undefined)
      updates.productCategory = requestBody.productCategory;
    if (requestBody.productDescription !== undefined)
      updates.productDescription = requestBody.productDescription;
    if (requestBody.form !== undefined) updates.form = requestBody.form;
    if (requestBody.safety !== undefined) updates.safety = requestBody.safety;
    if (requestBody.uom !== undefined) updates.uom = requestBody.uom;
    if (requestBody.ratePerUnit !== undefined)
      updates.ratePerUnit = requestBody.ratePerUnit;
    if (requestBody.marketSellingPrice !== undefined)
      updates.marketSellingPrice = requestBody.marketSellingPrice;
    if (requestBody.saleProfitMargin !== undefined)
      updates.saleProfitMargin = requestBody.saleProfitMargin;
    if (requestBody.productType !== undefined)
      updates.productType = requestBody.productType;
    if (requestBody.productSize !== undefined)
      updates.productSize = requestBody.productSize;
    if (requestBody.productColor !== undefined)
      updates.productColor = requestBody.productColor;
    if (requestBody.productVariant !== undefined)
      updates.productVariant = requestBody.productVariant;
    if (requestBody.ecoFriendly !== undefined)
      updates.ecoFriendly = requestBody.ecoFriendly;
    if (requestBody.handleWithCare !== undefined)
      updates.handleWithCare = requestBody.handleWithCare;

    // Handle image uploads
    if (requestBody.productImage !== undefined) {
      if (requestBody.productImage.startsWith("data:")) {
        const mimeType =
          requestBody.productImage.match(
            /^data:([A-Za-z-+\/]+);base64,/
          )?.[1] || "image/png";
        updates.productImage = await uploadToS3(
          requestBody.productImage,
          mimeType,
          "products/images"
        );
      } else {
        updates.productImage = requestBody.productImage;
      }
    }

    if (requestBody.additionalImages !== undefined) {
      if (requestBody.additionalImages.length > 0) {
        updates.additionalImages = await Promise.all(
          requestBody.additionalImages.map(async (img) => {
            if (img.startsWith("data:")) {
              const mimeType =
                img.match(/^data:([A-Za-z-+\/]+);base64,/)?.[1] || "image/png";
              return await uploadToS3(img, mimeType, "products/images");
            }
            return img; // Keep existing URL
          })
        );
      } else {
        updates.additionalImages = [];
      }
    }

    if (requestBody.productBrochure !== undefined) {
      if (requestBody.productBrochure.startsWith("data:")) {
        const mimeType =
          requestBody.productBrochure.match(
            /^data:([A-Za-z-+\/]+);base64,/
          )?.[1] || "application/octet-stream";
        updates.productBrochure = await uploadToS3(
          requestBody.productBrochure,
          mimeType,
          "products/brochures"
        );
      } else {
        updates.productBrochure = requestBody.productBrochure;
      }
    }

    // Validate updates
    const errors = validateUpdates(updates);
    if (errors.length > 0) {
      return sendResponse.validationError(res, errors);
    }

    // Update product in DynamoDB
    const updatedProduct = await dynamoDb.update(productId, updates);

    console.log("Product updated successfully:", productId);

    return sendResponse.success(res, {
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return sendResponse.error(
      res,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
});

/**
 * DELETE /products/:id
 * Delete a product
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;
    console.log("Delete Product:", productId);

    if (!productId) {
      return sendResponse.error(res, "Product ID is required", 400);
    }

    // Check if product exists
    const existingProduct = (await dynamoDb.get(productId)) as
      | Product
      | undefined;

    if (!existingProduct) {
      return sendResponse.error(res, "Product not found", 404);
    }

    // Delete product from DynamoDB
    await dynamoDb.delete(productId);

    console.log("Product deleted successfully:", productId);

    return sendResponse.success(res, {
      message: "Product deleted successfully",
      productId,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return sendResponse.error(
      res,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
});

/**
 * Validate product data for creation
 */
function validateProduct(product: CreateProductRequest): string[] {
  const errors: string[] = [];

  if (!product.productName || product.productName.trim() === "") {
    errors.push("Product name is required");
  }

  if (!product.productCategory || product.productCategory.trim() === "") {
    errors.push("Product category is required");
  }

  if (!product.productDescription || product.productDescription.trim() === "") {
    errors.push("Product description is required");
  }

  if (!product.form || product.form.trim() === "") {
    errors.push("Form is required");
  }

  if (!product.safety || product.safety.trim() === "") {
    errors.push("Safety information is required");
  }

  if (!product.uom || product.uom.trim() === "") {
    errors.push("Unit of measurement is required");
  }

  if (product.ratePerUnit === undefined || product.ratePerUnit < 0) {
    errors.push("Rate per unit must be a positive number");
  }

  if (
    product.marketSellingPrice === undefined ||
    product.marketSellingPrice < 0
  ) {
    errors.push("Market selling price must be a positive number");
  }

  if (
    product.saleProfitMargin === undefined ||
    product.saleProfitMargin < 0 ||
    product.saleProfitMargin > 100
  ) {
    errors.push("Sale profit margin must be between 0 and 100");
  }

  return errors;
}

/**
 * Validate update data
 */
function validateUpdates(updates: Record<string, any>): string[] {
  const errors: string[] = [];

  if (updates.productName !== undefined && updates.productName.trim() === "") {
    errors.push("Product name cannot be empty");
  }

  if (
    updates.productCategory !== undefined &&
    updates.productCategory.trim() === ""
  ) {
    errors.push("Product category cannot be empty");
  }

  if (
    updates.productDescription !== undefined &&
    updates.productDescription.trim() === ""
  ) {
    errors.push("Product description cannot be empty");
  }

  if (updates.ratePerUnit !== undefined && updates.ratePerUnit < 0) {
    errors.push("Rate per unit must be a positive number");
  }

  if (
    updates.marketSellingPrice !== undefined &&
    updates.marketSellingPrice < 0
  ) {
    errors.push("Market selling price must be a positive number");
  }

  if (
    updates.saleProfitMargin !== undefined &&
    (updates.saleProfitMargin < 0 || updates.saleProfitMargin > 100)
  ) {
    errors.push("Sale profit margin must be between 0 and 100");
  }

  return errors;
}

export default router;
