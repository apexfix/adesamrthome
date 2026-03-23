"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link"; // 新增 Link 组件
import { cn } from "@/lib/utils";

// 我为你重新梳理了“图文对应”的数据结构，并新增了 CCTV 选项
const slides = [
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", 
    title: "Protect Your Home",
    highlight: "Smart & Secure",
    description: "Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.",
    btnText: "Shop Collection",
    btnLink: "/products" // 智能锁默认去全部商品
  },
  {
    src: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop",
    title: "Military Grade",
    highlight: "Biometrics",
    description: "3D Facial Recognition and Fingerprint access. Never worry about losing keys again.",
    btnText: "Shop Collection",
    btnLink: "/products"
  },
  // --- 【新增】CCTV 选项 ---
  {
    // 我为你挑选的 CCTV 场景图：现代豪宅外墙，带有监控摄像头特写
    src: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=2070&auto=format&fit=crop", 
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    description: "Monitor your perimeter remotely with ADE's premium CCTV systems. Expert installation and setup.",
    btnText: "Shop Collection",
    btnLink: "/products?category=CCTV" // 【关键修复】点击跳转到分类名为 CCTV 的商品界面
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // 使用 useCallback 确保函数引用稳定，防止在 useEffect 依赖项中引起死循环
  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000); // 将轮播间隔调整为 7 秒，给文字和图片更长的展示时间

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1500 ease-in-out", 
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* 背景图片 */}
          <Image
            src={slide.src}
            alt={`${slide.title} ${slide.highlight}`}
            fill
            className={cn(
              "object-cover transition-transform duration-[10000ms] ease-out", // 延长 Ken Burns 放大时间，更显从容、高级
              index === current ? "scale-105" : "scale-100"
            )}
            priority={index === 0}
            unoptimized // 允许直接加载外部高质量图片
          />
          
          {/* 四角压暗遮罩：确保上方的白色/金色文字绝对清晰 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />
          
          {/* 【修复核心】浮动文字与按钮内容：将其放进 SwiperSlide 的循环内部 */}
          <div className="relative z-20 container px-4 md:px-6 flex flex-col items-center text-center mt-20">
            <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-white">
                {slide.title}
                <br />
                {/* 你的金色渐变高亮文字 */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                  {slide.highlight}
                </span>
              </h1>
              {/* 你的描述性文字 */}
              <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
                {slide.description}
              </p>
              {/* 按钮区域 */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
                {/* 昨晚的 Shop Now 按钮样式，带发光阴影 */}
                <Link href={slide.btnLink} className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black shadow-[0_0_40px_rgba(197,164,126,0.25)] hover:scale-105 transition-all uppercase tracking-widest">
                  {slide.btnText}
                </Link>
                {/* 昨晚的 Learn More 按钮样式，玻璃拟态 */}
                <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-black uppercase tracking-widest">
                  Get a Quote
                  
                </Link>
              </div>
            </div>
          </div>
          
          {/* 底部品牌金暗光装饰：增加高级感 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a47e]/15 blur-[180px] rounded-full pointer-events-none z-20" />
        </div>
      ))}
      
      {/* 轮播点导航 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
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
