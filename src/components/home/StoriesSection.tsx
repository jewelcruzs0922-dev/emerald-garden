import Image from "next/image";
import Link from "next/link";
import { IconHeart, LeafGlyph } from "@/components/icons";

const STORIES = [
  {
    quote:
      "The quality is amazing! My Ficus arrived in perfect condition and it's already thriving. Highly recommend Leaf & Root!",
    name: "Mariana Santos",
    location: "Quezon City",
    avatar: "/img/avatar-mariana.jpg",
  },
  {
    quote:
      "I was a beginner and their guide really helped me. The customer support is also very responsive and kind. Will definitely buy again!",
    name: "Rafael Cruz",
    location: "Davao City",
    avatar: "/img/avatar-rafael.jpg",
  },
  {
    quote:
      "Such a beautiful experience! The bonsai I received is even more stunning in person. Thank you, Leaf & Root!",
    name: "Angela Dela Torre",
    location: "Manila",
    avatar: "/img/avatar-angela.jpg",
  },
];

export default function StoriesSection() {
  return (
    <section className="section stories">
      <div className="stories__photo" aria-hidden="true">
        <Image
          src="/img/bonsai-green.jpg"
          alt=""
          fill
          sizes="(max-width: 1080px) 0px, 265px"
        />
      </div>

      <div className="wrap">
        <div className="stories__inner">
          <div className="stories__intro reveal">
            <span className="eyebrow eyebrow--script">What Our Customers Say</span>
            <h2>
              Real People,
              <br />
              Real Stories
              <IconHeart width={16} height={16} />
            </h2>
            <p className="lede">
              Join a growing community of bonsai lovers who found peace, beauty, and joy
              in every tree.
            </p>
            <Link className="btn btn--ghost" href="/contact">
              Read More Reviews <span className="arw">&rarr;</span>
            </Link>
          </div>

          <div className="notes">
            {STORIES.map((story) => (
              <figure className="note-card reveal" key={story.name}>
                <Image
                  className="note-card__avatar"
                  src={story.avatar}
                  alt=""
                  width={46}
                  height={46}
                />
                <blockquote>{story.quote}</blockquote>
                <figcaption className="note-card__who">
                  <span className="note-card__name">{story.name}</span>
                  <span className="note-card__loc">{story.location}</span>
                  <span className="stars" aria-label="5 out of 5 stars">
                    ★★★★★
                  </span>
                </figcaption>
                <LeafGlyph width={22} height={22} className="note-card__leaf" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
