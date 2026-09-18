"use client";

import Image from "next/image";
import { IconClose, IconHeart } from "@/components/icons";
import { CATALOG_BY_ID, formatPeso } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export default function WishlistDrawer() {
  const { panel, wishlist, toggleWish, addToCart, closePanels } = useStore();
  const open = panel === "wishlist";
  const items = wishlist.map((id) => CATALOG_BY_ID[id]).filter(Boolean);

  return (
    <aside
      className={`panel${open ? " is-open" : ""}`}
      id="wish-panel"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Wishlist"
    >
      <div className="panel__head">
        <h2 className="panel__title">Your Wishlist</h2>
        <button
          className="close-x"
          type="button"
          data-close
          onClick={closePanels}
          aria-label="Close wishlist"
        >
          <IconClose />
        </button>
      </div>

      <div className="panel__body">
        {items.length === 0 ? (
          <div className="panel-empty">
            <IconHeart width={18} height={18} />
            <p className="hand" style={{ fontSize: "1.35rem" }}>
              Nothing saved yet.
            </p>
            <p className="small">Tap the heart on a tree to keep it here.</p>
          </div>
        ) : (
          items.map((product) => (
            <div className="cart-line" key={product.id}>
              <Image
                className="cart-line__img"
                src={`/img/${product.img}`}
                alt=""
                width={68}
                height={68}
              />
              <div>
                <p className="cart-line__name">{product.name}</p>
                <p className="cart-line__meta">{product.env}</p>
                <button
                  type="button"
                  className="add-mini"
                  style={{ marginTop: ".55rem" }}
                  onClick={() => addToCart(product.id)}
                >
                  Add to basket
                </button>
              </div>
              <div>
                <p className="cart-line__price">{formatPeso(product.price)}</p>
                <button
                  type="button"
                  className="cart-line__remove"
                  onClick={() => toggleWish(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
