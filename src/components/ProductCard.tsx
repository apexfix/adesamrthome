import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import type { Product } from "@/types";
import { isSecurityCameraKit } from "@/lib/productType";
import { getPrice, getOptionalPrice, priceLabel } from "@/lib/productPricing";
import { GalleryImage } from "@/components/GalleryImage";
import { getProductStock } from "@/lib/productStock";

export function ProductCard({
  product,
  priority = false,
  prefetch,
  imageSizes = "(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, (max-width: 1500px) 25vw, 350px",
}: {
  product: Product;
  priority?: boolean;
  prefetch?: boolean;
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

  const stock = getProductStock(product);
  const displayImage = product.images?.[0]?.src || "";
  const displayCategory = isService
    ? "Installation Service"
    : product.categories?.[0]?.name || (isCameraKit ? "Security Camera Kit" : "Smart Lock");

  return (
    <Link 
      href={`/products/${product.slug || product.id}`}
      prefetch={prefetch}
      className="product-card liquid-glass-soft motion-card group relative flex min-w-0 flex-col overflow-hidden rounded-md border hover:border-[#c5a47e]/60"
    >
      {/* 1. Image Section */}
      <div className="product-card-media aspect-square relative overflow-hidden bg-zinc-950">
        <GalleryImage
          key={displayImage}
          photo={{ src: displayImage, alt: product.images?.[0]?.alt || product.name }}
          eager={priority}
          highPriority={priority}
          className="object-contain p-3"
          sizes={imageSizes}
        />
      </div>

      {/* 2. Content Section */}
      <div data-glass-highlight className="p-6 flex flex-col flex-1">
        <div className="flex-1 mb-6">
          <div data-product-badges className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="break-words text-xs font-bold uppercase text-[#c5a47e] opacity-90">
              {displayCategory}
            </p>
            {isOnSale && <span className="bg-red-700 px-2 py-1 text-xs font-bold text-white">Sale</span>}
          </div>
          <h3 className="break-words text-lg font-bold leading-7 text-white transition-colors group-hover:text-[#c5a47e] md:text-xl">
            {product.name}
          </h3>
          <p data-product-scope className="mt-3 flex items-start gap-1.5 text-xs font-semibold leading-5 text-zinc-300">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a47e]" aria-hidden="true" />
            <span>{isService ? "Installation Only" : isCameraKit ? "2-Camera PoE Kit" : priceIncludesInstallation ? "Standard Install Included" : "Installation Available"}</span>
          </p>
          {stock && <p data-product-stock className={`mt-3 text-sm font-semibold ${product.in_stock ? "text-emerald-400" : "text-amber-300"}`}>{stock.label}</p>}
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
              <p className="break-words text-2xl font-black text-[#c5a47e]">
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
