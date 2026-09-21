"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CATALOG_BY_ID } from "@/lib/catalog";

export interface WishlistContextValue {
  wishlist: string[];
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISH_KEY = "lr.wishlist.v1";

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISH_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({
  children,
  pushToast,
}: {
  children: ReactNode;
  pushToast: (message: string) => void;
}) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect -- deliberate post-mount hydration */
  useEffect(() => {
    setWishlist(readWishlist());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {
      /* storage unavailable — carry on in memory */
    }
  }, [wishlist]);

  const toggleWish = useCallback(
    (id: string) => {
      const product = CATALOG_BY_ID[id];
      if (!product) return;
      setWishlist((current) => {
        if (current.includes(id)) {
          return current.filter((entry) => entry !== id);
        }
        return [...current, id];
      });
      // Toast is triggered after the state update, not inside it
      const isIn = wishlist.includes(id);
      pushToast(
        isIn
          ? `${product.name} removed from your wishlist`
          : `${product.name} saved to your wishlist`,
      );
    },
    [pushToast, wishlist],
  );

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const value = useMemo<WishlistContextValue>(
    () => ({ wishlist, toggleWish, isWished }),
    [wishlist, toggleWish, isWished],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return context;
}
