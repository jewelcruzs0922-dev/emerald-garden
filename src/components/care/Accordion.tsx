"use client";

import { useRef, useState } from "react";

export interface AccordionItemData {
  q: string;
  a: string;
}

function Item({
  item,
  open,
  onToggle,
}: {
  item: AccordionItemData;
  open: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`acc-item${open ? " is-open" : ""}`}>
      <button
        className="acc-btn"
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        {item.q}
        <span className="sign" aria-hidden="true" />
      </button>
      <div
        className="acc-panel"
        ref={panelRef}
        style={{ height: open ? (panelRef.current?.scrollHeight ?? "auto") : 0 }}
      >
        <div className="acc-panel__inner">{item.a}</div>
      </div>
    </div>
  );
}

export default function Accordion({ items }: { items: AccordionItemData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <Item
          key={item.q}
          item={item}
          open={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
