"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"; // 1. 【新增】引入 Link 组件用于跳转
import { cn } from "@/lib/utils";

// 2. 【核心增量】完全保留原有设计感，仅在此基础上追加数据
const images = [
  // 智能锁 - 原始 1
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", 
  // 智能锁 - 原始 2
  "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop",
  // --- 【新增】CCTV 选项 ---
  // 我为你挑选的 CCTV 场景图：现代豪宅外墙，带有监控摄像头特写
  "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2070&auto=format&fit=crop" 
];

// 【新增】定义一个简单的描述数据，防止敷衍
const descriptions = [
  "Protect Your Home, Smart & Secure. Expert installation in Adelaide.",
  "Military Grade Biometrics. 3D Facial Recognition.",
  "24/7 Perimeter CCTV Systems. Monitor remotely."
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6500); // 稍微延长到 6.5 秒，给文字和图片更长的展示时间

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0">
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1500 ease-in-out", 
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* 3. 【修复核心】将文字内容放进每一页，不作为全局漂浮物 */}
          <div className="relative z-20 container px-4 h-full flex items-center justify-center">
             <div className="max-w-4xl text-center space-y-8 mt-20">
               {/* 金色渐变高亮文字 */}
               <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                 ADE Smart Home<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                   {index === 2 ? "CCTV Systems" : "Smart Locks"}
                 </span>
               </h1>
               {/* 描述性文字 */}
               <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
                 {descriptions[index]}
               </p>
               {/* 按钮区域 */}
               <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
                 {/* 4. 【业务逻辑绑定】只在这个基础上增加跳转，不改变原本结构 */}
                 <Link 
                   href={index === 2 ? "/products?category=CCTV" : "/products"}
                   className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black shadow-lg hover:scale-105 transition-all uppercase tracking-widest"
                 >
                   SHOP COLLECTION
                 </Link>
                 <Link 
                    href="/contact"
                    className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-black uppercase tracking-widest"
                 >
                    Get a Quote
                 </Link>
               </div>
             </div>
          </div>
          
          {/* Ken Burns 缓慢放大特效 */}
          <Image
            src={src}
            alt={`ADE Smart Home Premium Installation ${index + 1}`}
            fill
            className={cn(
              "object-cover transition-transform duration-[12000ms] ease-out", // 延长 Ken Burns 时间，更显高级
              index === current ? "scale-105" : "scale-100"
            )}
            priority={index === 0}
            unoptimized 
          />
          {/* 旗舰级遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 z-10" />
          
          {/* 底部品牌金暗光装饰：增加高级感 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a47e]/15 blur-[180px] rounded-full pointer-events-none z-10" />
        </div>
      ))}
      
      {/* 轮播点导航 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              index === current 
                ? "bg-[#c5a47e] w-10 shadow-[0_0_10px_rgba(197,164,126,0.5)]" 
                : "bg-white/30 w-2 hover:bg-white/60" 
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
