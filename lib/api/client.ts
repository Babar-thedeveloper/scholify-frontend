// ─────────────────────────────────────────────────────────────
// Base API client.
//
// Every call:
//  - prefixes NEXT_PUBLIC_API_URL
//  - sends `credentials: "include"` so cookies travel both ways
//  - JSON-encodes the body when present
//  - parses the standardized error shape: { error: { code, message, details? } }
//  - on a 401, transparently calls /api/v1/auth/refresh and retries ONCE
//
// We never touch tokens directly — cookies are HTTP-only and handled
// by the browser. The frontend just keeps the user object in React state.
// ─────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const AUTH_PREFIX = "/api/v1/auth";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
    /** Short id the user can quote to support — matches a server log entry. */
    public readonly requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable request body. */
  body?: unknown;
  /** Skip the 401-refresh retry (used internally for the refresh call itself). */
  skipRefresh?: boolean;
}

/**
 * `apiFetch` is the only function callers should use. Returns the parsed
 * JSON body, or `undefined` for 204 responses.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const res = await rawFetch(path, options);

  // Try one refresh-and-retry on 401 (except on auth routes themselves).
  if (
    res.status === 401 &&
    !options.skipRefresh &&
    !path.startsWith(AUTH_PREFIX)
  ) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const retry = await rawFetch(path, options);
      return parseOrThrow<T>(retry);
    }
  }

  return parseOrThrow<T>(res);
}

// ─── Internals ───────────────────────────────────────────────

async function rawFetch(path: string, options: RequestOptions): Promise<Response> {
  const { body, skipRefresh, headers, ...rest } = options;
  const hasBody = body !== undefined;
  return fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });
}

async function parseOrThrow<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;

  // Read once. If JSON parse fails, surface a synthetic error.
  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    if (!res.ok) {
      throw new ApiError(res.status, "NETWORK", `Request failed (${res.status})`);
    }
    return undefined as T;
  }

  if (!res.ok) {
    const err = (payload as {
      error?: { code: string; message: string; details?: unknown; requestId?: string };
    }).error;
    throw new ApiError(
      res.status,
      err?.code ?? "UNKNOWN",
      err?.message ?? `Request failed (${res.status})`,
      err?.details,
      err?.requestId
    );
  }

  return payload as T;
}

// In-flight refresh deduplication — if 3 requests 401 simultaneously,
// only one refresh call is fired.
let refreshInFlight: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const res = await rawFetch(`${AUTH_PREFIX}/refresh`, {
        method: "POST",
        skipRefresh: true,
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      // Clear after a tick so concurrent callers see the result, then it resets.
      setTimeout(() => { refreshInFlight = null; }, 0);
    }
  })();
  return refreshInFlight;
}
