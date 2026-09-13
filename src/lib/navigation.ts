export type ProductNavigationSection = "locks" | "installation" | "cctv";
export type ProductNavigationRoutes = Record<string, ProductNavigationSection>;

export const serviceNavigation = {
  locks: "/products?category=smart-lock",
  installation: "/smart-lock-installation-only-adelaide",
  cctv: "/products/security-camera-kits",
} as const;

export function activeNavigationHref(pathname: string, category: string | null | undefined, products: ProductNavigationRoutes): string | null {
  const section = products[pathname];
  if (section) return serviceNavigation[section];
  if (pathname === "/products") {
    // Undefined means the query has not hydrated; avoid guessing a category.
    if (category === undefined) return null;
    if (category === null) return "/products";
    const normalized = category.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalized === "securitycamerakits") return serviceNavigation.cctv;
    if (["smartlock", "smartlocks", "smartlockwithcamera", "lockin", "kaadas", "philips", "ezviz", "samsung", "dessmann", "aqara", "eufy", "yale"].includes(normalized)) return serviceNavigation.locks;
    return null;
  }
  if (pathname.startsWith("/blog/")) return "/blog";
  if (pathname.startsWith("/brands/")) return "/brands";
  return pathname;
}
