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
  async redirects() {
    return [
      {
        source: "/accommodation",
        destination: "/services/accommodation",
        permanent: true,
      },
      {
        source: "/dining",
        destination: "/services/food-service",
        permanent: true,
      },
      {
        source: "/conference",
        destination: "/services/conferences",
        permanent: true,
      },
      {
        source: "/conferences",
        destination: "/services/conferences",
        permanent: true,
      },
      {
        source: "/catering",
        destination: "/services/outside-catering",
        permanent: true,
      },
      {
        source: "/gardens",
        destination: "/services/garden-experience",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
