import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowSquiggle } from "@/components/icons";

interface PageHeadProps {
  /** Label for the final breadcrumb, e.g. "Shop". */
  crumb: string;
  title: ReactNode;
  lede: string;
  /** Handwritten annotation that sits in the right-hand column. */
  anno: string;
  /** Optional decorative sketch. */
  children?: ReactNode;
}

export default function PageHead({
  crumb,
  title,
  lede,
  anno,
  children,
}: PageHeadProps) {
  return (
    <section className="page-head">
      <div className="wrap">
        <div className="page-head__grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>{crumb}</span>
            </nav>
            <h1>{title}</h1>
            <p className="lede">{lede}</p>
          </div>
          <div className="page-head__aside">
            <span className="anno">
              {anno}
              <ArrowSquiggle />
            </span>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
