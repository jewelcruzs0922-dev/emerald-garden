"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* Hook your error reporter in here (Sentry, Axiom, …). */
    console.error("[leaf-and-root] route error:", error);
  }, [error]);

  return (
    <main id="main">
      <section className="section page-head">
        <div className="wrap wrap--narrow" style={{ textAlign: "center" }}>
          <span className="eyebrow">Something wilted</span>
          <h1 style={{ marginTop: ".6rem" }}>That didn&apos;t go to plan.</h1>
          <p className="lede" style={{ marginInline: "auto", maxWidth: "34rem" }}>
            An unexpected error stopped this page from loading. Nothing you did caused it,
            and your basket is still safely saved.
          </p>

          <div
            style={{
              display: "flex",
              gap: ".7rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "2rem",
            }}
          >
            <button className="btn" type="button" onClick={reset}>
              Try again
            </button>
            <Link className="btn btn--ghost" href="/">
              Back to the home page
            </Link>
          </div>

          {error.digest ? (
            <p className="small muted" style={{ marginTop: "1.6rem" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
