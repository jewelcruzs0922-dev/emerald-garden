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
import type { PanelName } from "@/lib/types";

export interface UIContextValue {
  panel: PanelName;
  availability: Record<string, number>;
  ready: boolean;
  searchQuery: string;
  stockFor: (id: string) => number;
  openPanel: (panel: PanelName) => void;
  closePanels: () => void;
  setSearchQuery: (query: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<PanelName>(null);
  const [availability, setAvailability] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [ready, setReady] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- deliberate post-mount hydration */
  useEffect(() => {
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

  const stockFor = useCallback(
    (id: string) => {
      const fromServer = availability[id];
      if (typeof fromServer === "number") return fromServer;
      return CATALOG_BY_ID[id]?.stock ?? 0;
    },
    [availability],
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

  const value = useMemo<UIContextValue>(
    () => ({
      panel,
      availability,
      ready,
      searchQuery,
      stockFor,
      openPanel,
      closePanels,
      setSearchQuery,
    }),
    [panel, availability, ready, searchQuery, stockFor, openPanel, closePanels],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used inside <UIProvider>");
  return context;
}
