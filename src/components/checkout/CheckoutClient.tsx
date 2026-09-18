"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { LeafGlyph } from "@/components/icons";
import { formatPeso } from "@/lib/catalog";
import {
  priceCart,
  SHIPPING,
  SHIPPING_REGIONS,
  type PricingIssue,
  type ShippingRegion,
} from "@/lib/commerce/pricing";
import { useStore } from "@/lib/store";

type Errors = Record<string, string>;
type Status = "idle" | "submitting" | "error";

const FIELDS = [
  { name: "name", label: "Full name", autoComplete: "name", span: 2 },
  { name: "email", label: "Email", autoComplete: "email", type: "email", span: 1 },
  { name: "phone", label: "Mobile number", autoComplete: "tel", type: "tel", span: 1 },
  { name: "address", label: "Street address", autoComplete: "street-address", span: 2 },
  { name: "city", label: "City / municipality", autoComplete: "address-level2", span: 1 },
  { name: "postalCode", label: "Postal code", autoComplete: "postal-code", span: 1 },
] as const;

export default function CheckoutClient() {
  const { cart, availability, ready, clearCart, pushToast } = useStore();
  const [region, setRegion] = useState<ShippingRegion>("metro");
  const [errors, setErrors] = useState<Errors>({});
  const [issues, setIssues] = useState<PricingIssue[]>([]);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const priced = useMemo(
    () =>
      priceCart(
        cart.map((line) => ({ id: line.id, qty: line.qty })),
        region,
        Object.keys(availability).length ? availability : undefined,
      ),
    [cart, region, availability],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      items: cart.map((line) => ({ id: line.id, qty: line.qty })),
      shippingRegion: region,
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      address: String(data.get("address") ?? "").trim(),
      city: String(data.get("city") ?? "").trim(),
      postalCode: String(data.get("postalCode") ?? "").trim(),
      notes: String(data.get("notes") ?? "").trim(),
    };

    /* Cheap client-side check so obvious mistakes never need a round trip. */
    const local: Errors = {};
    for (const field of ["name", "email", "phone", "address", "city", "postalCode"] as const) {
      if (!payload[field]) local[field] = "This is needed for delivery.";
    }
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) {
      local.email = "That email address looks incomplete.";
    }
    setErrors(local);
    if (Object.keys(local).length > 0) {
      setStatus("error");
      setFeedback("Please check the highlighted fields.");
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setStatus("submitting");
    setFeedback("");
    setIssues([]);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            message?: string;
            errors?: Errors;
            issues?: PricingIssue[];
            redirectUrl?: string;
          }
        | null;

      if (!response.ok || !result?.ok) {
        setErrors(result?.errors ?? {});
        setIssues(result?.issues ?? []);
        setStatus("error");
        setFeedback(result?.message ?? "Something went wrong. Nothing was charged.");
        return;
      }

      if (result.issues?.length) {
        pushToast("We adjusted an item that had sold out");
      }

      clearCart();
      /* Off to the payment provider. */
      window.location.assign(result.redirectUrl as string);
    } catch {
      setStatus("error");
      setFeedback("We couldn't reach the server. Nothing was charged.");
    }
  };

  if (ready && cart.length === 0) {
    return (
      <div className="checkout-empty">
        <LeafGlyph width={22} height={22} />
        <h2>Your basket is empty</h2>
        <p className="lede">
          Add a tree to the basket and it will show up here, ready to be packed.
        </p>
        <Link className="btn" href="/shop">
          Browse the collection <span className="arw">&rarr;</span>
        </Link>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <div className="checkout-grid">
      <form className="checkout-form" data-checkout-form onSubmit={onSubmit} noValidate>
        <h2>Where should we send it?</h2>
        <span className="hand">
          Live plants ship Monday to Wednesday so nothing waits in a depot.
        </span>

        <div className="form-row" style={{ marginTop: "1.6rem" }}>
          {FIELDS.map((field) => (
            <div
              key={field.name}
              className="field"
              style={field.span === 2 ? { gridColumn: "1 / -1" } : undefined}
            >
              <label className="label" htmlFor={`co-${field.name}`}>
                {field.label}
              </label>
              <input
                className="input"
                id={`co-${field.name}`}
                name={field.name}
                type={"type" in field ? field.type : "text"}
                autoComplete={field.autoComplete}
                aria-invalid={errors[field.name] ? true : undefined}
              />
              <p className="field-error">{errors[field.name] ?? ""}</p>
            </div>
          ))}

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label" htmlFor="co-region">
              Delivery area
            </label>
            <select
              className="select"
              id="co-region"
              name="shippingRegion"
              value={region}
              onChange={(event) => setRegion(event.target.value as ShippingRegion)}
            >
              {SHIPPING_REGIONS.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label} — {formatPeso(option.flat)} · {option.eta}
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label className="label" htmlFor="co-notes">
              Anything we should know? <span className="muted">(optional)</span>
            </label>
            <textarea
              className="textarea"
              id="co-notes"
              name="notes"
              placeholder="A gift message, a safe place to leave the box, a preferred day…"
            />
          </div>
        </div>

        <button
          className="btn btn--block"
          type="submit"
          disabled={busy}
          style={{ marginTop: "1.4rem" }}
        >
          {busy ? "Starting payment…" : `Pay ${formatPeso(priced.total)}`}{" "}
          {busy ? null : <span className="arw">&rarr;</span>}
        </button>

        <p className="form-note">
          You&apos;ll be taken to a secure payment page. Nothing is charged until
          you confirm there.
        </p>

        <p
          className={`newsletter__msg${status === "error" ? " is-error" : ""}`}
          data-checkout-msg
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      </form>

      <aside className="summary" aria-label="Order summary">
        <h3>Your basket</h3>

        {issues.length > 0 ? (
          <ul className="checkout-issues" data-checkout-issues>
            {issues.map((issue) => (
              <li key={`${issue.id}-${issue.code}`}>{issue.message}</li>
            ))}
          </ul>
        ) : null}

        <ul className="summary__lines">
          {priced.lines.map((line) => (
            <li key={line.id}>
              <Image
                src={`/img/${line.img}`}
                alt=""
                width={56}
                height={56}
                className="summary__img"
              />
              <div className="summary__meta">
                <span className="summary__name">{line.name}</span>
                <span className="summary__qty">
                  {line.qty} &times; {formatPeso(line.unitPrice)}
                </span>
              </div>
              <span className="summary__total">{formatPeso(line.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="sum-line">
          <span>Subtotal</span>
          <span>{formatPeso(priced.subtotal)}</span>
        </div>
        <div className="sum-line">
          <span>Shipping · {SHIPPING[region].label}</span>
          <span>{priced.shipping === 0 ? "Free" : formatPeso(priced.shipping)}</span>
        </div>
        <div className="sum-line sum-line--total">
          <span>Total</span>
          <span data-checkout-total>{formatPeso(priced.total)}</span>
        </div>

        {!priced.freeShipping ? (
          <p className="summary__note">
            Spend {formatPeso(5000 - priced.subtotal)} more for free shipping.
          </p>
        ) : (
          <p className="summary__note summary__note--good">
            Free shipping unlocked.
          </p>
        )}

        <p className="summary__promise">
          Every tree travels with a care card, wrapped in a rigid box with damp
          moss around the roots.
        </p>
      </aside>
    </div>
  );
}
