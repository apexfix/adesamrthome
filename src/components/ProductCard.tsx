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
    <div className="group relative border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-square relative bg-gray-100">
        {imageSrc ? (
           <Image 
             src={imageSrc} 
             alt={imageAlt}
             fill
             className="object-cover group-hover:scale-105 transition-transform duration-300"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
           />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 mb-1">
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: product.short_description || "" }} />
        <div className="flex items-center justify-between mt-4">
          <span className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md group-hover:bg-gray-800 transition-colors">
            Learn More
          </span>
          {product.on_sale && (
             <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Sale</span>
          )}
        </div>
      </div>
    </div>
  );
}
