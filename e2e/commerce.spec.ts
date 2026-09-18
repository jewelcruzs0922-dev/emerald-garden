import { expect, test } from "@playwright/test";
import { CATALOG, FREE_SHIPPING_THRESHOLD, formatPeso } from "../src/lib/catalog";
import { SHIPPING } from "../src/lib/commerce/pricing";

const CUSTOMER = {
  name: "Ana Reyes",
  email: "ana@example.com",
  phone: "0917 123 4567",
  address: "14 Saging Street, Barangay Kalusugan",
  city: "Quezon City",
  postalCode: "1102",
};

const product = (id: string) => CATALOG.find((entry) => entry.id === id)!;

test.describe("checkout API", () => {
  test("refuses an empty basket", async ({ request }) => {
    const response = await request.post("/api/checkout", {
      data: { items: [], ...CUSTOMER },
    });
    expect(response.status()).toBe(409);
  });

  test("requires the delivery details", async ({ request }) => {
    const response = await request.post("/api/checkout", {
      data: { items: [{ id: "ficus-fig", qty: 1 }], name: "", email: "nope" },
    });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(Object.keys(body.errors).sort()).toEqual([
      "address",
      "city",
      "email",
      "name",
      "phone",
      "postalCode",
    ]);
  });

  test("refuses a sold-out tree", async ({ request }) => {
    const soldOut = CATALOG.find((entry) => entry.stock === 0);
    test.skip(!soldOut, "no sold-out tree in the catalogue");

    const response = await request.post("/api/checkout", {
      data: { items: [{ id: soldOut!.id, qty: 1 }], ...CUSTOMER },
    });
    expect(response.status()).toBe(409);
    expect((await response.json()).issues[0].code).toBe("sold-out");
  });

  test("ignores a price supplied by the client", async ({ request }) => {
    const tree = product("ficus-fig");
    const response = await request.post("/api/checkout", {
      data: { items: [{ id: tree.id, qty: 1, price: 1 }], ...CUSTOMER },
    });
    expect(response.status()).toBe(200);

    const { redirectUrl } = await response.json();
    const orderId = new URL(redirectUrl).searchParams.get("order")!;

    // Follow the return trip so the order settles and can be read back.
    await request.get(`/api/checkout/return?order=${orderId}&session=mock_${orderId}`);
    const page = await request.get(`/orders/${orderId}`);
    expect(await page.text()).toContain(formatPeso(tree.price));
  });
});

test.describe("placing an order", () => {
  test("browse, check out, and land on a confirmed order", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('.product[data-product-id="ficus-retusa"] [data-add]').click();
    await page.locator('.product[data-product-id="juniper"] [data-add]').click();
    await expect(page.locator("[data-cart-count]")).toHaveText("2");

    await page.goto("/checkout");
    const subtotal = product("ficus-retusa").price + product("juniper").price;
    expect(subtotal).toBeGreaterThanOrEqual(FREE_SHIPPING_THRESHOLD);

    await page.locator("#co-name").fill(CUSTOMER.name);
    await page.locator("#co-email").fill(CUSTOMER.email);
    await page.locator("#co-phone").fill(CUSTOMER.phone);
    await page.locator("#co-address").fill(CUSTOMER.address);
    await page.locator("#co-city").fill(CUSTOMER.city);
    await page.locator("#co-postalCode").fill(CUSTOMER.postalCode);
    await page.locator("#co-notes").fill("Please leave with the guard if I am out.");

    await page.locator('[data-checkout-form] button[type="submit"]').click();

    await page.waitForURL(/\/orders\/LR-[A-Z0-9]{6}/, { timeout: 20_000 });
    await expect(page.locator("[data-order-status]")).toHaveAttribute(
      "data-order-status",
      "paid",
    );
    await expect(page.locator("[data-order-id]")).toHaveText(/^LR-[A-Z0-9]{6}$/);
    await expect(page.locator(".order-lines li")).toHaveCount(2);
    await expect(page.locator(".sum-line--total span").last()).toHaveText(
      formatPeso(subtotal),
    );
    await expect(page.locator("[data-cart-count]")).toHaveText("0");
  });

  test("shipping changes with the delivery area", async ({ page }) => {
    /* The cheapest tree, so the basket stays under the free-shipping
       threshold and the shipping line is actually exercised. */
    const cheapest = [...CATALOG].sort((a, b) => a.price - b.price)[0];
    expect(cheapest.price).toBeLessThan(FREE_SHIPPING_THRESHOLD);

    await page.goto("/shop");
    /* The default order defers everything past the eighth card, so sort by
       price to bring the cheapest tree into view before clicking it. */
    await page.locator("[data-sort]").selectOption("price-asc");
    await page.locator(`.product[data-product-id="${cheapest.id}"] [data-add]`).click();
    await page.goto("/checkout");

    await expect(page.locator("[data-checkout-total]")).toHaveText(
      formatPeso(cheapest.price + SHIPPING.metro.flat),
    );

    await page.locator("#co-region").selectOption("provincial");
    await expect(page.locator("[data-checkout-total]")).toHaveText(
      formatPeso(cheapest.price + SHIPPING.provincial.flat),
    );
  });
});

test.describe("stock", () => {
  test("a sold-out tree cannot be added", async ({ page }) => {
    const soldOut = CATALOG.find((entry) => entry.stock === 0);
    test.skip(!soldOut, "no sold-out tree in the catalogue");

    await page.goto("/shop");
    const card = page.locator(`.product[data-product-id="${soldOut!.id}"]`);
    await expect(card.locator(".product__sold")).toHaveText("Sold out");
    await expect(card.locator("[data-add]")).toBeDisabled();

    await card.locator("[data-add]").click({ force: true });
    await expect(page.locator("[data-cart-count]")).toHaveText("0");
  });

  test("availability drops after an order", async ({ request }) => {
    const before = await (await request.get("/api/inventory")).json();
    const tree = product("ficus-retusa");
    const starting = before.availability[tree.id];

    const response = await request.post("/api/checkout", {
      data: { items: [{ id: tree.id, qty: 1 }], ...CUSTOMER },
    });
    expect(response.status()).toBe(200);
    const { redirectUrl } = await response.json();
    const orderId = new URL(redirectUrl).searchParams.get("order")!;
    await request.get(`/api/checkout/return?order=${orderId}&session=mock_${orderId}`);

    const after = await (await request.get("/api/inventory")).json();
    expect(after.availability[tree.id]).toBe(starting - 1);
  });
});
