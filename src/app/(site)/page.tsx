import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { RevealGroup } from "@/components/RevealGroup";
import { HeroCarousel } from "@/components/HeroCarousel";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import { FAQSection } from "@/components/FAQSection";
import { ServicePathways } from "@/components/ServicePathways";
import { InstallationInclusions } from "@/components/InstallationInclusions";
import { AudiencePathways } from "@/components/AudiencePathways";
import StoryCarousel from "@/components/StoryCarousel"; 
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import type { Metadata } from "next";
import { siteUrl } from "@/lib/seoData";
import type { Product } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Smart Lock Supply & Installation Adelaide | ADE Smart Home" },
  description:
    "Smart lock supply + install from $699 across Adelaide metro. Free remote door check, no deposit, app and fingerprint setup on site. Call 0431 060 390.",
  alternates: {
    canonical: siteUrl,
    languages: {
      "x-default": siteUrl,
      "en-AU": siteUrl,
      "zh-CN": `${siteUrl}/zh`,
    },
  },
  openGraph: {
    title: "Smart Lock Supply & Installation Adelaide | ADE Smart Home",
    description:
      "Smart lock supply + install packages from $699 across Adelaide metro. Free remote door check and no deposit.",
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
    title: "Smart Lock Supply & Installation Adelaide | ADE Smart Home",
    description:
      "Smart lock supply and installation, installation-only services and Dahua CCTV camera kits for Adelaide homes and small businesses.",
    images: ["/img/og/ade-smart-home-adelaide.jpg"],
  },
};

// Named LocalStory to avoid clashing with other Story types.
interface LocalStory {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  category: string;
  suburb: string;
  contentType?: string;
}

export default async function Home() {
  let products: Product[] = [];
  try {
    products = await getProducts(1, 100);
  } catch (e) {
    console.error("Product fetch error:", e);
  }

  // Supply + install packages first; the installation-only card sits last as the secondary option.
  const featuredSlugs = ["lockin-x9-smart-lock", "lockin-s6-max-smart-lock", "lockin-v5-max-smart-lock", "smart-lock-installation-only-service"];
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
      <AudiencePathways />

      <section id="products" className="scroll-mt-20 border-y border-zinc-900 bg-zinc-950 py-20 md:py-24">
        <span id="smart-locks" className="block scroll-mt-28" />
        <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
          <div className="mb-10 flex flex-col gap-7 border-b border-zinc-800 pb-10 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-white md:text-5xl">
                Smart locks with Adelaide installation included
              </h2>
              <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">
                Choose a supplied-and-installed Lockin smart lock, or book us to fit
                a compatible lock you already own. We check your door before booking.
              </p>
            </div>
            <Link href="/products?category=smart-lock" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-[#d9b98f]">
              Browse smart locks <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <RevealGroup className="product-rail -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4">
            {featuredLocks.map((product) => (
              <div key={product.id} className="flex w-[78%] shrink-0 snap-start sm:w-auto [&>a]:w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </RevealGroup>
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
                <h2 className="text-3xl font-bold text-white md:text-5xl">Recent installations across Adelaide</h2>
              </div>
              <Link href="/gallery" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#d9b98f]">View all installations <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
            <StoryCarousel stories={latestStories} />
          </div>
        </section>
      )}
      <GoogleReviews />
      <InstallationInclusions quoteHref="#quote" />
      <FAQSection includeCameras quoteHref="#quote" />
      <ContactForm mixedServices />
    </main>
  );
}
