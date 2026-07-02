import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // @react-pdf/renderer ships as ESM; Next.js needs to transpile it.
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
