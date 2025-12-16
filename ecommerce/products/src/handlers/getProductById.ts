import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamoDb } from "@utils/dynamodb";
import { response } from "@utils/response";
import { Product } from "../entities/Product";

/**
 * Lambda handler to get a specific product by ID
 * Returns full product details for the detail view
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Get Product By ID Event:", JSON.stringify(event, null, 2));

    // Extract product ID from path parameters
    const productId = event.pathParameters?.id;

    if (!productId) {
      return response.error("Product ID is required", 400);
    }

    // Fetch product from DynamoDB
    const product = (await dynamoDb.get(productId)) as Product | undefined;

    if (!product) {
      return response.error("Product not found", 404);
    }

    console.log("Product retrieved:", product.id);

    // Return full product details
    return response.success({
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return response.error(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
};
