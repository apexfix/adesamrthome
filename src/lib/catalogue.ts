import type { Product } from "@/types";
import { isSecurityCameraKit } from "@/lib/productType";

export type CatalogueParams = Record<string, string | string[] | undefined>;
type FilterOption = { name: string; slug: string };
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function productBrands(product: Product, knownBrands: FilterOption[] = []): FilterOption[] {
  const explicit = product.brands || [];
  const attribute = product.attributes?.find(item => item.name.toLowerCase() === "brand");
  const names = [...(attribute?.options || []), ...(attribute?.terms || []).map(item => item.name)]
    .filter((name): name is string => typeof name === "string" && name.trim().length > 0);
  // Older entries identify their brand as a category. Only match known brands exactly.
  const legacy = knownBrands.filter(brand => (product.categories || []).some(category =>
    normalize(category.name) === normalize(brand.name) || normalize(category.slug) === normalize(brand.slug)));
  return [...explicit, ...legacy, ...names.map(name => ({ name, slug: name.toLowerCase().replace(/\s+/g, "-") }))];
}

export function groupCatalogue(products: Product[]) {
  return [
    { id: "installation-service", name: "Installation Only", products: products.filter(p => p.kind === "service") },
    { id: "smart-lock", name: "Smart Locks", products: products.filter(p => p.kind !== "service" && !isSecurityCameraKit(p)) },
    { id: "security-camera-kits", name: "Security Camera Kits", products: products.filter(p => p.kind !== "service" && isSecurityCameraKit(p)) },
  ];
}

export function catalogueHref(category?: string, brand?: string) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (brand) query.set("brand", brand);
  return query.size ? `/products?${query}` : "/products";
}

export function selectCatalogue(products: Product[], params: CatalogueParams) {
  const categories = products.flatMap(p => p.categories || []).map(c => ({ name: c.name, slug: c.slug }));
  const brands = [...new Map(products.flatMap(product => productBrands(product)).map(brand => [normalize(brand.name), brand])).values()]
    .sort((a, b) => a.name.localeCompare(b.name, "en-AU"));
  const read = (value: string | string[] | undefined, options: FilterOption[], category = false) => {
    if (value === undefined || value === "") return null;
    if (typeof value !== "string" || value.length > 100) return undefined;
    const token = normalize(value);
    if (!token) return undefined;
    return options.find(option => normalize(option.slug) === token || normalize(option.name) === token ||
      (category && token === "smartlocks" && option.slug === "smart-lock"));
  };
  const category = read(params.category, categories, true);
  const brand = read(params.brand, brands);
  const valid = category !== undefined && brand !== undefined;
  const filtered = valid ? products.filter(product => {
    const categoryMatches = !category || (category.slug === "smart-lock"
      ? product.kind !== "service" && !isSecurityCameraKit(product)
      : (product.categories || []).some(item => item.slug === category.slug));
    return categoryMatches && (!brand || productBrands(product, brands).some(item => normalize(item.name) === normalize(brand.name)));
  }) : [];
  const groups = groupCatalogue(filtered);
  const ordered = groups.flatMap(group => group.products);
  const categoryName = groupCatalogue(products).find(group => group.id === category?.slug)?.name || category?.name;
  const type = ordered.length && ordered.every(p => p.kind === "service") ? "Installation Only"
    : ordered.length && ordered.every(isSecurityCameraKit) ? "Security Camera Kits" : categoryName || "Smart Locks";
  const title = brand ? `${brand.name} ${type}` : categoryName || "All Products";
  return { valid, category, brand, brands, groups, products: ordered, title, filtered: Boolean(category || brand) };
}
