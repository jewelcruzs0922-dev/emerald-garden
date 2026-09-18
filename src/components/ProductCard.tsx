"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconBasket, IconHeart } from "@/components/icons";
import { formatPeso, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  /** Show the one-line description (catalogue pages). */
  showNote?: boolean;
  /** Extra classes for the card element itself (keeps grid `nth-child` intact). */
  className?: string;
}

export default function ProductCard({
  product,
  showNote = false,
  className = "",
}: ProductCardProps) {
  const { addToCart, toggleWish, isWished, ready, stockFor } = useStore();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* Catalogue stock until the live figure arrives, so the first paint is sane. */
  const stock = ready ? stockFor(product.id) : product.stock;
  const soldOut = stock <= 0;

  const onAdd = () => {
    addToCart(product.id);
    if (soldOut) return;
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <article
      className={`product ${className}${soldOut ? " is-sold-out" : ""}`.trim()}
      data-product-id={product.id}
    >
      <button
        className={`wish-btn${ready && isWished(product.id) ? " is-on" : ""}`}
        type="button"
        data-wish={product.id}
        onClick={() => toggleWish(product.id)}
        aria-pressed={ready && isWished(product.id)}
        aria-label={`Save ${product.name} to wishlist`}
      >
        <IconHeart width={17} height={17} />
      </button>

      <div className="product__media">
        <div className="product__img">
          <Image
            src={`/img/${product.img}`}
            alt={`${product.name} bonsai`}
            fill
            sizes="(max-width: 400px) 92vw, (max-width: 720px) 46vw, (max-width: 1080px) 44vw, 260px"
          />
          {soldOut ? <span className="product__sold">Sold out</span> : null}
        </div>
      </div>

      <div className="product__meta">
        <p className="product__env">{product.env}</p>
        <h3 className="product__name">
          <Link
            className="product__link"
            href={`/shop/${product.id}`}
            aria-label={`View ${product.name}`}
          />
          {product.name}
        </h3>
        {showNote ? (
          <p className="small muted" style={{ marginTop: ".35rem" }}>
            {product.note}
          </p>
        ) : null}
        <div className="product__bot">
          <span className="product__price">{formatPeso(product.price)}</span>
          <span className="product__actions">
            {!soldOut && stock <= 2 ? (
              <span className="product__stock">
                {stock === 1 ? "Last one" : `${stock} left`}
              </span>
            ) : null}
            <button
              className={`add-mini${justAdded ? " is-added" : ""}`}
              type="button"
              data-add={product.id}
              onClick={onAdd}
              disabled={soldOut}
              aria-label={
                soldOut ? `${product.name} has sold out` : `Add ${product.name} to basket`
              }
            >
              <IconBasket width={17} height={17} />
            </button>
          </span>
        </div>
      </div>
    </article>
  );
}
