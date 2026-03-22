"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Plus } from "lucide-react";

export function ProductCard({ product }: { product: any }) {
  // 【关键修复】：自动兼容不同的数据字段名称
  // 如果价格不在 .price，尝试读取 .regular_price 或 .sale_price
  const displayPrice = product.price || product.regular_price || product.sale_price || "TBA";
  
  // 如果图片不在 .image，尝试读取 .image_url 或 .images[0]
  const displayImage = product.image || 
                       product.image_url || 
                       (product.images && product.images[0]?.url) || 
                       "/placeholder.jpg";

  return (
    <Link 
      href={`/products/${product.slug || product.id}`}
      className="group relative flex flex-col bg-zinc-900/40 rounded-[2rem] overflow-hidden border border-zinc-800/50 hover:border-[#c5a47e]/40 transition-all duration-500"
    >
      {/* 1. Image Section */}
      <div className="aspect-square relative overflow-hidden bg-zinc-950">
        <Image 
          src={displayImage} 
          alt={product.name || "Smart Lock"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Installation Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-[#c5a47e]/30 px-3 py-1.5 rounded-full z-10">
          <ShieldCheck className="w-3 h-3 text-[#c5a47e]" />
          <span className="text-[9px] font-bold text-white uppercase tracking-widest">Installation Included</span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 mb-6">
          <p className="text-[#c5a47e] text-[10px] font-bold uppercase tracking-widest mb-2 opacity-80">
            {product.category || "Professional Series"}
          </p>
          <h3 className="text-xl font-bold text-white group-hover:text-[#c5a47e] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </div>

        {/* 3. Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">Full Package Price</p>
            <p className="text-2xl font-black text-[#c5a47e] tracking-tighter">
              ${displayPrice}
            </p>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-[#c5a47e] group-hover:border-[#c5a47e] transition-all duration-300">
            <Plus className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
