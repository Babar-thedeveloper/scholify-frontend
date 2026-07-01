"use client";

// ─────────────────────────────────────────────────────────────
// Save/unsave toggle button for a single posting.
//
// - Hidden entirely for guests + org users (only students save)
// - Optimistic UI: flips immediately on click, rolls back on error
// - Fetches its own initial state on mount so the icon reflects
//   what's in the DB
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUser } from "@/components/auth/UserContext";
import { savePosting, savedStatus, unsavePosting } from "@/lib/api/saved";
import { ApiError } from "@/lib/api/client";

interface Props {
  postingId: string;
  postingSlug: string;
  /** Optional label — defaults to "Save for later" / "Saved". */
  savedLabel?: string;
  unsavedLabel?: string;
}

export function SaveToggle({
  postingId,
  postingSlug,
  savedLabel = "Saved",
  unsavedLabel = "Save for later",
}: Props) {
  const { user, isAuthed, isLoading: authLoading } = useUser();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthed || user.role !== "student") return;
    let cancelled = false;
    (async () => {
      try {
        const status = await savedStatus([postingId]);
        if (!cancelled) setSaved(!!status[postingId]);
      } catch {
        /* silent */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => { cancelled = true; };
  }, [postingId, isAuthed, authLoading, user.role]);

  // Only students can save.
  if (authLoading || !isAuthed || user.role !== "student") return null;

  async function toggle() {
    setBusy(true);
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      if (wasSaved) {
        await unsavePosting(postingId);
        toast.success("Removed from saved items");
      } else {
        const res = await savePosting({ postingId, postingSlug });
        toast.success(res.message);
      }
    } catch (err) {
      setSaved(wasSaved);
      toast.error(err instanceof ApiError ? err.message : "Couldn't update saved state.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      variant={saved ? "secondary" : "outline"}
      size="lg"
      className="w-full"
      onClick={toggle}
      disabled={busy || !hydrated}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Bookmark className={saved ? "size-4 fill-current" : "size-4"} />
      )}
      {saved ? savedLabel : unsavedLabel}
    </Button>
  );
}
