import Image from "next/image";
import { getProducts } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductShowcase3D } from "@/components/ProductShowcase3D";
import { ServiceFeatures } from "@/components/ServiceFeatures";
import { GoogleReviews } from "@/components/GoogleReviews";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  let products = [];
  try {
    // Fetch more products for the carousel and grid
    products = await getProducts(1, 10);
  } catch (error) {
    console.error("Failed to fetch products", error);
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <HeroCarousel />
        <div className="relative z-10 container px-4 md:px-6 flex flex-col items-center text-center">
          <div className="max-w-4xl space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              Protect Your Home
              <br />
              <span className="text-blue-400">Smart</span> & <span className="text-blue-400">Secure</span>
            </h1>
            <p className="text-xl text-slate-200 mx-auto max-w-2xl">
              Explore our latest series of smart locks, combining cutting-edge biometrics with modern design for an unparalleled security experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link
                href="/products"
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-slate-900 shadow transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-slate-700 bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Product Showcase */}
      <section className="py-12 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Latest Arrivals</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Discover our newest additions with our interactive 3D showcase.</p>
        </div>
        <ProductShowcase3D products={products} />
      </section>

      {/* Service Features */}
      <ServiceFeatures />

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
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
