/**
 * homepage.data.ts
 * ----------------
 * Single source of truth for all static homepage copy and content.
 * Edit text here - the section components stay presentation-only.
 *
 * Icons are referenced by their lucide-react component name (string) and
 * resolved in the components via a small icon map, so this file stays free
 * of JSX and can be imported anywhere.
 */

/** Shared content container - matches the navbar/footer width convention. */
export const CONTAINER =
  "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-8xl 2xl:max-w-screen-2xl";

/* ── Section 1 - Hero ───────────────────────────────────────────── */

export const hero = {
  eyebrow: "Pakistan's #1 student opportunity platform",
  headlineTop: "You have the grades.",
  headlineAccent: "We have the opportunities.",
  subtitle:
    "Scholarships, internships, and career opportunities for every Pakistani student — national, international, and everything in between. One platform, zero cost, forever.",
  primaryCta: { label: "Browse scholarships", href: "/scholarships" },
  secondaryCta: { label: "How it works", href: "#how-it-works" },
  trustLine:
    "Trusted by students from NUST, LUMS, FAST, GIKI, UET and 50+ Pakistani universities.",
  /** Floating mockup cards in the hero visual stack. */
  mockCards: [
    {
      kind: "scholarship" as const,
      title: "Chevening 2026",
      meta: "Deadline · 7 Nov",
      badge: "Fully funded",
      rotate: "-rotate-3",
    },
    {
      kind: "scholarship" as const,
      title: "HEC Need-Based",
      meta: "Deadline · 30 Jun",
      badge: "Need-based",
      rotate: "rotate-2",
    },
    {
      kind: "internship" as const,
      title: "Software Intern @ Daraz",
      meta: "Karachi · Paid",
      badge: "Internship",
      rotate: "-rotate-1",
    },
  ],
};

/* ── Section 2 - Impact Bar ─────────────────────────────────────── */

export interface ImpactStat {
  value: string;
  label: string;
}

export const impactStats: ImpactStat[] = [
  { value: "47+", label: "Active scholarships tracked" },
  { value: "PKR 2.4Cr+", label: "In funding opportunities" },
  { value: "12+", label: "Internships posted" },
  { value: "100% Free", label: "For students, forever" },
];

export const impactFootnote = "Updated daily · Last refresh: today";

/* ── Section 3 - Founder Story ──────────────────────────────────── */

export const founder = {
  eyebrow: "Our Story",
  headingTop: "Made by a Pakistani student.",
  headingAccent: "Built for every Pakistani student.",
  name: "Babar",
  title: "Founder · Scholify",
  /** Photo location - drop a real image here to replace the initials avatar. */
  photo: "/founder-placeholder.jpg",
  paragraphs: [
    "During my university years, I missed scholarship after scholarship - not because I wasn't eligible, but because no one ever told me they existed.",
    "Deadlines came and went on Facebook groups I never saw. Opportunities lived in WhatsApp messages I never received. By the time I found out, it was always too late.",
    "I built Scholify so no Pakistani student goes through that again. Every scholarship in one place. Every deadline tracked. Every opportunity visible. Free, forever - because your future shouldn't depend on who you know.",
  ],
  signature: "- Babar, Founder",
};

/* ── Section 4 - Feature Grid ───────────────────────────────────── */

export interface Feature {
  icon: string; // lucide icon name
  title: string;
  description: string;
}

export const featureHeader = {
  eyebrow: "Everything you need",
  heading: "One platform. Every opportunity.",
  subtitle:
    "AI-powered matching, smart CV builder, and deadline alerts — from discovery to application, Scholify covers your entire journey.",
};

export const features: Feature[] = [
  {
    icon: "Sparkles",
    title: "AI opportunity matching",
    description:
      "Our AI analyzes your profile, GPA, and interests to show you exactly which scholarships and internships you're most likely to get. No more guesswork.",
  },
  {
    icon: "FileText",
    title: "AI-powered CV builder",
    description:
      "Add your details once. Our AI generates a professional, ATS-friendly CV tailored for every application — scholarships, internships, and jobs.",
  },
  {
    icon: "Search",
    title: "All scholarships, one place",
    description:
      "HEC, PEEF, Chevening, DAAD, Fulbright - every Pakistani-eligible scholarship in one searchable directory. National, international, and provincial.",
  },
  {
    icon: "Bell",
    title: "Email deadline alerts",
    description:
      "Get email reminders 7, 3, and 1 day before any scholarship closes. Never miss another opportunity because you didn't see it in time.",
  },
  {
    icon: "Briefcase",
    title: "Internships included",
    description:
      "Onsite, remote, paid - connect with Pakistani and international companies looking specifically for student talent.",
  },
  {
    icon: "Users",
    title: "Companies find you",
    description:
      "Build your profile and let recruiters discover you. Reverse the search - opportunities come to you.",
  },
];

/* ── Section 5 - How It Works ───────────────────────────────────── */

export interface Step {
  title: string;
  description: string;
}

export const howItWorksHeader = {
  eyebrow: "Simple process",
  heading: "Three steps. That's it.",
  subtitle: "No complicated forms. No hidden fees. Just opportunities.",
};

export const steps: Step[] = [
  {
    title: "Sign up free",
    description:
      "Create an account in 2 minutes. Just an email. No credit card, no commitments.",
  },
  {
    title: "Build your profile",
    description:
      "Add your university, GPA, and interests. We generate a professional CV automatically.",
  },
  {
    title: "Apply or get found",
    description:
      "Filter scholarships by deadline, apply to internships, or let companies discover you.",
  },
];

/* ── Section 6 - Testimonials ───────────────────────────────────── */

export interface Testimonial {
  quote: string;
  name: string;
  initials: string;
  credential: string;
}

