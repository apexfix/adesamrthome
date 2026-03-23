"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper"; // 1. 【核心修复】引入 Swiper 核心
import { Autoplay, EffectFade } from "swiper/modules";

// 必须引入 Swiper 样式才能正常显示
import "swiper/css";
import "swiper/css/effect-fade";

// 2. 【关键修正】显式向 Swiper Core 注册模块
// 这一步如果不做，即使开启了 autoplay 也没有任何效果
SwiperCore.use([Autoplay, EffectFade]);

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
        // 模块已经通过 .use() 加载，无需再在此处显式写 modules={[...]}
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
            {/* 渐变遮罩：确保上方的文字绝对清晰可见 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95 z-10" />
            
            {/* 保留原生 img 标签，彻底绕过 Next.js 的拦截机制（解决黑屏问题） */}
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
