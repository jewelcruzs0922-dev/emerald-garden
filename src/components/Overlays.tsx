"use client";

import { useEffect } from "react";
import CartDrawer from "@/components/overlays/CartDrawer";
import MobileNav from "@/components/overlays/MobileNav";
import SearchOverlay from "@/components/overlays/SearchOverlay";
import Toasts from "@/components/overlays/Toasts";
import WishlistDrawer from "@/components/overlays/WishlistDrawer";
import { useStore, type PanelName } from "@/lib/store";

const PANEL_IDS: Record<Exclude<PanelName, null>, string> = {
  cart: "cart-panel",
  wishlist: "wish-panel",
  search: "search-overlay",
  menu: "mobile-nav",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

/**
 * All of the site-wide off-canvas UI: the dimming scrim, the basket and
 * wishlist drawers, the search overlay and the toast stack.
 *
 * Also owns the keyboard contract for those overlays: while one is open the
 * rest of the page is `inert`, Tab is trapped inside the panel, and focus
 * returns to whatever opened it once it closes.
 */
export default function Overlays() {
  const { panel, closePanels, openPanel } = useStore();

  /* ⌘K / Ctrl-K and "/" open search. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        openPanel("search");
      } else if (event.key === "/" && !typing) {
        event.preventDefault();
        openPanel("search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPanel]);

  /* Modal behaviour: inert the page shell, trap Tab, restore focus on close. */
  useEffect(() => {
    const shell = document.getElementById("page-shell");
    const opener = document.activeElement as HTMLElement | null;

    if (!panel) {
      shell?.removeAttribute("inert");
      return;
    }

    shell?.setAttribute("inert", "");
    const container = document.getElementById(PANEL_IDS[panel]);
    if (!container) return;

    /* Wait for the slide-in before moving focus so the ring lands correctly. */
    const timer = window.setTimeout(() => {
      const items = focusableWithin(container);
      (items[0] ?? container).focus({ preventScroll: true });
    }, 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusableWithin(container);
      if (items.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!container.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus({ preventScroll: true });
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      shell?.removeAttribute("inert");
      if (opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [panel]);

  return (
    <>
      <div
        className={`scrim${panel ? " is-open" : ""}`}
        data-scrim
        onClick={closePanels}
        aria-hidden="true"
      />
      <MobileNav />
      <CartDrawer />
      <WishlistDrawer />
      <SearchOverlay />
      <Toasts />
    </>
  );
}
