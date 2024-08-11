import { S3Client, S3ClientConfig, PutObjectCommand } from "@aws-sdk/client-s3";
import 'dotenv/config';


// Extracting environment variables with proper type handling
export const bucketName = process.env.BUCKET_NAME;
const bucketRegion: string | undefined = process.env.BUCKET_REGION;
const accessKey: string | undefined = process.env.ACCESS_KEY;
const secretKey: string | undefined = process.env.SECRET_KEY;

// Ensure all necessary environment variables are provided
if (!bucketRegion || !accessKey || !secretKey) {
  throw new Error("AWS S3 environment variables are not properly set.");
}

// Configuration object for the S3 client
const s3Config: S3ClientConfig = {
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
  region: bucketRegion,
};

export default s3Config


