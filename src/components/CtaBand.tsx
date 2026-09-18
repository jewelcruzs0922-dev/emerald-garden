import Link from "next/link";
import type { ReactNode } from "react";

interface CtaBandProps {
  heading: ReactNode;
  note: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
}

export default function CtaBand({
  heading,
  note,
  primary,
  secondary,
}: CtaBandProps) {
  return (
    <section className="section cta-band rip rip--top">
      <div className="wrap">
        <div className="cta-band__inner">
          <div className="reveal">
            <h2>{heading}</h2>
            <span className="hand">{note}</span>
          </div>
          <div className="cta-band__actions reveal">
            <Link className="btn" href={primary.href}>
              {primary.label} <span className="arw">&rarr;</span>
            </Link>
            <Link className="btn btn--ghost" href={secondary.href}>
              {secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
