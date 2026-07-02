"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allow="admin">
      <DashboardShell
        variant="admin"
        sidebar={({ onNavigate }) => <AdminSidebar onNavigate={onNavigate} />}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
