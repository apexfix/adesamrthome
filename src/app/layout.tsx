import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OpeningGate } from "@/components/OpeningGate";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 标题：品牌 + 核心业务 + 地区 + 核心卖点（2年质保）
  title: "Best Smart Lock Installation Adelaide | ADE Smart Home | 2-Year Warranty",
  // 描述：包含品牌名(Philips/Samsung)、服务数量(350+)、服务地区(Adelaide)
  description: "Professional Smart Lock Installation in Adelaide. Specialized in Philips, Samsung & Yale. 350+ installs with neat-clean-flushed finish. 24-month warranty. Best price guaranteed in South Australia.",
  keywords: ["Smart Lock Installation Adelaide", "Digital Lock Installer Adelaide", "Philips Smart Lock Australia", "Samsung Smart Lock Installation", "Locksmith Adelaide"],
  // 增加 OpenGraph，让你的网站发在 WhatsApp 或 Facebook 时显示更好看
  openGraph: {
    title: "ADE Smart Home | Expert Smart Lock Installation in Adelaide",
    description: "Professional, neat, and secure smart lock solutions for Adelaide homes.",
    url: "https://www.adesmarthome.com.au",
    siteName: "ADE Smart Home",
    locale: "en_AU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <OpeningGate />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
}
