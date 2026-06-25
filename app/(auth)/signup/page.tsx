import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign up | Scholify",
  description: "Create your free Scholify account.",
};

export default function SignupPage() {
  return (
    <AuthCard
      size="md"
      aside={{
        title: "Hello, future!",
        text: "Join 50,000+ Pakistani students finding scholarships & internships in one place.",
        switchPrompt: "Already have an account?",
        switchLabel: "Sign In",
        switchHref: "/login",
      }}
    >
      <SignupForm />
    </AuthCard>
  );
}
