import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage() {
  let products = [];
  try {
    products = await getProducts(1, 20);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    <div className="w-full px-4 md:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p>No products available or failed to load.</p>
        </div>
      )}
    </div>
  );
}
