"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

// 必须引入 Swiper 样式
import "swiper/css";
import "swiper/css/effect-fade";

// 包含你原始的图片链接和追加的 CCTV 选项
const slides = [
  {
    title: "Protect Your Home",
    highlight: "Smart & Secure",
    description: "Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.",
    imagePath: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2000", 
  },
  {
    title: "Military Grade",
    highlight: "Biometrics",
    description: "3D Facial Recognition and Fingerprint access. Never worry about losing keys again.",
    imagePath: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=2000", 
  },
  {
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    description: "Monitor your perimeter remotely. Expert installation and setup in Adelaide.",
    imagePath: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=2000", 
  }
];

export function HeroCarousel() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden bg-black">
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/95 z-10" />
            
            {/* 核心修复：使用原生的 img 标签，彻底绕过 Next.js 的拦截机制 */}
            <img
              src={slide.imagePath}
              alt={`${slide.title} ${slide.highlight}`}
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-[15000ms] ease-out hover:scale-110"
            />
            
            {/* 底部品牌金暗光装饰 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a47e]/15 blur-[180px] rounded-full pointer-events-none z-20" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
