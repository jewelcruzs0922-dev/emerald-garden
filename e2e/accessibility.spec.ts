import { expect, test } from "@playwright/test";

/** WCAG relative luminance. */
function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

test.describe("off-canvas focus management", () => {
  test("closed overlays are not reachable by keyboard", async ({ page }) => {
    await page.goto("/shop");
    const reachable = await page.evaluate(() => {
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          "a[href], button, input, select, textarea, [tabindex]",
        ),
      );
      return focusable.filter((element) => {
        const panel = element.closest(
          "#mobile-nav, #cart-panel, #wish-panel, #search-overlay",
        );
        if (!panel || panel.classList.contains("is-open")) return false;
        const style = getComputedStyle(panel);
        return style.visibility !== "hidden" && style.display !== "none";
      }).length;
    });
    expect(reachable).toBe(0);
  });

  test("opening the basket inerts the page, traps Tab, and restores focus", async ({
    page,
  }) => {
    await page.goto("/shop");
    const trigger = page.locator("[data-open-cart]");
    await trigger.focus();
    await trigger.click();

    const panel = page.locator("#cart-panel");
    await expect(panel).toHaveClass(/is-open/);
    await expect
      .poll(() =>
        page.evaluate(() => document.getElementById("page-shell")!.hasAttribute("inert")),
      )
      .toBe(true);
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.getElementById("cart-panel")!.contains(document.activeElement),
        ),
      )
      .toBe(true);

    for (let i = 0; i < 6; i += 1) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() =>
        document.getElementById("cart-panel")!.contains(document.activeElement),
      );
      expect(inside, "Tab should stay inside the open drawer").toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(panel).not.toHaveClass(/is-open/);
    await expect
      .poll(() =>
        page.evaluate(() => document.getElementById("page-shell")!.hasAttribute("inert")),
      )
      .toBe(false);
    await expect
      .poll(() =>
        page.evaluate(
          () => document.activeElement === document.querySelector("[data-open-cart]"),
        ),
      )
      .toBe(true);
  });
});

test.describe("colour contrast", () => {
  test("every piece of visible text meets WCAG AA", async ({ page }) => {
    await page.goto("/");
    const failures = await page.evaluate(() => {
      const parse = (value: string) => {
        const match = value.match(/rgba?\(([^)]+)\)/);
        if (!match) return null;
        const [r, g, b, a = "1"] = match[1].split(",").map((part) => part.trim());
        return { r: +r, g: +g, b: +b, a: +a };
      };
      const background = (element: Element) => {
        let node: Element | null = element;
        while (node && node !== document.documentElement) {
          const colour = parse(getComputedStyle(node).backgroundColor);
          if (colour && colour.a > 0.85) return colour;
          node = node.parentElement;
        }
        return { r: 244, g: 239, b: 228, a: 1 };
      };

      const out: string[] = [];
      const nodes = document.querySelectorAll(
        "p,span,a,li,h1,h2,h3,h4,button,label,blockquote,figcaption,td,th,small,strong,em",
      );
      for (const element of Array.from(nodes)) {
        const text = element.textContent?.trim();
        if (!text) continue;
        const own = Array.from(element.childNodes).some(
          (child) => child.nodeType === 3 && child.textContent?.trim(),
        );
        if (!own) continue;
        if (!element.getClientRects().length) continue;

        const style = getComputedStyle(element);
        if (style.visibility === "hidden" || Number(style.opacity) < 0.3) continue;

        const foreground = parse(style.color);
        if (!foreground) continue;
        out.push(
          JSON.stringify({
            text: text.slice(0, 40),
            className: String(element.className).slice(0, 40),
            colour: style.color,
            size: Number.parseFloat(style.fontSize),
            weight: Number.parseInt(style.fontWeight, 10),
            background: `rgb(${background(element).r}, ${background(element).g}, ${background(element).b})`,
          }),
        );
      }
      return out;
    });

    const problems: string[] = [];
    for (const raw of failures ?? []) {
      const item = JSON.parse(raw) as {
        text: string;
        className: string;
        colour: string;
        background: string;
        size: number;
        weight: number;
      };
      const parseColour = (value: string) => {
        const [r, g, b] = value.match(/\d+/g)!.map(Number);
        return { r, g, b };
      };
      const foreground = luminance(parseColour(item.colour));
      const behind = luminance(parseColour(item.background));
      const ratio =
        (Math.max(foreground, behind) + 0.05) / (Math.min(foreground, behind) + 0.05);
      const large = item.size >= 24 || (item.weight >= 700 && item.size >= 18.66);
      const required = large ? 3 : 4.5;
      if (ratio < required - 0.01) {
        problems.push(
          `${ratio.toFixed(2)}:1 (needs ${required}) — "${item.text}" .${item.className}`,
        );
      }
    }

    expect(problems).toEqual([]);
  });
});

test.describe("structure", () => {
  test("the skip link is the first thing focus reaches and targets main", async ({
    page,
  }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() =>
      document.activeElement?.textContent?.trim(),
    );
    expect(focused).toBe("Skip to content");
    await expect(page.locator("main#main")).toHaveCount(1);
  });

  test("navigation marks the current page", async ({ page }) => {
    await page.goto("/care");
    await expect(page.locator('.main-nav a[aria-current="page"]')).toHaveText(
      "Care Guide",
    );
  });

  test("the accordion exposes its state", async ({ page }) => {
    await page.goto("/care");
    const first = page.locator(".acc-btn").first();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(".acc-item.is-open")).toHaveCount(1);
  });
});
