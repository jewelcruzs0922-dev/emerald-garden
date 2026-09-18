"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark, IconClose } from "@/components/icons";
import { NAV_LINKS } from "@/components/Header";
import { useStore } from "@/lib/store";

export default function MobileNav() {
  const pathname = usePathname();
  const { panel, closePanels, openPanel } = useStore();
  const open = panel === "menu";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      className={`mobile-nav${open ? " is-open" : ""}`}
      id="mobile-nav"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Site menu"
    >
      <div className="mobile-nav__head">
        <Link className="brand" href="/" onClick={closePanels}>
          <span className="brand__mark">
            <BrandMark />
          </span>
          <span className="brand__text">
            <span className="brand__name">Emerald Garden</span>
            <span className="brand__tag">Bonsai for a Greener Tomorrow</span>
          </span>
        </Link>
        <button
          className="close-x"
          type="button"
          data-close
          onClick={closePanels}
          aria-label="Close menu"
        >
          <IconClose />
        </button>
      </div>

      <div className="mobile-nav__body">
        <nav className="mobile-nav__links" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closePanels}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
              <span>view</span>
            </Link>
          ))}
        </nav>

        <div className="mobile-nav__extra">
          <div className="mobile-nav__row">
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => openPanel("search")}
            >
              Search
            </button>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => openPanel("wishlist")}
            >
              Wishlist
            </button>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => openPanel("cart")}
            >
              Basket
            </button>
          </div>
          <p className="hand" style={{ fontSize: "1.2rem" }}>
            Grown slowly, shipped with care.
          </p>
        </div>
      </div>
    </div>
  );
}
