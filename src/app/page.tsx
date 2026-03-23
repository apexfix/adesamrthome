import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import { FAQSection } from "@/components/FAQSection";
import StoryCarousel from "@/components/StoryCarousel"; 
import path from "path";
import fs from "fs";
import matter from "gray-matter";

export default async function Home() {
  let products = [];
  try {
    products = await getProducts(1, 10);
  } catch (e) {
    console.error(e);
  }

  // 获取案例数据
  const postsDirectory = path.join(process.cwd(), "content/posts");
  let latestStories = [];
  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    latestStories = filenames.map(filename => {
      const fileContent = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
      const { data } = matter(fileContent);
      return { slug: filename.replace(".md", ""), ...data };
    }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  }

  return (
    <div className="flex flex-col bg-black">
      {/* Hero 区域：现在只放 HeroCarousel，文字已经集成在组件内部了 */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center overflow-hidden border-b border-zinc-900/50">
        <HeroCarousel />
      </section>

      {/* 剩下的其他组件保持不变 */}
      <ServiceFeatures />
      
      {latestStories.length > 0 && (
        <section className="py-24 bg-black border-y border-zinc-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">Recent <span className="text-[#c5a47e]">Works</span></h2>
            <StoryCarousel stories={latestStories as any} />
          </div>
        </section>
      )}

      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Featured Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <GoogleReviews />
      <FAQSection />
      <ContactForm />
    </div>
  );
}
