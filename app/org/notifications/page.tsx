"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  MarkAllReadButton,
  NotificationsList,
} from "@/components/shared/NotificationsList";

export default function OrgNotificationsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <NotificationsList
        header={({ hasUnread, onMarkAllRead, marking }) => (
          <PageHeader
            title="Notifications"
            subtitle="Updates on applicants, postings and your organization"
            action={
              <MarkAllReadButton
                hasUnread={hasUnread}
                onClick={onMarkAllRead}
                marking={marking}
              />
            }
          />
        )}
      />
    </div>
  );
}
