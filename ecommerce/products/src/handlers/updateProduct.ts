import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamoDb } from "@utils/dynamodb";
import { response } from "@utils/response";
import { UpdateProductRequest, Product } from "../entities/Product";

/**
 * Lambda handler to update a product (PUT/PATCH)
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Update Product Event:", JSON.stringify(event, null, 2));

    // Extract product ID from path parameters
    const productId = event.pathParameters?.id;

    if (!productId) {
      return response.error("Product ID is required", 400);
    }

    // Parse request body
    if (!event.body) {
      return response.error("Request body is required", 400);
    }

    const requestBody: UpdateProductRequest = JSON.parse(event.body);

    // Check if product exists
    const existingProduct = (await dynamoDb.get(productId)) as
      | Product
      | undefined;

    if (!existingProduct) {
      return response.error("Product not found", 404);
    }

    // Prepare updates (only include fields that are provided)
    const updates: any = {
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
    if (requestBody.productImage !== undefined)
      updates.productImage = requestBody.productImage;
    if (requestBody.additionalImages !== undefined)
      updates.additionalImages = requestBody.additionalImages;
    if (requestBody.productBrochure !== undefined)
      updates.productBrochure = requestBody.productBrochure;

    // Validate updates
    const errors = validateUpdates(updates);
    if (errors.length > 0) {
      return response.validationError(errors);
    }

    // Update product in DynamoDB
    const updatedProduct = await dynamoDb.update(productId, updates);

    console.log("Product updated successfully:", productId);

    return response.success({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return response.error(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
};

/**
 * Validate update data
 */
function validateUpdates(updates: any): string[] {
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
