import { expect, test } from "@playwright/test";
import type { Order } from "../src/lib/commerce/orders";

/**
 * A receipt the browser kept at checkout, under an id the server store has
 * never seen. This is the path a serverless host takes when a request lands on
 * an instance that did not take the payment.
 */
const CACHED_ID = "LR-AAAAAA";

const CACHED_ORDER: Order = {
  id: CACHED_ID,
  createdAt: "2026-01-01T09:00:00.000Z",
  updatedAt: "2026-01-01T09:00:00.000Z",
  status: "paid",
  customer: {
    name: "Ana Reyes",
    email: "ana@example.com",
    phone: "0917 123 4567",
    address: "14 Saging Street",
    city: "Quezon City",
    postalCode: "1102",
    notes: "",
  },
  lines: [
    {
      id: "ficus-retusa",
      name: "Ficus Retusa",
      img: "bonsai-ficus.jpg",
      env: "Indoor",
      unitPrice: 2500,
      qty: 2,
      lineTotal: 5000,
    },
  ],
  subtotal: 5000,
  shipping: 0,
  total: 5000,
  shippingRegion: "metro",
  payment: {
    provider: "mock",
    reference: `mock_${CACHED_ID}`,
    paidAt: "2026-01-01T09:00:00.000Z",
  },
};

test.describe("order receipts", () => {
  test("render on the server when the store has the order", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('.product[data-product-id="ficus-retusa"] [data-add]').click();
    await page.goto("/checkout");

    await page.locator("#co-name").fill("Ana Reyes");
    await page.locator("#co-email").fill("ana@example.com");
    await page.locator("#co-phone").fill("0917 123 4567");
    await page.locator("#co-address").fill("14 Saging Street");
    await page.locator("#co-city").fill("Quezon City");
    await page.locator("#co-postalCode").fill("1102");
    await page.locator('[data-checkout-form] button[type="submit"]').click();

    await page.waitForURL(/\/orders\/LR-[A-Z0-9]{6}/, { timeout: 20_000 });
    await expect(page.locator("[data-order-status]")).toHaveAttribute(
      "data-order-status",
      "paid",
    );
    await expect(page.locator(".order-lines li")).toHaveCount(1);
  });

  test("fall back to the browser's copy when the server cannot find the order", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate((order) => {
      window.sessionStorage.setItem(`lr.order.${order.id}`, JSON.stringify(order));
    }, CACHED_ORDER);

    await page.goto(`/orders/${CACHED_ID}`);

    /* The server lookup misses, so this is the client fallback rendering. */
    await expect(page.locator("[data-order-id]")).toHaveText(CACHED_ID);
    await expect(page.locator("[data-order-status]")).toHaveAttribute(
      "data-order-status",
      "paid",
    );
    await expect(page.locator(".order-lines li")).toHaveCount(1);
    await expect(page.locator(".sum-line--total span").last()).toHaveText("₱5,000");
    await expect(page.locator(".order-side address")).toContainText("Quezon City");
  });

  test("prefer the settled outcome over a receipt cached before payment", async ({
    page,
  }) => {
    /* This is the real sequence: the browser caches the order while it is still
       pending, then the return endpoint settles it and reports the outcome in a
       cookie, because it may not be able to reach the same store again. */
    const pending: Order = {
      ...CACHED_ORDER,
      id: "LR-CCCCCC",
      status: "pending",
      payment: { provider: "mock", reference: "mock_LR-CCCCCC" },
    };

    await page.goto("/");
    await page.evaluate((order) => {
      window.sessionStorage.setItem(`lr.order.${order.id}`, JSON.stringify(order));
      const outcome = {
        status: "paid",
        reference: "mock_LR-CCCCCC",
        paidAt: "2026-01-01T09:05:00.000Z",
      };
      document.cookie = `lr.order.${order.id}=${encodeURIComponent(
        JSON.stringify(outcome),
      )}; path=/`;
    }, pending);

    await page.goto(`/orders/${pending.id}`);
    await expect(page.locator("[data-order-status]")).toHaveAttribute(
      "data-order-status",
      "paid",
    );
    await expect(page.locator(".order-banner h1")).toContainText("confirmed");
    await expect(page.locator(".order-meta")).toContainText("mock_LR-CCCCCC");
  });

  test("explain themselves when neither the server nor the browser has the order", async ({
    page,
  }) => {
    await page.goto("/orders/LR-BBBBBB");
    await expect(page.locator("h1")).toContainText("can't show that receipt");
    await expect(
      page.getByRole("link", { name: /Ask us about this order/i }),
    ).toBeVisible();
  });

  test("a malformed reference is a 404", async ({ page }) => {
    const response = await page.goto("/orders/not-an-order");
    expect(response?.status()).toBe(404);
  });
});
