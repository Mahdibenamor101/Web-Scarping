const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "") // strip accents (e.g. "Città" -> "citta")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Appends a short random suffix so two restaurants named the same don't collide. */
export function uniqueSlug(input: string): string {
  const base = slugify(input) || "resto";
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
