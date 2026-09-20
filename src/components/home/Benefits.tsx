import {
  IconDelivery,
  IconPottedTree,
  IconSeedling,
  IconSupport,
} from "@/components/icons";

const BENEFITS = [
  {
    title: (
      <>
        Healthy &amp;
        <br />
        Well-Cared For
      </>
    ),
    label: "Healthy and well-cared for",
    icon: <IconSeedling />,
  },
  {
    title: (
      <>
        Safe Shipping
        <br />
        Worldwide
      </>
    ),
    label: "Safe shipping worldwide",
    icon: <IconDelivery />,
  },
  {
    title: (
      <>
        Support for
        <br />
        Every Step
      </>
    ),
    label: "Support for every step",
    icon: <IconSupport />,
  },
  {
    title: (
      <>
        Nature
        <br />
        in Your Space
      </>
    ),
    label: "Nature in your space",
    icon: <IconPottedTree />,
  },
];

export default function Benefits() {
  return (
    <section className="benefits rip rip--top" aria-label="Why buy from Emerald Garden">
      <div className="wrap">
        <ul className="benefits__list">
          {BENEFITS.map((benefit) => (
            <li className="benefit" key={benefit.label}>
              {benefit.icon}
              <h3>{benefit.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
