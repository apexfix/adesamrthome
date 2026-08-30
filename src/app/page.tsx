import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import { FAQSection } from "@/components/FAQSection";
import { ServicePathways } from "@/components/ServicePathways";
import StoryCarousel from "@/components/StoryCarousel"; 
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seoData";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: { absolute: "Smart Lock Installation Adelaide | ADE Smart Home" },
  description:
    "Smart lock supply and installation plus installation-only service for compatible customer-supplied locks across Adelaide. Free door compatibility checks and local support.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "en-AU": siteUrl,
      "zh-CN": `${siteUrl}/zh`,
    },
  },
  openGraph: {
    title: "Smart Lock Installation Adelaide | ADE Smart Home",
    description:
      "Adelaide smart lock installers offering installed-price products, installation-only service and free door compatibility checks.",
    url: siteUrl,
    siteName: "ADE Smart Home",
    images: [
      {
        url: "/img/hero1.avif",
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
    images: ["/img/hero1.avif"],
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
    <div className="flex flex-col bg-black">
      <section className="relative h-[82svh] min-h-[680px] max-h-[900px] overflow-hidden border-b border-zinc-900/50">
        <HeroCarousel />
      </section>

      <ServicePathways />
      
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

      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto max-w-[1500px] px-5 text-center md:px-8 xl:px-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <ServiceFeatures />
      <GoogleReviews />
      <FAQSection />
      <ContactForm />
    </div>
  );
}
