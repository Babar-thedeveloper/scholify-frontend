import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Opportunity Finder | Scholify",
  description:
    "Let AI find scholarships and internships matched to your profile. Our engine reads your field of study, skills, and level to surface the opportunities you're most likely to win.",
  keywords: [
    "AI scholarship finder",
    "AI internship finder",
    "personalized scholarship recommendations",
    "matched scholarships Pakistan",
    "matched internships Pakistan",
  ],
  alternates: { canonical: `${SITE_URL}/ai-finder` },
  openGraph: {
    title: "AI Opportunity Finder | Scholify",
    description:
      "Let AI find scholarships and internships matched to your profile — field of study, skills, and level.",
    url: `${SITE_URL}/ai-finder`,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    title: "AI Opportunity Finder | Scholify",
    description:
      "Let AI find scholarships and internships matched to your profile.",
  },
};

export default function AiFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
