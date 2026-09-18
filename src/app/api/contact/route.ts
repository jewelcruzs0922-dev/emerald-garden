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
  const name = clean(asString(body.name, 120));
  const email = clean(asString(body.email, 254));
  const topic = clean(asString(body.topic, 120)) || "General enquiry";
  const message = clean(asString(body.message, 4000));

  const errors: FieldErrors = {};
  if (!name) errors.name = "We would like to know who we are writing back to.";
  if (!email) errors.email = "We need an email address to reply to.";
  else if (!isEmail(email)) errors.email = "That email address looks incomplete.";
  if (message.length < 10) {
    errors.message = "Tell us a little more — even one sentence helps.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: "Almost there — please check the fields below.", errors },
      { status: 422 },
    );
  }

  const limit = rateLimit(clientKey(request, "contact"));
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: "We've had a few messages from you already — try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const result = await deliver({
    subject: `[Leaf & Root] ${topic} — ${name}`,
    replyTo: email,
    text: [
      `Topic: ${topic}`,
      `From: ${name} <${email}>`,
      "",
      message,
    ].join("\n"),
  });

  return NextResponse.json({
    ok: true,
    delivered: result.delivered,
    message: `Thank you, ${name.split(" ")[0]}. We will write back within a day.`,
  });
}
