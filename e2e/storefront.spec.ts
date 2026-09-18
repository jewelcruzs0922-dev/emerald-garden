import { expect, test, type Page } from "@playwright/test";
import { CATALOG, FILTERS } from "../src/lib/catalog";

const PAGES = ["/", "/shop", "/about", "/care", "/journal", "/contact", "/checkout"];

/** Fails the test if anything throws or logs an error while the page runs. */
function watchForErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  return errors;
}

test.describe("every route", () => {
  for (const path of PAGES) {
    test(`${path} renders without errors or overflow`, async ({ page }) => {
      const errors = watchForErrors(page);
      await page.goto(path);

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("header.site-header")).toBeVisible();
      await expect(page.locator("footer.site-footer")).toBeVisible();

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow, "page should not scroll horizontally").toBe(false);

      // Scroll the whole page so every lazy image is requested.
      await page.evaluate(async () => {
        const step = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
      });

      const brokenImages = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => img.currentSrc && img.naturalWidth === 0)
          .map((img) => img.currentSrc),
      );
      expect(brokenImages).toEqual([]);

      const missingAlt = await page.evaluate(
        () =>
          Array.from(document.images).filter((img) => !img.hasAttribute("alt")).length,
      );
      expect(missingAlt, "every image needs an alt attribute").toBe(0);

      expect(errors).toEqual([]);
    });
  }
});

test.describe("home page", () => {
  test("renders the hero and the newsletter", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Small Trees");
    await expect(page.locator("#newsletter")).toBeVisible();
  });
});

test.describe("catalogue", () => {
  test("lists every tree and defers the overflow", async ({ page }) => {
    await page.goto("/shop");
    const cards = page.locator(".shop-grid .product");
    await expect(cards).toHaveCount(CATALOG.length);
    await expect(page.locator("[data-count]")).toContainText(`of ${CATALOG.length}`);

    const visible = await page.locator(".shop-grid .product:visible").count();
    expect(visible).toBe(8);
  });

  test("filters by position", async ({ page }) => {
    await page.goto("/shop");
    await page.locator('[data-filter="indoor"]').click();
    const names = page.locator(".shop-grid .product:visible .product__name");
    await expect(names).toHaveCount(5);
    await expect(names.first()).toContainText("Japanese Maple");
  });

  test("sorts by price", async ({ page }) => {
    await page.goto("/shop");
    await page.locator("[data-sort]").selectOption("price-asc");
    await expect(
      page.locator(".shop-grid .product:visible .product__name").first(),
    ).toContainText("Ficus Fig");
  });

  test("loads the rest of the collection", async ({ page }) => {
    await page.goto("/shop");
    await page.locator("[data-load-more]").click();
    await expect(page.locator(".shop-grid .product:visible")).toHaveCount(CATALOG.length);
    await expect(page.locator("[data-load-more]")).toHaveCount(0);
  });

  test("every filter chip returns something", async ({ page }) => {
    await page.goto("/shop");
    for (const filter of FILTERS) {
      await page.locator(`[data-filter="${filter.key}"]`).click();
      const count = await page.locator(".shop-grid .product:visible").count();
      expect(count, `filter "${filter.label}" returned nothing`).toBeGreaterThan(0);
    }
  });
});

test.describe("product pages", () => {
  for (const product of CATALOG) {
    test(`${product.name} has a page`, async ({ page }) => {
      await page.goto(`/shop/${product.id}`);
      await expect(page.locator("h1")).toHaveText(product.name);
      await expect(page.locator("[data-buy-box]")).toBeVisible();
      await expect(page.locator(".pdp__specs > div")).toHaveCount(7);
      await expect(page.locator(".pdp__care dd")).toHaveCount(4);
      await expect(page.locator(".product-row .product")).toHaveCount(4);
    });
  }

  test("an unknown product is a 404", async ({ page }) => {
    const response = await page.goto("/shop/not-a-real-tree");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("branch");
  });
});
