import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3Client = new S3Client({ region: process.env.REGION });
const BUCKET_NAME = process.env.PRODUCTS_BUCKET;

/**
 * Uploads a file to S3
 * @param data Base64 string or Buffer of the file
 * @param mimeType MIME type of the file
 * @param folder Folder in S3 bucket (e.g., "products/images")
 * @returns Public URL of the uploaded file
 */
export async function uploadToS3(
  data: string | Buffer,
  mimeType: string,
  folder: string
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error("PRODUCTS_BUCKET environment variable is not set");
  }

  // Handle Base64 strings (remove data:image/png;base64, prefix if present)
  let buffer: Buffer;
  let extension = mimeType.split("/")[1] || "bin";

  if (typeof data === "string") {
    // Check if it's a data URL
    if (data.includes("base64,")) {
      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        buffer = Buffer.from(matches[2], "base64");
        extension = mimeType.split("/")[1];
      } else {
        buffer = Buffer.from(data, "base64");
      }
    } else {
      buffer = Buffer.from(data, "base64");
    }
  } else {
    buffer = data;
  }

  const filename = `${uuidv4()}.${extension}`;
  const key = `${folder}/${filename}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    // ContentDisposition: "inline", // Optional: to view in browser
  });

  await s3Client.send(command);

  // Return the public URL
  // Note: This assumes objects are public or CloudFront is used.
  // For private buckets, presigned URLs should be generated instead on retrieval.
  // Given "fully ready" frontend usually expects a static URL, we'll return the S3 URL.
  // However, S3 public access is blocked by default.
  // For this milestone, we will assume we can construct the URL.
  return `https://${BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com/${key}`;
}
