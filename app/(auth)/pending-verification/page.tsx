import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Application received | Scholify",
};

interface PendingVerificationPageProps {
  searchParams: Promise<{ org?: string; contact?: string }>;
}

export default async function PendingVerificationPage({
  searchParams,
}: PendingVerificationPageProps) {
  const { org, contact } = await searchParams;
  const orgName = org || "your organization";
  const contactName = contact?.split(" ")[0] || "there";

  return (
    <AuthCard
      size="sm"
      aside={{
        title: "Almost there!",
        text: "We review every organization to keep our student community safe.",
        switchPrompt: "Need help?",
        switchLabel: "Contact us",
        switchHref: "mailto:hello@scholify.pk",
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-primary dark:bg-emerald-500/15">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Application received!</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Thank you, <span className="font-semibold text-foreground">{contactName}</span>.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your organization account for{" "}
          <span className="font-semibold text-foreground">&ldquo;{orgName}&rdquo;</span> is under review.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          We verify all organizations before they go live to protect our student community.
        </p>

        <div className="mt-6 w-full rounded-xl border border-border bg-muted/30 p-4 text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What happens next
          </p>
          <ul className="space-y-1.5 text-sm text-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              Our team reviews your application (1-2 business days)
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              You&apos;ll receive an email once approved
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              Then you can post scholarships / internships
            </li>
          </ul>
        </div>

        <Button variant="outline" size="sm" asChild className="mt-6 text-sm">
          <Link href="/">← Back to home</Link>
        </Button>

        <p className="mt-6 text-xs text-muted-foreground">
          Questions? Contact us at{" "}
          <a href="mailto:hello@scholify.pk" className="font-medium text-primary hover:underline">
            hello@scholify.pk
          </a>
        </p>
      </div>
    </AuthCard>
  );
}
