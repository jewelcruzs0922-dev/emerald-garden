/**
 * Tiny in-memory fixed-window rate limiter.
 *
 * This is deliberately dependency-free and good enough to stop a bored visitor
 * hammering the form. It is per-process, so on a multi-instance deployment you
 * would swap this for Upstash/Redis — the call signature is the same so only
 * this file changes.
 */
const WINDOW_MS = 60_000;
const MAX_ENTRIES = 5_000;
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit = 5, windowMs = WINDOW_MS): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < windowMs);
  recent.push(now);

  /* Crude memory guard — a real store would expire keys instead. */
  if (hits.size > MAX_ENTRIES) hits.clear();
  hits.set(key, recent);

  const ok = recent.length <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - recent.length),
    retryAfterSeconds: ok ? 0 : Math.ceil((recent[0] + windowMs - now) / 1000),
  };
}

/** Best-effort client identity behind a proxy. */
export function clientKey(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}
