"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  images: { src: string; alt: string }[];
  price: string;
  slug: string;
  prices?: {
    price: string;
    currency_code: string;
  };
}

interface ProductShowcase3DProps {
  products: Product[];
}

export function ProductShowcase3D({ products = [] }: ProductShowcase3DProps) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!products || products.length === 0) return 0;
    const targetIndex = products.findIndex(p => p.name.trim().toLowerCase() === "Smart lock installation service".toLowerCase());
    return targetIndex !== -1 ? targetIndex : 0;
  });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!products || products.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, products.length]);

  // If no products, show nothing or mock? Let's assume passed products or empty.
  if (!products || products.length === 0) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Calculate position styles
  const getStyles = (index: number) => {
    const total = products.length;
    // Calculate distance accounting for wrap-around
    let diff = (index - activeIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;

    // Only show 3 items: center, 1 left, 1 right for cleaner look without overlap issues
    if (Math.abs(diff) > 1) return { display: "none" };

    const zIndex = 10 - Math.abs(diff);
    const opacity = 1;
    const scale = 1 - Math.abs(diff) * 0.15; // Slightly smaller side cards
    
    // Spacing to ensure NO overlap
    const translateX = diff * 110; // Slightly reduced spacing percentage to fit larger cards in container
    
    // Step down effect (Ladder/Podium)
    const translateY = Math.abs(diff) * 10; // 10% down for side items
    
    const rotateY = diff * -5; // Very subtle rotation

    return {
      zIndex,
      opacity,
      transform: `perspective(1000px) translateX(${translateX}%) translateY(${translateY}%) translateZ(${-Math.abs(diff) * 200}px) rotateY(${rotateY}deg) scale(${scale})`,
      display: "block",
    };
  };

  return (
    <div 
      className="relative w-full max-w-[1600px] mx-auto h-[950px] py-12 flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Navigation Buttons */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 md:left-10 z-20 p-4 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur transition-all text-slate-800"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 md:right-10 z-20 p-4 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur transition-all text-slate-800"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Cards Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {products.map((product, index) => {
          const styles = getStyles(index);
          const isActive = index === activeIndex;
          
          if (styles.display === "none") return null;

          const imageSrc = product.images?.[0]?.src || "/placeholder.jpg";
          const price = product.prices?.price 
            ? (parseInt(product.prices.price) / 100).toFixed(2) 
            : product.price;

          return (
            <div
              key={product.id}
              className={cn(
                "absolute w-[340px] md:w-[500px] transition-all duration-300 ease-out", // Increased width
                isActive ? "cursor-default" : "cursor-pointer"
              )}
              style={styles as any}
              onClick={() => {
                if (!isActive) setActiveIndex(index);
              }}
            >
              <div className="relative h-[500px] md:h-[650px] w-full overflow-visible">
                 <Image 
                   src={imageSrc} 
                   alt={product.name}
                   fill
                   className="object-contain drop-shadow-2xl"
                   sizes="(max-width: 768px) 100vw, 50vw"
                 />
              </div>
              
              <div className="w-full h-[140px] p-6 text-center bg-white rounded-2xl shadow-xl -mt-12 relative z-10 flex flex-col items-center justify-between">
                <h3 className="font-bold text-lg line-clamp-2 w-full px-2">{product.name}</h3>
                <Link 
                  href={`/products/${product.slug}`}
                  className="px-8 py-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  Learn More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
