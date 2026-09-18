"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconBasket, IconCheck, IconHeart } from "@/components/icons";
import {
  FREE_SHIPPING_THRESHOLD,
  formatPeso,
  type Product,
} from "@/lib/catalog";
import { useStore } from "@/lib/store";

export default function ProductBuyBox({ product }: { product: Product }) {
  const { addToCart, toggleWish, isWished, ready, stockFor } = useStore();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const stock = ready ? stockFor(product.id) : product.stock;
  const soldOut = stock <= 0;
  const max = Math.max(1, stock);
  const saved = ready && isWished(product.id);

  /* Keep the stepper honest if availability drops while the page is open. */
  useEffect(() => {
    setQty((current) => Math.min(Math.max(1, current), max));
  }, [max]);

  const onAdd = () => {
    addToCart(product.id, qty);
    if (soldOut) return;
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 1800);
  };

  const shortfall = FREE_SHIPPING_THRESHOLD - product.price * qty;

  return (
    <div className="buy" data-buy-box data-stock={stock}>
      <div className="buy__price-row">
        <span className="buy__price">{formatPeso(product.price)}</span>
        <span className="buy__env">{product.env}</span>
      </div>

      <p className="buy__stock" data-buy-stock>
        {soldOut ? (
          <span className="buy__stock--out">Sold out — waitlist open</span>
        ) : stock === 1 ? (
          <span className="buy__stock--low">One only — this is a single tree</span>
        ) : (
          <span className="buy__stock--in">{stock} available</span>
        )}
      </p>

      <div className="buy__actions">
        <div className="buy__qty" aria-label="Quantity">
          <button
            type="button"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            disabled={soldOut || qty <= 1}
            aria-label="Decrease quantity"
          >
            &minus;
          </button>
          <span data-buy-qty aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((value) => Math.min(max, value + 1))}
            disabled={soldOut || qty >= max}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          className={`btn buy__add${justAdded ? " is-added" : ""}`}
          type="button"
          onClick={onAdd}
          disabled={soldOut}
          data-buy-add
        >
          {justAdded ? (
            <>
              <IconCheck width={17} height={17} /> Added
            </>
          ) : soldOut ? (
            "Sold out"
          ) : (
            <>
              <IconBasket width={17} height={17} /> Add to basket
            </>
          )}
        </button>
      </div>

      <button
        className={`buy__wish${saved ? " is-on" : ""}`}
        type="button"
        onClick={() => toggleWish(product.id)}
        aria-pressed={saved}
        data-buy-wish
      >
        <IconHeart width={16} height={16} />
        {saved ? "Saved to your wishlist" : "Save to wishlist"}
      </button>

      <ul className="buy__assurances">
        <li>
          {shortfall > 0 && !soldOut ? (
            <>
              Add {formatPeso(shortfall)} more for free shipping.
            </>
          ) : (
            <>Free shipping on this order.</>
          )}
        </li>
        <li>Ships Monday to Wednesday so nothing waits in a depot.</li>
        <li>
          Live arrival guarantee — a photo within 24 hours and we replace it.{" "}
          <Link href="/care#shipping">Shipping &amp; returns</Link>
        </li>
      </ul>
    </div>
  );
}
