import Image from "next/image";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

export default async function Home() {
  let products = [];
  try {
    // Fetch more products for the carousel and grid
    products = await getProducts(1, 10);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    // 1. 去掉了 space-y-12，改为普通的垂直弹性盒子
    <div className="flex flex-col">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <HeroCarousel />
        <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              Protect Your Home
              <br />
              <span className="text-[#c5a47e]">Smart</span> & <span className="text-[#c5a47e]">Secure</span>
            </h1>
            <p className="text-xl text-slate-200 mx-auto max-w-2xl">
              Explore our latest series of smart locks, combining cutting-edge biometrics with modern design for an unparalleled security experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[#c5a47e] px-8 text-sm font-bold text-white shadow transition-colors hover:bg-black hover:text-[#c5a47e] border border-[#c5a47e] focus-visible:outline-none"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features - 现在它会和上面的 Hero 无缝衔接 */}
      <ServiceFeatures />

      {/* Featured Products - 2. 单独为这个模块增加了 py-20 (上下内边距)，保证它不会和上下模块挤在一起 */}
      <section className="container mx-auto px-4 md:px-6 py-20 bg-white">
        <div className="flex items-center justify-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Featured Products</h2>
        </div>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <div className="text-center py-12 text-gray-500 bg-slate-50 rounded-lg">
             <p>No products available or failed to load.</p>
           </div>
        )}
      </section>

      {/* Google Reviews */}
      <GoogleReviews />

      {/* Contact Form Section */}
      <ContactForm />
    </div>
  );
}
