"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Plus } from "lucide-react";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  // 1. 处理价格逻辑
  const minorUnit = product.prices?.currency_minor_unit || 2;
  const divider = Math.pow(10, minorUnit);

  // 现价（折扣后的价格）
  const currentPrice = (parseInt(product.prices?.price || "0") / divider).toFixed(0);
  
  // 原价
  const regularPrice = (parseInt(product.prices?.regular_price || "0") / divider).toFixed(0);

  // 判断是否正在打折
  const isOnSale = regularPrice !== currentPrice;
  const hasPrice = parseInt(product.prices?.price || "0") > 0;

  // 处理图片和分类
  const displayImage = product.images?.[0]?.src || "/placeholder.jpg";
  const displayCategory = product.categories?.[0]?.name || "Smart Lock";

  return (
    <Link 
      href={`/products/${product.slug || product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-zinc-800/50 bg-zinc-900/40 transition-all duration-300 hover:border-[#c5a47e]/60"
    >
      {/* 1. Image Section */}
      <div className="aspect-square relative overflow-hidden bg-zinc-950">
        <Image 
          src={displayImage} 
          alt={product.name || "Smart Lock"}
          fill
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Sale Badge - 如果打折则显示 */}
        {isOnSale && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10">
            Sale
          </div>
        )}

        {/* Installation Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 border border-[#c5a47e]/30 bg-black/70 px-3 py-1.5 z-10">
          <ShieldCheck className="w-3 h-3 text-[#c5a47e]" />
          <span className="text-[9px] font-bold text-white uppercase tracking-widest">Standard Install Included</span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 mb-6">
          <p className="text-[#c5a47e] text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">
            {displayCategory}
          </p>
          <h3 className="text-xl font-bold text-white group-hover:text-[#c5a47e] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* 3. Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
              {!hasPrice ? "Installed Quote" : isOnSale ? "Special Offer" : "Installed Package"}
            </p>
            <div className="flex items-baseline gap-2">
              {/* 现价 */}
              <p className="text-2xl font-black text-[#c5a47e] tracking-tighter">
                {hasPrice ? `$${currentPrice}` : "Quote Required"}
              </p>
              {/* 原价（仅在打折时显示） */}
              {hasPrice && isOnSale && (
                <p className="text-sm text-zinc-500 line-through decoration-zinc-600 font-medium">
                  ${regularPrice}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex h-10 w-10 items-center justify-center border border-zinc-700 bg-zinc-800 transition-all duration-300 group-hover:border-[#c5a47e] group-hover:bg-[#c5a47e]">
            <Plus className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
