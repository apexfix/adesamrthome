import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../globals.css";
import { RootDocument } from "@/components/RootDocument";
import { siteUrl } from "@/lib/seoData";

// Separate root layout so the Chinese pages are served with <html lang="zh-CN">.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "阿德莱德智能锁安装 | ADE Smart Home",
    template: "%s | ADE Smart Home",
  },
  icons: {
    icon: "/img/logo.png",
    apple: "/img/logo.png",
  },
  robots: { index: true, follow: true },
};

export default function ChineseLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <RootDocument lang="zh">{children}</RootDocument>;
}
