import crypto from "node:crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ApiError } from "@/lib/api";

// Photo storage, optional, same "unset env = graceful degrade" pattern as
// Stripe (src/app/api/billing/*) and email (src/lib/email.ts) -- see
// CONTEXT.md §13, "pas de stockage S3-compatible branché" was the gap
// this closes, but only for whoever actually configures it.
//
// Deliberately generic S3 API, not an AWS-specific client: setting
// S3_ENDPOINT to a non-AWS host is exactly how this same client talks to
// Cloudflare R2, Supabase Storage, or MinIO -- CONTEXT.md §6 named R2/
// Supabase Storage as the intended options, not AWS S3 itself.
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.S3_ENDPOINT &&
      process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_PUBLIC_URL_BASE,
  );
}

let client: S3Client | null = null;
function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: "auto",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

/**
 * Uploads one image, namespaced by organization (so two restaurants'
 * uploads can never collide even sharing one bucket) and by `folder`
 * (menu-item photos vs. branding logo/background -- same mechanism, kept
 * visually separable in the bucket). Returns the public URL to store --
 * this function never touches the database itself, so the same call
 * works uniformly whether the caller is item-form.tsx or the branding
 * settings form.
 */
export async function uploadImage(opts: {
  organizationId: string;
  contentType: string;
  bytes: Uint8Array;
  folder: "menu-items" | "branding";
}): Promise<string> {
  if (!isStorageConfigured()) {
    throw new ApiError(501, "storage_not_configured");
  }
  if (!ALLOWED_CONTENT_TYPES.has(opts.contentType)) {
    throw new ApiError(400, "unsupported_content_type");
  }
  if (opts.bytes.byteLength > MAX_UPLOAD_BYTES) {
    throw new ApiError(413, "file_too_large");
  }

  const ext = opts.contentType === "image/png" ? "png" : opts.contentType === "image/webp" ? "webp" : "jpg";
  const key = `${opts.folder}/${opts.organizationId}/${crypto.randomUUID()}.${ext}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: opts.bytes,
      ContentType: opts.contentType,
      // Menu photos and branding images are both meant to be shown on the
      // public menu page -- there's nothing private about either once a
      // table's QR exposes the menu itself.
      ACL: "public-read",
    }),
  );

  return `${process.env.S3_PUBLIC_URL_BASE!.replace(/\/$/, "")}/${key}`;
}
