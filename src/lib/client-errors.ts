/** Turns a failed fetch Response into a message worth showing a user. */
export async function friendlyErrorMessage(res: Response, fallback: string): Promise<string> {
  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After");
    return retryAfter
      ? `Trop de tentatives, réessayez dans ${retryAfter} secondes.`
      : "Trop de tentatives, réessayez plus tard.";
  }
  const body = await res.json().catch(() => ({}));
  return body.error ?? fallback;
}
