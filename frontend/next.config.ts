import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // During builds, we don't want to fail on linting errors/warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // During builds, we don't want to fail on type errors (for now)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
