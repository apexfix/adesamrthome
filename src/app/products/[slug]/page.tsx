import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import { ShieldCheck, Calendar, Phone, Mail, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { ProductGallery } from "@/components/ProductGallery";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error("Failed to fetch product", error);
  }

  if (!product) {
    notFound();
  }

  // 1. 【核心修复】精准的价格计算逻辑 (WooCommerce Store API)
  const minorUnit = product.prices?.currency_minor_unit || 2;
  const divider = Math.pow(10, minorUnit);
  const currentPrice = (parseInt(product.prices?.price || "0") / divider).toFixed(0);
  const regularPrice = (parseInt(product.prices?.regular_price || "0") / divider).toFixed(0);
  const isOnSale = regularPrice !== currentPrice;
  const currencySymbol = product.prices?.currency_symbol || "$";
  
  // 2. 图像预览回退
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ src: "/placeholder.jpg", alt: product.name }];

  return (
    <div className="bg-zinc-950 min-h-screen text-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* 面包屑导航 - 提升专业感 */}
        <nav className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-white transition-colors">Collection</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#c5a47e]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-32">
          
          {/* 左侧：产品图片展示 (使用你现有的 Gallery 组件) */}
          <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-900 bg-zinc-900/50 shadow-2xl">
            <ProductGallery images={galleryImages} />
            {isOnSale && (
              <div className="absolute top-8 right-8 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg z-20">
                Special Offer
              </div>
            )}
          </div>

          {/* 右侧：产品详情信息 */}
          <div className="flex flex-col">
            <div className="mb-10">
              <p className="text-[#c5a47e] font-bold uppercase tracking-[0.4em] text-[10px] mb-4">
                {product.categories?.[0]?.name || "Premium Smart Security"}
              </p>
              <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black text-[#c5a47e] tracking-tighter">
                  {currencySymbol}{currentPrice}
                </span>
                {isOnSale && (
                  <span className="text-xl text-zinc-600 line-through decoration-zinc-700 font-medium">
                    {currencySymbol}{regularPrice}
                  </span>
                )}
                <span className="ml-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  Inc. GST & Adelaide Install
                </span>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-zinc-800 to-transparent mb-10" />

              <div 
                className="prose prose-invert prose-zinc max-w-none text-zinc-400 font-light leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: product.short_description || "" }} 
              />
            </div>

            {/* 核心卖点卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="w-12 h-12 rounded-2xl bg-[#c5a47e]/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-[#c5a47e]" />
                </div>
                <div>
                  <p className="font-bold text-sm">2-Year Warranty</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Full replacement</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-3xl bg-zinc-900/40 border border-zinc-800/50">
                <div className="w-12 h-12 rounded-2xl bg-[#c5a47e]/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#c5a47e]" />
                </div>
                <div>
                  <p className="font-bold text-sm">Expert Install</p>
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Adelaide Local Team</p>
                </div>
              </div>
            </div>

            {/* 交互按钮区 */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-2 px-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock & Ready for Installation
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  href="/contact"
                  className="h-16 bg-[#c5a47e] text-black hover:bg-[#e8d0a9] rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(197,164,126,0.2)]"
                >
                  <Calendar className="w-5 h-5" />
                  Book Install
                </Link>
                <a 
                  href="tel:0493343981"
                  className="h-16 bg-transparent text-white border-2 border-zinc-800 hover:border-[#c5a47e] rounded-full font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Expert
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 技术参数与详细描述 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 pt-24 border-t border-zinc-900">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              Technical <span className="text-[#c5a47e]">Specs</span>
            </h2>
            {product.attributes && (
              <dl className="space-y-6">
                {product.attributes.map((attr: any) => (
                  <div key={attr.id} className="border-b border-zinc-900 pb-4">
                    <dt className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{attr.name}</dt>
                    <dd className="text-white font-medium">{attr.options.join(", ")}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-8">Product <span className="text-[#c5a47e]">Story</span></h2>
            <div 
              className="prose prose-invert prose-zinc max-w-none text-zinc-400 font-light leading-relaxed prose-headings:text-white prose-img:rounded-[2rem] prose-img:border prose-img:border-zinc-800 shadow-xl"
              dangerouslySetInnerHTML={{ __html: product.description || "" }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
