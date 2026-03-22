import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer'],
  images: {
    remotePatterns: [
      // 保留你原本的 IP 图片源
      {
        protocol: "http",
        hostname: "45.145.229.20",
        port: "2031",
        pathname: "/**",
      },
      // 新增 Cloudinary 官方图床白名单
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
