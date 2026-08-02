import { describe, expect, it } from "vitest";
import { rateLimit, getClientIp } from "../src/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to the limit, then blocks with a retry-after", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit(key, { limit: 3, windowMs: 60_000 })).toEqual({ allowed: true });
    }
    const blocked = rateLimit(key, { limit: 3, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("keys are independent -- hitting the limit on one key doesn't affect another", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    rateLimit(keyA, { limit: 1, windowMs: 60_000 });
    expect(rateLimit(keyA, { limit: 1, windowMs: 60_000 }).allowed).toBe(false);
    expect(rateLimit(keyB, { limit: 1, windowMs: 60_000 }).allowed).toBe(true);
  });

  it("resets after the window elapses", async () => {
    const key = `test-window-${Math.random()}`;
    expect(rateLimit(key, { limit: 1, windowMs: 50 }).allowed).toBe(true);
    expect(rateLimit(key, { limit: 1, windowMs: 50 }).allowed).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(rateLimit(key, { limit: 1, windowMs: 50 }).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prefers X-Forwarded-For, taking the first hop", () => {
    const req = new Request("http://localhost/", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("203.0.113.5");
  });

  it("falls back to X-Real-IP", () => {
    const req = new Request("http://localhost/", { headers: { "x-real-ip": "203.0.113.9" } });
    expect(getClientIp(req)).toBe("203.0.113.9");
  });

  it("falls back to 'unknown' with no proxy headers", () => {
    const req = new Request("http://localhost/");
    expect(getClientIp(req)).toBe("unknown");
  });
});
