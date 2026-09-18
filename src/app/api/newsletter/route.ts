import { NextResponse } from "next/server";
import { deliver } from "@/lib/mailer";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { asString, clean, isEmail, type FieldErrors } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn't read that request." },
      { status: 400 },
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const email = clean(asString(body.email, 254));

  const errors: FieldErrors = {};
  if (!email) errors.email = "We need an email address to write to.";
  else if (!isEmail(email)) errors.email = "That email address looks incomplete.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: "Please check the email address.", errors },
      { status: 422 },
    );
  }

  const limit = rateLimit(clientKey(request, "newsletter"));
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: "That's a lot of sign-ups — please try again in a minute.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const result = await deliver({
    subject: "New newsletter subscriber",
    replyTo: email,
    text: `A new subscriber joined the Green Note.\n\nEmail: ${email}`,
  });

  return NextResponse.json({
    ok: true,
    delivered: result.delivered,
    message: "Thank you — a little green note is on its way.",
  });
}
