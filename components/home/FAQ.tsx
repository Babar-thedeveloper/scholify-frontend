import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CONTAINER, faqHeader, faqs, faqContact } from "./homepage.data";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function FAQ() {
  return (
    <section className="w-full bg-background py-20 md:py-28">
      <div className={CONTAINER}>
        <SectionHeading
          eyebrow={faqHeader.eyebrow}
          heading={faqHeader.heading}
          subtitle={faqHeader.subtitle}
        />

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="glass-panel rounded-2xl px-5 py-2 md:px-7 md:py-3">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="py-4 text-base font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link
              href={faqContact.href}
              className="inline-flex items-center gap-1 font-medium text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400"
            >
              {faqContact.label}
              <ArrowRight className="size-3.5" />
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
