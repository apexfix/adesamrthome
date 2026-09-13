import { GalleryImage } from "@/components/GalleryImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { getOptionalPrice, priceLabel } from "@/lib/productPricing";

export function CatalogueInstallation({ product }: { product: Product }) {
  const photo = product.images?.[0];
  return (
    <div data-installation-listing className={`grid gap-5 border-y border-zinc-800 py-6 lg:items-center ${photo ? "grid-cols-[80px_1fr] sm:grid-cols-[140px_1fr] lg:grid-cols-[160px_1fr_1fr]" : "lg:grid-cols-2"}`}>
      {photo && <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-zinc-950 sm:aspect-[4/3]">
        <GalleryImage key={photo.src} photo={{ src: photo.src, alt: photo.alt || product.name }} sizes="(max-width: 639px) 80px, 160px" className="object-contain" />
      </div>}
      <div className="min-w-0">
        <h3 className="text-xl font-bold leading-7 text-white"><Link prefetch={false} href={`/products/${product.slug}`} className="hover:text-[#d9b98f]">{product.name}</Link></h3>
        <p className="mt-3 text-base leading-7 text-zinc-300">Customer-supplied lock. Door compatibility checked before booking.</p>
        <Link prefetch={false} href={`/products/${product.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-[#d9b98f]">View installation service <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
      <dl className={`divide-y divide-zinc-800 ${photo ? "col-span-2 lg:col-span-1" : ""}`}>
        {(product.service_options || []).map(option => <div key={option.name} className="flex items-center justify-between gap-4 py-3">
          <dt className="min-w-0 text-sm leading-6 text-zinc-300">{option.name}</dt>
          <dd className="shrink-0 text-xl font-bold text-[#d9b98f]">{priceLabel(getOptionalPrice(product, option.price))}</dd>
        </div>)}
      </dl>
    </div>
  );
}
