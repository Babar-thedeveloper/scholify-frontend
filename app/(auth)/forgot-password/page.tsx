import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot password | Scholify",
  description: "Reset your Scholify account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      size="sm"
      aside={{
        title: "Forgot password?",
        text: "No worries- we'll email you a secure link to reset it in seconds.",
        switchPrompt: "Remembered it?",
        switchLabel: "Sign in",
        switchHref: "/login",
      }}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
