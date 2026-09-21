"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CATALOG_BY_ID } from "@/lib/catalog";
import type { CartLine } from "@/lib/types";

export interface CartContextValue {
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, delta: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "lr.cart.v1";

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
  stockFor,
  pushToast,
}: {
  children: ReactNode;
  stockFor: (id: string) => number;
  pushToast: (message: string, action?: { href: string; label: string }) => void;
}) {
  const [cart, setCart] = useState<CartLine[]>([]);

  /* Hydrate from storage after mount so the server HTML stays deterministic. */
  /* eslint-disable react-hooks/set-state-in-effect -- deliberate post-mount hydration */
  useEffect(() => {
    setCart(readCart());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable — carry on in memory */
    }
  }, [cart]);

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      const product = CATALOG_BY_ID[id];
      if (!product) return;

      const limit = stockFor(id);
      if (limit <= 0) {
        pushToast(`${product.name} has sold out`);
        return;
      }

      const already = cart.find((line) => line.id === id)?.qty ?? 0;
      const next = Math.min(already + qty, limit);
      if (next === already) {
        pushToast(
          limit === 1
            ? `Only one ${product.name} is available`
            : `Only ${limit} of ${product.name} are available`,
        );
        return;
      }

      setCart((current) => {
        const existing = current.find((line) => line.id === id);
        if (existing) {
          return current.map((line) => (line.id === id ? { ...line, qty: next } : line));
        }
        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            qty: next,
          },
        ];
      });

      pushToast(`${product.name} added to your basket`, {
        href: "/checkout",
        label: "Checkout",
      });
    },
    [cart, pushToast, stockFor],
  );

  const setQty = useCallback(
    (id: string, delta: number) => {
      const limit = stockFor(id);
      if (delta > 0 && limit <= 0) {
        pushToast(`${CATALOG_BY_ID[id]?.name ?? "That tree"} has sold out`);
        return;
      }
      setCart((current) =>
        current
          .map((line) =>
            line.id === id
              ? { ...line, qty: Math.min(line.qty + delta, Math.max(limit, 0)) }
              : line,
          )
          .filter((line) => line.qty > 0),
      );
    },
    [pushToast, stockFor],
  );

  const removeLine = useCallback((id: string) => {
    setCart((current) => current.filter((line) => line.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo<CartContextValue>(() => {
    const cartCount = cart.reduce((total, line) => total + line.qty, 0);
    const cartTotal = cart.reduce((total, line) => total + line.price * line.qty, 0);
    return { cart, cartCount, cartTotal, addToCart, setQty, removeLine, clearCart };
  }, [cart, addToCart, setQty, removeLine, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
