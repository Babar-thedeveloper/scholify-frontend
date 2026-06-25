"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OrgSidebar } from "@/components/org/OrgSidebar";

export default function OrgDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allow="org">
      <DashboardShell
        variant="org"
        sidebar={({ onNavigate }) => <OrgSidebar onNavigate={onNavigate} />}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
