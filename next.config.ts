import type { NextConfig } from "next";

// Security headers applied to every route.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Public, indexable routes → X-Robots-Tag: index, follow.
const PUBLIC_PATHS = [
  "/",
  "/scholarships/:path*",
  "/internships/:path*",
  "/blog/:path*",
  "/postings/:path*",
  "/organizations/:path*",
  "/about",
  "/contact",
  "/help",
  "/privacy",
  "/terms",
  "/ai-cv",
];

// Authenticated / non-public routes → X-Robots-Tag: noindex, nofollow.
const PRIVATE_PATHS = [
  "/dashboard/:path*",
  "/admin/:path*",
  "/org/:path*",
  "/login",
  "/signup",
  "/verify-email/:path*",
  "/accept-invite/:path*",
  "/pending-verification",
];

const nextConfig: NextConfig = {
  devIndicators: false,
  // @react-pdf/renderer ships as ESM; Next.js needs to transpile it.
  transpilePackages: ["@react-pdf/renderer"],
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...PUBLIC_PATHS.map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      })),
      ...PRIVATE_PATHS.map((source) => ({
        source,
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      })),
    ];
  },
};

export default nextConfig;
