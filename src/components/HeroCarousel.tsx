"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 我为你替换了极其高端、充满氛围感的高清场景大图
const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", // 现代深色大门与温馨灯光，极具安全感和归属感
  "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop"  // 智能家居/科技感门禁特写，暗调高级质感
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000); // 稍微延长到 6 秒，让高端大图有更长的展示时间

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1500 ease-in-out", // 延长透明度过渡时间，更柔和
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Ken Burns 缓慢放大特效 */}
          <Image
            src={src}
            alt={`ADE Smart Home Premium Installation ${index + 1}`}
            fill
            className={cn(
              "object-cover transition-transform duration-[8000ms] ease-out", // 动画变长，显得更从容、高级
              index === current ? "scale-105" : "scale-100"
            )}
            priority={index === 0}
            unoptimized // 允许直接加载外部高质量图片
          />
          {/* 旗舰级遮罩：四角压暗，中间微透，确保你的白色/金色文字绝对清晰 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        </div>
      ))}
      
      {/* 轮播点导航 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              index === current 
                ? "bg-[#c5a47e] w-10 shadow-[0_0_10px_rgba(197,164,126,0.5)]" // 激活状态：加长，带发光
                : "bg-white/30 w-2 hover:bg-white/60" // 未激活状态
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
