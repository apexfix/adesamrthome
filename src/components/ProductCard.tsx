import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  // 1. 价格逻辑 (保留你原本强大的 API 兼容性)
  const currencySymbol = product?.prices?.currency_symbol || "AUD$"; 
  const currentRawPrice = product?.prices?.price || product?.prices?.sale_price || product?.price || product?.sale_price;
  const currentPrice = currentRawPrice 
    ? (typeof currentRawPrice === 'string' && parseInt(currentRawPrice) > 1000 ? (parseInt(currentRawPrice) / 100).toFixed(2) : parseFloat(currentRawPrice).toFixed(2)) 
    : null;

  const regularRawPrice = product?.prices?.regular_price || product?.regular_price;
  const regularPrice = regularRawPrice 
    ? (typeof regularRawPrice === 'string' && parseInt(regularRawPrice) > 1000 ? (parseInt(regularRawPrice) / 100).toFixed(2) : parseFloat(regularRawPrice).toFixed(2)) 
    : null;

  const isDiscounted = regularPrice && currentPrice && !isNaN(parseFloat(regularPrice)) && !isNaN(parseFloat(currentPrice)) && parseFloat(regularPrice) > parseFloat(currentPrice);

  const imageSrc = product?.images?.[0]?.src || "/placeholder.jpg";
  const imageAlt = product?.images?.[0]?.alt || product?.name || "Product Image";
  const targetUrl = `/products/${product?.slug || product?.id || ""}`;

  return (
    <div className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm transition-all duration-500 hover:border-[#c5a47e]/50 hover:shadow-[0_0_30px_rgba(197,164,126,0.15)]">
      
      {/* 全局点击层 */}
      <Link href={targetUrl} className="absolute inset-0 z-20">
        <span className="sr-only">View {product?.name}</span>
      </Link>

      {/* 图片区域：增加深色叠加层 */}
      <div className="aspect-square relative bg-zinc-800 overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {/* 图片上的暗角渐变，增强深度感 */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
        
        {/* 折扣标签优化 */}
        {isDiscounted && (
          <div className="absolute top-3 left-3 z-30 bg-[#c5a47e] text-black text-[10px] font-bold px-2 py-1 rounded-full tracking-tighter uppercase shadow-lg">
            Special Offer
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-5 flex flex-col flex-1 relative z-10">
        <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2 mb-3 h-10 md:h-12 leading-snug group-hover:text-[#c5a47e] transition-colors">
          {product?.name || "Premium Smart Lock"}
        </h3>

        <div className="mt-auto pt-4 flex flex-col gap-4">
          <div className="flex flex-col">
            {isDiscounted ? (
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-500 text-xs line-through tracking-tight">
                  Was {currencySymbol}{regularPrice}
                </span>
                <span className="text-[#c5a47e] text-xl font-bold tracking-tight">
                  {currencySymbol}{currentPrice}
                </span>
              </div>
            ) : (
              <span className="text-[#c5a47e] text-xl font-bold tracking-tight">
                {currentPrice ? `${currencySymbol}${currentPrice}` : "Enquire Now"}
              </span>
            )}
          </div>

          {/* 按钮：改为胶囊状，增加吸附感 */}
          <div className="relative z-30">
            <Link 
              href={targetUrl}
              className="inline-flex w-full items-center justify-center px-4 py-2.5 bg-zinc-800 text-[#c5a47e] text-xs font-bold rounded-full border border-[#c5a47e]/20 transition-all duration-300 hover:bg-[#c5a47e] hover:text-black hover:border-[#c5a47e] hover:shadow-[0_0_15px_rgba(197,164,126,0.3)]"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
