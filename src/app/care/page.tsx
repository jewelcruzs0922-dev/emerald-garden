import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import Image from "next/image";
import Accordion from "@/components/care/Accordion";
import CareTOC from "@/components/care/CareTOC";
import CtaBand from "@/components/CtaBand";
import { IconCheck } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = pageMetadata({
  title: "Care Guide",
  description:
    "A practical, honest bonsai care guide: light, watering, soil, feeding, pruning, a seasonal calendar, troubleshooting and shipping.",
  path: "/care",
});

const FAQ = [
  {
    q: "Can a bonsai really live indoors?",
    a: "Yes — if you choose the right species. Tropical and sub-tropical trees like ficus, jade and Chinese elm adapt well to bright indoor life. Temperate species such as pine, juniper and maple need a cold winter and belong outdoors.",
  },
  {
    q: "How often should I water?",
    a: "Whenever the top two centimetres of soil are dry. In a hot Manila summer that may be twice a day; in an air-conditioned room in January, twice a week. Check with your finger rather than the calendar.",
  },
  {
    q: "I'm a complete beginner. Which tree?",
    a: "A Ficus Retusa or Chinese Elm. Both forgive missed waterings, tolerate indoor air, and respond quickly to pruning — which is exactly what you want while you're learning to read a tree.",
  },
  {
    q: "Do you ship overseas?",
    a: "Not at the moment. Live plants need phytosanitary certificates and import permits, and we would rather do that properly than badly. Domestic shipping covers all of the Philippines.",
  },
  {
    q: "What if my tree gets sick?",
    a: "Message us with a photo. Most problems are light, water or drainage, and a two-minute conversation usually solves it. We do this for free, forever, for any tree that came from us.",
  },
];

const TROUBLES = [
  {
    title: "Yellow, dropping leaves",
    copy: "Usually too much water, or a cold draught. Check drainage, then move the tree somewhere brighter and less breezy.",
  },
  {
    title: "Crisp brown leaf edges",
    copy: "Too dry, or sitting in an air-conditioned draft. Water thoroughly and raise humidity with a tray of pebbles and water nearby.",
  },
  {
    title: "Long pale shoots",
    copy: "Reaching for light. Move closer to the window and rotate the pot weekly.",
  },
  {
    title: "Sticky residue or webbing",
    copy: "Aphids or spider mite. Wash the foliage, isolate the tree, and treat with insecticidal soap weekly for three weeks.",
  },
  {
    title: "Nothing happens",
    copy: "Sometimes a tree is simply resting. If the bark is firm and green beneath, it is alive. Be patient.",
  },
];

function Point({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <IconCheck width={18} height={18} />
      <span>{children}</span>
    </li>
  );
}

