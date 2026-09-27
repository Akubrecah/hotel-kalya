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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://images.unsplash.com",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
