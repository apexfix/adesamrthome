import type { Product } from "@/types";

export function isSecurityCameraKit(product: Product) {
  return (product.categories || []).some(
    (category) => category.slug === "security-camera-kits",
  );
}
