// ═════════════════════════════════════════════════════════════
// Scholify · Reminders API
// ═════════════════════════════════════════════════════════════
import { apiFetch } from "./client";

export type ReminderChannel = "email" | "whatsapp" | "sms" | "in_app";

export interface ReminderDto {
  id: string;
  postingId: string;
  postingSlug: string;
  postingTitle: string;
  organizationName: string;
  type: "internship" | "scholarship";
  deadlineAt: string | null;
  remindAt: string;
  daysBefore: number;
  channel: ReminderChannel | string;
  isActive: boolean;
  lastSentAt: string | null;
  createdAt: string;
}

export interface ListRemindersResponse {
  items: ReminderDto[];
  total: number;
}

const BASE = "/api/v1/reminders";

export async function listReminders(): Promise<ListRemindersResponse> {
  return apiFetch<ListRemindersResponse>(BASE);
}

export interface CreateReminderInput {
  postingId?: string;
  postingSlug?: string;
  daysBefore: number;
  channel?: ReminderChannel;
}

export interface CreateReminderResult {
  reminder: ReminderDto;
  message: string;
}

export async function createReminder(input: CreateReminderInput): Promise<CreateReminderResult> {
  return apiFetch<CreateReminderResult>(BASE, { method: "POST", body: input });
}

export interface PatchReminderInput {
  daysBefore?: number;
  channel?: ReminderChannel;
  isActive?: boolean;
}

export async function patchReminder(
  id: string,
  input: PatchReminderInput
): Promise<CreateReminderResult> {
  return apiFetch<CreateReminderResult>(
    `${BASE}/${encodeURIComponent(id)}`,
    { method: "PATCH", body: input }
  );
}

export async function deleteReminder(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
}
