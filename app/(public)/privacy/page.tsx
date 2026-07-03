import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Scholify",
  description:
    "How Scholify collects, uses, and protects your personal information.",
};

const SECTIONS = [
  {
    title: "What we collect",
    content:
      "We collect the information you provide when you sign up, build your profile, or apply to opportunities — such as your name, email, university, education details, and CV. We also collect basic usage data to improve the platform.",
  },
  {
    title: "How we use your data",
    content:
      "We use your data to match you with scholarships and internships, send deadline reminders, and help organizations review applications. We do not sell your data to advertisers or unrelated third parties.",
  },
  {
    title: "Profile visibility",
    content:
      "Your profile is private by default. Organizations can only see your details when you apply to one of their listings, or if you explicitly opt in to be discoverable in your privacy settings.",
  },
  {
    title: "Cookies and analytics",
    content:
      "We use essential cookies to keep you logged in and secure. We may use basic analytics to understand how students use the platform so we can keep improving it.",
  },
  {
    title: "Data security",
    content:
      "We use industry-standard security measures to protect your data. Access is restricted, passwords are hashed, and sensitive information is never stored in plain text.",
  },
  {
    title: "Your rights",
    content:
      "You can update or delete your account and data at any time from your settings. If you have questions about your data, contact us at hello@scholify.pk.",
  },
  {
    title: "Changes to this policy",
    content:
      "We may update this Privacy Policy as the platform grows. When we do, the updated date will be shown at the bottom of this page.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          We built Scholify to help students, not to exploit their data. Here is what we do and do not do with your information.
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
