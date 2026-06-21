import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactBar } from "@/components/home/ImpactBar";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { GiveBackSection } from "@/components/home/GiveBackSection";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Scholify — Pakistan's #1 Scholarship & Internship Platform",
  description:
    "Find every scholarship and internship for Pakistani students in one place. National, international, and provincial. 100% free, deadline reminders included.",
  openGraph: {
    title: "Scholify — Pakistan's #1 Scholarship & Internship Platform",
    description:
      "Find every scholarship and internship for Pakistani students in one place. National, international, and provincial. 100% free, deadline reminders included.",
    images: ["/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImpactBar />
      <FeatureGrid />
      <HowItWorks />
      <Testimonials />
      <GiveBackSection />
      <FAQ />
      <FinalCTA />
    </>
  );
}
