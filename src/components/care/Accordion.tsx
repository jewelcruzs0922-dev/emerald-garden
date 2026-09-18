"use client";

import { useState } from "react";

export interface AccordionItemData {
  q: string;
  a: string;
}

/**
 * Height is animated with a CSS grid track (`0fr` → `1fr`) rather than a
 * measured pixel height, so there is no ref to read during render and no
 * reflow to measure on open.
 */
export default function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div className={`acc-item${open ? " is-open" : ""}`} key={item.q}>
            <button
              className="acc-btn"
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              {item.q}
              <span className="sign" aria-hidden="true" />
            </button>
            <div className="acc-panel">
              <div className="acc-panel__inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
