import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: any; // Using any for now to handle potential Store API vs V3 differences
}

export function ProductCard({ product }: ProductCardProps) {
  // 1. 获取基础货币符号
  const currencySymbol = product?.prices?.currency_symbol || "AUD$"; 

  // 2. 智能提取价格 (兼容多种 API 返回结构，且增加更强的防御性检测)
  // 获取现价/促销价
  const currentRawPrice = product?.prices?.price || product?.prices?.sale_price || product?.price || product?.sale_price;
  const currentPrice = currentRawPrice 
    ? (typeof currentRawPrice === 'string' && parseInt(currentRawPrice) > 1000 ? (parseInt(currentRawPrice) / 100).toFixed(2) : parseFloat(currentRawPrice).toFixed(2)) 
    : null;

  // 获取原价 (用于划线)
  const regularRawPrice = product?.prices?.regular_price || product?.regular_price;
  const regularPrice = regularRawPrice 
    ? (typeof regularRawPrice === 'string' && parseInt(regularRawPrice) > 1000 ? (parseInt(regularRawPrice) / 100).toFixed(2) : parseFloat(regularRawPrice).toFixed(2)) 
    : null;

  // 判断是否真的在打折 (原价必须存在且有效，现价也必须存在且有效，且原价大于现价)
  const isDiscounted = regularPrice && currentPrice && !isNaN(parseFloat(regularPrice)) && !isNaN(parseFloat(currentPrice)) && parseFloat(regularPrice) > parseFloat(currentPrice);

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
        {/* 商品名称：限制高度 */}
        <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 mb-1 h-10 md:h-12 leading-tight">
          <Link href={`/products/${product?.slug || ""}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product?.name || "Unnamed Product"}
          </Link>
        </h3>

        {/* 价格与操作区域：使用金色统一风格 */}
        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col">
            
            {/* 折扣价逻辑 */}
            {isDiscounted ? (
              <>
                {/* 原价：灰色、删除线、更低调 */}
                <span className="text-gray-400 text-xs md:text-sm line-through mb-0.5">
                  Was {currencySymbol}{regularPrice}
                </span>
                {/* 促销价：替换为金色，大字号 */}
                <span className="text-[#c5a47e] text-lg md:text-xl font-bold leading-none">
                  Now {currencySymbol}{currentPrice}
                </span>
              </>
            ) : (
              /* 普通价格：金色、加粗 */
              <span className="text-[#c5a47e] text-lg md:text-xl font-bold">
                {currentPrice ? `${currencySymbol}${currentPrice}` : "Enquire Now"}
              </span>
            )}
            
          </div>

          {/* 购买按钮换成了更小巧的图标或文字，适应一行5个的紧凑布局，颜色也变为金色统一 */}
          <span className="inline-flex items-center justify-center px-3 py-1.5 bg-[#c5a47e] text-white text-xs font-semibold rounded group-hover:bg-black transition-colors duration-300 z-10 relative">
            View Details
          </span>
        </div>
      </div>
    </div>
  );
}
