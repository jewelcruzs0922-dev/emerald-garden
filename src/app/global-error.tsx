"use client";

/**
 * Last-resort boundary for failures inside the root layout itself, so it has to
 * render its own document. Styles are inlined deliberately — the stylesheet may
 * be the thing that failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F4EFE4",
          color: "#2B2A20",
          fontFamily:
            "'Segoe UI', system-ui, -apple-system, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.8rem", margin: "0 0 .8rem" }}>
            Leaf &amp; Root couldn&apos;t start up
          </h1>
          <p style={{ lineHeight: 1.7, color: "#4C4A3B", margin: "0 0 1.6rem" }}>
            Something went wrong before the page could render. Reloading usually
            sorts it out.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: 0,
              borderRadius: 999,
              padding: ".85rem 1.6rem",
              background: "#2F4432",
              color: "#FBF8F0",
              fontSize: ".9rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload the page
          </button>
          {error.digest ? (
            <p style={{ marginTop: "1.4rem", fontSize: ".78rem", color: "#6E6B58" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
