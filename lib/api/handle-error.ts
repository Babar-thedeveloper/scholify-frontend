import { toast } from "sonner";
import { ApiError } from "./client";

/**
 * Call this in every catch block instead of writing toast logic inline.
 *
 * - Shows the backend's friendly `message` as a toast (always).
 * - Logs `debug` to the console in development (never shown in UI).
 *
 * @param err     The caught value — works with ApiError, Error, or anything.
 * @param fallback Shown when the error has no readable message.
 */
export function handleApiError(err: unknown, fallback = "Something went wrong."): void {
  if (err instanceof ApiError) {
    toast.error(err.message);
    if (err.debug) {
      console.error(`[API ${err.status} ${err.code}] ${err.debug}`, {
        requestId: err.requestId,
        details: err.details,
      });
    }
    return;
  }

  if (err instanceof Error) {
    toast.error(err.message || fallback);
    console.error("[Error]", err);
    return;
  }

  toast.error(fallback);
  console.error("[Unknown error]", err);
}
