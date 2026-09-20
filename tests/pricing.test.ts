import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  SHIPPING,
  describeShipping,
  isShippingRegion,
  priceCart,
  type CartInput,
} from "@/lib/commerce/pricing";
import { CATALOG_BY_ID, FREE_SHIPPING_THRESHOLD, formatPeso } from "@/lib/catalog";

const ficus = CATALOG_BY_ID["ficus-retusa"];
const fig = CATALOG_BY_ID["ficus-fig"];
const redPine = CATALOG_BY_ID["red-pine"];

describe("priceCart", () => {
  it("prices lines from the catalogue and ignores client-supplied prices", () => {
    const tampered = { id: ficus.id, qty: 2, price: 1 } as CartInput;
    const cart = priceCart([tampered]);

    assert.equal(cart.lines.length, 1);
    assert.equal(cart.lines[0].unitPrice, ficus.price);
    assert.equal(cart.lines[0].lineTotal, ficus.price * 2);
    assert.equal(cart.subtotal, ficus.price * 2);
  });

  it("removes items that are not in the catalogue", () => {
    const cart = priceCart([{ id: "ghost-tree", qty: 1 }]);

    assert.deepEqual(cart.lines, []);
    assert.equal(cart.issues.length, 1);
    assert.equal(cart.issues[0].code, "unknown");
    assert.equal(cart.total, 0);
  });

  it("rejects quantities below one", () => {
    for (const qty of [0, -3, Number.NaN, 0.4]) {
      const cart = priceCart([{ id: fig.id, qty }]);

      assert.deepEqual(cart.lines, [], `qty ${qty}`);
      assert.equal(cart.issues.length, 1, `qty ${qty}`);
      assert.equal(cart.issues[0].code, "unknown", `qty ${qty}`);
    }
  });

  it("floors fractional quantities", () => {
    const cart = priceCart([{ id: fig.id, qty: 2.9 }]);

    assert.equal(cart.lines[0].qty, 2);
    assert.equal(cart.itemCount, 2);
  });

  it("flags items that are sold out in the catalogue", () => {
    assert.ok(redPine.stock <= 0);

    const cart = priceCart([{ id: redPine.id, qty: 1 }]);

    assert.deepEqual(cart.lines, []);
    assert.equal(cart.issues[0].code, "sold-out");
    assert.equal(cart.shipping, 0);
    assert.equal(cart.total, 0);
  });

  it("honours a live availability map over catalogue stock", () => {
    const soldOut = priceCart([{ id: ficus.id, qty: 1 }], "metro", { [ficus.id]: 0 });
    assert.equal(soldOut.issues[0].code, "sold-out");

    const restocked = priceCart([{ id: redPine.id, qty: 1 }], "metro", {
      [redPine.id]: 2,
    });
    assert.equal(restocked.lines.length, 1);
    assert.equal(restocked.lines[0].qty, 1);
  });

  it("clamps to available stock and reports the shortfall", () => {
    const cart = priceCart([{ id: ficus.id, qty: 5 }], "metro", { [ficus.id]: 2 });

    assert.equal(cart.lines[0].qty, 2);
    assert.equal(cart.lines[0].lineTotal, ficus.price * 2);
    assert.equal(cart.issues[0].code, "insufficient-stock");
    assert.equal(cart.itemCount, 2);
  });

  it("totals items, subtotal and shipping", () => {
    const cart = priceCart([
      { id: fig.id, qty: 1 },
      { id: ficus.id, qty: 1 },
    ]);
    const subtotal = fig.price + ficus.price;

    assert.ok(subtotal < FREE_SHIPPING_THRESHOLD);
    assert.equal(cart.itemCount, 2);
    assert.equal(cart.subtotal, subtotal);
    assert.equal(cart.freeShipping, false);
    assert.equal(cart.shipping, SHIPPING.metro.flat);
    assert.equal(cart.total, subtotal + SHIPPING.metro.flat);
  });

  it("uses the provincial rate when asked", () => {
    const cart = priceCart([{ id: fig.id, qty: 1 }], "provincial");

    assert.equal(cart.shippingRegion, "provincial");
    assert.equal(cart.shipping, SHIPPING.provincial.flat);
  });

  it("gives free shipping at or above the threshold", () => {
    const qty = Math.ceil(FREE_SHIPPING_THRESHOLD / ficus.price);
    const subtotal = ficus.price * qty;
    assert.ok(subtotal >= FREE_SHIPPING_THRESHOLD);

    const cart = priceCart([{ id: ficus.id, qty }]);

    assert.equal(cart.freeShipping, true);
    assert.equal(cart.shipping, 0);
    assert.equal(cart.total, subtotal);
  });

  it("charges no shipping for an empty cart", () => {
    const cart = priceCart([]);

    assert.deepEqual(cart.lines, []);
    assert.equal(cart.subtotal, 0);
    assert.equal(cart.shipping, 0);
    assert.equal(cart.total, 0);
    assert.equal(cart.freeShipping, false);
  });
});

describe("describeShipping", () => {
  it("says Free when shipping is free", () => {
    const text = describeShipping({
      freeShipping: true,
      shippingRegion: "metro",
      subtotal: 9000,
    });

    assert.equal(text, "Free");
  });

  it("shows the rate and the gap to free shipping", () => {
    const subtotal = 2200;
    const text = describeShipping({
      freeShipping: false,
      shippingRegion: "metro",
      subtotal,
    });

    assert.equal(
      text,
      `${formatPeso(SHIPPING.metro.flat)} · add ` +
        `${formatPeso(FREE_SHIPPING_THRESHOLD - subtotal)} for free shipping`,
    );
  });
});

describe("isShippingRegion", () => {
  it("accepts the known regions", () => {
    assert.equal(isShippingRegion("metro"), true);
    assert.equal(isShippingRegion("provincial"), true);
  });

  it("rejects anything else", () => {
    for (const value of ["", "Metro", null, undefined, 0, {}]) {
      assert.equal(isShippingRegion(value), false, String(value));
    }
  });
});
