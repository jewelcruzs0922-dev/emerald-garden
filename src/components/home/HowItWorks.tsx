import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="section how" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title" className="sr-only">
        How It Works
      </h2>
      <Image
        className="how__img"
        src="/img/how-it-works-sheet.png"
        alt="How It Works, illustrated on torn notebook paper: 1. Choose Your Tree — browse the collection and find the perfect bonsai for your space. 2. Place Your Order — secure checkout with safe and flexible payment options. 3. We Pack with Care — your bonsai is carefully packaged for a healthy journey. 4. It Arrives at Your Home — unbox, enjoy, and start your bonsai journey."
        width={2128}
        height={503}
        sizes="100vw"
      />
    </section>
  );
}
