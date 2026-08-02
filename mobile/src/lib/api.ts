import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// The mobile app's only backend is the existing Next.js API (see
// src/app/api/** in the repo root) -- no separate mobile backend. Auth
// travels as `Authorization: Bearer <token>` rather than a cookie: React
// Native's fetch has no cookie jar wired to it the way a browser does, so
// the web app's httpOnly-cookie session (src/lib/session.ts) isn't usable
// here. The web login/signup/invite-accept routes now also return the raw
// JWT in the JSON body specifically for this -- getSession() on the
// server checks the Authorization header first, cookie second, so every
// existing route works for both clients unchanged.
const TOKEN_KEY = "mbqr_session_token";

export function apiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    throw new Error(
      "EXPO_PUBLIC_API_URL is not set -- copy mobile/.env.example to mobile/.env and point it at your running web app.",
    );
  }
  return url.replace(/\/$/, "");
}

// expo-secure-store's real (Keychain/Keystore-backed) implementation only
// exists on iOS/Android -- the only platforms this app actually ships to.
// Its web fallback isn't fully wired in this SDK version (confirmed by
// bundling for web as a quick local smoke test -- see mobile/README.md);
// localStorage is a fine stand-in there since web is a development
// convenience, never the shipped target.
const isWeb = Platform.OS === "web";

export async function getToken(): Promise<string | null> {
  if (isWeb) return typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (isWeb) {
    if (typeof localStorage !== "undefined") localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  if (isWeb) {
    if (typeof localStorage !== "undefined") localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Thin wrapper, not a generated client: this app talks to the same REST
 * routes the web dashboard does, so there's no separate API surface to
 * keep in sync -- a new web route is immediately callable from here with
 * the same path and shape.
 */
export async function apiFetch<T = unknown>(
  path: string,
  init: { method?: string; body?: unknown; skipAuth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (!init.skipAuth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${apiBaseUrl()}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => ({})) : undefined;

  if (!res.ok) {
    throw new ApiError(res.status, (body as { error?: string })?.error ?? `request_failed_${res.status}`);
  }

  return body as T;
}

/** Multipart upload (photos) -- separate from apiFetch since it can't set a JSON Content-Type. */
export async function apiUpload<T = unknown>(path: string, formData: FormData): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${apiBaseUrl()}${path}`, { method: "POST", headers, body: formData });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, (body as { error?: string })?.error ?? `request_failed_${res.status}`);
  }
  return body as T;
}
