import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = pageMetadata({
  title: "The Journal",
  description:
    "Notes, care essays and small observations from the Emerald Garden workshop - a little independent magazine about growing things slowly.",
  path: "/journal",
});

const POSTS = [
  {
    id: "indoors",
    img: "bonsai-indoor.jpg",
    alt: "An indoor bonsai beside a bright doorway",
    topic: "Care",
    read: "4 min",
    title: "How to Keep Your Bonsai Happy Indoors",
    teaser:
      "Light, humidity and the one mistake almost everyone makes in their first winter with a ficus.",
  },
  {
    id: "newowner",
    img: "bonsai-tools.jpg",
    alt: "Bonsai tools arranged on a mat",
    topic: "Beginners",
    read: "6 min",
    title: "5 Things Every New Bonsai Owner Should Know",
    teaser:
      "Start here if you've just unboxed your first tree and are afraid to touch it.",
  },
  {
    id: "water",
    img: "bonsai-balcony.jpg",
    alt: "A bonsai on a sunny balcony",
    topic: "Care",
    read: "3 min",
    title: "Watering by Feel, Not by Clock",
    teaser: "Why a schedule will fail you, and what to check with your finger instead.",
  },
  {
    id: "forest",
    img: "bonsai-maple-forest.jpg",
    alt: "A trident maple forest planting",
    topic: "Craft",
    read: "7 min",
    title: "The Quiet Pleasure of a Forest Planting",
    teaser: "Five trunks, one pot, and the trick of making them look accidental.",
  },
  {
    id: "trunk",
    img: "bonsai-wire-detail.jpg",
    alt: "Close view of an aged trunk with wire marks",
    topic: "Craft",
    read: "5 min",
    title: "Reading a Trunk: Age, Movement and Scars",
    teaser:
      "What old wire marks, deadwood and a little lean can tell you about a tree's history.",
  },
  {
    id: "places",
    img: "bonsai-scroll.jpg",
    alt: "A bonsai displayed with a hanging scroll",
    topic: "Rooms",
    read: "4 min",
    title: "Where to Put It: A Short Guide to Sitting a Tree",
    teaser:
      "Windowsills, side tables and the case for moving a bonsai three times before you commit.",
  },
];

export default function JournalPage() {
  return (
    <main id="main">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />
      <PageHead
        crumb="Journal"
        title="The Journal"
        lede="Notes from the bench — what we're learning, what we got wrong, and the small things worth noticing. Written between waterings."
        anno="Written slowly, like everything else here."
      />

      <section className="section section--flush-top">
        <div className="wrap">
          <article className="journal-page__lead reveal" id="time">
            <div>
              <figure className="photo">
                <Image
                  src="/img/bonsai-forest.jpg"
                  alt="A bald cypress bonsai planted over moss and stone"
                  fill
                  sizes="(max-width: 1080px) 100vw, 720px"
                />
              </figure>
              <p className="post__meta" style={{ marginTop: "1.4rem" }}>
                <span>Essay</span>
                <span className="dot" />
                <span>5 min read</span>
                <span className="dot" />
                <span>Marisol Reyes</span>
              </p>
              <h2>Why Bonsai Takes Time — And Why That's Beautiful</h2>
              <p>
                We rush very little here. A trunk thickens by a millimetre a season. A
                branch you wire this spring will only begin to look inevitable three years
                from now, and the tree will keep its own opinion about it the whole time.
              </p>
              <p>
                People often ask how long it takes to &ldquo;make&rdquo; a bonsai. The
                honest answer is that you don&apos;t. You keep a tree alive, you make
                small decisions, and you come back next year to see what it thought of
                them. Somewhere in that exchange the tree becomes something you
                couldn&apos;t have drawn.
              </p>
              <p>
                That is the whole pleasure, as far as we&apos;re concerned: not the
                finished silhouette, but the long, quiet middle where nothing much appears
                to be happening at all.
              </p>
              <div className="tag-row">
                <span className="chip">Patience</span>
                <span className="chip">Essay</span>
                <span className="chip">The long game</span>
              </div>
            </div>

            <aside className="journal-page__side">
              <h4>Browse by topic</h4>
              <ul>
                <li>
                  <a href="#indoors">Care &amp; keeping alive</a>
                </li>
                <li>
                  <a href="#newowner">For beginners</a>
                </li>
                <li>
                  <a href="#forest">Craft &amp; shaping</a>
                </li>
                <li>
                  <a href="#trunk">Reading a tree</a>
                </li>
              </ul>
              <h4 style={{ marginTop: "1.6rem" }}>The small print</h4>
              <p className="hand" style={{ fontSize: "1.15rem", marginTop: ".6rem" }}>
                New notes go out with the newsletter, roughly once a month.
              </p>
              <Link
                className="link-arw"
                href="/#newsletter"
                style={{ marginTop: "1rem" }}
              >
                Subscribe <span className="arw">&rarr;</span>
              </Link>
            </aside>
          </article>
        </div>
      </section>

      <section className="section bg-paper-2 rip rip--top rip--bottom">
        <div className="wrap">
          <div
            className="journal__head reveal"
            style={{ marginBottom: "clamp(1.6rem,3vw,2.4rem)" }}
          >
            <div>
              <span className="eyebrow">More Reading</span>
              <h2>From the archive</h2>
            </div>
          </div>

          <div className="post-grid">
            {POSTS.map((post) => (
              <Link
                className="post reveal"
                href={`#${post.id}`}
                id={post.id}
                key={post.id}
              >
                <div className="photo">
                  <Image
                    src={`/img/${post.img}`}
                    alt={post.alt}
                    fill
                    sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 340px"
                  />
                </div>
                <p className="post__meta" style={{ marginTop: "1rem" }}>
                  <span>{post.topic}</span>
                  <span className="dot" />
                  <span>{post.read}</span>
                </p>
                <h3>{post.title}</h3>
                <p>{post.teaser}</p>
                <span className="post__go">
                  Read <span aria-hidden="true">&rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Every issue ends with trees looking for homes."
        note="See what's ready to travel this week."
        primary={{ href: "/shop", label: "Shop the collection" }}
        secondary={{ href: "/care", label: "Read the care guide" }}
      />
    </main>
  );
}
