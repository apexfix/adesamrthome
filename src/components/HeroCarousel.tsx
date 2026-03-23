"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Protect Your Home",
    highlight: "Smart & Secure",
    description: "Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.",
    imagePath: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2000",
    btn1Text: "SHOP NOW",
    btn1Link: "/products",
  },
  {
    title: "Military Grade",
    highlight: "Biometrics",
    description: "3D Facial Recognition and Fingerprint access. Never worry about losing keys again.",
    imagePath: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=2000",
    btn1Text: "EXPLORE LOCKS",
    btn1Link: "/products?category=SMART+LOCK",
  },
  {
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    description: "Monitor your perimeter remotely with ADE's premium CCTV systems. Expert installation and setup.",
    imagePath: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=2000",
    btn1Text: "VIEW CCTV",
    btn1Link: "/products?category=CCTV",
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* 背景图片：使用原生 img 避开所有 Next.js 和 Swiper 的报错 */}
          <img
            src={slide.imagePath}
            alt={slide.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-transform duration-[15000ms] ease-out",
              index === current ? "scale-110" : "scale-105"
            )}
          />

          {/* 遮罩层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/95 z-10" />

          {/* 文字内容区：精确还原昨晚的排版 */}
          <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center">
            <div className="max-w-4xl text-center space-y-10">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight">
                {slide.title}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                  {slide.highlight}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
                <Link href={slide.btn1Link} className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black shadow-lg hover:scale-105 transition-all uppercase">
                  {slide.btn1Text}
                </Link>
                <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-black uppercase">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 底部三个点：手动实现的导航菜单 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              current === i ? "bg-[#c5a47e] w-10 shadow-[0_0_10px_rgba(197,164,126,0.5)]" : "bg-white/30 w-2 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
