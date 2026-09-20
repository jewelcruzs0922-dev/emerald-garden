"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconBasket,
  IconHeart,
  IconMenu,
  IconSearch,
} from "@/components/icons";
import Brand from "@/components/Brand";
import { useStore } from "@/lib/store";
import { NAV_LINKS } from "@/lib/seo";

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, ready, openPanel } = useStore();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`site-header${stuck ? " is-stuck" : ""}`}>
      <div className="wrap header-inner">
        <Brand />

        <nav className="main-nav" aria-label="Primary">
          <ul>
            <li>
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
                Home
              </Link>
            </li>
            {NAV_LINKS.slice(1).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            className="icon-btn"
            type="button"
            data-open-search
            onClick={() => openPanel("search")}
            aria-label="Search"
          >
            <IconSearch />
          </button>
          <button
            className="icon-btn"
            type="button"
            data-open-wishlist
            onClick={() => openPanel("wishlist")}
            aria-label="Wishlist"
          >
            <IconHeart />
            <span
              className={`icon-btn__badge${ready && wishlist.length ? " is-on" : ""}`}
              data-wish-count
            >
              {ready ? wishlist.length : 0}
            </span>
          </button>
          <button
            className="icon-btn"
            type="button"
            data-open-cart
            onClick={() => openPanel("cart")}
            aria-label="Shopping basket"
          >
            <IconBasket />
            <span
              className={`icon-btn__badge${ready && cartCount ? " is-on" : ""}`}
              data-cart-count
            >
              {ready ? cartCount : 0}
            </span>
          </button>
          <button
            className="icon-btn menu-btn"
            type="button"
            data-open-menu
            onClick={() => openPanel("menu")}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
        </div>
      </div>
    </header>
  );
}
