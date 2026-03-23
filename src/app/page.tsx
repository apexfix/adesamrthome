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

// 定义案例类型接口
interface Story {
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  suburb: string;
  date: string;
}

export default async function Home() {
  // 1. 获取产品数据（通用获取，不在此进行 Tabs 过滤）
  let products = [];
  try {
    // 获取前 10 个精选产品
    products = await getProducts(1, 10);
  } catch (error) {
    console.error("Home page API Error:", error);
  }

  // 2. 从本地 Markdown 获取最新的安装案例
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
      // 按日期排序
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      // 取前 6 个
      .slice(0, 6); 
  }

  return (
    <div className="flex flex-col bg-black">
      {/* 1. 【还原】原始纯净版 Hero Section */}
      {/* 轮播背景在底层，文字浮在上面，大气且专注 */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center text-white overflow-hidden border-b border-zinc-900/50">
        
        {/* 背景轮播图组件 */}
        <HeroCarousel />
        
        {/* 浮动文字内容区域 */}
        <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* 你的原始标语 */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
              Protect Your Home
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                Smart & Secure
              </span>
            </h1>
            {/* 你的原始描述 */}
            <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
              Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.
            </p>
            {/* 原始按钮区域 */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
              <Link href="/products" className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-black text-black shadow-[0_0_40px_rgba(197,164,126,0.25)] hover:scale-105 transition-all uppercase tracking-widest">Shop Collection</Link>
              <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-black uppercase tracking-widest">Get a Quote</Link>
            </div>
          </div>
        </div>
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

      {/* 3. Featured Products Collection (下方列表) */}
      <section className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Featured Collection</h2>
            <div className="h-1 w-20 bg-[#c5a47e] rounded-full" />
          </div>
          {/* 产品网格展示 */}
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
