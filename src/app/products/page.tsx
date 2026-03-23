import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 1. 获取 URL 中的 category 参数 (例如 "SMART LOCK" 或 "CCTV")
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : null;

  // 2. 从 WordPress 获取产品数据 (拉取前 50 个以确保覆盖两个分类)
  let allProducts = [];
  try {
    allProducts = await getProducts(1, 50);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  // 3. 核心过滤逻辑：根据后端分类名匹配
  const displayedProducts = categoryParam
    ? allProducts.filter((product: any) =>
        product.categories?.some(
          (cat: any) => cat.name.toUpperCase() === categoryParam.toUpperCase()
        )
      )
    : allProducts; // 如果没有参数（直接点击 Products），则显示全部

  // 4. 动态页面标题
  const pageTitle = categoryParam === "SMART LOCK" 
    ? "Smart Locks" 
    : categoryParam === "CCTV" 
    ? "CCTV Systems" 
    : "All Products";

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
