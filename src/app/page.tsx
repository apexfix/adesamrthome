import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import { FAQSection } from "@/components/FAQSection";
import { ServicePathways } from "@/components/ServicePathways";
import { AudiencePathways } from "@/components/AudiencePathways";
import { HomeCameraFeature } from "@/components/HomeCameraFeature";
import { isSecurityCameraKit } from "@/lib/productType";
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
  title: { absolute: "Smart Locks & Security Camera Kits Adelaide | ADE Smart Home" },
  description:
    "Adelaide smart lock installation and Dahua CCTV camera kits. Installed locks from $699, installation-only from $200 and a 2-camera PoE kit for $443.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "x-default": siteUrl,
      "en-AU": siteUrl,
      "zh-CN": `${siteUrl}/zh`,
    },
  },
  openGraph: {
    title: "Smart Locks & Security Camera Kits Adelaide | ADE Smart Home",
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
    title: "Smart Locks & Security Camera Kits Adelaide | ADE Smart Home",
    description:
      "Smart lock supply and installation, installation-only services and Dahua CCTV camera kits for Adelaide homes and small businesses.",
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

  const cameraKit = products.find(isSecurityCameraKit);
  const featuredSlugs = ["smart-lock-installation-only-service", "lockin-x9-smart-lock", "lockin-s6-max-smart-lock", "lockin-v5-max-smart-lock"];
  const featuredLocks = featuredSlugs.flatMap(slug => products.filter(product => product.slug === slug));
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
          suburb: String(data.suburb || "Adelaide"),
          contentType: data.contentType,
        };
      })
      .filter(story => story.contentType !== "guide")
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }

  return (
    <main className="flex flex-col bg-black">
      <section className="home-hero relative overflow-hidden border-b border-zinc-900/50">
        <HeroCarousel />
      </section>

      <ServicePathways />

      {cameraKit && <HomeCameraFeature product={cameraKit} />}

      <section id="products" className="scroll-mt-20 border-y border-zinc-900 bg-zinc-950 py-20 md:py-24">
        <span id="smart-locks" className="block scroll-mt-28" />
        <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
          <div className="mb-10 flex flex-col gap-7 border-b border-zinc-800 pb-10 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
                Keyless entry, locally installed
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">
                Smart lock installation in Adelaide
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">
                Choose a supplied-and-installed Lockin smart lock, or book us to fit
                a compatible lock you already own. We check your door before booking.
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
                  className="glass-control group flex min-h-14 items-center justify-between gap-3 rounded-md border px-4 text-sm font-bold text-white hover:text-[#d9b98f]"
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredLocks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              href="/products"
              className="glass-control inline-flex min-h-12 items-center gap-2 rounded-md border px-6 text-sm font-bold text-white hover:text-[#d9b98f]"
            >
              View all products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {latestStories.length > 0 && (
        <section className="border-b border-zinc-900 bg-black py-16 md:py-24">
          <div className="mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-sm font-semibold text-[#c5a47e]">Installed across Adelaide</p>
                <h2 className="mt-3 text-3xl font-bold text-white md:text-5xl">Recent works</h2>
              </div>
              <Link href="/gallery" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]">View all installations <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <StoryCarousel stories={latestStories} />
          </div>
        </section>
      )}
      <AudiencePathways />
      <ServiceFeatures />
      <GoogleReviews />
      <FAQSection includeCameras />
      <ContactForm mixedServices />
    </main>
  );
}
