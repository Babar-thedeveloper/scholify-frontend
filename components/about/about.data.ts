/**
 * about.data.ts - content for the /about page.
 * `icon` values are lucide-react component names resolved in the components.
 */

export const aboutHero = {
  eyebrow: "About Scholify",
  headingTop: "We're leveling the playing field",
  headingAccent: "for every Pakistani student.",
  intro:
    "Scholify exists for one reason: no Pakistani student should miss a life-changing opportunity simply because they never heard about it. We bring every scholarship, internship and student opportunity into one place - free, verified, and updated daily.",
  stats: [
    { value: "47+", label: "Scholarships tracked" },
    { value: "50+", label: "Universities reached" },
    { value: "100%", label: "Free for students" },
  ],
};

export interface AboutValue {
  icon: string;
  title: string;
  description: string;
}

export const aboutValuesHeader = {
  eyebrow: "What we believe",
  heading: "Principles we don't compromise on.",
  subtitle:
    "Everything we build comes back to these three commitments to Pakistani students.",
};

export const aboutValues: AboutValue[] = [
  {
    icon: "Eye",
    title: "Visibility for all",
    description:
      "Every national, international and provincial opportunity in one searchable place - so no student loses out just because they didn't know it existed.",
  },
  {
    icon: "ShieldCheck",
    title: "Always free, always honest",
    description:
      "No fees for students, no selling your data, and only verified listings from official sources. Your future shouldn't depend on who you know.",
  },
  {
    icon: "HeartHandshake",
    title: "A community that gives back",
    description:
      "Students who win through Scholify help fund the next one. 100% transparent donations, with proof of impact for every contribution.",
  },
];
