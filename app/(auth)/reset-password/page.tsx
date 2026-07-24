import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset password | Scholify",
  description: "Set a new password for your Scholify account.",
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <AuthCard
      size="sm"
      aside={{
        title: "Almost done!",
        text: "Pick a strong new password and you're back in- your other sessions will be signed out for safety.",
        switchPrompt: "Know your password?",
        switchLabel: "Sign in",
        switchHref: "/login",
      }}
    >
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
