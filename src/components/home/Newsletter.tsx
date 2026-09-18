"use client";

import { useState, type FormEvent } from "react";
import { LeafGlyph } from "@/components/icons";

/** Painted countryside panorama that closes the home page. */
function LandscapeScene() {
  return (
    <svg
      className="newsletter__landscape"
      viewBox="0 0 1440 190"
      preserveAspectRatio="none"
      role="img"
      aria-label="An illustrated countryside of fields, trees and a small house"
    >
      <defs>
        <linearGradient id="lr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2EBD9" />
          <stop offset="100%" stopColor="#E4DDC4" />
        </linearGradient>
        <linearGradient id="lr-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C6CFB0" />
          <stop offset="100%" stopColor="#AEBB95" />
        </linearGradient>
        <linearGradient id="lr-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93A47A" />
          <stop offset="100%" stopColor="#7C8F63" />
        </linearGradient>
        <linearGradient id="lr-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C7F52" />
          <stop offset="100%" stopColor="#5A6C44" />
        </linearGradient>
        <linearGradient id="lr-fore" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4C5C38" />
          <stop offset="100%" stopColor="#3B4A2C" />
        </linearGradient>
      </defs>

      <rect width="1440" height="190" fill="url(#lr-sky)" />

      <g fill="#FFFFFF" opacity=".45">
        <path d="M150 40c8-14 26-16 34-6 10-10 30-8 34 6 12-2 20 6 18 14H138c-4-8 2-14 12-14z" />
        <path d="M1180 30c7-12 22-14 29-5 9-9 26-7 30 5 10-2 17 5 15 12h-84c-3-7 2-12 10-12z" />
      </g>

      <path
        d="M0 96c120-26 210-40 320-28 96 10 150 34 240 30 104-5 168-40 280-40 118 0 190 34 300 40 116 6 200-22 300-34v126H0z"
        fill="url(#lr-far)"
      />

      <g fill="#7D8E66">
        <path d="M232 92c0-10 7-17 16-17s16 7 16 17c0 8-6 14-16 14s-16-6-16-14z" />
        <path d="M282 96c0-8 6-14 13-14s13 6 13 14c0 6-5 11-13 11s-13-5-13-11z" />
        <path d="M742 84c0-11 8-19 18-19s18 8 18 19c0 9-7 16-18 16s-18-7-18-16z" />
        <path d="M806 90c0-8 6-14 13-14s13 6 13 14c0 6-5 11-13 11s-13-5-13-11z" />
      </g>

      <path
        d="M0 130c130-18 240 6 360-4 130-11 200-28 330-22 128 6 196 30 320 24 130-6 210-26 430-12v74H0z"
        fill="url(#lr-mid)"
      />

      <g stroke="#6F8157" strokeWidth="1.2" opacity=".55">
        <path d="M0 146c150-14 280 4 430-4M0 158c170-12 300 6 470-4" fill="none" />
        <path d="M980 146c140 10 260-6 460-2M960 158c150 10 300-8 480 0" fill="none" />
      </g>

      <path
        d="M0 158c150-14 280 6 440-2 140-7 260-16 400-8 140 8 260 22 400 14 70-4 140-10 200-14v42H0z"
        fill="url(#lr-near)"
      />

      <g>
        <path d="M1012 118h84v46h-84z" fill="#EADFC6" />
        <path d="M1000 120l54-30 54 30z" fill="#B4553A" />
        <path d="M1000 120h108" stroke="#8F4029" strokeWidth="2" />
        <rect x="1092" y="86" width="9" height="18" fill="#9A6448" />
        <rect x="1032" y="132" width="20" height="32" fill="#7C6446" />
        <rect x="1064" y="132" width="16" height="15" fill="#8FA7B4" />
        <path d="M1072 132v15M1064 139.5h16" stroke="#EADFC6" strokeWidth="1.6" />
      </g>

      <g>
        <g fill="#465733">
          <path d="M300 190v-34" stroke="#465733" strokeWidth="4" />
          <path d="M300 158c-22 0-38-16-38-36 0-19 16-34 38-34s38 15 38 34c0 20-16 36-38 36z" />
        </g>
        <g fill="#52633C">
          <path d="M420 190v-24" stroke="#52633C" strokeWidth="3" />
          <path d="M420 168c-16 0-27-11-27-25s11-24 27-24 27 10 27 24-11 25-27 25z" />
        </g>
        <g fill="#3F4E2D">
          <path d="M1120 190v-30" stroke="#3F4E2D" strokeWidth="4" />
          <path d="M1120 162c-19 0-33-14-33-31s14-30 33-30 33 13 33 30-14 31-33 31z" />
        </g>
      </g>

      <path
        d="M0 174c180-10 320 8 500 2 180-7 320-14 500-4 130 7 300 12 440 4v14H0z"
        fill="url(#lr-fore)"
      />

      <g stroke="#3F4E2D" strokeWidth="1.6" strokeLinecap="round" opacity=".8">
        <path d="M120 190v-12M128 190v-9M112 190v-8M620 190v-11M628 190v-8M1340 190v-12M1348 190v-9" />
      </g>

      <path
        d="M690 190c14-14 34-20 66-22 40-2 60 6 96 2"
        stroke="#C9BC97"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        opacity=".85"
      />
    </svg>
  );
}

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
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

      <LandscapeScene />
    </section>
  );
}
