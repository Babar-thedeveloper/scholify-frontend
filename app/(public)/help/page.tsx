import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Is Scholify free for students?",
    a: "Yes. Scholify is completely free for students. You can browse scholarships and internships, track your applications, and set deadline reminders at no cost.",
  },
  {
    q: "How do I apply to a scholarship or internship?",
    a: "Open any listing and click Apply. Some opportunities are submitted directly through Scholify, while others link out to the organization's own application page — we'll always tell you which before you start.",
  },
  {
    q: "How do organizations get verified?",
    a: "Organizations submit their registration details and official documents during onboarding. Our team reviews each application, and once approved the organization receives a verified badge shown to all applicants.",
  },
  {
    q: "How do deadline reminders work?",
    a: "When you save an opportunity, you can set a reminder a few days before its deadline. We'll notify you by email (and WhatsApp where enabled) so you never miss a closing date.",
  },
  {
    q: "Is my data private?",
    a: "Your profile is private by default. Organizations can only see your details when you apply to one of their listings, or if you explicitly opt in to be discoverable in your privacy settings.",
  },
  {
    q: "How do I report an issue?",
    a: "Email us at hello@scholify.pk with a description of the problem and any screenshots. We typically respond within one business day.",
  },
];

export default function HelpPage() {
  return (
    <div className="px-4 py-12 sm:py-16">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          How can we help?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Search our help center or browse the most common questions about using Scholify.
        </p>
        <div className="relative mx-auto mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search for help…" className="pl-9" />
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Still need help */}
      <div className="mt-12 rounded-xl border border-border bg-white p-6 text-center dark:bg-card">
        <h3 className="font-semibold text-foreground">Still need help?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Our team is here for you. We usually reply within one business day.
        </p>
        <a
          href="mailto:hello@scholify.pk"
          className="mt-4 inline-block font-medium text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400"
        >
          hello@scholify.pk
        </a>
      </div>
    </div>
  );
}
