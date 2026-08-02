import { ApiError } from "./api";

// Automatic menu translation, optional -- same "unset env = graceful
// degrade" pattern as Stripe/email/S3/OAuth: POST /api/menu/translate
// returns a clean 501 if DEEPL_API_KEY isn't set, dashboard UI shows a
// clear "non configuré" message instead of crashing. Never exercised
// against a real DeepL account in this environment.
//
// Four languages, not "70+": DeepL's free tier covers roughly thirty, and
// claiming a number this app has never actually driven that high would be
// the same kind of overclaim the rest of CONTEXT.md's honesty pattern
// exists to avoid. FR/DE/ES/PT cover the largest tourist-menu demand
// beyond IT/EN without pretending to more than what's been built.
export const LANGUAGE_OPTIONS = [
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]["code"];

export const LANGUAGE_CODES: readonly string[] = LANGUAGE_OPTIONS.map((l) => l.code);

export function isTranslationConfigured(): boolean {
  return Boolean(process.env.DEEPL_API_KEY);
}

// DeepL's free-tier keys are suffixed ":fx" and must hit the api-free host;
// paid keys hit the regular host. Same key drives both target languages of
// a translation run, so this is checked once per call, not per language.
function deeplApiUrl(): string {
  const key = process.env.DEEPL_API_KEY ?? "";
  return key.endsWith(":fx") ? "https://api-free.deepl.com/v2/translate" : "https://api.deepl.com/v2/translate";
}

/**
 * Translates a batch of strings to one target language in a single DeepL
 * call (one HTTP round trip per language per field, not per item) --
 * empty strings are sent through as-is rather than to the API, since
 * DeepL rejects empty `text` entries.
 */
export async function translateBatch(texts: string[], targetLang: LanguageCode): Promise<string[]> {
  if (!isTranslationConfigured()) {
    throw new ApiError(501, "translation_not_configured");
  }

  const nonEmpty = texts.map((t, i) => ({ i, t })).filter((e) => e.t.trim().length > 0);
  if (nonEmpty.length === 0) return texts;

  const params = new URLSearchParams();
  params.append("target_lang", targetLang.toUpperCase());
  for (const { t } of nonEmpty) params.append("text", t);

  const res = await fetch(deeplApiUrl(), {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!res.ok) {
    throw new Error(`deepl_translate_failed: ${res.status} ${await res.text()}`);
  }

  const body = (await res.json()) as { translations: { text: string }[] };
  const out = [...texts];
  nonEmpty.forEach((entry, idx) => {
    out[entry.i] = body.translations[idx]?.text ?? entry.t;
  });
  return out;
}
