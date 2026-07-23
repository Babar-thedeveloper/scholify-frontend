/**
 * announcements.data.ts
 * ---------------------
 * Featured hero announcements - the streaming-style rotating showcase.
 * Add / reorder slides here; the HeroCarousel renders them in order.
 *
 * `icon` is a lucide-react component name (resolved in HeroCarousel).
 * `theme` selects a gradient + accent palette defined in HeroCarousel.
 */

export type AnnouncementTheme =
  | "emerald"
  | "blue"
  | "violet"
  | "amber"
  | "rose";

export interface Announcement {
  /** Small status label, e.g. "Now live". */
  tag: string;
  /** Optional stat chip, e.g. "47+ scholarships". */
  highlight?: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  icon: string;
  theme: AnnouncementTheme;
}

export const announcements: Announcement[] = [
  {
    tag: "Now live",
    highlight: "47+ scholarships",
    title: "Every scholarship for Pakistani students - in one place",
    description:
      "National, international and provincial opportunities, updated daily and completely free. Stop hunting across Facebook groups and WhatsApp.",
    cta: { label: "Browse scholarships", href: "/scholarships" },
    icon: "GraduationCap",
    theme: "emerald",
  },
  {
    tag: "International",
    title: "Chevening, DAAD & Fulbright - applications open now",
    description:
      "Track every global scholarship with email reminders 7, 3 and 1 day before each deadline. Never miss the chance to study abroad.",
    cta: { label: "Explore funded study abroad", href: "/scholarships" },
    icon: "Globe",
    theme: "emerald",
  },
  {
    tag: "New",
    highlight: "12+ internships",
    title: "Paid internships from Pakistan's top companies",
    description:
      "Onsite, remote and paid roles from employers actively hiring student talent - from Daraz to fast-growing startups.",
    cta: { label: "View internships", href: "/internships" },
    icon: "Briefcase",
    theme: "emerald",
  },
  {
    tag: "Free tool",
    title: "Build a professional CV in minutes",
    description:
      "Fill your profile once, generate a polished CV instantly, and let verified recruiters discover you. Update once, use everywhere.",
    cta: { label: "Create your CV", href: "/signup" },
    icon: "FileText",
    theme: "emerald",
  },
  {
    tag: "Give back",
    title: "Help a Pakistani student complete their degree",
    description:
      "100% transparent community donations - every rupee reaches a verified student, with proof of impact for every contribution.",
    cta: { label: "Support a student", href: "#give-back" },
    icon: "HeartHandshake",
    theme: "emerald",
  },
];
