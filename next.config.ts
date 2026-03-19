import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer'],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "45.145.229.20",
        port: "2031",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
