"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const images = [
  "/img/a1.jpg",
  "/img/a2.jpg"
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* 引入 Ken Burns 缓慢放大特效 */}
          <Image
            src={src}
            alt={`Slide ${index + 1}`}
            fill
            className={cn(
              "object-cover transition-transform duration-[6000ms] ease-out",
              index === current ? "scale-105" : "scale-100"
            )}
            priority={index === 0}
          />
          {/* 高级渐变遮罩：顶部略暗，中间通透，底部加深 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
        </div>
      ))}
      
      {/* 轮播点导航优化 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === current 
                ? "bg-[#c5a47e] w-8" // 当前选中状态：拉长并使用品牌金
                : "bg-white/40 w-2 hover:bg-white/80" // 未选中状态
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
