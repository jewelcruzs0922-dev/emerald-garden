import type { Metadata } from "next";
import Link from "next/link";
import { LeafGlyph } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const SUGGESTIONS = [
  { href: "/shop", label: "Shop the collection" },
  { href: "/care", label: "Read the care guide" },
  { href: "/journal", label: "Browse the journal" },
  { href: "/contact", label: "Ask us a question" },
];

export default function NotFound() {
  return (
    <main id="main">
      <section className="section page-head">
        <div className="wrap wrap--narrow" style={{ textAlign: "center" }}>
          <span className="eyebrow">Error 404</span>
          <h1 style={{ marginTop: ".6rem" }}>This branch doesn&apos;t exist.</h1>
          <p className="lede" style={{ marginInline: "auto", maxWidth: "34rem" }}>
            The page you were looking for has been repotted, renamed, or never
            grew here in the first place.
          </p>

          <LeafGlyph
            width={44}
            height={44}
            style={{ margin: "2rem auto", color: "var(--sage)" }}
          />

          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: ".6rem",
              justifyContent: "center",
            }}
          >
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link className="btn btn--ghost btn--sm" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p style={{ marginTop: "2rem" }}>
            <Link className="link-arw" href="/">
              Back to the home page <span className="arw">&rarr;</span>
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
