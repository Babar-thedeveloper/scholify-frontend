import Link from "next/link";
import { Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";
import { ResendEmailButton } from "./resend-button";

export const metadata = {
  title: "Verify your email | Scholify",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams;
  const displayEmail = email || "your email address";

  return (
    <AuthCard
      size="sm"
      aside={{
        title: "One last step!",
        text: "Verify your email to unlock all Scholify features — scholarships, internships, and more.",
        switchPrompt: "Already verified?",
        switchLabel: "Sign in",
        switchHref: "/login",
      }}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-100 text-primary dark:bg-emerald-500/15">
          <Mail className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve sent a verification link to:
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground break-all">
          {displayEmail}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Click the link in the email to verify your account and access all Scholify features.
        </p>

        <div className="mt-6 flex w-full flex-col gap-2">
          <ResendEmailButton />
          <Button variant="ghost" size="sm" asChild className="text-sm">
            <Link href="/login">← Back to sign in</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder.
        </p>
      </div>
    </AuthCard>
  );
}
