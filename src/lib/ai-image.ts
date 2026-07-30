import { ApiError } from "./api";

// AI-generated food photography, optional -- same graceful-degrade
// pattern as Stripe/email/S3/translation. Requires OPENAI_API_KEY,
// checked by the route alongside isStorageConfigured() (src/lib/storage.ts)
// since a generated image has to be persisted somewhere permanent: the
// API can return either base64 bytes or a URL, but a returned URL expires
// within about an hour on OpenAI's side, so either way the bytes are
// re-uploaded to this app's own bucket immediately rather than ever
// stored as the long-lived photoUrl. Never exercised against a real
// OpenAI account in this environment.
export function isAiImageConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateFoodImage(prompt: string): Promise<{ bytes: Uint8Array; contentType: string }> {
  if (!isAiImageConfigured()) {
    throw new ApiError(501, "ai_image_not_configured");
  }

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size: "1024x1024", n: 1 }),
  });

  if (!res.ok) {
    throw new Error(`openai_image_generation_failed: ${res.status} ${await res.text()}`);
  }

  const body = (await res.json()) as { data: { b64_json?: string; url?: string }[] };
  const first = body.data[0];
  if (!first) throw new Error("openai_image_generation_empty_response");

  if (first.b64_json) {
    return { bytes: Uint8Array.from(Buffer.from(first.b64_json, "base64")), contentType: "image/png" };
  }
  if (first.url) {
    const imgRes = await fetch(first.url);
    if (!imgRes.ok) throw new Error("openai_image_download_failed");
    return { bytes: new Uint8Array(await imgRes.arrayBuffer()), contentType: "image/png" };
  }
  throw new Error("openai_image_generation_no_image_data");
}

/** Kept deliberately generic/restaurant-neutral -- the dish name and description do the real work. */
export function buildFoodPrompt(nameIt: string, descriptionIt?: string): string {
  const detail = descriptionIt ? ` (${descriptionIt})` : "";
  return `Professional food photography of "${nameIt}"${detail}. On a plate, restaurant menu style, natural lighting, 45-degree angle, appetizing, shallow depth of field, no text or watermark.`;
}
