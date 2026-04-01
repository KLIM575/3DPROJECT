import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three', 'lenis'],
  turbopack: {},
};

export default nextConfig;
