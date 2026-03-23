"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper"; 
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

// 【必须引入】Swiper 核心样式
import "swiper/css";
import "swiper/css/effect-fade";

// 显式加载模块
SwiperCore.use([Autoplay, EffectFade]);

const slides = [
  // 1. 【还原】原始版本（幻灯片 1）：现代深色大门与温馨灯光
  {
    title: "Protect Your Home",
    highlight: "Smart & Secure",
    description: "Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.",
    // 【物理检查】请确保你的 public/img/ 下有这两张图
    imagePath: "/img/hero-1.jpg", 
  },
  // 2. 【还原】原始版本（幻灯片 2）：暗调高级门禁特写
  {
    title: "Military Grade",
    highlight: "Biometrics",
    description: "3D Facial Recognition and Fingerprint access. Never worry about losing keys again.",
    imagePath: "/img/hero-2.jpg", 
  },
  // 3. 【新增】追加的 CCTV 选项，不干扰原本设计感
  {
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    description: "Monitor your perimeter remotely. Expert installation of perimeter security and access control in Adelaide.",
    // 将此处路径改为你准备好的 CCTV 豪宅外墙图
    imagePath: "/img/hero-cctv.jpg", 
  }
];

export function HeroCarousel() {
  return (
    <div className="absolute inset-0 z-0 bg-zinc-950">
      <Swiper
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 7000, // 停留时间
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden bg-zinc-950">
            {/* 渐变遮罩：确保上方的文字绝对清晰可见 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/95 z-10" />
            
            {/* 背景图片 - 增加了高级的缓慢推拉动画 */}
            <Image
              src={slide.imagePath}
              alt={`${slide.title} ${slide.highlight}`}
              fill
              className="object-cover object-center transform scale-105 transition-transform duration-[15000ms] ease-out hover:scale-110"
              priority={index === 0} // 第一张图优先加载
              quality={90}
            />
            
            {/* 底部品牌金暗光装饰 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a47e]/15 blur-[180px] rounded-full pointer-events-none z-20" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
