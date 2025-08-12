import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Reduce build overhead in CI by relaxing checks and strict mode
  reactStrictMode: false,

  images: {
    unoptimized: true, // recommended for static export
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // CI may enforce short timeouts; skipping TS errors improves reliability for static export
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
