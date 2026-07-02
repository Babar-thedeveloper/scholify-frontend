import { AuthCard } from "@/components/auth/AuthCard";
import { AcceptInviteClient } from "./accept-invite-client";

export const metadata = {
  title: "Accept invitation | Scholify",
};

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function AcceptInvitePage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <AuthCard
      size="md"
      aside={{
        title: "Join your team",
        text: "You've been invited to manage scholarships and internships on Scholify on behalf of your organization.",
        switchPrompt: "Already have an account?",
        switchLabel: "Sign in",
        switchHref: "/login",
      }}
    >
      <AcceptInviteClient token={token} />
    </AuthCard>
  );
}
