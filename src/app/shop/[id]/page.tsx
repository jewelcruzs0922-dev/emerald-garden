import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import ProductBuyBox from "@/components/shop/ProductBuyBox";
import { LeafGlyph } from "@/components/icons";
import { CATALOG, CATALOG_BY_ID, type Product } from "@/lib/catalog";
import { INCLUDED, PRODUCT_DETAILS } from "@/lib/product-details";
import { SITE } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return CATALOG.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = CATALOG_BY_ID[id];
  if (!product) return { title: "Tree not found" };

  const detail = PRODUCT_DETAILS[id];
  const description = `${product.name} — ${product.note} ${
    detail ? `${detail.heightCm}cm, ${detail.ageYears} years in training, ${detail.difficulty.toLowerCase()} to keep.` : ""
  }`.trim();

  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.id}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${product.env} bonsai`,
      description,
      url: `/shop/${product.id}`,
      siteName: SITE.name,
      locale: SITE.locale,
      images: [
        {
          url: `/img/${product.img}`,
          width: 1200,
          height: 900,
          alt: `${product.name} bonsai`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${product.env} bonsai`,
      description,
      images: [`/img/${product.img}`],
    },
  };
}

function relatedTo(product: Product): Product[] {
  const scored = CATALOG.filter((entry) => entry.id !== product.id).map((entry) => {
    let score = 0;
    if (entry.env === product.env) score += 3;
    score += entry.tags.filter((tag) => product.tags.includes(tag)).length * 2;
    score += Math.max(0, 2 - Math.abs(entry.price - product.price) / 2000);
    return { entry, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.entry);
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = CATALOG_BY_ID[id];
  const detail = PRODUCT_DETAILS[id];

  if (!product || !detail) notFound();

  const related = relatedTo(product);

  const specs: [string, React.ReactNode][] = [
    ["Species", <em key="s">{detail.scientificName}</em>],
    ["Native to", detail.origin],
    ["Height", `${detail.heightCm} cm from the rim of the pot`],
    ["Pot", detail.pot],
    ["In training", `${detail.ageYears} years`],
    ["Keeping it", detail.difficulty],
    ["Position", product.env],
  ];

  const careRows: [string, string][] = [
    ["Light", detail.care.light],
    ["Water", detail.care.water],
    ["Feed", detail.care.feed],
    ["Repotting", detail.care.repot],
  ];

  return (
    <main id="main">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: detail.story,
            sku: product.id,
            image: `${SITE.url}/img/${product.img}`,
            category: product.env,
            brand: { "@type": "Brand", name: SITE.name },
            additionalProperty: specs
              .filter(([, value]) => typeof value === "string")
              .map(([name, value]) => ({
                "@type": "PropertyValue",
                name,
                value: value as string,
              })),
            offers: {
              "@type": "Offer",
              url: `${SITE.url}/shop/${product.id}`,
              price: product.price,
              priceCurrency: "PHP",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/SoldOut",
              itemCondition: "https://schema.org/NewCondition",
            },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/shop/${product.id}` },
          ]),
        ]}
      />

      <nav className="crumbs crumbs--pdp" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <span aria-current="page">{product.name}</span>
        </div>
      </nav>

      <section className="section section--flush-top pdp">
        <div className="wrap">
          <div className="pdp__top">
            <figure className="pdp__media reveal">
              <div className="photo">
                <Image
                  src={`/img/${product.img}`}
                  alt={`${product.name} bonsai in ${detail.pot.toLowerCase()}`}
                  fill
                  priority
                  sizes="(max-width: 1080px) 100vw, 620px"
                />
              </div>
              <figcaption className="pdp__plate">
                <span className="hand">{product.no}</span>
                <span className="caption">
                  Photographed on our bench, unpadded — this is the exact tree.
                </span>
              </figcaption>
            </figure>

            <div className="pdp__intro reveal">
              <span className="eyebrow eyebrow--script">{product.tag}</span>
              <h1>{product.name}</h1>
              <p className="lede">{product.note}</p>

              <ProductBuyBox product={product} />

              <dl className="pdp__quick">
                <div>
                  <dt>Height</dt>
                  <dd>{detail.heightCm}cm</dd>
                </div>
                <div>
                  <dt>Age</dt>
                  <dd>{detail.ageYears} yrs</dd>
                </div>
                <div>
                  <dt>Keeping it</dt>
                  <dd>{detail.difficulty}</dd>
                </div>
                <div>
                  <dt>Position</dt>
                  <dd>{product.env}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-paper-2 rip rip--top rip--bottom">
        <div className="wrap">
          <div className="pdp__story">
            <div className="reveal">
              <span className="eyebrow eyebrow--script">About this tree</span>
              <p className="pdp__prose">{detail.story}</p>

              <div className="pdp__care">
                <h2>Keeping it happy</h2>
                <dl>
                  {careRows.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="pdp__care-more">
                  <Link className="link-arw" href="/care">
                    The full care guide <span className="arw">&rarr;</span>
                  </Link>
                </p>
              </div>
            </div>

            <aside className="pdp__side reveal">
              <h2>Details</h2>
              <dl className="pdp__specs">
                {specs.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="pdp__included-grid">
            <div className="reveal">
              <h2>What arrives in the box</h2>
              <ul className="pdp__included">
                {INCLUDED.map((item) => (
                  <li key={item}>
                    <LeafGlyph width={18} height={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pdp__note reveal">
              <span className="hand">A note from the bench</span>
              <p>
                We don&apos;t photograph a different tree and send you another one.
                The picture above is this specimen, taken the week you order. If it
                isn&apos;t the tree for you when it arrives, send it back within
                seven days — no explanation needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section collection">
        <div className="wrap">
          <div className="collection__inner">
            <div className="collection__intro reveal">
              <span className="eyebrow eyebrow--script">Also worth a look</span>
              <h2>
                Trees that
                <br />
                keep it company
              </h2>
              <p>
                Chosen for sharing a position, a temperament or a shelf with{" "}
                {product.name}.
              </p>
              <Link className="btn" href="/shop">
                All collection <span className="arw">&rarr;</span>
              </Link>
            </div>

            <div className="product-row">
              {related.map((entry) => (
                <ProductCard product={entry} className="reveal" key={entry.id} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Not sure this is the one? Ask us before you buy."
        note="Send a photo of where it would live. We'll tell you honestly."
        primary={{ href: "/contact", label: "Ask a grower" }}
        secondary={{ href: "/care", label: "Read the care guide" }}
      />
    </main>
  );
}
