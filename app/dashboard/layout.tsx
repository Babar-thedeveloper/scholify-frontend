"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StudentSidebar } from "@/components/dashboard/StudentSidebar";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow="student">
      <DashboardShell
        variant="student"
        sidebar={({ onNavigate }) => <StudentSidebar onNavigate={onNavigate} />}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
