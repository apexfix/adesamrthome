import { localProducts } from "./localProducts";
import type { Product, ProductTaxonomyItem } from "@/types";

export async function getProducts(page = 1, perPage = 20): Promise<Product[]> {
  return localProducts.slice((page - 1) * perPage, page * perPage);
}

export async function getProduct(slug: string): Promise<Product | null> {
  return localProducts.find((product) => product.slug === slug) ?? null;
}

export async function getCategories(): Promise<ProductTaxonomyItem[]> {
  return [
    { id: 1, name: "SMART LOCK", slug: "smart-lock" },
    { id: 2, name: "Lockin", slug: "lockin" },
    { id: 3, name: "CCTV", slug: "cctv" },
  ];
}
