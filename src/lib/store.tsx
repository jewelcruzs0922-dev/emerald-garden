"use client";

import { useMemo, type ReactNode } from "react";
import { CartProvider, useCart, type CartContextValue } from "@/lib/cart-context";
import {
  WishlistProvider,
  useWishlist,
  type WishlistContextValue,
} from "@/lib/wishlist-context";
import { ToastProvider, useToast, type ToastContextValue } from "@/lib/toast-context";
import { UIProvider, useUI, type UIContextValue } from "@/lib/ui-context";

/* ------------------------------------------------------------------
   Re-export types so existing imports still work.
   ------------------------------------------------------------------ */
export type { CartLine, Toast, PanelName } from "@/lib/types";

/* ------------------------------------------------------------------
   Composed hook — reads from the individual providers and returns
   the same shape the old god-context used. Components that already
   call `useStore()` keep working without changes.
   ------------------------------------------------------------------ */
export interface StoreValue {
  cart: CartContextValue["cart"];
  wishlist: WishlistContextValue["wishlist"];
  availability: UIContextValue["availability"];
  panel: UIContextValue["panel"];
  ready: UIContextValue["ready"];
  cartCount: CartContextValue["cartCount"];
  cartTotal: CartContextValue["cartTotal"];
  toasts: ToastContextValue["toasts"];
  searchQuery: UIContextValue["searchQuery"];
  addToCart: CartContextValue["addToCart"];
  setQty: CartContextValue["setQty"];
  removeLine: CartContextValue["removeLine"];
  clearCart: CartContextValue["clearCart"];
  toggleWish: WishlistContextValue["toggleWish"];
  isWished: WishlistContextValue["isWished"];
  stockFor: UIContextValue["stockFor"];
  openPanel: UIContextValue["openPanel"];
  closePanels: UIContextValue["closePanels"];
  setSearchQuery: UIContextValue["setSearchQuery"];
  pushToast: ToastContextValue["pushToast"];
  dismissToast: ToastContextValue["dismissToast"];
}

/**
 * Composed provider — nests the focused providers in the correct order
 * so child providers can access parent contexts.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <UIProvider>
        <ComposedInner>{children}</ComposedInner>
      </UIProvider>
    </ToastProvider>
  );
}

function ComposedInner({ children }: { children: ReactNode }) {
  const { pushToast } = useToast();
  const { stockFor } = useUI();

  return (
    <CartProvider stockFor={stockFor} pushToast={pushToast}>
      <WishlistProvider pushToast={pushToast}>{children}</WishlistProvider>
    </CartProvider>
  );
}

/**
 * Drop-in replacement for the old single-context `useStore()`.
 * Composes values from the focused sub-contexts.
 */
export function useStore(): StoreValue {
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();
  const ui = useUI();

  return useMemo<StoreValue>(
    () => ({
      cart: cart.cart,
      wishlist: wishlist.wishlist,
      availability: ui.availability,
      panel: ui.panel,
      ready: ui.ready,
      cartCount: cart.cartCount,
      cartTotal: cart.cartTotal,
      toasts: toast.toasts,
      searchQuery: ui.searchQuery,
      addToCart: cart.addToCart,
      setQty: cart.setQty,
      removeLine: cart.removeLine,
      clearCart: cart.clearCart,
      toggleWish: wishlist.toggleWish,
      isWished: wishlist.isWished,
      stockFor: ui.stockFor,
      openPanel: ui.openPanel,
      closePanels: ui.closePanels,
      setSearchQuery: ui.setSearchQuery,
      pushToast: toast.pushToast,
      dismissToast: toast.dismissToast,
    }),
    [cart, wishlist, toast, ui],
  );
}
