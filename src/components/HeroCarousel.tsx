"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    title: "Protect Your Home",
    highlight: "Smart & Secure",
    desc: "Experience the future of home security in Adelaide. Precision-installed smart locks.",
    link: "/products"
  },
  {
    src: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop",
    title: "Military Grade",
    highlight: "Biometrics",
    desc: "3D Facial Recognition and Fingerprint access. Never worry about losing keys again.",
    link: "/products"
  },
  {
    // 换成了一张同样具有别墅外形美感的监控主题图
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    desc: "Monitor your perimeter remotely with ADE's premium CCTV systems. Expert installation.",
    link: "/products?category=CCTV"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1500 ease-in-out",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* 文字内容 */}
          <div className="relative z-30 container mx-auto px-4 h-full flex items-center justify-center">
            <div className="max-w-4xl text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight">
                {slide.title}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                  {slide.highlight}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
                {slide.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
                <Link href={slide.link} className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black shadow-lg hover:scale-105 transition-all uppercase">
                  Shop Now
                </Link>
                <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-black uppercase">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          <Image
            src={slide.src}
            alt={slide.title}
            fill
            className={cn(
              "object-cover transition-transform duration-[10000ms] ease-out",
              index === current ? "scale-105" : "scale-100"
            )}
            priority={index === 0}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />
        </div>
      ))}
      
      {/* 底部导航点 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-40">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              index === current ? "bg-[#c5a47e] w-10 shadow-lg" : "bg-white/30 w-2"
            )}
          />
        ))}
      </div>
    </div>
  );
}
