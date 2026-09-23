// =============================================================================
// Hotel Kalya — Next.js Configuration
// =============================================================================

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Unsplash stock images (to be replaced with real hotel photos)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
