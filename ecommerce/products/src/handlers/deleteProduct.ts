import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamoDb } from "@utils/dynamodb";
import { response } from "@utils/response";
import { Product } from "../entities/Product";

/**
 * Lambda handler to delete a product
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Delete Product Event:", JSON.stringify(event, null, 2));

    // Extract product ID from path parameters
    const productId = event.pathParameters?.id;

    if (!productId) {
      return response.error("Product ID is required", 400);
    }

    // Check if product exists
    const existingProduct = (await dynamoDb.get(productId)) as
      | Product
      | undefined;

    if (!existingProduct) {
      return response.error("Product not found", 404);
    }

    // Delete product from DynamoDB
    await dynamoDb.delete(productId);

    console.log("Product deleted successfully:", productId);

    return response.success({
      message: "Product deleted successfully",
      productId,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return response.error(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
};
