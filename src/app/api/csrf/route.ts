import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Returns a fresh CSRF token for the client to include in POST requests. */
export async function GET() {
  const token = await generateCsrfToken();
  return NextResponse.json({ ok: true, token });
}
