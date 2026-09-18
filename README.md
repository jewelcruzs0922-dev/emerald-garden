# Leaf & Root

A storefront for a small bonsai nursery — a design-led marketing site with a
working commerce flow behind it. Built with Next.js App Router, React 19 and
TypeScript, with no UI framework and no runtime dependencies beyond React.

The premise: a shop that sells one-off, living things, where the copy is written
by the growers and every tree is a single specimen rather than a SKU.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

| Command                           | What it does                                    |
| --------------------------------- | ----------------------------------------------- |
| `npm run typecheck`               | `tsc --noEmit`                                  |
| `npm run lint`                    | ESLint (flat config)                            |
| `npm run format` / `format:check` | Prettier                                        |
| `npm run test:e2e`                | Playwright: 52 tests against a production build |

The Playwright suite runs a real `next build` and drives the result, so orders
actually settle and stock actually decrements. It needed no browser download —
`playwright.config.ts` points at the installed Chrome locally and falls back to
bundled Chromium in CI.

No environment variables are required. Without them the site runs with a mock
payment provider, logs form submissions to the console, and stores orders as
JSON on disk. See [Configuration](#configuration) to switch anything on.

---

## What is here

| Area      | Routes                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------- |
| Marketing | `/`, `/about`, `/care`, `/journal`, `/contact`                                                                       |
| Catalogue | `/shop`, `/shop/[id]` (10 product pages)                                                                             |
| Commerce  | `/checkout`, `/orders/[id]`                                                                                          |
| API       | `/api/checkout`, `/api/checkout/return`, `/api/inventory`, `/api/contact`, `/api/newsletter`, `/api/webhooks/stripe` |
| SEO       | `/sitemap.xml` (16 URLs), `/robots.txt`, `/og.png`                                                                   |

**Working end to end:** browse → product page → basket → checkout → payment →
order confirmation, with server-side pricing, atomic stock reservation and an
itemised receipt.

---

## Notable decisions

These are the parts worth reading the source for.

### The client is never trusted with money

`src/lib/commerce/pricing.ts` recomputes the entire basket from `CATALOG` using
only the product ids and quantities posted by the browser. A tampered price in
the request body is ignored. Verified: posting `price: 1` for a ₱2,200 tree
still charges ₱2,200.

### Stock cannot be oversold

`src/lib/commerce/inventory.ts` claims stock inside a locked read-modify-write.
The catalogue declares how many of each tree exist; a second document records
how many have sold, so availability is derived and the catalogue stays the one
place a grower edits stock. If two people check out the last tree, the second
gets a `409` and their reservation is released.

### Storage degrades instead of breaking

`src/lib/commerce/json-store.ts` writes JSON to `data/` locally. On a read-only
filesystem — Vercel, a read-only container — the first failed write switches the
store to `globalThis`, and the checkout keeps working. State simply does not
survive a restart. The reason is logged once.

Memory state deliberately lives on `globalThis` rather than in module scope:
Next bundles server code per route, so a module-level `Map` would be duplicated
and the checkout route would never see the order page's reads. (This was a real
bug, caught by exercising the flow in a production build.)

### Payments sit behind an interface

`src/lib/commerce/payments/` defines a `PaymentProvider` with two
implementations:

- **mock** (default) — performs the same work as a real processor: create a
  session, redirect the customer through a return endpoint, verify, then settle.
  No money moves, and the whole flow stays demonstrable without credentials.
- **stripe** — Stripe Checkout, called over the REST API with `fetch`, so the
  project keeps its zero-dependency property. Activates when `STRIPE_SECRET_KEY`
  is set.

> The Stripe adapter is written but **unexercised** — there are no credentials in
> this repository, so the first live run is its real test.

### Order settlement is single-path

Both the return endpoint and the Stripe webhook guard on order status before
settling, so a page refresh or a replayed webhook cannot double-process.
Confirmed by replaying the return URL twice: inventory unchanged. The webhook
verifies its signature with `node:crypto` (HMAC, timing-safe compare, five-minute
tolerance) and refuses to act without `STRIPE_WEBHOOK_SECRET`, so a forged
request can never mark an order paid.

