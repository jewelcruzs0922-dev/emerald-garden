/* ------------------------------------------------------------------
   Shared types used across the store contexts.
   ------------------------------------------------------------------ */

export interface CartLine {
  id: string;
  name: string;
  price: number;
  img: string;
  qty: number;
}

export interface Toast {
  id: number;
  message: string;
  action?: { href: string; label: string };
}

export type PanelName = "cart" | "wishlist" | "search" | "menu" | null;
