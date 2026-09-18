import { expect, test } from "@playwright/test";
import { CATALOG } from "../src/lib/catalog";

const ROUTES = ["/", "/shop", "/about", "/care", "/journal", "/contact"];

test.describe("metadata", () => {
  test("the sitemap lists every page and every tree", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toHaveLength(ROUTES.length + CATALOG.length);
    for (const product of CATALOG) {
      expect(locations.some((url) => url.endsWith(`/shop/${product.id}`))).toBe(true);
    }
  });

  test("robots.txt points at the sitemap and keeps crawlers out of the API", async ({
    request,
  }) => {
    const body = await (await request.get("/robots.txt")).text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("Disallow: /api/");
  });

  for (const path of ROUTES) {
    test(`${path} has canonical, OpenGraph and a description`, async ({ page }) => {
      await page.goto(path);
      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      expect(await canonical.getAttribute("href")).toBeTruthy();

      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        /\/og\.png$/,
      );
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );

      const description = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      expect(description?.length ?? 0).toBeGreaterThan(40);
    });
  }

  test("a product page advertises itself as its own canonical", async ({ page }) => {
    const product = CATALOG[0];
    await page.goto(`/shop/${product.id}`);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain(`/shop/${product.id}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      new RegExp(product.img.replace(".", "\\.")),
    );
  });

  test("the 404 and checkout are excluded from indexing", async ({ page }) => {
    await page.goto("/checkout");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});

test.describe("structured data", () => {
  test("the site publishes an organisation and a website", async ({ page }) => {
    await page.goto("/");
    const types = await readSchemaTypes(page);
    expect(types).toContain("Organization+LocalBusiness+Store");
    expect(types).toContain("WebSite");
  });

  test("the shop publishes its catalogue as products with offers", async ({ page }) => {
    await page.goto("/shop");
    const types = await readSchemaTypes(page);
    expect(types).toContain("ItemList");
    expect(types).toContain("Product");
    expect(types).toContain("Offer");
  });

  test("a product page publishes price, currency and availability", async ({ page }) => {
    const product = CATALOG[0];
    await page.goto(`/shop/${product.id}`);

    const product_ = await page.evaluate(() => {
      const blocks = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
      );
      for (const block of blocks) {
        const parsed = JSON.parse(block.textContent ?? "null");
        const found = Array.isArray(parsed)
          ? parsed.find((n) => n["@type"] === "Product")
          : null;
        if (found) return found;
      }
      return null;
    });

    expect(product_).toBeTruthy();
    expect(product_.offers.price).toBe(product.price);
    expect(product_.offers.priceCurrency).toBe("PHP");
    expect(product_.offers.availability).toContain("InStock");
  });

  test("the care and contact pages answer common questions in schema", async ({
    page,
  }) => {
    for (const path of ["/care", "/contact"]) {
      await page.goto(path);
      expect(await readSchemaTypes(page)).toContain("FAQPage");
    }
  });
});

async function readSchemaTypes(page: import("@playwright/test").Page): Promise<string[]> {
  return page.evaluate(() => {
    const types: string[] = [];
    const walk = (node: unknown): void => {
      if (Array.isArray(node)) return node.forEach(walk);
      if (node && typeof node === "object") {
        const record = node as Record<string, unknown>;
        if (record["@type"])
          types.push(([] as string[]).concat(record["@type"] as string).join("+"));
        Object.values(record).forEach(walk);
      }
    };
    for (const block of Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    )) {
      try {
        walk(JSON.parse(block.textContent ?? "null"));
      } catch {
        types.push("PARSE_ERROR");
      }
    }
    return [...new Set(types)];
  });
}
