/**
 * CSRF token generation and validation using the Double Submit Cookie pattern.
 *
 * The token is generated server-side, stored in a signed cookie, and also
 * returned to the client. The client sends it back in a header on POST.
 * The server compares the header value against the cookie value.
 *
 * This is safe because an attacker on a different origin cannot read cookies
 * or set custom headers on cross-origin requests (Simple requests won't send
 * custom headers, and Preflighted requests are blocked by CORS).
 */

import { cookies } from "next/headers";
import { createHmac, randomBytes } from "crypto";

const COOKIE_NAME = "emerald.csrf";
const HEADER_NAME = "x-csrf-token";
const SECRET = process.env.CSRF_SECRET ?? "emerald-garden-csrf-fallback-key";

function sign(token: string, ts: number): string {
  const payload = `${ts}:${token}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}:${sig}`;
}

function unsign(signed: string): { token: string; ts: number } | null {
  const parts = signed.split(":");
  if (parts.length !== 3) return null;
  const [tsStr, token, sig] = parts;
  const ts = Number(tsStr);
  if (!ts || !token || !sig) return null;

  const expected = createHmac("sha256", SECRET).update(`${tsStr}:${token}`).digest("hex");
  if (sig !== expected) return null;

  // Token expires after 1 hour
  if (Date.now() - ts > 3_600_000) return null;

  return { token, ts };
}

/** Generate a new CSRF token and set it as a cookie. Returns the raw token. */
export async function generateCsrfToken(): Promise<string> {
  const raw = randomBytes(32).toString("hex");
  const ts = Date.now();
  const signed = sign(raw, ts);

  const store = await cookies();
  store.set(COOKIE_NAME, signed, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 3600,
  });

  return raw;
}

/** Validate the CSRF token from the request header against the cookie. */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  const store = await cookies();
  const signed = store.get(COOKIE_NAME)?.value;
  if (!signed) return false;

  const decoded = unsign(signed);
  if (!decoded) return false;

  const headerToken = request.headers.get(HEADER_NAME);
  if (!headerToken) return false;

  // Constant-time comparison
  if (headerToken.length !== decoded.token.length) return false;
  let diff = 0;
  for (let i = 0; i < headerToken.length; i++) {
    diff |= headerToken.charCodeAt(i) ^ decoded.token.charCodeAt(i);
  }
  return diff === 0;
}
