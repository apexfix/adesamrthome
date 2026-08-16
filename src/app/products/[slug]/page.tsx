import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import { ShieldCheck, Calendar, Phone, Mail, CheckCircle2, ChevronRight, Zap, Camera } from "lucide-react";
import { ProductGallery } from "@/components/ProductGallery";
import StoryCarousel from "@/components/StoryCarousel"; // 导入案例轮播
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 定义 Story 类型接口
interface Story {
  slug: string;
  title: string;
  coverImage: string;
  category: string;
  suburb: string;
  date: string;
}

function getAttributeValues(attribute: any) {
  if (Array.isArray(attribute.options)) {
    return attribute.options;
  }

  if (Array.isArray(attribute.terms)) {
    return attribute.terms.map((term: any) => term.name || term.slug).filter(Boolean);
  }

  return [];
}

const installationPhotosBySlug: Record<string, { src: string; alt: string }[]> = {
  "lockin-s50m-pro-smart-lock": [
    {
      src: "/img/products/lockin-s50m-pro/real-install-01.jpg",
      alt: "Lockin smart lock installed on black glass entry door in Adelaide",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-02.jpg",
      alt: "Close-up of Lockin smart lock keypad and camera after installation",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-03.jpg",
      alt: "Close-up view of Lockin smart lock camera module on black door",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-04.jpg",
      alt: "Lockin smart lock installed on white front door with sidelights",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-05.jpg",
      alt: "Lockin smart lock product front and interior panel",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-06.jpg",
      alt: "Lockin smart lock installed beside stainless pull handle",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-07.jpg",
      alt: "Real installation close-up of Lockin keypad smart lock",
    },
    {
      src: "/img/products/lockin-s50m-pro/real-install-08.jpg",
      alt: "Lockin smart lock installed on timber entry door",
    },
  ],
};

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

  // 1. 价格计算逻辑
  const minorUnit = product.prices?.currency_minor_unit || 2;
  const divider = Math.pow(10, minorUnit);
  const currentPrice = (parseInt(product.prices?.price || "0") / divider).toFixed(0);
  const regularPrice = (parseInt(product.prices?.regular_price || "0") / divider).toFixed(0);
  const isOnSale = regularPrice !== currentPrice;
  const currencySymbol = product.prices?.currency_symbol || "$";
  
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ src: "/placeholder.jpg", alt: product.name }];
  const installationPhotos = installationPhotosBySlug[slug] || [];

  // 2. 【新增】获取关联的安装案例
  const postsDirectory = path.join(process.cwd(), "content/posts");
  let relatedStories: Story[] = [];

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory);
    const brand = product.name.split(" ")[0]; // 获取品牌名，如 "EZVIZ" 或 "M2"

    relatedStories = filenames
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
      // 筛选：标题中包含品牌名，或者如果没找到，就显示最近的 4 个
      .filter((s) => s.title.toLowerCase().includes(brand.toLowerCase()))
      .slice(0, 4);

    // 如果没有特定品牌的案例，就显示最新的 4 个通用案例
    if (relatedStories.length === 0) {
        relatedStories = filenames
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
            .slice(0, 4);
    }
  }

  return (
    <div className="bg-zinc-950 min-h-screen text-white pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* 面包屑导航 */}
        <nav className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-white transition-colors">Collection</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#c5a47e]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-32">
          {/* 左侧：图片展示 */}
          <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-900 bg-zinc-900/50 shadow-2xl">
            <ProductGallery images={galleryImages} />
            {isOnSale && (
              <div className="absolute top-8 right-8 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg z-20">
                Special Offer
              </div>
            )}
          </div>

          {/* 右侧：产品信息 */}
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

        {/* 详细描述区 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 pt-24 border-t border-zinc-900">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              Technical <span className="text-[#c5a47e]">Specs</span>
            </h2>
            {product.attributes && (
              <dl className="space-y-6">
                {product.attributes.map((attr: any, index: number) => {
                  const values = getAttributeValues(attr);

                  if (values.length === 0) {
                    return null;
                  }

                  return (
                    <div key={`${attr.name}-${attr.id || index}`} className="border-b border-zinc-900 pb-4">
                      <dt className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{attr.name}</dt>
                      <dd className="text-white font-medium">{values.join(", ")}</dd>
                    </div>
                  );
                })}
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

        {installationPhotos.length > 0 && (
          <section className="mt-24 pt-20 border-t border-zinc-900">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
              <div>
                <p className="text-[#c5a47e] text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                  Real Installations
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Adelaide On-Door Photos
                </h2>
              </div>
              <p className="text-zinc-500 max-w-xl text-sm leading-relaxed">
                Real front doors, real retrofits, and real finish quality from local Adelaide installations.
              </p>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 pb-4">
              <div className="flex gap-4">
                {installationPhotos.map((photo) => (
                  <div
                    key={photo.src}
                    className="relative aspect-[4/5] w-[220px] md:w-[260px] shrink-0 overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="260px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 【新增】：关联安装案例区域 */}
        {relatedStories.length > 0 && (
          <div className="mt-40 pt-20 border-t border-zinc-900">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Installation <span className="text-[#c5a47e]">Gallery</span>
                </h2>
                <p className="text-zinc-500 font-light leading-relaxed">
                  Real results from Adelaide homes. See how the {product.name.split(" ")[0]} looks when professionally installed by our team.
                </p>
              </div>
              <Link 
                href="/blog" 
                className="group flex items-center gap-2 text-[#c5a47e] font-bold uppercase tracking-widest text-xs hover:opacity-80 transition-opacity"
              >
                View All Stories <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            <StoryCarousel stories={relatedStories} />
          </div>
        )}

      </div>
    </div>
  );
}
