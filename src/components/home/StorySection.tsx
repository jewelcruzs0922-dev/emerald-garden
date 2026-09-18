import Image from "next/image";
import Link from "next/link";
import { IconHeart } from "@/components/icons";

const CLOUD =
  "M-23 6c-7-3-9-11-4-16-3-7 3-14 10-12 3-8 12-10 18-5 6-4 15-1 16 6 7 0 11 8 7 14 4 6-1 13-8 13z";

/** Hand-drawn field sketch: a bonsai on a bench with a cup and a book. */
function FieldSketch() {
  return (
    <svg
      className="about__drawing"
      viewBox="0 -14 300 356"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* bench line */}
      <path d="M14 272c60-4 120-5 178-4 32 1 62 2 94 5" opacity=".7" />

      {/* pot */}
      <path d="M90 246h72l-8.6 30.5a7 7 0 0 1-6.7 5.1h-41.4a7 7 0 0 1-6.7-5.1L90 246z" />
      <path d="M83 246h86" />
      <path d="M97 253h68" opacity=".5" />
      {/* pot feet */}
      <path d="M104 282v6M148 282v6" />

      {/* trunk */}
      <path d="M126 246c-3-25 4-42 19-53 10-8 16-17 18-28" />
      <path d="M126 219c9-4 15-11 18-21" />

      {/* branches */}
      <path d="M148 190c-16-1-28-8-35-20" />
      <path d="M160 166c-13-3-22-11-26-23" />
      <path d="M160 196c14-3 23-11 27-23" />
      <path d="M171 146c6-7 14-11 24-11" />

      {/* foliage pads */}
      <g>
        <path d={CLOUD} transform="translate(142 168) scale(1.05)" />
        <path d={CLOUD} transform="translate(196 140) scale(.82)" />
        <path d={CLOUD} transform="translate(103 166) scale(.78)" />
        <path d={CLOUD} transform="translate(166 118) scale(.62)" />
        <path d={CLOUD} transform="translate(205 190) scale(.6)" />
      </g>

      {/* hatching beneath the pot */}
      <g opacity=".5">
        <path d="M108 290l-8 10M128 290l-8 10M148 290l-8 10M164 290l-8 10M98 290l-4 5" />
      </g>
      <path d="M92 290h78" opacity=".5" />

      {/* fallen leaves */}
      <path d="M74 268c-5-4-6-10-3-15 5 1 8 6 8 12" />
      <path d="M214 272c5-4 7-10 4-15-5 1-9 6-9 12" />

      {/* cup */}
      <g>
        <path d="M206 254h38v14a11 11 0 0 1-11 11h-16a11 11 0 0 1-11-11v-14z" />
        <path d="M206 254c0 2.6 8.5 4.6 19 4.6s19-2 19-4.6" />
        <path d="M244 258c8 0 12 3.6 12 8.4 0 4.8-4 8.4-12 8.4" />
        <path d="M214 262c0 6 .8 11 2.4 15" opacity=".45" />
      </g>

      {/* closed book */}
      <g>
        <path d="M28 300l92-11 8 20-92 11z" />
        <path d="M28 300v18l8 2v-20z" />
        <path d="M40 306l-4 20M120 293l8 20" opacity=".5" />
      </g>
    </svg>
  );
}

export default function StorySection() {
  return (
    <section className="section about">
      <div className="wrap">
        <div className="about__grid">
          <div className="about__left reveal">
            <svg
              className="about__branch"
              viewBox="0 0 150 240"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 236C40 196 62 158 70 118c6-30 24-52 56-64" />
              <path d="M70 118c-12-2-22-10-27-22M88 92c-13-1-23-8-29-19M108 70c-11-3-19-11-22-22M76 134c11-4 19-12 23-23M56 168c12-2 22-9 27-19M38 200c11-1 21-7 27-16" />
              <path d="M40 92c-4-5-5-12-2-18M52 66c-3-5-3-12 0-17" />
            </svg>

            <figure className="about__photo polaroid polaroid--tape">
              <div className="photo">
                <Image
                  src="/img/bonsai-indoor.jpg"
                  alt="A bonsai beside a bright window in a warm room"
                  fill
                  sizes="(max-width: 1080px) 80vw, 400px"
                />
              </div>
            </figure>

            <div className="about__companion">
              <p className="hand">
                More than
                <br />
                just a plant,
                <br />
                it&apos;s a companion
              </p>
              <svg
                width="30"
                height="30"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 34V22" />
                <path d="M20 26c-6 0-11-5-11-11 6 0 11 5 11 11zM20 26c6 0 11-5 11-11-6 0-11 5-11 11z" />
                <path d="M9 34h22" />
              </svg>
            </div>
          </div>

          <div className="about__body reveal">
            <span className="eyebrow eyebrow--script">About Us</span>
            <h2>
              More Than Plants,
              <br />
              It&apos;s a Lifestyle
            </h2>
            <p>
              Leaf &amp; Root was born from a simple belief — that nature brings peace,
              balance, and beauty into our everyday lives. We grow and care for bonsai
              trees for hobbyists, collectors, and anyone who wants to bring a little more
              green into their space.
            </p>
            <Link className="btn btn--ghost" href="/about">
              Our Story <span className="arw">&rarr;</span>
            </Link>
          </div>

          <div className="about__sketch reveal">
            <FieldSketch />
            <div className="about__sketch-note">
              <p className="hand">
                Good
                <br />
                things
                <br />
                grow slowly
              </p>
              <IconHeart width={14} height={14} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
