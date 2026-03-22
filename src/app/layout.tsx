import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Best Smart Lock Installation Adelaide | ADE Smart Home | 2-Year Warranty",
  description: "Professional Smart Lock Installation in Adelaide. Specialized in Philips, Samsung & Yale. 350+ installs with neat-clean-flushed finish. 24-month warranty. Best price guaranteed in South Australia.",
  keywords: ["Smart Lock Installation Adelaide", "Digital Lock Installer Adelaide", "Philips Smart Lock Australia", "Samsung Smart Lock Installation", "Locksmith Adelaide"],
  openGraph: {
    title: "ADE Smart Home | Expert Smart Lock Installation in Adelaide",
    description: "Professional, neat, and secure smart lock solutions for Adelaide homes.",
    url: "https://www.adesmarthome.com.au",
    siteName: "ADE Smart Home",
    locale: "en_AU",
    type: "website",
  },
};

// 构造 JSON-LD 结构化数据 (LocalBusiness / Locksmith)
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Locksmith", // 搜索引擎能精准识别这是一个锁匠/安防服务商
  "name": "ADE Smart Home",
  "image": "https://www.adesmarthome.com.au/img/logo.png", // 确保这是你的绝对路径 Logo
  "@id": "https://www.adesmarthome.com.au",
  "url": "https://www.adesmarthome.com.au",
  "telephone": "+61493343981", // 国际格式电话
  "email": "smarthomeade@gmail.com",
  "priceRange": "$$", // 表明价格区间，对转化率有帮助
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Adelaide", // 锁定城市
    "addressRegion": "SA", // 锁定州
    "addressCountry": "AU" // 锁定国家
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": -34.9285, // 阿德莱德市中心纬度
      "longitude": 138.6007  // 阿德莱德市中心经度
    },
    "geoRadius": "50000" // 服务半径：以阿德市中心为圆心50公里内 (覆盖整个大阿德区)
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    // 如果你有 Facebook Page, Instagram 或小红书链接，可以填在这里，增加企业权威度
    // "https://www.facebook.com/yourpage", 
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 在 head 中注入 JSON-LD 脚本，不影响页面渲染，专门给搜索引擎爬虫看 */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        {/* 如果你之前没有引入 Footer 组件，记得在这里引入 */}
        <Footer />
      </body>
    </html>
  );
}
