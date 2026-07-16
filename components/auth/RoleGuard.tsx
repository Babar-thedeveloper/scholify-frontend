"use client";

// Client-side role gate for the mock auth. When real auth lands,
// replace the redirect logic with a server-side session check.
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import {} from "lucide-react";
import { useUser, type UserRole } from "./UserContext";

interface RoleGuardProps {
  allow: UserRole;
  children: React.ReactNode;
}

export function RoleGuard({ allow, children }: RoleGuardProps) {
  const { role, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (role === allow) return;
    // Redirect to the right place for the current role.
    if (role === "guest") router.replace("/login");
    else if (role === "student") router.replace("/dashboard");
    else if (role === "org") router.replace("/org/dashboard");
    else if (role === "admin") router.replace("/admin");
  }, [role, allow, isLoading, router]);

  if (isLoading || role !== allow) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
