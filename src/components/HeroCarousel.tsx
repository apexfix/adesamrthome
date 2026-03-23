"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

SwiperCore.use([Autoplay, EffectFade, Pagination]);

const slides = [
  {
    title: "Protect Your Home",
    highlight: "Smart & Secure",
    description: "Experience the future of home security in Adelaide. Precision-installed smart locks combining biometrics with world-class design.",
    imagePath: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=2000",
    btn1Text: "SHOP NOW",
    btn1Link: "/products",
    btn2Text: "LEARN MORE",
    btn2Link: "/contact"
  },
  {
    title: "Military Grade",
    highlight: "Biometrics",
    description: "3D Facial Recognition and Fingerprint access. Never worry about losing keys again.",
    imagePath: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=2000",
    btn1Text: "EXPLORE LOCKS",
    btn1Link: "/products?category=SMART+LOCK",
    btn2Text: "LEARN MORE",
    btn2Link: "/contact"
  },
  {
    title: "24/7 Crystal Clear",
    highlight: "CCTV Systems",
    description: "Monitor your perimeter remotely. Expert installation and setup in Adelaide.",
    imagePath: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=2000",
    btn1Text: "VIEW CCTV",
    btn1Link: "/products?category=CCTV",
    btn2Text: "LEARN MORE",
    btn2Link: "/contact"
  }
];

export function HeroCarousel() {
  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Swiper
        effect="fade"
        speed={1500}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        pagination={{ 
          clickable: true,
        }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative h-full w-full overflow-hidden bg-black flex items-center justify-center">
            
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/95 z-10" />
            
            <img
              src={slide.imagePath}
              alt={`${slide.title} ${slide.highlight}`}
              className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-[15000ms] ease-out hover:scale-110"
            />

            {/* 内容区：100% 还原昨晚定稿的结构和 CSS 类名 */}
            <div className="relative z-20 container px-4 md:px-6 flex flex-col items-center text-center">
              <div className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight text-white">
                  {slide.title}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c5a47e] via-[#e8d0a9] to-[#c5a47e]">
                    {slide.highlight}
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-300 font-light mx-auto max-w-2xl leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center">
                  {/* 昨晚的 Shop Now 按钮样式 */}
                  <Link href={slide.btn1Link} className="inline-flex h-14 items-center justify-center rounded-full bg-[#c5a47e] px-10 text-sm font-bold text-black shadow-lg hover:scale-105 transition-all">
                    {slide.btn1Text}
                  </Link>
                  {/* 昨晚的 Learn More 按钮样式 */}
                  <Link href={slide.btn2Link} className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 text-sm font-bold text-white transition-all hover:bg-white hover:text-black">
                    {slide.btn2Text}
                  </Link>
                </div>
              </div>
            </div>

            {/* 底部金光装饰 */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c5a47e]/15 blur-[180px] rounded-full pointer-events-none z-20" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
