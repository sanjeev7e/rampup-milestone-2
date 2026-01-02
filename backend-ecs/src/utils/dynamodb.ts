import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-providers";

// Initialize DynamoDB client with credentials from environment
const client = new DynamoDBClient({
  region: process.env.REGION || "ap-south-1",
  credentials: fromEnv(),
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PRODUCTS_TABLE || "Products";

/**
 * DynamoDB utility functions for CRUD operations
 */
export const dynamoDb = {
  /**
   * Put an item into DynamoDB
   */
  put: async (item: any) => {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    });
    return await docClient.send(command);
  },

  /**
   * Get an item by ID
   */
  get: async (id: string) => {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });
    const result = await docClient.send(command);
    return result.Item;
  },

  /**
   * Scan all items (using Query on GSI to get all items)
   */
  scan: async () => {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "ProductsByTypeIndex",
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":type": "products",
      },
    });
    const result = await docClient.send(command);
    return result.Items || [];
  },

  /**
   * Update an item
   */
  update: async (id: string, updates: any) => {
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(updates).forEach((key, index) => {
      updateExpression.push(`#attr${index} = :val${index}`);
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = updates[key];
    });

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await docClient.send(command);
    return result.Attributes;
  },

  /**
   * Delete an item
   */
  delete: async (id: string) => {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });
    return await docClient.send(command);
  },
};
