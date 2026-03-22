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
                className="inline-flex
