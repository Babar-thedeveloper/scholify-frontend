// ═════════════════════════════════════════════════════════════
// Scholify · Saved-items API
// ═════════════════════════════════════════════════════════════
import { apiFetch } from "./client";

export interface SavedItemDto {
  id: string;
  postingId: string;
  postingSlug: string;
  postingTitle: string;
  type: "internship" | "scholarship";
  organizationName: string;
  location: string | null;
  stipendAmount: string | null;
  fundingAmount: string | null;
  deadlineAt: string | null;
  savedAt: string;
}

export interface ListSavedResponse {
  items: SavedItemDto[];
  total: number;
}

const BASE = "/api/v1/saved";

export async function listSaved(): Promise<ListSavedResponse> {
  return apiFetch<ListSavedResponse>(BASE);
}

export interface SaveResult {
  postingId: string;
  saved: true;
  message: string;
}

export async function savePosting(input: {
  postingId?: string;
  postingSlug?: string;
}): Promise<SaveResult> {
  return apiFetch<SaveResult>(BASE, { method: "POST", body: input });
}

export async function unsavePosting(postingId: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${encodeURIComponent(postingId)}`, { method: "DELETE" });
}

/** Batch check- returns { [postingId]: isSaved } for the listing page. */
export async function savedStatus(postingIds: string[]): Promise<Record<string, boolean>> {
  if (postingIds.length === 0) return {};
  const { status } = await apiFetch<{ status: Record<string, boolean> }>(
    `${BASE}/status`,
    { method: "POST", body: { postingIds } }
  );
  return status;
}
