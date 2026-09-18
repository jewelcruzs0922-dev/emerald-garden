"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { IconClose } from "@/components/icons";
import { CATALOG, formatPeso } from "@/lib/catalog";
import { useStore } from "@/lib/store";

const SUGGESTIONS = [
  { label: "Indoor bonsai", value: "indoor" },
  { label: "Beginner friendly", value: "beginner" },
  { label: "Pine", value: "pine" },
  { label: "Under \u20B13,000", value: "under 3000" },
];

export default function SearchOverlay() {
  const { panel, searchQuery, setSearchQuery, closePanels } = useStore();
  const open = panel === "search";
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 240);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    const terms = query.split(/\s+/);
    return CATALOG.filter((product) => {
      const haystack = [
        product.name,
        product.env,
        product.tag,
        product.note,
        product.tags.includes("under3000")
          ? "under 3000 under \u20B13,000 cheap budget"
          : "",
      ]
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }, [searchQuery]);

  return (
    <div
      className={`search-overlay${open ? " is-open" : ""}`}
      id="search-overlay"
      tabIndex={-1}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="search-inner">
        <button
          className="close-x"
          type="button"
          data-close
          onClick={closePanels}
          aria-label="Close search"
          style={{ marginLeft: "auto", marginBottom: "1rem" }}
        >
          <IconClose />
        </button>

        <form
          className="search-form"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            ref={inputRef}
            type="search"
            name="q"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search bonsai, care, journal…"
            autoComplete="off"
            aria-label="Search"
          />
          <span style={{ color: "var(--ink-3)", fontSize: ".8rem" }}>Esc</span>
        </form>

        <div className="search-hint">
          <span>Try:</span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.value}
              className="chip-suggest"
              type="button"
              onClick={() => setSearchQuery(suggestion.value)}
            >
              {suggestion.label}
            </button>
          ))}
        </div>

        <div className="search-results">
          {searchQuery.trim() === "" ? null : results.length === 0 ? (
            <p className="search-empty">
              No trees match &ldquo;{searchQuery}&rdquo; just yet. Try
              &ldquo;indoor&rdquo; or &ldquo;beginner&rdquo;.
            </p>
          ) : (
            <>
              <p className="search-results__label">
                {results.length} result{results.length > 1 ? "s" : ""}
              </p>
              {results.map((product) => (
                <Link
                  className="result"
                  href={`/shop/${product.id}`}
                  key={product.id}
                  onClick={closePanels}
                >
                  <Image
                    src={`/img/${product.img}`}
                    alt=""
                    width={84}
                    height={68}
                  />
                  <div>
                    <h4>{product.name}</h4>
                    <p>
                      {product.env} &middot; {product.tag}
                    </p>
                  </div>
                  <span className="price">{formatPeso(product.price)}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
