import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { FounderStory } from "@/components/home/FounderStory";
import { AboutValues } from "@/components/about/AboutValues";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "About - Scholify",
  description:
    "Scholify was built by a Pakistani student so no student misses an opportunity again. Read our story and what we stand for.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <FounderStory />
      <AboutValues />
      <FinalCTA />
    </>
  );
}
