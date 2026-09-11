import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['nodemailer'],
  async redirects() {
    return [
      {
        source: "/blog/my-first-blog",
        destination: "/blog/ezviz-dl05-retrofit-adelaide",
        permanent: true,
      },
    ];
  },
  images: {
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