export default function CarePage() {
  return (
    <main id="main">
      <JsonLd
        data={[
          faqSchema(FAQ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Care Guide", path: "/care" },
          ]),
        ]}
      />
      <PageHead
        crumb="Care Guide"
        title="The Care Guide"
        lede="Everything we tell customers in the first ten minutes, written down properly. No mystique, no gatekeeping — bonsai are just trees with small pots and firm opinions."
        anno="When in doubt, water less."
      />

      <section className="section section--flush-top">
        <div className="wrap">
          <div className="care-layout">
            <CareTOC />

            <div className="care-content">
              <article className="care-block" id="light">
                <div className="care-block__head">
                  <span className="care-block__no">01</span>
                  <h2>Light &amp; position</h2>
                </div>
                <p>
                  Light is the single biggest factor in whether your tree thrives or
                  merely survives. A bonsai in good light will use water faster, grow
                  denser and resist pests. There is no fertiliser that fixes a dark
                  corner.
                </p>
                <ul className="care-points">
                  <Point>
                    <b>Indoor trees</b> want a bright window, ideally east or west, with
                    4–6 hours of direct or filtered sun. Rotate the pot a quarter turn
                    every fortnight so the tree doesn't lean.
                  </Point>
                  <Point>
                    <b>Outdoor trees</b> need real sun and real weather. A balcony, a
                    sheltered garden bench or a bright windowsill that opens works well.
                    If the tree came from us as outdoor stock, it stays outdoors.
                  </Point>
                  <Point>
                    <b>Air conditioning</b> dries leaves far faster than people expect.
                    Keep trees clear of direct vents, and away from radiators in the
                    cooler months.
                  </Point>
                </ul>
                <figure className="care-figure">
                  <div className="photo">
                    <Image
                      src="/img/bonsai-indoor.jpg"
                      alt="An indoor bonsai placed beside a bright doorway"
                      fill
                      sizes="(max-width: 1080px) 100vw, 700px"
                    />
                  </div>
                  <figcaption className="caption">
                    A bright doorway is often the best spot in the house.
                  </figcaption>
                </figure>
              </article>

              <article className="care-block" id="water">
                <div className="care-block__head">
                  <span className="care-block__no">02</span>
                  <h2>Watering</h2>
                </div>
                <p>
                  Forget schedules. Water when the tree is thirsty, and check with your
                  finger before you pour. Two centimetres into the soil: if it's dry,
                  water until it runs freely from the drainage holes.
                </p>
                <div className="care-split">
                  <div>
                    <ul className="care-points">
                      <Point>
                        <b>Water thoroughly</b>, not little and often. A shallow splash
                        only wets the surface and encourages weak roots.
                      </Point>
                      <Point>
                        <b>Morning is kindest.</b> Leaves dry through the day, which keeps
                        fungal problems away.
                      </Point>
                      <Point>
                        <b>Rainwater or rested tap water</b> if you can. If not, tap water
                        is fine — don't overthink it.
                      </Point>
                      <Point>
                        <b>Never let a pot sit in water.</b> Empty the saucer ten minutes
                        after watering.
                      </Point>
                    </ul>
                  </div>
                  <figure className="photo">
                    <Image
                      src="/img/bonsai-balcony.jpg"
                      alt="A fig bonsai on a balcony beside a watering can"
                      fill
                      sizes="(max-width: 720px) 100vw, 340px"
                    />
                  </figure>
                </div>
              </article>

              <article className="care-block" id="soil">
                <div className="care-block__head">
                  <span className="care-block__no">03</span>
                  <h2>Soil &amp; repotting</h2>
                </div>
                <p>
                  Bonsai soil is coarse on purpose: it drains fast and holds air around
                  the roots. Most of our trees are in a mix of akadama, pumice and a
                  little lava rock. Repot every two to three years for young trees, longer
                  for older ones.
                </p>
                <ul className="care-points">
                  <Point>
                    <b>Best window:</b> late winter to early spring, just as buds begin to
                    swell and before leaves open.
                  </Point>
                  <Point>
                    <b>Trim the roots,</b> don't just move the tree. Take roughly a third,
                    keeping the fine feeder roots.
                  </Point>
                  <Point>
                    <b>Shade for a week</b> afterwards and hold off fertiliser for about
                    four weeks while new roots form.
                  </Point>
                </ul>
                <figure className="care-figure">
                  <div className="photo">
                    <Image
                      src="/img/bonsai-ficus.jpg"
                      alt="A ficus bonsai with exposed surface roots in a shallow pot"
                      fill
                      sizes="(max-width: 1080px) 100vw, 700px"
                    />
                  </div>
                  <figcaption className="caption">
                    Surface roots are a feature, not an accident — keep them clear of
                    soil.
                  </figcaption>
                </figure>
              </article>

              <article className="care-block" id="feed">
                <div className="care-block__head">
                  <span className="care-block__no">04</span>
                  <h2>Feeding</h2>
                </div>
                <p>
                  A tree in a small pot exhausts its soil quickly. We feed lightly and
                  often through the growing season, and not at all in the depths of winter
                  or the first month after repotting.
                </p>
                <ul className="care-points">
                  <Point>
                    <b>Growing season:</b> a balanced liquid feed every two weeks, diluted
                    to half strength.
                  </Point>
                  <Point>
                    <b>Flowering species</b> appreciate a little more potassium as buds
                    form.
                  </Point>
                  <Point>
                    <b>Too much</b> looks like long, pale, floppy growth and crusty soil.
                    Flush the pot with water and skip a month.
                  </Point>
                </ul>
              </article>

              <article className="care-block" id="prune">
                <div className="care-block__head">
                  <span className="care-block__no">05</span>
                  <h2>Pruning &amp; wiring</h2>
                </div>
                <p>
                  Shaping is a conversation between you and the tree, and you only get one
                  vote per season. Work slowly, step back often, and remove less than you
                  think you should.
                </p>
                <div className="care-split">
                  <figure className="photo">
                    <Image
                      src="/img/bonsai-wire-detail.jpg"
                      alt="Close view of an aged pine trunk showing old wire marks"
                      fill
                      sizes="(max-width: 720px) 100vw, 340px"
                    />
                  </figure>
                  <ul className="care-points" style={{ marginTop: 0 }}>
                    <Point>
                      <b>Structural pruning</b> in late winter while the tree is dormant
                      and you can see the shape.
                    </Point>
                    <Point>
                      <b>Pinching</b> soft new shoots through summer keeps foliage pads
                      tight.
                    </Point>
                    <Point>
                      <b>Wiring</b> sets a branch in one to three seasons. Check monthly;
                      if it bites the bark, remove and reapply next year.
                    </Point>
                  </ul>
                </div>
              </article>

              <article className="care-block" id="seasons">
                <div className="care-block__head">
                  <span className="care-block__no">06</span>
                  <h2>Season by season</h2>
                </div>
                <p>
                  A rough rhythm for a tropical indoor tree. Outdoor and temperate species
                  shift a month or two either way.
                </p>
                <div style={{ overflowX: "auto", marginTop: "1.8rem" }}>
                  <table className="season-table">
                    <caption className="sr-only">Seasonal bonsai care calendar</caption>
                    <thead>
                      <tr>
                        <th scope="col">Season</th>
                        <th scope="col">Water</th>
                        <th scope="col">Feed</th>
                        <th scope="col">Work</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Spring</th>
                        <td>Increasing</td>
                        <td>Resume fortnightly</td>
                        <td>Repot, structural prune, wire</td>
                      </tr>
                      <tr>
                        <th scope="row">Summer</th>
                        <td>Daily, maybe twice</td>
                        <td>Fortnightly</td>
                        <td>Pinch shoots, watch for pests</td>
                      </tr>
                      <tr>
                        <th scope="row">Autumn</th>
                        <td>Easing off</td>
                        <td>Monthly, low nitrogen</td>
                        <td>Light tidy, check wire</td>
                      </tr>
                      <tr>
                        <th scope="row">Winter</th>
                        <td>Sparingly</td>
                        <td>None for most</td>
                        <td>Rest, plan, sharpen tools</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="care-block" id="trouble">
                <div className="care-block__head">
                  <span className="care-block__no">07</span>
                  <h2>Troubleshooting</h2>
                </div>
                <ul className="trouble">
                  {TROUBLES.map((item) => (
                    <li key={item.title}>
                      <strong>{item.title}</strong>
                      <span>{item.copy}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="care-block" id="shipping">
                <div className="care-block__head">
                  <span className="care-block__no">08</span>
                  <h2>Shipping &amp; returns</h2>
                </div>
                <p>
                  Live plants need planning, so we ship Monday to Wednesday only. That way
                  nothing sits in a depot over a weekend.
                </p>
                <ul className="care-points">
                  <Point>
                    <b>Metro Manila:</b> next-day courier, flat ₱180. Free over ₱5,000.
                  </Point>
                  <Point>
                    <b>Provincial:</b> two to four days, from ₱320 depending on island.
                  </Point>
                  <Point>
                    <b>Live arrival guarantee.</b> If a tree arrives damaged, send us a
                    photo within 24 hours and we will replace it or refund you.
                  </Point>
                  <Point>
                    <b>Change of heart:</b> unopened, healthy trees can come back within
                    seven days, minus shipping.
                  </Point>
                </ul>
              </article>

              <article className="care-block" id="faq">
                <div className="care-block__head">
                  <span className="care-block__no">09</span>
                  <h2>FAQ</h2>
                </div>
                <div style={{ marginTop: "1.6rem" }}>
                  <Accordion items={FAQ} />
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        heading="Still stuck? Send us a photo of your tree."
        note="We answer every message ourselves, usually within a day."
        primary={{ href: "/contact", label: "Ask a grower" }}
        secondary={{ href: "/journal", label: "Read the journal" }}
      />
    </main>
  );
}
