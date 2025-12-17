import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { dynamoDb } from "../utils/dynamodb";
import { response } from "../utils/response";
import { CreateProductRequest, Product } from "../entities/Product";

/**
 * Lambda handler to create a new product
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Create Product Event:", JSON.stringify(event, null, 2));

    // Parse request body
    if (!event.body) {
      return response.error("Request body is required", 400);
    }

    const requestBody: CreateProductRequest = JSON.parse(event.body);

    // Validate required fields
    const errors = validateProduct(requestBody);
    if (errors.length > 0) {
      return response.validationError(errors);
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
      productImage: requestBody.productImage,
      additionalImages: requestBody.additionalImages || [],
      productBrochure: requestBody.productBrochure,
      createdAt: now,
      updatedAt: now,
    };

    // Save to DynamoDB
    await dynamoDb.put(product);

    console.log("Product created successfully:", product.id);

    return response.success(
      {
        message: "Product created successfully",
        product,
      },
      201
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return response.error(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
};

/**
 * Validate product data
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
