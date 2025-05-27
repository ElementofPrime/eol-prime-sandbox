import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ Allow build despite linting errors
  },
};

export default nextConfig;