import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamoDb } from "@utils/dynamodb";
import { response } from "@utils/response";
import { Product, ProductListItem } from "../entities/Product";

/**
 * Lambda handler to get all products (optimized for grid view)
 * Returns only essential fields: id, productName, productCategory, productImage, marketSellingPrice
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Get All Products Event:", JSON.stringify(event, null, 2));

    // Fetch all products from DynamoDB
    const products = (await dynamoDb.scan()) as Product[];

    // Transform to optimized list items (only required fields for grid view)
    const productListItems: ProductListItem[] = products.map((product) => ({
      id: product.id,
      productName: product.productName,
      productCategory: product.productCategory,
      productImage: product.productImage,
      marketSellingPrice: product.marketSellingPrice,
    }));

    console.log(`Retrieved ${productListItems.length} products`);

    return response.success({
      products: productListItems,
      count: productListItems.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return response.error(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
};
