"use client";

import { useState, type FormEvent } from "react";
import { LeafGlyph } from "@/components/icons";
import { isEmail } from "@/lib/validation";

type Status = "idle" | "sending" | "ok" | "error";

export default function Newsletter() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement | null;
    const value = input?.value.trim() ?? "";

    if (!isEmail(value)) {
      setStatus("error");
      setMessage("Hmm, that email looks a little wilted. Try again?");
      input?.focus();
      return;
    }

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        errors?: Record<string, string>;
      } | null;

      if (!response.ok || !data?.ok) {
        setStatus("error");
        setMessage(
          data?.errors?.email ??
            data?.message ??
            "Something went wrong at our end. Please try again.",
        );
        return;
      }

      setStatus("ok");
      setMessage(data.message ?? "Thank you — you're on the list.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again.");
    }
  };

  return (
    <section className="section newsletter" id="newsletter">
      <div className="wrap">
        <div className="newsletter__inner">
          <div className="reveal">
            <h2>
              Let&apos;s Grow
              <br />
              Something Beautiful
              <LeafGlyph />
            </h2>
          </div>

          <p className="newsletter__sub reveal">
            Get updates on new arrivals, care tips, and special offers.
          </p>

          <div className="reveal">
            <form
              className="newsletter__form"
              data-newsletter
              onSubmit={onSubmit}
              noValidate
            >
              <label className="sr-only" htmlFor="news-email">
                Your email address
              </label>
              <span className="newsletter__field">
                <input
                  id="news-email"
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  autoComplete="email"
                  required
                  aria-invalid={status === "error" ? true : undefined}
                />
              </span>
              <button className="btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Subscribe"}
              </button>
            </form>
            <p
              className={`newsletter__msg${status === "error" ? " is-error" : ""}`}
              data-newsletter-msg
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
