"use client";

import { useEffect, useRef, useState } from "react";

interface UseJustAddedOptions {
  /** Duration in ms before the "added" feedback resets. */
  duration?: number;
}

/**
 * Shared "just added to cart" feedback state used by ProductCard and
 * ProductBuyBox. Returns `justAdded` (boolean) and `markAdded` (call after
 * a successful addToCart).
 */
export function useJustAdded({ duration = 1400 }: UseJustAddedOptions = {}) {
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const markAdded = () => {
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), duration);
  };

  return { justAdded, markAdded };
}
