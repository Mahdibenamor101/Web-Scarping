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
 * Uploads one menu-item photo, namespaced by organization so two
 * restaurants' uploads can never collide or overwrite each other even
 * though they share one bucket. Returns the public URL to store as
 * MenuItem.photoUrl -- this function never touches the database itself,
 * so the same route works uniformly whether the item already exists or
 * is still being created client-side (see item-form.tsx).
 */
export async function uploadMenuItemPhoto(opts: {
  organizationId: string;
  contentType: string;
  bytes: Uint8Array;
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
  const key = `menu-items/${opts.organizationId}/${crypto.randomUUID()}.${ext}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: opts.bytes,
      ContentType: opts.contentType,
      // Menu photos are meant to be shown on the public menu page --
      // there's nothing private about a dish photo once a table's QR
      // exposes the menu itself.
      ACL: "public-read",
    }),
  );

  return `${process.env.S3_PUBLIC_URL_BASE!.replace(/\/$/, "")}/${key}`;
}
