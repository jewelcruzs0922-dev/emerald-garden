import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  StockError,
  availableFor,
  availableMap,
  releaseStock,
  reserveStock,
  soldMap,
} from "@/lib/commerce/inventory";
import { CATALOG, CATALOG_BY_ID } from "@/lib/catalog";

/* Keep the store in memory so the tests never touch ./data. */
process.env.EMERALD_GARDEN_STORAGE = "memory";

const shared = globalThis as typeof globalThis & {
  __leafAndRootMemory?: Map<string, unknown>;
};

beforeEach(() => {
  shared.__leafAndRootMemory?.clear();
});

const ficus = CATALOG_BY_ID["ficus-retusa"];
const fig = CATALOG_BY_ID["ficus-fig"];
const blackPine = CATALOG_BY_ID["black-pine"];
const redPine = CATALOG_BY_ID["red-pine"];

describe("availability", () => {
  it("starts from catalogue stock", async () => {
    const available = await availableMap();

    for (const product of CATALOG) {
      assert.equal(available[product.id], product.stock, product.id);
    }
  });

  it("returns the remaining count for a product", async () => {
    assert.equal(await availableFor(ficus.id), ficus.stock);
  });

  it("returns zero for an unknown product", async () => {
    assert.equal(await availableFor("not-a-tree"), 0);
  });
});

describe("reserveStock", () => {
  it("decrements availability", async () => {
    await reserveStock([{ id: ficus.id, qty: 2 }]);

    assert.equal(await availableFor(ficus.id), ficus.stock - 2);
    assert.equal((await soldMap())[ficus.id], 2);
  });

  it("accumulates across successive reservations", async () => {
    await reserveStock([{ id: ficus.id, qty: 1 }]);
    await reserveStock([{ id: ficus.id, qty: 1 }]);

    assert.equal((await soldMap())[ficus.id], 2);
    assert.equal(await availableFor(ficus.id), ficus.stock - 2);
  });

  it("ignores unknown product ids", async () => {
    await reserveStock([{ id: "not-a-tree", qty: 3 }]);

    assert.deepEqual(await soldMap(), {});
  });

  it("sells out only once every unit is claimed", async () => {
    await reserveStock([{ id: ficus.id, qty: ficus.stock }]);

    assert.equal(await availableFor(ficus.id), 0);
  });

  it("throws instead of overselling, reserving nothing", async () => {
    await assert.rejects(
      reserveStock([{ id: blackPine.id, qty: blackPine.stock + 1 }]),
      (error: unknown) => {
        assert.ok(error instanceof StockError);
        assert.equal(error.productId, blackPine.id);
        assert.equal(error.remaining, blackPine.stock);
        return true;
      },
    );

    assert.equal(await availableFor(blackPine.id), blackPine.stock);
    assert.deepEqual(await soldMap(), {});
  });

  it("applies nothing when any line in a reservation fails", async () => {
    await assert.rejects(
      reserveStock([
        { id: ficus.id, qty: 1 },
        { id: redPine.id, qty: 1 },
      ]),
      StockError,
    );

    assert.equal(await availableFor(ficus.id), ficus.stock);
    assert.deepEqual(await soldMap(), {});
  });

  it("cannot oversell the last unit under concurrent requests", async () => {
    const results = await Promise.allSettled([
      reserveStock([{ id: blackPine.id, qty: 1 }]),
      reserveStock([{ id: blackPine.id, qty: 1 }]),
    ]);

    assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
    assert.equal(results.filter((r) => r.status === "rejected").length, 1);
    assert.equal(await availableFor(blackPine.id), 0);
  });
});

describe("releaseStock", () => {
  it("returns units to the pool", async () => {
    await reserveStock([{ id: ficus.id, qty: 3 }]);
    await releaseStock([{ id: ficus.id, qty: 2 }]);

    assert.equal(await availableFor(ficus.id), ficus.stock - 1);
  });

  it("never drives the sold count below zero", async () => {
    await releaseStock([{ id: fig.id, qty: 5 }]);

    assert.equal(await availableFor(fig.id), fig.stock);
    assert.equal((await soldMap())[fig.id] ?? 0, 0);
  });

  it("ignores unknown product ids", async () => {
    await releaseStock([{ id: "not-a-tree", qty: 1 }]);

    assert.deepEqual(await soldMap(), {});
  });
});
