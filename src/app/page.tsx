import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import { FAQSection } from "@/components/FAQSection";
import StoryCarousel from "@/components/StoryCarousel"; 
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Story {
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  suburb: string;
  date: string;
}

export default async function Home() {
  let products = [];
  try {
    products = await getProducts(1, 10);
  } catch (error) {
    console.error("Home page API Error:", error);
  }

  const postsDirectory = path.join(process.cwd(), "content/posts");
  let latestStories: Story[] = [];

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    latestStories = filenames
      .filter((fn) => fn.endsWith(".md"))
      .map((filename) => {
        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContent);
        
        return {
          slug: filename.replace(".md", ""),
          title: data.title || "Untitled Project",
          coverImage: data.coverImage || "",
          category: data.category || "Installation",
          suburb: data.suburb || "Adelaide",
          date: data.date || ""
        } as Story;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6); 
  }

  return (
    <div className="flex flex-col bg-black">
      {/* 1. Hero Section：全权由 HeroCarousel 接管，文字和底部指示器在轮播图内部 */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center text-white overflow-hidden border-b border-zinc-900/50">
        <HeroCarousel />
      </section>

      <ServiceFeatures />

      {/* 2. Installation Stories Section */}
      {latestStories.length > 0 && (
        <section className="py-24 bg-black border-y border-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Recent <span className="text-[#c5a47e]">Works</span>
                </h2>
                <p className="text-zinc-500 font-light leading-relaxed">
                  Real results from real Adelaide homes. See our professional craftsmanship across 400+ successful installations.
                </p>
              </div>
              <Link 
                href="/blog" 
                className="group flex items-center gap-2 text-[#c5a47e] font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity"
              >
                View All Stories <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <StoryCarousel stories={latestStories} />
          </div>
        </section>
      )}

      {/* 3. Featured Products Collection */}
      <section className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Featured Collection</h2>
            <div className="h-1 w-20 bg-[#c5a47e] rounded-full" />
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 text-zinc-500 border border-zinc-900 rounded-3xl bg-zinc-900/50">
               <p className="text-lg animate-pulse">Preparing our latest smart lock collection...</p>
             </div>
          )}
        </div>
      </section>

      <GoogleReviews />
      <FAQSection />
      <ContactForm />
    </div>
  );
}
