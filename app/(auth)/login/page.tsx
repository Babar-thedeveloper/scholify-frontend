import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in | Scholify",
  description: "Sign in to your Scholify account.",
};

export default function LoginPage() {
  return (
    <AuthCard
      size="sm"
      aside={{
        title: "Welcome back!",
        text: "Pakistan's #1 platform for scholarships & internships- always free for students.",
        switchPrompt: "New to Scholify?",
        switchLabel: "Create Account",
        switchHref: "/signup",
      }}
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
