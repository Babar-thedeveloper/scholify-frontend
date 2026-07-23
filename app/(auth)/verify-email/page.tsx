import { AuthCard } from "@/components/auth/AuthCard";
import { VerifyClient } from "./verify-client";

export const metadata = {
  title: "Verify your email | Scholify",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string; token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email, token } = await searchParams;

  return (
    <AuthCard
      size="sm"
      aside={{
        title: token ? "Almost there!" : "One last step!",
        text: "Verify your email to unlock all Scholify features- scholarships, internships, and more.",
        switchPrompt: "Already verified?",
        switchLabel: "Sign in",
        switchHref: "/login",
      }}
    >
      <VerifyClient email={email} token={token} />
    </AuthCard>
  );
}
