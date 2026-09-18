import Image from "next/image";
import Link from "next/link";
import { IconHeart, LeafGlyph } from "@/components/icons";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <Image
          src="/img/bonsai-literati-wide.jpg"
          alt="A literati-style ficus bonsai in an olive pot on a weathered wooden table, lit by warm afternoon light"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            Small Trees,
            <br />
            Big Peace
            <LeafGlyph className="leafglyph" />
          </h1>

          <p className="hero__lede">
            At Emerald Garden, we bring nature closer to home with carefully grown bonsai
            trees — perfect for beginners, collectors, and anyone who finds peace in
            greenery.
          </p>

          <div className="hero__cta">
            <Link className="btn" href="/shop">
              Shop Now <span className="arw">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="hero__side">
          <p className="hero__note">
            A little green goes
            <br />
            a long way
            <IconHeart width={15} height={15} />
          </p>
        </div>
      </div>

      <svg
        className="hero__sprout"
        viewBox="0 0 70 82"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 48h26l-3.4 26a3 3 0 0 1-3 2.6h-13a3 3 0 0 1-3-2.6L22 48z" />
        <path d="M17 48h36" />
        <path d="M35 48V27" />
        <path d="M35 33c0-8 5-13.5 13-15-1 8.5-5.6 13.6-13 15zM35 33c0-8-5-13.5-13-15 1 8.5 5.6 13.6 13 15z" />
        <path d="M35 24c0-5.5 3.4-9.4 9-10.6-.7 4.9-3.9 9.1-9 10.6z" />
      </svg>
    </section>
  );
}
