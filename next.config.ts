import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This project sits beside other lockfiles; pin the workspace root so
  // Turbopack/Next resolves from here and not a parent directory.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Service pages retired in the Oasis Orchard Stack rebrand.
  async redirects() {
    return [
      {
        source: "/services/web-development-nigeria",
        destination: "/services/web-development-canada",
        permanent: true,
      },
      {
        source: "/services/ai-product-features",
        destination: "/services/business-automation",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