### Content is not hidden behind JavaScript

Scroll-reveal styles are gated behind a `.js` class set by an inline script that
runs before the body parses. Without JavaScript — or if the bundle fails to
load — every section renders visible rather than invisible. The commerce layer
is an enhancement on top of working HTML, not a requirement for reading the site.

### Accessibility is treated as a requirement

Off-canvas UI sets `inert` on the page shell, traps Tab inside the open panel,
and returns focus to whatever opened it. Closed drawers are removed from the tab
order via a `visibility` transition. There is a skip link, `aria-current` on
navigation, `aria-expanded` on the accordion, `aria-invalid` on invalid fields,
and full `prefers-reduced-motion` support. Contrast was audited by walking every
text node in the browser and computing its effective background.

---

## Configuration

Copy `.env.example` to `.env.local`. Everything is optional.

| Variable                                                      | Effect when set                                                                                                  |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                        | Canonical URLs, sitemap and OpenGraph tags resolve to this origin.                                               |
| `RESEND_API_KEY`, `LEAF_AND_ROOT_INBOX`, `LEAF_AND_ROOT_FROM` | Contact, newsletter and order emails are actually delivered. Without them, submissions are validated and logged. |
| `STRIPE_SECRET_KEY`                                           | Checkout switches from the mock provider to Stripe.                                                              |
| `STRIPE_WEBHOOK_SECRET`                                       | Enables the webhook endpoint with signature verification.                                                        |
| `LEAF_AND_ROOT_STORAGE=memory`                                | Forces in-memory storage. Detected automatically on a read-only filesystem.                                      |

---

## Structure

```
src/
  app/
    (routes)            marketing pages, shop, checkout, orders
    api/                route handlers
    layout.tsx          fonts, metadata, store provider, overlays
    globals.css         design tokens, components, home page
    pages.css           inner-page styles
  components/
    home/               home page sections
    shop/               catalogue grid, product buy box
    checkout/           checkout form and summary
    overlays/           cart, wishlist, search, mobile nav, toasts
    icons.tsx           every icon and decorative mark, hand-authored SVG
  lib/
    catalog.ts          commercial facts: price, stock, imagery
    product-details.ts  editorial copy and horticultural specs
    commerce/           pricing, inventory, orders, payments, notifications
    store.tsx           cart, wishlist, panels, availability, toasts
    seo.ts              site constants, per-page metadata helper
    structured-data.ts  schema.org builders
```

`catalog.ts` and `product-details.ts` are separate on purpose: one holds the
facts a shop back-end would replace, the other the copy a grower writes.

---

## Assets

- **Typefaces** — Fraunces, Nunito Sans, Caveat and Caveat Brush, self-hosted as
  woff2 and loaded through `next/font/local`. Only the weights the stylesheet
  uses are declared, since every declared file is preloaded.
- **Photography** — sourced from Wikimedia Commons and downsized. Attribution
  per image is in [`credits.txt`](./credits.txt).
- **Illustration** — the field sketch, notebook, landscape panorama, botanical
  marks and icon set are all hand-authored SVG in this repository.

---

## Known limitations

This is a portfolio piece, not a production shop.

- **Product photography** is a single image per tree; there is no gallery.
- **Content is hardcoded.** There is no CMS, so changing a price or adding a
  journal post means editing TypeScript and redeploying.
- **Storage is not durable in memory mode.** Swapping `json-store.ts` for a
  database, or `OrderRepository` for the Shopify Storefront API, is a
  single-file change by design.
- **Placeholder content remains:** the workshop address, phone numbers and
  testimonials are invented, and the social links point at `/contact`.
- **No unit or component tests.** Coverage is end-to-end only; the pricing and
  inventory logic in particular would benefit from fast unit tests.
- **No accounts, order history, stock notifications or coupon codes.**
