/**
 * Outbound mail for the two public forms.
 *
 * Set `RESEND_API_KEY` and `LEAF_AND_ROOT_INBOX` and submissions are delivered
 * by email. With no transport configured the submission is still validated,
 * accepted and written to the server log, and `delivered: false` is reported
 * back — nothing is silently swallowed, and the UI never claims a delivery
 * that did not happen.
 */
export interface MailMessage {
  subject: string;
  text: string;
  replyTo?: string;
  /** Defaults to the shop inbox; set this to send a customer receipt. */
  to?: string;
}

export interface DeliveryResult {
  delivered: boolean;
  reason?: string;
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 8000;

export function mailTransportConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAF_AND_ROOT_INBOX);
}

export async function deliver(message: MailMessage): Promise<DeliveryResult> {
  if (!mailTransportConfigured()) {
    console.info(
      "[leaf-and-root] mail transport not configured; logging instead\n" +
        `  to: ${message.to ?? process.env.LEAF_AND_ROOT_INBOX ?? "n/a"}\n` +
        `  subject: ${message.subject}\n` +
        `  reply-to: ${message.replyTo ?? "n/a"}\n` +
        message.text
          .split("\n")
          .map((line) => `  ${line}`)
          .join("\n"),
    );
    return { delivered: false, reason: "transport-not-configured" };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.LEAF_AND_ROOT_FROM ??
          "Leaf & Root <onboarding@resend.dev>",
        to: [message.to ?? (process.env.LEAF_AND_ROOT_INBOX as string)],
        subject: message.subject,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[leaf-and-root] mail provider responded ${response.status} ${detail.slice(0, 300)}`,
      );
      return { delivered: false, reason: `provider-${response.status}` };
    }
    return { delivered: true };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error("[leaf-and-root] mail delivery failed:", error);
    return { delivered: false, reason: aborted ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}
