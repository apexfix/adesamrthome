import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

// 强制每次访问都进行动态渲染，严禁使用打包时的静态缓存
export const dynamic = "force-dynamic";

const SMART_LOCK_CHILD_CATEGORIES = new Set([
  "smartlock",
  "smartlocks",
  "smartlockwithcamera",
  "lockin",
  "philips",
  "ezviz",
  "samsung",
  "dessmann",
  "aqara",
  "kaadas",
  "eufy",
  "yale",
]);

const SMART_LOCK_BRANDS = ["Lockin", "Philips", "EZVIZ", "Samsung", "Dessmann"];

function normalizeCategory(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function productMatchesCategory(product: any, categoryParam: string) {
  const requested = normalizeCategory(categoryParam);
  const categories = product.categories || [];

  return categories.some((cat: any) => {
    const categoryName = normalizeCategory(cat.name || "");
    const categorySlug = normalizeCategory(cat.slug || "");

    if (categoryName === requested || categorySlug === requested) {
      return true;
    }

    if (requested === "smartlock" || requested === "smartlocks") {
      return (
        SMART_LOCK_CHILD_CATEGORIES.has(categoryName) ||
        SMART_LOCK_CHILD_CATEGORIES.has(categorySlug)
      );
    }

    return false;
  });
}

function productMatchesBrand(product: any, brandParam: string) {
  const requested = normalizeCategory(brandParam);
  const searchableValues = [
    ...(product.tags || []).map((tag: any) => tag.name || tag.slug || ""),
    ...(product.brands || []).map((brand: any) => brand.name || brand.slug || ""),
    ...(product.categories || []).map((cat: any) => cat.name || cat.slug || ""),
    product.name || "",
    product.sku || "",
  ];

  return searchableValues.some((value) => normalizeCategory(value).includes(requested));
}

function getPageTitle(categoryParam: string | null) {
  const normalized = categoryParam ? normalizeCategory(categoryParam) : "";

  if (normalized === "smartlock" || normalized === "smartlocks") {
    return "Smart Locks";
  }

  if (normalized === "cctv") {
    return "CCTV Systems";
  }

  if (normalized === "lockin") {
    return "Lockin Smart Locks";
  }

  return categoryParam || "All Products";
}

export default async function ProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 兼容 Next.js 最新版本的异步参数读取逻辑
  const params = props.searchParams ? await props.searchParams : {};
  const categoryParam = typeof params.category === 'string' ? params.category : null;
  const brandParam = typeof params.brand === 'string' ? params.brand : null;

  // 从 WordPress 获取产品数据
  let allProducts = [];
  try {
    allProducts = await getProducts(1, 50);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  const categoryProducts = categoryParam
    ? allProducts.filter((product: any) => productMatchesCategory(product, categoryParam))
    : allProducts;

  const displayedProducts = brandParam
    ? categoryProducts.filter((product: any) => productMatchesBrand(product, brandParam))
    : categoryProducts;

  const pageTitle = getPageTitle(categoryParam);
  const isSmartLocksPage =
    categoryParam !== null &&
    ["smartlock", "smartlocks"].includes(normalizeCategory(categoryParam));

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* 页面标题区域 */}
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 uppercase">
            {pageTitle}
          </h1>
          <div className="h-1 w-20 bg-[#c5a47e] rounded-full" />
          {categoryParam && (
             <p className="mt-6 text-zinc-400 max-w-2xl mx-auto">
               Showing all available products in the {pageTitle} category.
             </p>
          )}
          {isSmartLocksPage && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/products?category=SMART+LOCK"
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  !brandParam
                    ? "border-[#c5a47e] bg-[#c5a47e] text-black"
                    : "border-zinc-800 text-zinc-400 hover:border-[#c5a47e] hover:text-white"
                }`}
              >
                All Brands
              </Link>
              {SMART_LOCK_BRANDS.map((brand) => (
                <Link
                  key={brand}
                  href={`/products?category=SMART+LOCK&brand=${encodeURIComponent(brand)}`}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    brandParam && normalizeCategory(brandParam) === normalizeCategory(brand)
                      ? "border-[#c5a47e] bg-[#c5a47e] text-black"
                      : "border-zinc-800 text-zinc-400 hover:border-[#c5a47e] hover:text-white"
                  }`}
                >
                  {brand}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 产品网格展示 */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {displayedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-zinc-500 border border-zinc-900 rounded-3xl bg-zinc-900/50 max-w-3xl mx-auto">
            <p className="text-xl">No products found in this category.</p>
            <p className="text-sm mt-2">Please check if the category names in WordPress match exactly.</p>
          </div>
        )}
        
      </div>
    </div>
  );
}
