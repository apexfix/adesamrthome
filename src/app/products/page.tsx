import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage() {
  let products = [];
  try {
    products = await getProducts(1, 20);
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Curated <span className="text-[#c5a47e]">Collection</span>
          </h1>
          <p className="text-zinc-500 text-lg font-light leading-relaxed">
            Our selection of industry-leading smart locks, handpicked for Adelaide’s climate and security needs. Every price includes professional on-site installation.
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-sm">Synchronizing latest collection...</p>
          </div>
        )}

      </div>
    </div>
  );
}
