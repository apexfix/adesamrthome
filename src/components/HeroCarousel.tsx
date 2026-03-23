"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";

// 必须引入 Swiper 样式才能正常显示
import "swiper/css";
import "swiper/css/effect-fade";

// 幻灯片数据 - 【关键】全部使用本地 public/img/ 下的静态图片路径
const slides = [
  {
    title: "Protect Your Home",
    highlight: "Smart & Secure",
    // 这是你原始的纯净版文案
    description: "Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.",
    // 【物理检查】请确保 public/img/hero-lock-1.jpg 存在
    imagePath: "/img/hero-lock-1.jpg", 
  },
  {
    title: "Military Grade",
    highlight: "Biometrics",
    description: "3D Facial Recognition and Fingerprint access. Never worry about losing keys again.",
    // 【物理检查】请确保 public/img/hero-lock-2.jpg 存在
    imagePath: "/img/hero-lock-2.jpg", 
  },
  // --- 【新增】在纯净版基础上，只在最后追加一个监控选项 ---
  {
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    description: "Monitor your perimeter remotely. Expert installation and setup in Adelaide.",
    // 【物理检查】请确保 public/img/hero-cctv.jpg 存在 (或者暂时用锁的图片代替，名字改对即可)
    imagePath: "/img/hero-cctv.jpg", 
  }
];

export function HeroCarousel() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        speed={1500} // 平滑渐变速度
        autoplay={{
          delay: 7000, // 停留时间
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden bg-black">
            {/* 渐变遮罩：确保文字绝对清晰可见 */}
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
