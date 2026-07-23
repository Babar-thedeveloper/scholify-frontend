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
  title: "Scholify - Pakistan's #1 Scholarship & Internship Platform",
  description:
    "Find every scholarship and internship for Pakistani students in one place. National, international, and provincial. 100% free, deadline reminders included.",
  alternates: { canonical: "/" },
  keywords: [
    "scholarships in Pakistan",
    "internships in Pakistan",
    "fully funded scholarships",
    "study abroad for Pakistani students",
    "student opportunities Pakistan",
    "free CV builder",
    "deadline reminders",
  ],
  openGraph: {
    title: "Scholify - Pakistan's #1 Scholarship & Internship Platform",
    description:
      "Find every scholarship and internship for Pakistani students in one place. National, international, and provincial. 100% free, deadline reminders included.",
    images: ["/og-image.svg"],
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
