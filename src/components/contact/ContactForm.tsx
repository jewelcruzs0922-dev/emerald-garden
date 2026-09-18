"use client";

import { useState, type FormEvent } from "react";
import { IconLeafTiny } from "@/components/icons";

const TOPICS = [
  "A tree I already own",
  "Choosing my first bonsai",
  "An order or shipping",
  "Visit the workshop",
  "Wholesale or a gift",
  "Something else",
];

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "");
    const message = String(data.get("message") ?? "").trim();

    /* Validate locally first so the common case never needs a round trip. */
    const local: Errors = {};
    if (!name) local.name = "We would like to know who we are writing back to.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      local.email = "That email does not look quite right.";
    if (message.length < 10)
      local.message = "Tell us a little more — even one sentence helps.";

    setErrors(local);
    if (Object.keys(local).length > 0) {
      setStatus("error");
      setFeedback("Almost there — just a couple of small things above.");
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; errors?: Errors }
        | null;

      if (!response.ok || !result?.ok) {
        setErrors(result?.errors ?? {});
        setStatus("error");
        setFeedback(
          result?.message ?? "Something went wrong at our end. Please try again.",
        );
        const firstBad = form.querySelector<HTMLElement>(".field-error:not(:empty)");
        const field = firstBad?.closest(".field")?.querySelector<HTMLElement>(
          "input, textarea, select",
        );
        field?.focus();
        return;
      }

      setErrors({});
      setStatus("ok");
      setFeedback(result.message ?? "Thank you — we will be in touch.");
      form.reset();
    } catch {
      setStatus("error");
      setFeedback("We couldn't reach the server. Please try again.");
    }
  };

  const fieldError = (key: keyof Errors) => errors[key] ?? "";
  const busy = status === "sending";

  return (
    <>
      <h2>Send us a note</h2>
      <span className="hand">Fields marked with a leaf are the important ones.</span>

      <form data-contact-form onSubmit={onSubmit} noValidate>
        <div className="form-row">
          <div className="field">
            <label className="label" htmlFor="c-name">
              Your name <IconLeafTiny className="label-leaf" />
            </label>
            <input
              className="input"
              id="c-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={errors.name ? true : undefined}
            />
            <p className="field-error">{fieldError("name")}</p>
          </div>
          <div className="field">
            <label className="label" htmlFor="c-email">
              Email <IconLeafTiny className="label-leaf" />
            </label>
            <input
              className="input"
              id="c-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={errors.email ? true : undefined}
            />
            <p className="field-error">{fieldError("email")}</p>
          </div>
        </div>

        <div className="field" style={{ marginTop: "1.1rem" }}>
          <label className="label" htmlFor="c-topic">
            What&apos;s it about?
          </label>
          <select className="select" id="c-topic" name="topic">
            {TOPICS.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </div>

        <div className="field" style={{ marginTop: "1.1rem" }}>
          <label className="label" htmlFor="c-message">
            Your message <IconLeafTiny className="label-leaf" />
          </label>
          <textarea
            className="textarea"
            id="c-message"
            name="message"
            required
            placeholder="A photo description helps — where the tree sits, which window, how often you water…"
            aria-invalid={errors.message ? true : undefined}
          />
          <p className="field-error">{fieldError("message")}</p>
        </div>

        <button
          className="btn btn--block"
          type="submit"
          disabled={busy}
          style={{ marginTop: "1.4rem" }}
        >
          {busy ? "Sending…" : "Send message"} <span className="arw">&rarr;</span>
        </button>
        <p className="form-note">
          We&apos;ll only use your email to reply. No lists, no forwarding.
        </p>
        <p
          className={`newsletter__msg${status === "error" ? " is-error" : ""}`}
          data-contact-msg
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      </form>
    </>
  );
}
