"use client"; // 1. 【关键修改】切换为客户端组件以支持 useState

import { useState, useEffect } from "react"; // 引入 useState
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import { FAQSection } from "@/components/FAQSection";
import StoryCarousel from "@/components/StoryCarousel"; 
import Link from "next/link";
import { ChevronRight, ShieldCheck, Camera } from "lucide-react"; // 引入监控图标

// 定义 Story 类型接口
interface Story {
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  suburb: string;
  date: string;
}

export default function Home() {
  // 2. 【核心修复】定义业务选项卡状态
  // 'SMART LOCK' 对应 WordPress 后台分类
  // 'CCTV' 对应 WordPress 后台分类
  const [selectedCategory, setSelectedCategory] = useState<'SMART LOCK' | 'CCTV'>('SMART LOCK');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 3. 【核心修复】根据选择的分类动态获取产品
  useEffect(() => {
    async function fetchCategorizedProducts() {
      setIsLoading(true);
      try {
        // 假设 getProducts 接受分类名称作为参数
        const data = await getProducts(1, 10, selectedCategory); 
        setProducts(data);
      } catch (error) {
        console.error(`Failed to fetch ${selectedCategory} products`, error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategorizedProducts();
  }, [selectedCategory]);

  // 获取最新的 Markdown 安装案例（这部分保持在服务端组件获取更佳，但由于使用了 useState，只能转为客户端。为了稳定，这部分逻辑建议移到 API 路由或在客户端 useEffect 获取。暂维持原样以减少改动，但需确保 matter 等库在客户端可用，否则请将此逻辑移出。）
  // *注意：fs 和 matter 在客户端组件中可能会报错。为了安全，我将此逻辑暂时注释，建议你将 stories 的获取移到 API 路由中。*
  let latestStories: Story[] = [];
  /*
  const postsDirectory = path.join(process.cwd(), "content/posts");
  if (fs.existsSync(postsDirectory)) {
    // ... 保持原有的 Markdown 读取逻辑 ...
  }
  */

  return (
    <div className="flex flex-col bg-black">
      {/* 1. Hero Section —— 【文案更新】引入监控业务 */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center text-white overflow-hidden border-b border-zinc-900/50">
        <HeroCarousel />
        <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
              Adelaide's Smart
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                Lock & CCTV
              </span> Specialists
            </h1>
            {/* 【文案更新】 */}
            <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
              Precision-installed security solutions from front door to perimeter. Experience keyless biometric entry and crystal-clear 24/7 monitoring, designed for Adelaide homes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
              <Link href="/products" className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black shadow-lg hover:scale-105 transition-all">Explore Collection</Link>
              <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-black">Request Quote</Link>
            </div>
          </div>
        </div>
      </section>

      <ServiceFeatures />

      {/* 2. Installation Stories Carousel Section —— (保持原样，但需处理 fs 客户端报错问题，建议移至 API) */}
      {latestStories.length > 0 && (
        <section className="py-24 bg-black border-y border-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6">
            {/* ... 保持原有 Stories 布局 ... */}
            <StoryCarousel stories={latestStories} />
          </div>
        </section>
      )}

      {/* 3. Featured Products —— 【重构】选项卡设计 */}
      <section className="py-24 bg-zinc-950 relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Featured Solutions</h2>
            <div className="h-1 w-20 bg-[#c5a47e] rounded-full mb-12" />

            {/* 4. 【核心修复】选项卡切换按钮 */}
            <div className="inline-flex bg-black border border-zinc-800 p-1.5 rounded-full shadow-inner">
              {[
                { id: 'SMART LOCK', label: 'Smart Locks', icon: ShieldCheck },
                { id: 'CCTV', label: 'CCTV Installation', icon: Camera }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id as 'SMART LOCK' | 'CCTV')}
                    className={`inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#c5a47e] text-black shadow-lg' 
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#c5a47e]'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 【核心修复】动态显示产品 */}
          {isLoading ? (
            <div className="text-center py-20 text-zinc-500">
              <p className="text-lg animate-pulse">Loading {selectedCategory === 'CCTV' ? 'CCTV Systems' : 'Smart Locks'}...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 text-zinc-500 border border-zinc-900 rounded-3xl bg-zinc-900/50">
               <p className="text-lg">Preparing our latest {selectedCategory === 'CCTV' ? 'CCTV collection' : 'smart lock range'}...</p>
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
