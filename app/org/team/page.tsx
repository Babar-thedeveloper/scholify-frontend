"use client";

import { Users, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default function TeamManagementPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Team Management"
        subtitle="Invite colleagues and manage administration roles for your organization"
      />

      <div className="mt-8">
        <EmptyState
          Icon={Users}
          title="Team Management Coming Soon"
          description="Collaborate with your hiring managers and selection committees. Soon you'll be able to invite teammates, assign custom permissions, and track reviews collectively."
          actionLabel="Invite Team Member (Disabled)"
          actionHref=""
        />
      </div>
    </div>
  );
}
