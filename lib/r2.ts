import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const need = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`${k} is not set`);
  return v;
};

let client: S3Client | undefined;
export const r2 = () =>
  (client ??= new S3Client({
    region: "auto",
    endpoint: need("R2_ENDPOINT"),
    credentials: { accessKeyId: need("R2_ACCESS_KEY_ID"), secretAccessKey: need("R2_SECRET_ACCESS_KEY") },
  }));

export const bucket = () => need("R2_BUCKET");
export const publicUrl = (key: string) => `${need("R2_PUBLIC_URL").replace(/\/$/, "")}/${key}`;

/** Short-lived link the browser uses to PUT one file straight into the bucket. */
export const presignPut = (key: string, contentType: string) =>
  getSignedUrl(r2(), new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }), { expiresIn: 900 });

export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const res = await r2().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    return JSON.parse((await res.Body!.transformToString()) || "null") as T;
  } catch (e) {
    if ((e as { name?: string }).name === "NoSuchKey") return null;
    throw e;
  }
}

export const putJson = (key: string, data: unknown, cache = "public, max-age=0, must-revalidate") =>
  r2().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: JSON.stringify(data, null, 2), ContentType: "application/json", CacheControl: cache }));
