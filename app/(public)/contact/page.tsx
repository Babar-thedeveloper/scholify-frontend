import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, LifeBuoy, Send, Clock } from "lucide-react";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Contact Scholify";
const DESCRIPTION =
  "Get in touch with the Scholify team - email us, report a problem, or submit a scholarship or internship we're missing. We reply within one business day.";

export const metadata: Metadata = {
  title: `${TITLE} | Scholify`,
  description: DESCRIPTION,
  keywords: ["contact Scholify", "Scholify support", "scholarship help", "submit a scholarship"],
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", title: `${TITLE} · Scholify`, description: DESCRIPTION },
};

const CONTACT_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: TITLE,
  description: DESCRIPTION,
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "hello@scholify.pk",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@scholify.pk",
      availableLanguage: ["English", "Urdu"],
      areaServed: "PK",
    },
  },
};

const METHODS = [
  {
    Icon: Mail,
    title: "Email us",
    body: "For anything - questions, feedback, partnerships. This is the fastest way to reach us.",
    action: { label: "hello@scholify.pk", href: "mailto:hello@scholify.pk" },
  },
  {
    Icon: LifeBuoy,
    title: "Help center",
    body: "Answers to the most common questions about accounts, applications and reminders.",
    action: { label: "Visit help center", href: "/help" },
  },
  {
    Icon: Send,
    title: "Submit a scholarship",
    body: "Know of a scholarship or internship we don't list yet? Tell us and we'll add it.",
    action: { label: "Submit an opportunity", href: "/help" },
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_LD) }} />

      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          We&apos;re here to help
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{TITLE}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{DESCRIPTION}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4 text-emerald-600" /> Typical response time: within one business day
        </p>
      </div>

      {/* Methods */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {METHODS.map(({ Icon, title, body, action }) => (
          <div key={title} className="flex flex-col rounded-2xl border border-border bg-card p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Icon className="size-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <Link
              href={action.href}
              className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              {action.label}
            </Link>
          </div>
        ))}
      </div>

      {/* Big email CTA */}
      <div className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white sm:p-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <MessageCircle className="size-6" /> Have a question?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-emerald-50">
              Send us an email and a real person on the Scholify team will get back to you. No bots, no ticket queues.
            </p>
          </div>
          <a
            href="mailto:hello@scholify.pk"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
          >
            <Mail className="size-4" /> Email hello@scholify.pk
          </a>
        </div>
      </div>
    </div>
  );
}