export const testimonialHeader = {
  eyebrow: "Real students. Real stories.",
  heading: "From classrooms in Pakistan to opportunities worldwide.",
  subtitle:
    "These are early Scholify users. More stories are being written every day.",
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I had no idea Chevening existed until I saw it on Scholify. The deadline reminder gave me three weeks to prepare. Six months later, I'm in the UK. This platform genuinely changed my life.",
    name: "Ayesha K.",
    initials: "AK",
    credential: "Chevening Scholar 2026",
  },
  {
    quote:
      "Mujhe nahi pata tha ke HEC ki itni saari scholarships hain. Scholify ne sab ek jagah dikha di, aur reminder mil gaya. Ab main NUST mein need-based scholarship pe parh raha hoon.",
    name: "Hassan R.",
    initials: "HR",
    credential: "NUST Undergraduate",
  },
];

export const testimonialFootnote =
  "* Beta testers and early users. Full success stories coming soon.";

/* ── Section 7 - Give Back ──────────────────────────────────────── */

export const giveBack = {
  eyebrow: "Pakistan ka apna platform",
  headingTop: "Pay it forward.",
  headingAccent: "Help the next student dream.",
  description:
    "Got a scholarship or job through Scholify? Or just want to help a struggling student? Every rupee you donate goes directly to a verified Pakistani student in need - 100% transparent, zero platform fees, and proof of impact for every contribution.",
  campaign: {
    label: "Current campaign",
    title: "Helping Aisha complete her final year at UET",
    raised: "PKR 64,200",
    goal: "PKR 100,000",
    percent: 64,
    donors: "47 donors",
    timeLeft: "6 days left",
    primaryCta: "Donate now",
    secondaryCta: "See where your money goes",
  },
  footnote:
    "Helping students in need · Powered by community · Always transparent.",
};

/* ── Section 8 - FAQ ────────────────────────────────────────────── */

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqHeader = {
  eyebrow: "Questions answered",
  heading: "Common questions, honest answers.",
  subtitle: "No marketing fluff. Just the truth about how Scholify works.",
};

export const faqs: FaqItem[] = [
  {
    question: "Is Scholify really free? Will it always be free?",
    answer:
      "Yes, 100% free for students - and it will always be free. We don't take a cut of your scholarship, we don't charge for premium features, and we don't sell your data. The platform sustains itself through optional company hiring fees and community donations.",
  },
  {
    question: "Where do the scholarships come from? Are they verified?",
    answer:
      "Every scholarship listing comes from official sources - HEC, university financial aid offices, government portals like PEEF and Ehsaas, and verified international organizations like Chevening, DAAD, and Fulbright. We manually verify each one before publishing and update deadlines daily.",
  },
  {
    question: "Can companies actually see my profile? Will I be contacted?",
    answer:
      "Only if you opt in. By default, your profile is private. You can choose to make it visible to verified recruiters when you're ready, and you control who can contact you and when.",
  },
  {
    question:
      "If I get an internship through Scholify, do you take a commission?",
    answer:
      "Never. Students pay nothing. Companies pay a small fee to post jobs and access talent, but the student keeps every rupee of their salary or stipend.",
  },
  {
    question: "Where does my donation actually go?",
    answer:
      "100% to the verified student you're supporting. Scholify takes 0% of donations - we cover transaction costs ourselves. Every donation is tracked, every student is verified through their university, and you get proof of impact (receipts, updates, sometimes a thank-you message).",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Yes. We never sell or share your data with third parties. Your profile information is only visible to recruiters if you make it visible, and you can delete your account and data at any time.",
  },
  {
    question: "Which universities can sign up?",
    answer:
      "Any student enrolled in a recognized Pakistani university or college - public or private - can sign up. We currently have active users from NUST, LUMS, FAST, GIKI, UET, Punjab University, Karachi University, and many more.",
  },
];

export const faqContact = { label: "Still have questions? Get in touch", href: "/contact" };

/* ── Section 9 - Final CTA ──────────────────────────────────────── */

export const finalCta = {
  heading: "Your future is one click away.",
  subtitle:
    "Be among the first Pakistani students to access every opportunity in one place.",
  primaryCta: { label: "Sign up free", href: "/signup" },
  secondaryCta: { label: "Browse scholarships", href: "/scholarships" },
  bullets: ["Free forever", "No credit card", "2-minute signup"],
};

/* ── Section 10 - Footer ────────────────────────────────────────── */

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
  /** brand/social icon name handled by the Footer component */
  icon?: "whatsapp" | "instagram" | "linkedin" | "mail";
}

export const footer = {
  tagline:
    "Pakistan's first complete scholarship, internship, and student opportunity platform.",
  madeIn: "Made in Pakistan, for Pakistani students.",
  columns: [
    {
      heading: "Platform",
      links: [
        { label: "Scholarships", href: "/scholarships" },
        { label: "Internships", href: "/internships" },
        { label: "How it works", href: "#how-it-works" },
      ] as FooterLink[],
    },
    {
      heading: "Resources",
      links: [
        { label: "CV builder", href: "/dashboard/cv" },
        { label: "Application tips", href: "/help" },
        { label: "Blog", href: "/about" },
        { label: "Help center", href: "/help" },
      ] as FooterLink[],
    },
    {
      heading: "Connect",
      links: [
        { label: "Contact us", href: "/help" },
        { label: "WhatsApp updates", href: "#", icon: "whatsapp" },
        { label: "Instagram", href: "#", icon: "instagram" },
        { label: "LinkedIn", href: "#", icon: "linkedin" },
        { label: "hello@scholify.pk", href: "mailto:hello@scholify.pk", icon: "mail" },
      ] as FooterLink[],
    },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Submit a missing scholarship", href: "/help" },
  ] as FooterLink[],
};
