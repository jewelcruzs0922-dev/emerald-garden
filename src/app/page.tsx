import type { Metadata } from "next";
import Benefits from "@/components/home/Benefits";
import CollectionSection from "@/components/home/CollectionSection";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import StoriesSection from "@/components/home/StoriesSection";
import StorySection from "@/components/home/StorySection";

export const metadata: Metadata = {
  title: "Leaf & Root — Bonsai for a Greener Tomorrow",
  description:
    "A small bonsai shop bringing nature closer to home with carefully grown bonsai trees — perfect for beginners, collectors, and anyone who finds peace in greenery.",
};

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Benefits />
      <StorySection />
      <CollectionSection />
      <HowItWorks />
      <StoriesSection />
      <Newsletter />
    </main>
  );
}
