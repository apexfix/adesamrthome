import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import { FAQSection } from "@/components/FAQSection";
import { ServicePathways } from "@/components/ServicePathways";
import { AudiencePathways } from "@/components/AudiencePathways";
import StoryCarousel from "@/components/StoryCarousel"; 
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seoData";
import type { Product } from "@/types";
import Link from "next/link";
import { ArrowRight, Cctv, LockKeyhole, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Smart Lock Installation Adelaide | ADE Smart Home" },
  description:
    "Smart lock supply and installation across Adelaide, plus Dahua security camera kits for homes and small businesses. Compare products and request a local quote.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "x-default": siteUrl,
      "en-AU": siteUrl,
      "zh-CN": `${siteUrl}/zh`,
    },
  },
  openGraph: {
    title: "Smart Lock Installation Adelaide | ADE Smart Home",
    description:
      "Adelaide smart lock installers offering installed-price products, installation-only service and practical Dahua security camera kits.",
    url: siteUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/og/ade-smart-home-adelaide.jpg",
        width: 1200,
        height: 630,
        alt: "ADE Smart Home smart lock installation in Adelaide",
      },
    ],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Lock Installation Adelaide | ADE Smart Home",
    description:
      "Smart lock supply and installation plus installation-only service for compatible customer-supplied locks across Adelaide.",
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
  },
};

// 1. 修改接口名称为 LocalStory，避开命名空间冲突
// 同时移除所有 "?"，确保类型是严格的 string
interface LocalStory {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  category: string;
  suburb: string;
}

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await getProducts(1, 10);
  } catch (e) {
    console.error("Product fetch error:", e);
  }

  const postsDirectory = path.join(process.cwd(), "content/posts");
  let latestStories: LocalStory[] = [];

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    latestStories = filenames
      .filter(fn => fn.endsWith(".md"))
      .map(filename => {
        const fileContent = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
        const { data } = matter(fileContent);
        
        // 2. 强制提供默认字符串值，解决 "undefined is not assignable to string" 错误
        return { 
          slug: filename.replace(".md", ""), 
          title: String(data.title || "Untitled Project"),
          date: String(data.date || ""),
          coverImage: String(data.coverImage || ""),
          category: String(data.category || "Installation"),
          suburb: String(data.suburb || "Adelaide")
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }

  return (
    <main className="flex flex-col bg-black">
      <section className="relative h-[82svh] min-h-[680px] max-h-[900px] overflow-hidden border-b border-zinc-900/50">
        <HeroCarousel />
      </section>

      <ServicePathways />
      <AudiencePathways />
      
      {latestStories.length > 0 && (
        <section className="py-24 bg-black border-y border-zinc-900/50">
          <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
              Recent <span className="text-[#c5a47e]">Works</span>
            </h2>
            <StoryCarousel stories={latestStories} />
          </div>
        </section>
      )}

      <section id="products" className="scroll-mt-20 border-y border-zinc-900 bg-zinc-950 py-20 md:py-24">
        <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
          <div className="mb-10 flex flex-col gap-7 border-b border-zinc-800 pb-10 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
                Products &amp; Services
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
                Choose the right security upgrade
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">
                Compare installed smart locks, book installation for a compatible lock you
                already own, or explore security camera equipment packages.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 xl:w-[620px]">
              {[
                { label: "Smart Locks", href: "/products?category=smart-lock", icon: LockKeyhole },
                { label: "Installation Only", href: "/smart-lock-installation-only-adelaide", icon: Wrench },
                { label: "Camera Kits", href: "/products/security-camera-kits", icon: Cctv },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex min-h-14 items-center justify-between border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/products"
              className="inline-flex min-h-12 items-center gap-2 border border-zinc-700 px-6 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
            >
              View all products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <ServiceFeatures />
      <GoogleReviews />
      <FAQSection />
      <ContactForm />
    </main>
  );
}
