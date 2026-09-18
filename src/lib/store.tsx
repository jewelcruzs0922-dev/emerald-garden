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

export type PanelName = "cart" | "wishlist" | "search" | "menu" | null;

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

interface StoreValue {
  cart: CartLine[];
  wishlist: string[];
  availability: Record<string, number>;
  panel: PanelName;
  ready: boolean;
  cartCount: number;
  cartTotal: number;
  toasts: Toast[];
  searchQuery: string;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, delta: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  stockFor: (id: string) => number;
  openPanel: (panel: PanelName) => void;
  closePanels: () => void;
  setSearchQuery: (query: string) => void;
  pushToast: (message: string, action?: Toast["action"]) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const STORAGE = {
  cart: "lr.cart.v1",
  wish: "lr.wishlist.v1",
} as const;

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [panel, setPanel] = useState<PanelName>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ready, setReady] = useState(false);
  const toastId = useRef(0);

  /* Hydrate from storage after mount so the server HTML stays deterministic.
     A lazy useState initialiser would run on the server too, where `window` is
     undefined, and then disagree with the client — a hydration mismatch. An
     effect is the correct place for this, despite what the rule assumes. */
  /* eslint-disable react-hooks/set-state-in-effect -- deliberate post-mount hydration */
  useEffect(() => {
    setCart(readStorage<CartLine[]>(STORAGE.cart, []));
    setWishlist(readStorage<string[]>(STORAGE.wish, []));
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* Availability is server-owned; the catalogue only knows the starting stock. */
  useEffect(() => {
    let cancelled = false;
    fetch("/api/inventory")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { ok?: boolean; availability?: Record<string, number> } | null) => {
        if (!cancelled && data?.availability) setAvailability(data.availability);
      })
      .catch(() => {
        /* Offline or blocked — fall back to catalogue stock below. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE.cart, JSON.stringify(cart));
    } catch {
      /* storage unavailable — carry on in memory */
    }
  }, [cart, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE.wish, JSON.stringify(wishlist));
    } catch {
      /* storage unavailable — carry on in memory */
    }
  }, [wishlist, ready]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, action?: Toast["action"]) => {
      const id = ++toastId.current;
      setToasts((current) => [...current, { id, message, action }]);
      window.setTimeout(() => dismissToast(id), 3400);
    },
    [dismissToast],
  );

  /** Live stock, falling back to the catalogue before the fetch resolves. */
  const stockFor = useCallback(
    (id: string) => {
      const fromServer = availability[id];
      if (typeof fromServer === "number") return fromServer;
      return CATALOG_BY_ID[id]?.stock ?? 0;
    },
    [availability],
  );

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

  const toggleWish = useCallback(
    (id: string) => {
      const product = CATALOG_BY_ID[id];
      if (!product) return;
      setWishlist((current) => {
        if (current.includes(id)) {
          pushToast(`${product.name} removed from your wishlist`);
          return current.filter((entry) => entry !== id);
        }
        pushToast(`${product.name} saved to your wishlist`);
        return [...current, id];
      });
    },
    [pushToast],
  );

  const openPanel = useCallback((next: PanelName) => {
    setPanel(next);
    if (typeof document !== "undefined") {
      document.body.classList.add("no-scroll");
    }
  }, []);

  const closePanels = useCallback(() => {
    setPanel(null);
    if (typeof document !== "undefined") {
      document.body.classList.remove("no-scroll");
    }
  }, []);

  /* Escape closes whatever is open, and we make sure the body scroll lock
     never sticks around after a route change. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanel(null);
        document.body.classList.remove("no-scroll");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const value = useMemo<StoreValue>(() => {
    const cartCount = cart.reduce((total, line) => total + line.qty, 0);
    const cartTotal = cart.reduce((total, line) => total + line.price * line.qty, 0);
    return {
      cart,
      wishlist,
      availability,
      panel,
      ready,
      cartCount,
      cartTotal,
      toasts,
      searchQuery,
      addToCart,
      setQty,
      removeLine,
      clearCart,
      toggleWish,
      isWished: (id: string) => wishlist.includes(id),
      stockFor,
      openPanel,
      closePanels,
      setSearchQuery,
      pushToast,
      dismissToast,
    };
  }, [
    cart,
    wishlist,
    availability,
    panel,
    ready,
    toasts,
    searchQuery,
    addToCart,
    setQty,
    removeLine,
    clearCart,
    toggleWish,
    stockFor,
    openPanel,
    closePanels,
    pushToast,
    dismissToast,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <StoreProvider>");
  return context;
}
