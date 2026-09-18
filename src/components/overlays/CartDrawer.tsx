"use client";

import Image from "next/image";
import Link from "next/link";
import { IconClose, LeafGlyph } from "@/components/icons";
import { formatPeso } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export default function CartDrawer() {
  const { panel, cart, cartTotal, setQty, removeLine, closePanels } = useStore();
  const open = panel === "cart";
  const empty = cart.length === 0;

  return (
    <aside
      className={`panel${open ? " is-open" : ""}`}
      id="cart-panel"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Shopping basket"
    >
      <div className="panel__head">
        <h2 className="panel__title">Your Basket</h2>
        <button
          className="close-x"
          type="button"
          data-close
          onClick={closePanels}
          aria-label="Close basket"
        >
          <IconClose />
        </button>
      </div>

      <div className="panel__body">
        {empty ? (
          <div className="panel-empty">
            <LeafGlyph width={18} height={18} />
            <p className="hand" style={{ fontSize: "1.35rem" }}>
              Your basket is empty.
            </p>
            <p className="small">Every tree is looking for a windowsill.</p>
            <p style={{ marginTop: "1.2rem" }}>
              <Link
                className="btn btn--ghost btn--sm"
                href="/shop"
                onClick={closePanels}
              >
                Browse the collection
              </Link>
            </p>
          </div>
        ) : (
          cart.map((line) => (
            <div className="cart-line" key={line.id}>
              <Image
                className="cart-line__img"
                src={`/img/${line.img}`}
                alt=""
                width={68}
                height={68}
              />
              <div>
                <p className="cart-line__name">{line.name}</p>
                <p className="cart-line__meta">{formatPeso(line.price)} each</p>
                <div className="qty">
                  <button
                    type="button"
                    onClick={() => setQty(line.id, -1)}
                    aria-label={`Decrease quantity of ${line.name}`}
                  >
                    &minus;
                  </button>
                  <span>{line.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(line.id, 1)}
                    aria-label={`Increase quantity of ${line.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <p className="cart-line__price">
                  {formatPeso(line.price * line.qty)}
                </p>
                <button
                  type="button"
                  className="cart-line__remove"
                  onClick={() => removeLine(line.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="panel__foot" style={empty ? { display: "none" } : undefined}>
        <div className="sum-row">
          <span>Subtotal</span>
          <span data-cart-subtotal>{formatPeso(cartTotal)}</span>
        </div>
        <div className="sum-row">
          <span className="muted">Shipping</span>
          <span className="muted">Calculated at checkout</span>
        </div>
        <div className="sum-row sum-row--total">
          <span>Total</span>
          <span data-cart-total>{formatPeso(cartTotal)}</span>
        </div>
        <Link
          className="btn btn--block"
          href="/checkout"
          onClick={closePanels}
          style={{ marginTop: "1.1rem" }}
        >
          Checkout <span className="arw">&rarr;</span>
        </Link>
        <p className="note">Packed with patience. Live plants ship Mon&ndash;Wed.</p>
      </div>
    </aside>
  );
}
