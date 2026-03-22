import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

interface ProductCardProps {
  product: any; // Using any for now to handle potential Store API vs V3 differences, or I should use the proper type if I'm confident.
}

export function ProductCard({ product }: ProductCardProps) {
  // Store API returns 'prices' object, Admin API returns 'price' string.
  // Store API: prices.price (string), prices.currency_code (string), etc.
  // Or prices.price is an integer in cents sometimes.
  // Let's inspect the data later, but for now handle both or assume Store API structure which is often:
  // prices: { price: "1000", regular_price: "1000", sale_price: "1000", ... }
  // Actually Store API prices are usually objects.
  
  // Let's assume standard object structure for now and use safe access.
  const price = product.prices?.price ? (parseInt(product.prices.price) / 100).toFixed(2) : product.price;
  const currency = product.prices?.currency_code || "CNY";
  const imageSrc = product.images?.[0]?.src || "/placeholder.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;

  return (
export function ProductCard({ product }: ProductCardProps) {
  // 保持你原有的价格计算逻辑
  const price = product.prices?.price 
    ? (parseInt(product.prices.price) / 100).toFixed(2) 
    : product.price;
  
  // 假设你的货币是澳元或人民币，可以根据实际调整
  const currencySymbol = product.prices?.currency_symbol || "AUD"; 
  
  const imageSrc = product.images?.[0]?.src || "/placeholder.jpg";
  const imageAlt = product.images?.[0]?.alt || product.name;

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
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>

        {/* 2. 商品简短描述 */}
        <p className="text-sm text-gray-500 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: product.short_description || "" }} />

        {/* 3. 价格与操作区域 */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            {/* 价格显示：金色、加粗、大字号 */}
            <span className="text-[#c5a47e] text-xl font-bold">
              {price ? `${currencySymbol}${price}` : "Enquire Now"}
            </span>
            {/* 如果有折扣标签，显示在价格下方 */}
            {product.on_sale && (
              <span className="text-[10px] text-red-500 font-medium uppercase tracking-tighter">
                Special Offer
              </span>
            )}
          </div>

          <span className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-xs font-semibold rounded-md group-hover:bg-[#c5a47e] transition-colors duration-300">
            Learn More
          </span>
        </div>
      </div>
    </div>
  );
}
