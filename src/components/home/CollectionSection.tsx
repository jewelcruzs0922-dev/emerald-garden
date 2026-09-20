import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { RuleSquiggle } from "@/components/icons";
import { CATALOG_BY_ID, FEATURED_IDS } from "@/lib/catalog";

export default function CollectionSection() {
  const featured = FEATURED_IDS.map((id) => CATALOG_BY_ID[id]).filter(Boolean);

  return (
    <section className="section collection rip rip--top rip--bottom">
      <div className="wrap">
        <div className="collection__inner">
          <div className="collection__intro reveal">
            <div className="collection__label">
              <span className="eyebrow eyebrow--script">Featured Collection</span>
              <RuleSquiggle className="hand-rule" width={90} height={9} />
            </div>
            <h2>
              Popular Bonsai
              <br />
              Species
            </h2>
            <p>
              Discover some of our most loved varieties, carefully selected for their
              beauty, resilience, and unique character.
            </p>
            <Link className="btn collection__btn" href="/shop">
              View All Collection <span className="arw">&rarr;</span>
            </Link>
          </div>

          <div className="product-row">
            {featured.map((product) => (
              <ProductCard product={product} className="reveal" key={product.id} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
