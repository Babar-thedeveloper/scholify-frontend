/** Canonical site origin + name. Override via NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://scholify.pk").replace(/\/$/, "");
export const SITE_NAME = "Scholify";
