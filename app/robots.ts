import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Authenticated / non-indexable areas - off-limits to every crawler.
const DISALLOW = [
  "/dashboard",
  "/org",
  "/admin",
  "/api",
  "/login",
  "/signup",
  "/accept-invite",
  "/verify-email",
  "/pending-verification",
];

// AI answer engines / training + search crawlers we explicitly welcome to
// public content (so Scholify is citable in AI Overviews, ChatGPT, Perplexity…).
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
