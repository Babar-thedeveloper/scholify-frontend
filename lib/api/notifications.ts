// ═════════════════════════════════════════════════════════════
// Scholify · Notifications API
// ═════════════════════════════════════════════════════════════
import { apiFetch } from "./client";

export type NotificationTypeKey =
  | "application_status"
  | "deadline_reminder"
  | "new_applicant"
  | "posting_published"
  | "verification"
  | "system";

export interface NotificationDto {
  id: string;
  type: NotificationTypeKey | string;
  title: string;
  subtitle: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface ListNotificationsResponse {
  items: NotificationDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const BASE = "/api/v1/notifications";

/** Fetch a page of the current user's notifications. */
export async function listNotifications(params: {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
} = {}): Promise<ListNotificationsResponse> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) qs.set(k, String(v));
  }
  const suffix = qs.toString();
  return apiFetch<ListNotificationsResponse>(`${BASE}${suffix ? `?${suffix}` : ""}`);
}

/** Cheap dedicated query used by the bell-badge poller. */
export async function getUnreadCount(): Promise<number> {
  const { count } = await apiFetch<{ count: number }>(`${BASE}/unread-count`);
  return count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${encodeURIComponent(id)}/read`, { method: "POST" });
}

export interface MarkAllReadResult {
  marked: number;
  message: string;
}

export async function markAllNotificationsRead(): Promise<MarkAllReadResult> {
  return apiFetch<MarkAllReadResult>(`${BASE}/mark-all-read`, { method: "POST" });
}
