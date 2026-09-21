import type { Metadata } from "next";
import ErrorBoundary from "@/components/ErrorBoundary";
import Benefits from "@/components/home/Benefits";
import CollectionSection from "@/components/home/CollectionSection";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Newsletter from "@/components/home/Newsletter";
import StoriesSection from "@/components/home/StoriesSection";
import StorySection from "@/components/home/StorySection";

export const metadata: Metadata = {
  title: "Emerald Garden — Bonsai for a Greener Tomorrow",
  description:
    "A small bonsai shop bringing nature closer to home with carefully grown bonsai trees — perfect for beginners, collectors, and anyone who finds peace in greenery.",
};

export default function HomePage() {
  return (
    <main id="main">
      <ErrorBoundary name="Hero">
        <Hero />
      </ErrorBoundary>
      <ErrorBoundary name="Benefits">
        <Benefits />
      </ErrorBoundary>
      <ErrorBoundary name="StorySection">
        <StorySection />
      </ErrorBoundary>
      <ErrorBoundary name="CollectionSection">
        <CollectionSection />
      </ErrorBoundary>
      <ErrorBoundary name="HowItWorks">
        <HowItWorks />
      </ErrorBoundary>
      <ErrorBoundary name="StoriesSection">
        <StoriesSection />
      </ErrorBoundary>
      <ErrorBoundary name="Newsletter">
        <Newsletter />
      </ErrorBoundary>
    </main>
  );
}
