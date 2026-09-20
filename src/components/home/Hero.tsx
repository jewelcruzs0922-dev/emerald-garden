import type { SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { LeafGlyph } from "@/components/icons";

/** A hand-drawn outline heart — symmetrical, un-filled, inked in the note's colour. */
function NoteHeart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 20.7C11.6 20.4 4.2 15.2 4.2 10.1 4.2 7.3 6.1 5.5 8.3 5.5c1.8 0 3 1.2 3.7 2.5.7-1.3 1.9-2.5 3.7-2.5 2.2 0 4.1 1.8 4.1 4.6 0 5.1-7.4 10.3-7.8 10.6z" />
    </svg>
  );
}

/**
 * The hero is one continuous scene rather than a stack of UI blocks: a single
 * photograph of the bench, a warm paper veil carrying the copy, and a handful
 * of hand-drawn props resting on the wooden table in the frame. Everything is
 * layered inside `.hero` so the header, sunlight and foreground share the same
 * picture plane.
 */
export default function Hero() {
  return (
    <section className="hero">
        <div className="hero__bg">
        <Image
          src="/img/emerald-hero-media.png"
          alt="Emerald Garden bonsai showcase"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero__sun" aria-hidden="true" />
      </div>

      <div className="hero__body">
        <div className="wrap hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              Small Trees,
              <br />
              Big Peace
              <LeafGlyph className="leafglyph" />
            </h1>

            <p className="hero__lede">
              At Emerald Garden, we bring nature closer to home with carefully grown
              bonsai trees — perfect for beginners, collectors, and anyone who finds peace
              in greenery.
            </p>

            <div className="hero__cta">
              <Link className="btn hero__btn" href="/shop">
                Shop Now <span className="arw">&rarr;</span>
              </Link>
            </div>
          </div>

          <aside className="hero__aside">
            <p className="hero__note">
              A little
              <br />
              green goes
              <br />
              a long way
              <NoteHeart width={30} height={30} />
            </p>
          </aside>
        </div>
      </div>

      <LeafGlyph className="hero__leaf hero__leaf--a" />
      <LeafGlyph className="hero__leaf hero__leaf--b" />
      <LeafGlyph className="hero__leaf hero__leaf--c" />
    </section>
  );
}
