import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Scholify",
  description:
    "The rules and responsibilities for using Scholify.",
};

const SECTIONS = [
  {
    title: "Accepting the terms",
    content:
      "By using Scholify, you agree to these Terms of Service. If you do not agree, please do not use the platform.",
  },
  {
    title: "Who can use Scholify",
    content:
      "Scholify is for students enrolled in recognized universities or colleges, and for verified organizations offering scholarships or internships. You must provide accurate information and keep your account secure.",
  },
  {
    title: "Student opportunities",
    content:
      "We list scholarships and internships to help students find opportunities. We do our best to verify information, but final eligibility, deadlines, and application decisions are controlled by the organizations offering the opportunity.",
  },
  {
    title: "Organization accounts",
    content:
      "Organizations must provide accurate information and only post genuine opportunities. Misleading or fraudulent listings will result in account suspension.",
  },
  {
    title: "Prohibited use",
    content:
      "Do not use Scholify to spam, scrape data, harass users, post false information, or attempt to bypass security. Misuse may result in account termination.",
  },
  {
    title: "Content and intellectual property",
    content:
      "You keep ownership of the content you upload, such as your CV and profile details. You give us permission to display it to organizations when you apply or choose to be discoverable.",
  },
  {
    title: "Limitation of liability",
    content:
      "Scholify helps connect students with opportunities, but we are not responsible for decisions made by organizations, missed deadlines, or changes to listings. Always verify details directly with the opportunity provider.",
  },
  {
    title: "Changes to these terms",
    content:
      "We may update these Terms as the platform evolves. Continued use after changes means you accept the updated terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="px-4 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Please read these terms carefully before using Scholify.
        </p>
      </div>

      <div className="mt-12 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-lg font-semibold text-foreground">
              {section.title}
            </h2>
            <p className="text-muted-foreground">{section.content}</p>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        Last updated: July 2026
      </p>
    </div>
  );
}
