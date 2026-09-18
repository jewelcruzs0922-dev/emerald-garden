"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import ProductCard from "@/components/ProductCard";
import { CATALOG, FILTERS, type FilterKey, type Product } from "@/lib/catalog";

const PAGE_SIZE = 8;
const PAGE_STEP = 3;
const INSERT_AFTER = 3;

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

function InsertCard() {
  return (
    <figure className="insert-card" data-insert-card>
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20c0-8 6-14 16-15 0 11-6 16-13 16H4z" />
        <path d="M4 20c3-5 7-8 12-10" />
      </svg>
      <h3>Not sure which one?</h3>
      <p>
        Tell us your light and your routine. We&apos;ll suggest two or three trees
        that will actually thrive with you.
      </p>
      <p className="hand">— ask us anything, really.</p>
      <Link className="link-arw" href="/contact">
        Ask a grower <span className="arw">&rarr;</span>
      </Link>
    </figure>
  );
}

export default function ShopClient() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [shown, setShown] = useState(PAGE_SIZE);

  /* Deep links such as /shop#red-pine should reveal a deferred card. */
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const index = CATALOG.findIndex((product) => product.id === id);
    if (index >= PAGE_SIZE) setShown(index + 1);
  }, []);

  const ordered = useMemo(() => {
    const list = [...CATALOG];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [sort]);

  const matching = useMemo(
    () =>
      filter === "all"
        ? ordered
        : ordered.filter((product) => product.tags.includes(filter)),
    [ordered, filter],
  );

  const visibleCount =
    filter === "all" ? Math.min(shown, matching.length) : matching.length;
  const remaining = matching.length - shown;

  const cells: ReactNode[] = [];
  const insertAt = Math.min(INSERT_AFTER, matching.length);
  matching.forEach((product: Product, index) => {
    if (index === insertAt) cells.push(<InsertCard key="insert-card" />);
    const deferred = filter === "all" && index >= shown;
    cells.push(
      <ProductCard
        key={product.id}
        product={product}
        showNote
        className={deferred ? "is-deferred" : ""}
      />,
    );
  });
  if (insertAt >= matching.length) {
    cells.push(<InsertCard key="insert-card" />);
  }

  return (
    <>
      <div className="shop-tools">
        <div className="filters" role="group" aria-label="Filter trees">
          {FILTERS.map((entry) => (
            <button
              key={entry.key}
              className={`chip${filter === entry.key ? " is-active" : ""}`}
              type="button"
              data-filter={entry.key}
              onClick={() => setFilter(entry.key)}
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="shop-tools__right">
          <span className="result-count" data-count>
            Showing <b>{visibleCount}</b> of <b>{matching.length}</b> trees
          </span>
          <div className="sort-wrap">
            <label className="sr-only" htmlFor="sort">
              Sort by
            </label>
            <select
              className="select"
              id="sort"
              data-sort
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
              <option value="name">Name · A to Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="shop-grid" data-shop-grid>{cells}</div>

      {matching.length === 0 ? (
        <div className="shop-empty" data-shop-empty>
          <span className="hand">Nothing here yet.</span>
          <p className="muted">Try another filter — or clear them all.</p>
          <p style={{ marginTop: "1.2rem" }}>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => setFilter("all")}
            >
              Show everything
            </button>
          </p>
        </div>
      ) : null}

      {filter === "all" && remaining > 0 ? (
        <div className="shop-more" data-shop-more>
          <button
            className="btn btn--ghost"
            type="button"
            data-load-more
            onClick={() => setShown((value) => value + PAGE_STEP)}
          >
            Load more trees <span className="arw">&darr;</span>
          </button>
        </div>
      ) : null}
    </>
  );
}
