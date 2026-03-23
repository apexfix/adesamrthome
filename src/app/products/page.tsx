import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

// 1. 【核心修复】强制每次访问都进行动态渲染，严禁使用打包时的静态缓存
export const dynamic = "force-dynamic";

export default async function ProductsPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 2. 兼容 Next.js 最新版本的异步参数读取逻辑
  const params = props.searchParams ? await props.searchParams : {};
  const categoryParam = typeof params.category === 'string' ? params.category : null;

  // 3. 从 WordPress 获取产品数据
  let allProducts = [];
  try {
    allProducts = await getProducts(1, 50);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  // 4. 核心过滤逻辑：严格匹配参数与 WP 分类名
  const displayedProducts = categoryParam
    ? allProducts.filter((product: any) =>
        product.categories?.some(
          (cat: any) => cat.name.toUpperCase() === categoryParam.toUpperCase()
        )
      )
    : allProducts;

  // 5. 动态页面标题
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

        {
