import type { NextConfig } from "next";

const wordpressUrl = process.env.WORDPRESS_URL || "http://45.145.229.20:2031";
const wordpressImageSource = new URL(wordpressUrl);

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer'],
  images: {
    remotePatterns: [
      {
        protocol: wordpressImageSource.protocol.replace(":", "") as "http" | "https",
        hostname: wordpressImageSource.hostname,
        port: wordpressImageSource.port,
        pathname: "/**",
      },
      // 新增 Cloudinary 官方图床白名单
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
    ],
  },
};

export default nextConfig;
