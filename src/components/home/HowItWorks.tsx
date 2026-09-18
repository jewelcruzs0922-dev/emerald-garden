const STEPS = [
  {
    title: "Choose Your Tree",
    copy: "Browse our collection and find the perfect bonsai for your space.",
    art: (
      <svg viewBox="0 0 80 84" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M40 74V40" />
        <path d="M40 46c-11 0-20-9-20-20C20 15 29 6 40 6s20 9 20 20c0 11-9 20-20 20z" />
        <path d="M40 24c-5-4-12-4-17 0M40 24c5-4 12-4 17 0M40 34c-4-3-10-3-14 0M40 34c4-3 10-3 14 0" />
        <path d="M22 74h36l-3 8H25l-3-8z" />
        <path d="M64 14c4-3 8-3 11 0" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    title: "Place Your Order",
    copy: "Secure checkout with safe and flexible payment options.",
    art: (
      <svg viewBox="0 0 80 84" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 30 40 16l26 14v34a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V30z" />
        <path d="M14 30l26 15 26-15M40 45v22" />
        <path d="M27 23l26 15" />
        <path d="M20 8h6l3 6" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    title: "We Pack With Care",
    copy: "Your bonsai is carefully packaged for a healthy journey.",
    art: (
      <svg viewBox="0 0 80 84" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 26h30v26H6z" />
        <path d="M36 34h16l12 12v6H36z" />
        <path d="M52 34v12h12" />
        <circle cx="20" cy="58" r="6" />
        <circle cx="55" cy="58" r="6" />
        <path d="M26 58h23M6 52h8" />
        <path d="M12 20c4-5 10-7 16-5" strokeDasharray="3 4" />
      </svg>
    ),
  },
  {
    title: "It Arrives at Your Home",
    copy: "Unbox, enjoy, and start your bonsai journey!",
    art: (
      <svg viewBox="0 0 80 84" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 38 40 20l28 18v30H12z" />
        <path d="M30 68V50h20v18" />
        <path d="M6 68h68" />
        <path d="M56 44c0-3 2.2-5 5-5 0 3-2.2 5-5 5zM56 44c0-2.6-2-4.4-4.6-4.4 0 2.6 2 4.4 4.6 4.4zM56 44v6M49 50h14" strokeDasharray="2.5 3" />
      </svg>
    ),
  },
];

function StepArrow() {
  return (
    <svg
      className="step__arrow"
      viewBox="0 0 26 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 6h22" />
      <path d="M18 1.6 23.4 6 18 10.4" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="section how">
      <div className="wrap">
        <div className="notebook reveal">
          <div className="notebook__binding" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, index) => (
              <i key={index} />
            ))}
          </div>

          <div className="notebook__head">
            <h2>How It Works</h2>
            <p className="lede">
              Bringing a bonsai into your home is easier than you think.
            </p>
          </div>

          <div className="steps">
            {STEPS.map((step, index) => (
              <div
                className={`step${index === 0 ? " step--1" : ""}`}
                key={step.title}
              >
                <div className="step__art">{step.art}</div>
                <span className="step__num">{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                {index < STEPS.length - 1 ? <StepArrow /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
