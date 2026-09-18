export type Environment = "Indoor" | "Outdoor" | "Indoor / Outdoor";

export type FilterKey =
  "all" | "indoor" | "outdoor" | "beginner" | "collector" | "under3000";

export interface Product {
  id: string;
  name: string;
  env: Environment;
  price: number;
  /** File name inside /public/img */
  img: string;
  /** Catalogue plate number, e.g. "No. 01" */
  no: string;
  /** Short badge shown over the photograph */
  tag: string;
  /** One-line description */
  note: string;
  tags: Exclude<FilterKey, "all">[];
  /** Units on hand. Trees are largely one-offs, so most are 0 or 1. */
  stock: number;
}

export const CATALOG: Product[] = [
  {
    id: "black-pine",
    name: "Japanese Black Pine",
    env: "Outdoor",
    price: 3800,
    img: "bonsai-black-pine.jpg",
    no: "No. 01",
    tag: "Classic",
    note: "An upright, resinous pine with rugged bark.",
    stock: 1,
    tags: ["outdoor", "collector"],
  },
  {
    id: "japanese-maple",
    name: "Japanese Maple",
    env: "Indoor / Outdoor",
    price: 4200,
    img: "bonsai-maple.jpg",
    no: "No. 02",
    tag: "Seasonal colour",
    note: "Leaves shift from green to amber each autumn.",
    stock: 1,
    tags: ["indoor", "outdoor", "collector"],
  },
  {
    id: "ficus-retusa",
    name: "Ficus Retusa",
    env: "Indoor",
    price: 2500,
    img: "bonsai-ficus.jpg",
    no: "No. 03",
    tag: "Beginner friendly",
    note: "Forgiving, glossy and happy on a bright sill.",
    stock: 4,
    tags: ["indoor", "beginner", "under3000"],
  },
  {
    id: "juniper",
    name: "Juniperus Procumbens",
    env: "Outdoor",
    price: 3200,
    img: "bonsai-cascade.jpg",
    no: "No. 04",
    tag: "Cascade form",
    note: "A trailing juniper that loves full sun.",
    stock: 2,
    tags: ["outdoor", "beginner"],
  },
  {
    id: "trident-forest",
    name: "Trident Maple Forest",
    env: "Outdoor",
    price: 5600,
    img: "bonsai-maple-forest.jpg",
    no: "No. 05",
    tag: "Collector's pick",
    note: "Five trunks planted as one small woodland.",
    stock: 1,
    tags: ["outdoor", "collector"],
  },
  {
    id: "chinese-elm",
    name: "Chinese Elm",
    env: "Indoor / Outdoor",
    price: 2900,
    img: "bonsai-ligustrum.jpg",
    no: "No. 06",
    tag: "Beginner friendly",
    note: "Fine branching and quick to reward you.",
    stock: 3,
    tags: ["indoor", "outdoor", "beginner", "under3000"],
  },
  {
    id: "flowering-adenium",
    name: "Flowering Adenium",
    env: "Indoor",
    price: 3400,
    img: "bonsai-adenium.jpg",
    no: "No. 07",
    tag: "Blooms yearly",
    note: "Desert rose with bright trumpet flowers.",
    stock: 1,
    tags: ["indoor"],
  },
  {
    id: "red-pine",
    name: "Japanese Red Pine",
    env: "Outdoor",
    price: 5400,
    img: "bonsai-red-pine.jpg",
    no: "No. 08",
    tag: "Collector's pick",
    note: "Soft needles, sculptural and patient.",
    stock: 0,
    tags: ["outdoor", "collector"],
  },
  {
    id: "ficus-fig",
    name: "Ficus Fig",
    env: "Indoor",
    price: 2200,
    img: "bonsai-fig.jpg",
    no: "No. 09",
    tag: "Beginner friendly",
    note: "Broad leaves, thrives near a warm window.",
    stock: 5,
    tags: ["indoor", "beginner", "under3000"],
  },
  {
    id: "bald-cypress",
    name: "Bald Cypress",
    env: "Outdoor",
    price: 3900,
    img: "bonsai-forest.jpg",
    no: "No. 10",
    tag: "Loves water",
    note: "A graceful, water-loving specimen.",
    stock: 1,
    tags: ["outdoor", "collector"],
  },
];

export const CATALOG_BY_ID: Record<string, Product> = Object.fromEntries(
  CATALOG.map((p) => [p.id, p]),
);

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All trees" },
  { key: "indoor", label: "Indoor" },
  { key: "outdoor", label: "Outdoor" },
  { key: "beginner", label: "Beginner friendly" },
  { key: "collector", label: "Collector's picks" },
  { key: "under3000", label: "Under \u20B13,000" },
];

/** Hand-picked trees shown in the home page collection row. */
export const FEATURED_IDS = ["black-pine", "japanese-maple", "ficus-retusa", "juniper"];

export function formatPeso(amount: number): string {
  return "\u20B1" + amount.toLocaleString("en-PH");
}

/** Units on hand after accounting for what the catalogue starts with. */
export function isSoldOut(product: Product): boolean {
  return product.stock <= 0;
}

export const FREE_SHIPPING_THRESHOLD = 5000;
