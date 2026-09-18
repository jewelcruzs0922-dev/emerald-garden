import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "Leaf & Root began with a single bench, a watering can and a belief that nature brings peace, balance and beauty into everyday life.",
  path: "/about",
});

const VALUES = [
  {
    title: "Patience over speed",
    copy: "A tree that is rushed will show it in a year. We would rather sell you nothing this month than a tree that isn't ready.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 34s-11-6.6-11-14.6A6.2 6.2 0 0 1 20 15a6.2 6.2 0 0 1 11 4.4C31 27.4 20 34 20 34z" />
        <path d="M20 12V5M13 8l-3-4M27 8l3-4" />
      </svg>
    ),
  },
  {
    title: "Suited to your life",
    copy: "We ask about your window before we talk about species. The right tree is the one that fits the room you actually have.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 33V17" />
        <path d="M20 22c-7 0-13-6-13-13 7 0 13 6 13 13zM20 22c7 0 13-6 13-13-7 0-13 6-13 13z" />
        <path d="M12 33h16" />
      </svg>
    ),
  },
  {
    title: "Nothing leaves unhappy",
    copy: "Each tree is packed in a rigid box with damp moss around the roots, and we follow up two weeks later.",
    icon: (
      <svg width="34" height="34" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 12h24l-2 20a2 2 0 0 1-2 1.8H12A2 2 0 0 1 10 32L8 12z" />
        <path d="M14 12V9a6 6 0 0 1 12 0v3" />
        <path d="M15 22c1.6 2.6 3.3 3.9 5 3.9s3.4-1.3 5-3.9" />
      </svg>
    ),
  },
];

const TIMELINE = [
  {
    year: "2018",
    sub: "the bench",
    title: "Two ficus and a notebook",
    copy: "Marisol starts keeping bonsai on a bench behind the house, logging watering times in a school notebook. The notebook is still on the shelf.",
  },
  {
    year: "2019",
    sub: "first stall",
    title: "A Saturday market stall",
    copy: "Twelve trees, a hand-painted sign and a lot of nervous small talk. Eleven went home with new owners. We kept the twelfth.",
  },
  {
    year: "2021",
    sub: "the workshop",
    title: "The garage becomes a growing room",
    copy: "Lights, fans, a proper bench and a repotting corner. We begin growing from cuttings rather than buying in stock.",
  },
  {
    year: "2023",
    sub: "the journal",
    title: "We start writing things down publicly",
    copy: "The care guide begins as a bundle of notes to customers, then turns into the journal you're reading now.",
  },
  {
    year: "Today",
    sub: "still small",
    title: "1,200 trees on their way to being something",
    copy: "We still grow everything ourselves, still answer every message, and still keep the notebook.",
  },
];

const BENCH = [
  {
    role: "The bench",
    title: "Wiring, slowly",
    copy: "A branch takes two or three seasons to set. We re-check the wire every month so it never bites the bark.",
    img: "bonsai-wire-detail.jpg",
    alt: "Close-up of a pine trunk with aged wire marks",
  },
  {
    role: "The kit",
    title: "Six tools, no more",
    copy: "Concave cutters, shears, a root rake and a roll of wire. Everything else is a luxury.",
    img: "bonsai-tools.jpg",
    alt: "Bonsai tools laid out on a work mat",
  },
  {
    role: "The long game",
    title: "Forests take five years",
    copy: "Five trunks planted to look like they grew together by accident. They didn't.",
    img: "bonsai-maple-forest.jpg",
    alt: "A trident maple forest planting",
  },
];

export default function AboutPage() {
  return (
    <main id="main">
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHead
        crumb="About"
        title={
          <>
            Grown slowly, by people
            <br />
            who notice.
          </>
        }
        lede="We are a small team of growers, repotters and one very patient bookkeeper, working out of a converted garage in Quezon City."
        anno="Good things grow slowly."
      />

      <section className="section section--flush-top">
        <div className="wrap">
          <div className="story-lead">
            <figure className="photo reveal">
              <Image
                src="/img/bonsai-juniper-rock.jpg"
                alt="A juniper bonsai growing over a rock, set among moss"
                fill
                sizes="(max-width: 1080px) 100vw, 620px"
              />
            </figure>
            <div className="story-lead__text reveal">
              <span className="eyebrow">Our Story</span>
              <h2>More Than Plants, It's a Lifestyle.</h2>
              <p>
                Leaf &amp; Root was born from a simple belief — that nature brings
                peace, balance, and beauty into our everyday lives. We grow and
                care for bonsai trees for hobbyists, collectors, and anyone who
                wants to bring a little more green into their space.
              </p>
              <p>
                It started on a single bench behind the house: two ficus, a
                juniper that refused to behave, and a notebook of watering
                times. Friends asked for cuttings. Then neighbours asked for
                trees. Then strangers started writing to ask which one would
                survive a north-facing apartment.
              </p>
              <p>
                We still answer those letters ourselves. Every tree is grown
                here, wired here and photographed on the same battered table
                you'll see in half of our pictures.
              </p>
              <p className="story-lead__sign">— Marisol &amp; Ben, growers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-paper-2 rip rip--top rip--bottom">
        <div className="wrap">
          <div className="values">
            {VALUES.map((value) => (
              <div className="value reveal" key={value.title}>
                {value.icon}
                <h3>{value.title}</h3>
                <p>{value.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap wrap--narrow">
          <span className="eyebrow reveal">A Short History</span>
          <h2 className="reveal" style={{ marginTop: ".7rem" }}>
            From one bench to a small workshop.
          </h2>

          <div className="timeline">
            {TIMELINE.map((entry) => (
              <div className="tl-item reveal" key={entry.year}>
                <div className="tl-year">
                  {entry.year}
                  <small>{entry.sub}</small>
                </div>
                <div className="tl-body">
                  <h3>{entry.title}</h3>
                  <p>{entry.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream rip rip--top rip--bottom">
        <div className="wrap">
          <div className="quote-block reveal">
            <blockquote>
              We are not selling a plant. We are handing someone twenty quiet
              minutes a week, for years.
            </blockquote>
            <cite>Marisol Reyes · co-founder &amp; head grower</cite>
          </div>

          <div
            className="values"
            style={{ marginTop: "clamp(2.5rem,5vw,4rem)" }}
          >
            {BENCH.map((entry) => (
              <figure className="grower reveal" key={entry.title}>
                <div className="photo">
                  <Image
                    src={`/img/${entry.img}`}
                    alt={entry.alt}
                    fill
                    sizes="(max-width: 1080px) 50vw, 340px"
                  />
                </div>
                <p className="role" style={{ marginTop: "1rem" }}>
                  {entry.role}
                </p>
                <h3>{entry.title}</h3>
                <p>{entry.copy}</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Come and see the bench. Bring your questions."
        note="We're usually covered in soil, but we're friendly."
        primary={{ href: "/shop", label: "Shop the collection" }}
        secondary={{ href: "/contact", label: "Visit the workshop" }}
      />
    </main>
  );
}
