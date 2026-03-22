import { Star, Quote } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    id: 1,
    author: "Celia",
    rating: 5,
    text: "I contacted Smartlock to install a smart lock for my new house. John was extremely patient in explaining the different models... the installation was done brilliantly. Unlike many tradies who leave a mess behind, John made sure everything was properly cleaned up.",
    date: "1 week ago",
  },
  {
    id: 2,
    author: "longxiang",
    rating: 5,
    text: "John is incredibly professional and skilled. He installed a smart lock on our front door smoothly and without any issues... Even though additional cutting was required, John worked very carefully and cleanly. Just get John to do it properly.",
    date: "1 week ago",
  },
  {
    id: 3,
    author: "Jingbo Zhou",
    rating: 5,
    text: "Professional, punctual, and paid great attention to detail. John was also very friendly and took the time to clearly explain how the lock works. The whole process was smooth and stress-free. Highly recommend his service.",
    date: "1 week ago",
  }
];

export function GoogleReviews() {
  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* 背景点缀：微弱的品牌色光晕 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#c5a47e]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* 头部：打造“官方认证”的权威感 */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
            <span className="text-sm font-bold text-[#c5a47e]">Excellent</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3 h-3 fill-[#c5a47e] text-[#c5a47e]" />
              ))}
            </div>
            <span className="text-xs text-zinc-500 ml-1">on Google</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Trusted by Adelaide Homeowners
          </h2>
          <p className="text-zinc-400 max-w-2xl text-lg font-light leading-relaxed">
            Don't just take our word for it. Join over 400+ satisfied customers who upgraded their home security with ADE Smart Home.
          </p>
        </div>

        {/* 评论网格：现代暗色卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="group relative bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800/50 backdrop-blur-sm transition-all duration-500 hover:border-[#c5a47e]/30 hover:bg-zinc-900/60 flex flex-col h-full"
            >
              {/* 装饰性的引用图标 */}
              <Quote className="absolute top-6 right-8 w-8 h-8 text-zinc-800 group-hover:text-[#c5a47e]/10 transition-colors duration-500" />
              
              <div className="flex items-center gap-4 mb-8">
                {/* 核心优化：统一使用 Google 品牌头像占位符，增强信任感 */}
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2.5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-[#c5a47e] transition-colors">{review.author}</div>
                  <div className="text-xs text-zinc-500 uppercase tracking-widest mt-0.5">{review.date}</div>
                </div>
              </div>

              <p className="text-zinc-300 text-sm md:text-base leading-relaxed flex-grow font-light">
                "{review.text}"
              </p>

              <div className="mt-8 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 fill-[#c5a47e] text-[#c5a47e]" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 底部按钮：药丸形发光设计 */}
        <div className="text-center">
          <Link 
            href="https://g.page/r/Cak2vtUI0QLfEBM/review" 
            target="_blank"
            className="group inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-black font-bold text-sm tracking-wide transition-all duration-300 hover:bg-[#c5a47e] hover:shadow-[0_0_30px_rgba(197,164,126,0.4)]"
          >
            VERIFIED REVIEWS ON 
            <span className="flex items-center ml-2 border-l border-black/10 pl-2">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
