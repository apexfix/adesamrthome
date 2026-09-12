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
    <section id="reviews" className="scroll-mt-20 border-y border-zinc-900 bg-zinc-950 py-20 text-white md:py-24">
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
              Customer feedback
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">
              Trusted by Adelaide homeowners
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">
              Feedback from local customers who chose ADE Smart Home for careful installation,
              clear setup help and a clean finish.
            </p>
          </div>
          <div className="flex items-center gap-3 border-l-2 border-[#c5a47e] pl-5">
            <div>
              <p className="text-sm font-bold text-white">Excellent on Google</p>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-[#c5a47e] text-[#c5a47e]" aria-hidden="true" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="liquid-glass-soft mt-12 grid overflow-hidden rounded-md border md:grid-cols-3">
          {reviews.map((review, index) => (
            <article
              key={review.id}
              className={`relative flex h-full flex-col py-8 md:px-7 lg:px-9 ${
                index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""
              }`}
            >
              <Quote className="absolute right-6 top-8 h-7 w-7 text-zinc-800" aria-hidden="true" />
              <div className="mb-7 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white p-2.5">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white">{review.author}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.1em] text-zinc-500">{review.date}</p>
                </div>
              </div>

              <p className="flex-grow text-base leading-7 text-zinc-300">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="mt-7 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 fill-[#c5a47e] text-[#c5a47e]" aria-hidden="true" />
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="https://g.page/r/Cak2vtUI0QLfEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center border border-zinc-700 px-6 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
          >
            Verified reviews on
            <span className="ml-2 flex border-l border-zinc-700 pl-2">
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
