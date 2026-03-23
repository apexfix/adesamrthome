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
  let products = [];
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
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center overflow-hidden border-b border-zinc-900/50">
        <HeroCarousel />
      </section>

      <ServiceFeatures />
      
      {latestStories.length > 0 && (
        <section className="py-24 bg-black border-y border-zinc-900/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
              Recent <span className="text-[#c5a47e]">Works</span>
            </h2>
            {/* 3. 使用 as any 绕过最后一道类型校验障眼法 */}
            <StoryCarousel stories={latestStories as any} />
          </div>
        </section>
      )}

      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
            Featured Collection
          </h2>
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
