import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function getEndpoint() {
  if (process.env.R2_ENDPOINT) return process.env.R2_ENDPOINT;
  if (process.env.R2_ACCOUNT_ID) return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  return null;
}

let s3 = null;
export function getS3Client() {
  if (s3) return s3;
  const endpoint = getEndpoint();
  if (!endpoint) return null;
  s3 = new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });
  return s3;
}

export async function getPresignedPut(key, contentType = 'application/octet-stream', expiresSeconds = 3600) {
  const client = getS3Client();
  if (!client) return null;
  const bucket = process.env.R2_BUCKET;
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(client, cmd, { expiresIn: expiresSeconds });
  return { url, key };
}

export async function getPresignedGet(key, expiresSeconds = 3600) {
  const client = getS3Client();
  if (!client) return null;
  const bucket = process.env.R2_BUCKET;
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(client, cmd, { expiresIn: expiresSeconds });
  return { url, key };
}

export function getPublicUrl(key) {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
}
