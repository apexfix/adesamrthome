import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Two root layouts (English (site) group and /zh) need a dedicated 404 document.
  experimental: { globalNotFound: true },
  serverExternalPackages: ['nodemailer'],
  async redirects() {
    return [
      {
        source: "/blog/my-first-blog",
        destination: "/blog/ezviz-dl05-retrofit-adelaide",
        permanent: true,
      },
      // CCTV kits are no longer sold; the site covers smart locks only.
      { source: "/products/security-camera-kits", destination: "/products", permanent: true },
      { source: "/products/dahua-5mp-2-camera-poe-security-kit", destination: "/products", permanent: true },
      { source: "/products/dahua-6mp-smart-dual-light-2-camera-poe-kit", destination: "/products", permanent: true },
      { source: "/blog/security-camera-kits-adelaide-buying-guide", destination: "/blog", permanent: true },
      // Near-duplicate installation pages were competing for the same searches; one hub page now covers them.
      {
        source: "/smart-lock-installer-adelaide",
        destination: "/smart-lock-installation-adelaide",
        permanent: true,
      },
      {
        source: "/digital-door-lock-adelaide",
        destination: "/smart-lock-installation-adelaide",
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
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/img/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    minimumCacheTTL: 86400,
    qualities: [65, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
