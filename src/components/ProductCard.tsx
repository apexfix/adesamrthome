import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import type { Product } from "@/types";
import { isSecurityCameraKit } from "@/lib/productType";
import { getPrice, getOptionalPrice, priceLabel } from "@/lib/productPricing";

export function ProductCard({
  product,
  priority = false,
  imageSizes = "(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, (max-width: 1500px) 25vw, 350px",
}: {
  product: Product;
  priority?: boolean;
  imageSizes?: string;
}) {
  const { current: currentPrice, regular: regularPrice, isOnSale } = getPrice(product);
  const hasPrice = currentPrice !== null;
  const installedPrice = getOptionalPrice(product, product.installed_price);
  const isService = product.kind === "service";
  const isCameraKit = isSecurityCameraKit(product);
  const serviceOptions = product.service_options || [];
  const standardMortisePrice = getOptionalPrice(product, serviceOptions[1]?.price);
  const priceIncludesInstallation = product.price_includes_installation !== false;

  // 处理图片和分类
  const displayImage = product.images?.[0]?.src || "/placeholder.jpg";
  const displayCategory = isService
    ? "Installation Service"
    : product.categories?.[0]?.name || "Smart Lock";

  return (
    <Link 
      href={`/products/${product.slug || product.id}`}
      className="liquid-glass-soft motion-card group relative flex flex-col overflow-hidden rounded-md border hover:border-[#c5a47e]/60"
    >
      {/* 1. Image Section */}
      <div className="aspect-square relative overflow-hidden bg-zinc-950">
        <Image 
          src={displayImage} 
          alt={product.name || "Smart Lock"}
          fill
          loading={priority ? "eager" : "lazy"}
          className="object-contain p-3"
          sizes={imageSizes}
        />
        
        {/* Sale Badge - 如果打折则显示 */}
        {isOnSale && (
          <div className="absolute top-4 right-4 bg-red-700 text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10">
            Sale
          </div>
        )}

        {/* Installation Badge */}
        <div className="liquid-glass absolute left-3 top-3 z-10 flex max-w-[calc(100%-24px)] items-center gap-1.5 rounded-md border px-3 py-2">
          <ShieldCheck className="w-3 h-3 text-[#c5a47e]" />
          <span className="text-xs font-semibold text-white">
            {isService
              ? "Installation Only"
              : isCameraKit
                ? "2-Camera PoE Kit"
              : priceIncludesInstallation
                ? "Standard Install Included"
                : "Installation Available"}
          </span>
        </div>
      </div>

      {/* 2. Content Section */}
      <div data-glass-highlight className="p-6 flex flex-col flex-1">
        <div className="flex-1 mb-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[#c5a47e] opacity-90">
            {displayCategory}
          </p>
          <h3 className="break-words text-lg font-bold leading-7 text-white transition-colors group-hover:text-[#c5a47e] md:text-xl">
            {product.name}
          </h3>
        </div>

        {/* 3. Price and Action */}
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-col">
            <p className="text-xs font-bold uppercase text-zinc-400">
              {!hasPrice
                ? "Quote Required"
                : isService
                  ? "Installation from"
                : isCameraKit
                  ? "Equipment Package"
                : priceIncludesInstallation
                    ? "Installed Package"
                    : "Lock Only"}
            </p>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              {/* 现价 */}
              <p className="text-2xl font-black text-[#c5a47e]">
                {priceLabel(currentPrice)}
              </p>
              {/* 原价（仅在打折时显示） */}
              {hasPrice && isOnSale && (
                <p className="text-sm text-zinc-400 line-through decoration-zinc-500 font-medium">
                  ${regularPrice}
                </p>
                )}
            </div>
            {installedPrice && !priceIncludesInstallation && (
              <p className="mt-2 text-sm leading-5 text-zinc-300">
                With standard install <span className="font-bold text-white">${installedPrice}</span>
              </p>
            )}
            {isService && standardMortisePrice && (
              <p className="mt-2 text-sm leading-5 text-zinc-300">
                Standard 6068 mortise{" "}
                <span className="font-bold text-white">${standardMortisePrice}</span>
              </p>
            )}
          </div>
          
          <div className="glass-control ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-md border" aria-hidden="true">
            <ArrowUpRight className="h-5 w-5 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
