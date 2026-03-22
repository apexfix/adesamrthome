import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: any; // Using any for now to handle potential Store API vs V3 differences
}

export function ProductCard({ product }: ProductCardProps) {
  // 1. 获取基础货币符号
  const currencySymbol = product?.prices?.currency_symbol || "AUD$"; 

  // 2. 智能提取价格 (兼容多种 API 返回结构)
  const currentRawPrice = product?.prices?.price || product?.prices?.sale_price || product?.price || product?.sale_price;
  const currentPrice = currentRawPrice 
    ? (typeof currentRawPrice === 'string' && parseInt(currentRawPrice) > 1000 ? (parseInt(currentRawPrice) / 100).toFixed(2) : parseFloat(currentRawPrice).toFixed(2)) 
    : null;

  const regularRawPrice = product?.prices?.regular_price || product?.regular_price;
  const regularPrice = regularRawPrice 
    ? (typeof regularRawPrice === 'string' && parseInt(regularRawPrice) > 1000 ? (parseInt(regularRawPrice) / 100).toFixed(2) : parseFloat(regularRawPrice).toFixed(2)) 
    : null;

  const isDiscounted = regularPrice && currentPrice && !isNaN(parseFloat(regularPrice)) && !isNaN(parseFloat(currentPrice)) && parseFloat(regularPrice) > parseFloat(currentPrice);

  // 3. 图片数据处理
  const imageSrc = product?.images?.[0]?.src || "/placeholder.jpg";
  const imageAlt = product?.images?.[0]?.alt || product?.name || "Product Image";
  
  // 4. 获取目标链接 (优先使用 slug，如果拿不到则退化使用 id)
  const targetUrl = `/products/${product?.slug || product?.id || ""}`;

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      
      {/* 隐藏的全局点击层：让用户点击卡片的任何空白处都能跳转 */}
      <Link href={targetUrl} className="absolute inset-0 z-0">
        <span className="sr-only">View {product?.name || "Product"}</span>
      </Link>

      <div className="aspect-square relative bg-gray-100 pointer-events-none">
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
        />
      </div>

      <div className="p-4 relative z-10 pointer-events-none">
        {/* 商品名称：限制高度，保持布局整齐 */}
        <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-1 h-10 md:h-12 leading-tight">
          {product?.name || "Unnamed Product"}
        </h3>

        {/* 价格与操作区域：使用金色统一风格 */}
        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col">
            
            {/* 折扣价逻辑 */}
            {isDiscounted ? (
              <>
                <span className="text-gray-400 text-xs md:text-sm line-through mb-0.5">
                  Was {currencySymbol}{regularPrice}
                </span>
                <span className="text-[#c5a47e] text-lg md:text-xl font-bold leading-none">
                  Now {currencySymbol}{currentPrice}
                </span>
              </>
            ) : (
              <span className="text-[#c5a47e] text-lg md:text-xl font-bold">
                {currentPrice ? `${currencySymbol}${currentPrice}` : "Enquire Now"}
              </span>
            )}
            
          </div>

          {/* 将 span 彻底替换为真实的 Link 标签，恢复指针交互 */}
          <Link 
            href={targetUrl}
            className="inline-flex items-center justify-center px-3 py-1.5 bg-[#c5a47e] text-white text-xs font-semibold rounded group-hover:bg-black transition-colors duration-300 pointer-events-auto"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
