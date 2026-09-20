import Image from "next/image";
import Link from "next/link";
import { RuleSquiggle } from "@/components/icons";

export default function StorySection() {
  return (
    <section className="section about">
      <div className="wrap">
        <div className="about__grid">
          <div className="about__left">
            <figure className="about__photo polaroid polaroid--tape reveal">
              <div className="photo">
                <Image
                  src="/img/bonsai-ficus.jpg"
                  alt="A bonsai beside a bright window in a warm room"
                  fill
                  sizes="(max-width: 1080px) 80vw, 480px"
                />
              </div>
            </figure>
          </div>

          <div className="about__body reveal">
            <div className="about__label">
              <span className="eyebrow eyebrow--script">About Us</span>
              <RuleSquiggle className="hand-rule" width={90} height={9} />
            </div>
            <h2>
              More Than Plants,
              <br />
              It&apos;s a Lifestyle
            </h2>
            <p>
              Emerald Garden was born from a simple belief — that nature brings peace,
              balance, and beauty into our everyday lives. We grow and care for bonsai
              trees for hobbyists, collectors, and anyone who wants to bring a little more
              green into their space.
            </p>
            <Link className="btn btn--ghost" href="/about">
              Our Story <span className="arw">&rarr;</span>
            </Link>
          </div>

          <figure className="about__sketch reveal">
            <Image
              className="about__sketch-img"
              src="/img/bonsai-sketch-paper.png"
              alt="A pencil sketch of a bonsai on a bench beside a cup and a book, drawn on a taped slip of paper"
              width={1303}
              height={1207}
              sizes="(max-width: 1080px) 80vw, 480px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
