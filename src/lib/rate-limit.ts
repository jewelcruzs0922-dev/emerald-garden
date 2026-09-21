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

  /* Evict oldest entries instead of clearing everything —
     avoids resetting limits for all clients simultaneously. */
  if (hits.size > MAX_ENTRIES) {
    const cutoff = now - windowMs;
    for (const [k, timestamps] of hits) {
      const alive = timestamps.filter((t) => t > cutoff);
      if (alive.length === 0) hits.delete(k);
      else hits.set(k, alive);
    }
    /* If still over capacity after evicting expired entries, remove the
       oldest 10% of remaining keys. */
    if (hits.size > MAX_ENTRIES) {
      const entries = [...hits.entries()].sort((a, b) => a[1][0] - b[1][0]);
      const remove = Math.ceil(entries.length * 0.1);
      for (let i = 0; i < remove; i++) {
        hits.delete(entries[i][0]);
      }
    }
  }

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
