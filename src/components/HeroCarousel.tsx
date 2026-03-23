"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    // 幻灯片 1：高级入户门（代表智能锁）
    title: "Precision Installed",
    highlight: "Smart Locks",
    description: "Military-grade biometrics. Keyless peace of mind for Adelaide families.",
    // 一张非常有质感的暗色木门与现代门把手特写
    imagePath: "https://images.unsplash.com/photo-1528318269466-69f88414ba2a?auto=format&fit=crop&q=80&w=2000", 
  },
  {
    // 幻灯片 2：监控业务
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    description: "Monitor your perimeter remotely. Expert installation and setup in Adelaide.",
    // 一张极具科技感的高清监控摄像头特写
    imagePath: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=2000", 
  },
  {
    // 幻灯片 3：综合全屋安防
    title: "Total Home",
    highlight: "Security Solutions",
    description: "Integrating locks and cameras for a seamless, secure Adelaide living experience.",
    // 一栋极具现代感的豪宅外观（完美契合黑金与智能家居调性）
    imagePath: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000", 
  },
];

export function HeroCarousel() {
  return (
    <div className="absolute inset-0 z-0">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden bg-zinc-950">
            {/* 渐变遮罩：确保上方的白色文字绝对清晰可见 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />
            
            {/* 背景图片 */}
            <Image
              src={slide.imagePath}
              alt={`${slide.title} ${slide.highlight}`}
              fill
              className="object-cover object-center transform scale-105"
              priority={index === 0}
              quality={90}
            />
            
            {/* 底部品牌金暗光装饰 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#c5a47e]/20 blur-[150px] rounded-full pointer-events-none z-20" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
