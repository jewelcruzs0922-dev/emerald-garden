"use client";

import { useEffect, useState } from "react";

export const CARE_SECTIONS = [
  { id: "light", label: "Light & position" },
  { id: "water", label: "Watering" },
  { id: "soil", label: "Soil & repotting" },
  { id: "feed", label: "Feeding" },
  { id: "prune", label: "Pruning & wiring" },
  { id: "seasons", label: "Season by season" },
  { id: "trouble", label: "Troubleshooting" },
  { id: "shipping", label: "Shipping & returns" },
  { id: "faq", label: "FAQ" },
];

export default function CareTOC() {
  const [active, setActive] = useState(CARE_SECTIONS[0].id);

  useEffect(() => {
    const blocks = CARE_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((el): el is HTMLElement => Boolean(el));
    if (!blocks.length || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 },
    );

    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="care-toc" aria-label="On this page">
      <h4>On this page</h4>
      <ul>
        {CARE_SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={active === section.id ? "is-active" : undefined}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="care-toc__card">
        <p className="hand">
          &ldquo;Most bonsai die of kindness — too much water, too little light.&rdquo;
        </p>
      </div>
    </aside>
  );
}
