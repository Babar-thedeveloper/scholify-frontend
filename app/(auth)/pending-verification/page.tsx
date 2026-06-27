import Link from "next/link";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Application received | Scholify",
};

interface PendingVerificationPageProps {
  searchParams: Promise<{ org?: string; contact?: string; email?: string }>;
}

export default async function PendingVerificationPage({
  searchParams,
}: PendingVerificationPageProps) {
  const { org, contact, email } = await searchParams;
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

        <div className="mt-6 w-full rounded-xl border border-border bg-muted/30 p-4 text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            What happens next
          </p>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">Verify your email first.</span> We&apos;ve sent a link
                to {email ? <span className="font-semibold">{email}</span> : "your inbox"}.
              </span>
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Our team reviews your organization (1–2 business days).</span>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>Once approved you can publish scholarships &amp; internships.</span>
            </li>
          </ul>
        </div>

        {email && (
          <Button asChild className="mt-6 w-full">
            <Link href={`/verify-email?email=${encodeURIComponent(email)}`}>
              Go to verification page
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="sm" asChild className="mt-2 text-sm">
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
