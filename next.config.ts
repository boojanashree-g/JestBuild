import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    forceSwcTransforms: true, // Force SWC for production builds
  },
};

export default nextConfig;