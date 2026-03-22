import { Star } from "lucide-react";
import Link from "next/link";
// 删除了无用的 next/image 引入

const reviews = [
  {
    id: 1,
    author: "Celia",
    rating: 5,
    text: "I contacted Smartlock to install a smart lock for my new house. I was given a wide range of options, which could have been confusing, but John was extremely patient in explaining the different models... After discussing my needs, I decided on a Samsung smart lock, which turned out to be the perfect choice. John was very punctual for the appointment, and the installation was done brilliantly. Unlike many tradies who leave a mess behind, John made sure everything was properly cleaned up after the installation.",
    date: "1 week ago",
    initial: "C",
    // 移除了 images 数组
  },
  {
    id: 2,
    author: "longxiang",
    rating: 5,
    text: "John is incredibly professional and skilled, and I highly recommend his service. He installed a smart lock on our front door and replaced the existing lock smoothly and without any issues... Even though additional cutting was required on the door, John worked very carefully and cleanly, with minimal impact. If you're thinking about installing a smart lock, I wouldn't recommend DIY at all—just get John to do it properly.",
    date: "1 week ago",
    initial: "L",
  },
  {
    id: 3,
    author: "Jingbo Zhou",
    rating: 5,
    text: "I recently had my smart lock installed by John, and I couldn't be happier with the service. He was professional, punctual, and paid great attention to detail throughout the installation. John was also very friendly and took the time to clearly explain how the lock works and answer all my questions. The whole process was smooth and stress-free, and I felt very comfortable from start to finish. Highly recommend his service.",
    date: "1 week ago",
    initial: "J",
  }
];

export function GoogleReviews() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* 头部标题区域 */}
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-slate-900">Excellent</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#F4B400] text-[#F4B400]" />
              ))}
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">
            Customer Reviews
          </h2>
          <p className="text-gray-500 max-w-2xl text-lg">
            See what our customers have to say about our smart locks and installation services.
          </p>
        </div>

        {/* 评论卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full border border-slate-100">
              
              {/* 用户信息栏 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#c5a47e]/10 flex items-center justify-center text-[#c5a47e] font-bold text-lg">
                  {review.initial}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{review.author}</div>
                  <div className="text-sm text-slate-500">{review.date}</div>
                </div>
                <div className="ml-auto flex bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold mr-1 text-slate-700">{review.rating}.0</span>
                  <Star className="w-3 h-3 fill-[#F4B400] text-[#F4B400] self-center" />
                </div>
              </div>

              {/* 评论正文 - 增加了行高和引用样式 */}
              <blockquote className="text-slate-600 text-sm md:text-base leading-relaxed flex-grow relative">
                <span className="text-4xl text-slate-200 absolute -top-4 -left-2 font-serif">"</span>
                <span className="relative z-10 italic">{review.text}</span>
              </blockquote>
              
            </div>
          ))}
        </div>

        {/* 底部按钮 */}
        <div className="text-center">
          <Link 
            href="https://g.page/r/Cak2vtUI0QLfEBM/review" 
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-white bg-black hover:bg-[#c5a47e] md:text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Read All Reviews on
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png" alt="Google" className="h-5 ml-3" />
          </Link>
        </div>

      </div>
    </section>
  );
}
