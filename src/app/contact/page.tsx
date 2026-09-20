import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import Accordion from "@/components/care/Accordion";
import ContactForm from "@/components/contact/ContactForm";
import { IconMail, IconPhone, IconPin } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHead from "@/components/PageHead";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Visit",
  description:
    "Write to Emerald Garden, ask a grower a question, or visit the workshop at 14 Saging Street, Quezon City. We answer every message ourselves.",
  path: "/contact",
});

const FAQ = [
  {
    q: "Can I visit without an appointment?",
    a: "Yes, during opening hours. Weekends can get busy and we keep only a few trees out on the bench, so if you are coming for something specific it is worth a quick message first.",
  },
  {
    q: "Do you repot or trim trees brought from elsewhere?",
    a: "We do, subject to condition. Bring the tree in for a look and we will tell you honestly whether it is worth the work, and when the right season is. There is a bench fee from ₱600 depending on size.",
  },
  {
    q: "Do you do gift wrapping?",
    a: "Happily, at no charge. We wrap in kraft paper with twine and a handwritten card, and we can include a small care card written for whoever receives it.",
  },
  {
    q: "My tree is struggling — is there a fee to ask?",
    a: "Never, if the tree came from us. Send a photo and a sentence or two about where it lives and how you water it, and we will walk you through it. Free advice forever.",
  },
];

export default function ContactPage() {
  return (
    <main id="main">
      <JsonLd
        data={[
          faqSchema(FAQ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <PageHead
        crumb="Contact"
        title="Come say hello."
        lede="Ask us anything — which tree suits a dark apartment, how to rescue a dropping ficus, or whether you can visit on a Saturday. There are no silly questions here, only trees that need different care."
        anno="We reply within a day, usually with too much detail."
      />

      <section className="section section--flush-top">
        <div className="wrap">
          <div className="contact-grid">
            <div className="contact-form reveal">
              <ContactForm />
            </div>

            <div className="reveal">
              <div className="info-list">
                <div className="info-item">
                  <IconPin />
                  <div>
                    <h4>The workshop</h4>
                    <p>
                      14 Saging Street, Barangay Kalusugan
                      <br />
                      Quezon City, Metro Manila 1102
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <IconMail />
                  <div>
                    <h4>Write to us</h4>
                    <p>
                      <a href="mailto:hello@emeraldgarden.ph">hello@emeraldgarden.ph</a>
                      <br />
                      <a href="mailto:care@emeraldgarden.ph">care@emeraldgarden.ph</a> —
                      for sick trees
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <IconPhone />
                  <div>
                    <h4>Call or message</h4>
                    <p>
                      <a href="tel:+63281234567">+63 2 8123 4567</a>
                      <br />
                      <a href="tel:+639171234567">+63 917 123 4567</a> (Viber)
                    </p>
                  </div>
                </div>
              </div>

              <div className="hours">
                <ul>
                  <li>
                    <span>Tuesday – Friday</span>
                    <span>9:00 – 18:00</span>
                  </li>
                  <li>
                    <span>Saturday</span>
                    <span>9:00 – 16:00</span>
                  </li>
                  <li>
                    <span>Sunday</span>
                    <span>
                      10:00 – 14:00 <span className="small muted">(by chance)</span>
                    </span>
                  </li>
                  <li>
                    <span>Monday</span>
                    <span className="closed">Closed — the trees rest</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-paper-2 rip rip--top rip--bottom">
        <div className="wrap wrap--narrow">
          <span className="eyebrow reveal">Before You Write</span>
          <h2 className="reveal" style={{ marginTop: ".7rem" }}>
            A few answers we give most often.
          </h2>
          <div style={{ marginTop: "2rem" }}>
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>
    </main>
  );
}
