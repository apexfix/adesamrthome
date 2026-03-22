import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

export default async function Home() {
  let products = [];
  try {
    // 抓取商品数据
    products = await getProducts(1, 10);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    <div className="flex flex-col bg-black">
      
      {/* 1. Hero Section: 升级为旗舰级排版和动效 */}
      <section className="relative h-[85vh] min-h-[650px] flex items-center justify-center text-white overflow-hidden">
        <HeroCarousel />
        <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
              Protect Your Home
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                Smart & Secure
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
              Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
              <Link
                href="/products"
                className="inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-[#c5a47e] to-[#b39169] px-10 text-sm font-bold tracking-wide text-black shadow-[0_0_30px_rgba(197,164,126,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(197,164,126,0.5)]"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold tracking-wide text-white transition-all hover:bg-white hover:text-black"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Service Features: 无缝衔接的品牌卖点 */}
      <ServiceFeatures />

      {/* 3. Featured Products: 彻底告别大白底，进入暗黑模式 */}
      <section className="py-24 bg-zinc-950 relative overflow-hidden">
        {/* 背景微弱装饰，防止纯黑太单调 */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#c5a47e]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              Featured Products
            </h2>
            <div className="h-1 w-20 bg-[#c5a47e] rounded-full" />
          </div>
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-20 text-zinc-500 border border-zinc-900 rounded-3xl bg-zinc-900/50 backdrop-blur-sm">
               <p className="text-lg">Preparing our latest smart lock collection...</p>
             </div>
          )}
        </div>
      </section>

      {/* 4. Google Reviews: 统一在深色背景下展示信任感 */}
      <div className="bg-zinc-950">
        <GoogleReviews />
      </div>

      {/* 5. Contact Form Section: 最后的业务收口 */}
      <ContactForm />
    </div>
  );
}
