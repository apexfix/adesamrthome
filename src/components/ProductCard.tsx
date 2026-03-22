import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: any; // Using any for now to handle potential Store API vs V3 differences
}

export function ProductCard({ product }: ProductCardProps) {
  // 1. 安全计算价格逻辑
  const rawPrice = product?.prices?.price;
  const price = rawPrice 
    ? (parseInt(rawPrice) / 100).toFixed(2) 
    : product?.price;
  
  // 2. 货币符号配置
  const currencySymbol = product?.prices?.currency_symbol || "AUD"; 
  
  // 3. 图片数据处理
  const imageSrc = product?.images?.[0]?.src || "/placeholder.jpg";
  const imageAlt = product?.images?.[0]?.alt || product?.name || "Product Image";

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative bg-gray-100">
        <Image 
          src={imageSrc} 
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
        />
      </div>

      <div className="p-4">
        {/* 1. 商品名称 */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
          <Link href={`/products/${product?.slug || ""}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product?.name || "Unnamed Product"}
          </Link>
        </h3>

        {/* 2. 商品简短描述 */}
        <p 
          className="text-sm text-gray-500 mb-2 line-clamp-2" 
          dangerouslySetInnerHTML={{ __html: product?.short_description || "" }} 
        />

        {/* 3. 价格与操作区域 */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            {/* 价格显示：金色、加粗、大字号 */}
            <span className="text-[#c5a47e] text-xl font-bold">
              {price ? `${currencySymbol}${price}` : "Enquire Now"}
            </span>
            {/* 如果有折扣标签，显示在价格下方 */}
            {product?.on_sale && (
              <span className="text-[10px] text-red-500 font-medium uppercase tracking-tighter">
                Special Offer
              </span>
            )}
          </div>

          <span className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-xs font-semibold rounded-md group-hover:bg-[#c5a47e] transition-colors duration-300 z-10 relative">
            Learn More
          </span>
        </div>
      </div>
    </div>
  );
}
