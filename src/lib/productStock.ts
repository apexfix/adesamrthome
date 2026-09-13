import type { Product } from "@/types";

export function getProductStock(product: Product) {
  if (product.kind === "service") return null;
  if (product.in_stock === true) return { label: "In stock", schema: "https://schema.org/InStock" };
  if (product.in_stock === false) return { label: "Out of stock", schema: "https://schema.org/OutOfStock" };
  return null;
}
