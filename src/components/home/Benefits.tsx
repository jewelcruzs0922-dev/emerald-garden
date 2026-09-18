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
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 33V17" />
        <path d="M20 22c-7 0-13-6-13-13 7 0 13 6 13 13zM20 22c7 0 13-6 13-13-7 0-13 6-13 13z" />
        <path d="M20 17c0-5-3-8.6-8-10 .6 4.6 3.4 8.4 8 10z" />
      </svg>
    ),
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
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 10h19v15H2z" />
        <path d="M21 14h8l7 7v4H21z" />
        <path d="M29 14v7h7" />
        <circle cx="10" cy="28" r="3.2" />
        <circle cx="28" cy="28" r="3.2" />
        <path d="M13.4 28h11.4M2 24h5" />
      </svg>
    ),
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
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21c-2.6-2.2-4-5-4-8a6.6 6.6 0 0 1 12-4 6.6 6.6 0 0 1 12 4c0 3-1.4 5.8-4 8L20 28l-8-7z" />
        <path d="M15 15.5c-.7 2.2.6 4 2.8 4.8" />
      </svg>
    ),
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
    icon: (
      <svg
        viewBox="0 0 40 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 34V24" />
        <path d="M20 27c-5.4 0-10-4.6-10-10 5.4 0 10 4.6 10 10zM20 27c5.4 0 10-4.6 10-10-5.4 0-10 4.6-10 10z" />
        <path d="M20 17c0-5-3.4-8.6-8.4-9.8C12.4 12.4 15.6 16 20 17zM20 17c0-5 3.4-8.6 8.4-9.8C27.6 12.4 24.4 16 20 17z" />
      </svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Why buy from Emerald Garden">
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
