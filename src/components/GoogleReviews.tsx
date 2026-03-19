import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    author: "Celia",
    rating: 5,
    text: "I contacted Smartlock to install a smart lock for my new house. I was given a wide range of options, which could have been confusing, but John was extremely patient in explaining the different models... After discussing my needs, I decided on a Samsung smart lock, which turned out to be the perfect choice. John was very punctual for the appointment, and the installation was done brilliantly. Unlike many tradies who leave a mess behind, John made sure everything was properly cleaned up after the installation.",
    date: "1 week ago",
    initial: "C",
    images: ["/img/a1.jpg", "/img/a2.jpg"] // Placeholders
  },
  {
    id: 2,
    author: "longxiang",
    rating: 5,
    text: "John is incredibly professional and skilled, and I highly recommend his service. He installed a smart lock on our front door and replaced the existing lock smoothly and without any issues... Even though additional cutting was required on the door, John worked very carefully and cleanly, with minimal impact. If you're thinking about installing a smart lock, I wouldn't recommend DIY at all—just get John to do it properly.",
    date: "1 week ago",
    initial: "L",
    images: ["/img/a1.jpg", "/img/a2.jpg", "/img/a1.jpg"] // Placeholders
  },
  {
    id: 3,
    author: "Jingbo Zhou",
    rating: 5,
    text: "I recently had my smart lock installed by John, and I couldn't be happier with the service. He was professional, punctual, and paid great attention to detail throughout the installation. John was also very friendly and took the time to clearly explain how the lock works and answer all my questions. The whole process was smooth and stress-free, and I felt very comfortable from start to finish. Highly recommend his service.",
    date: "1 week ago",
    initial: "J",
    images: ["/img/a2.jpg", "/img/a1.jpg", "/img/a2.jpg"] // Placeholders
  }
];

export function GoogleReviews() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl font-bold text-slate-800">Excellent</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#F4B400] text-[#F4B400]" />
              ))}
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Customer Reviews</h2>
          <p className="text-gray-500 max-w-2xl">
            See what our customers have to say about our smart locks and installation services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {reviews.map((review) => (
            <div key={review.id} className="bg-slate-50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {review.initial}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{review.author}</div>
                  <div className="text-xs text-slate-500">{review.date}</div>
                </div>
                <div className="ml-auto flex bg-white px-2 py-1 rounded-full border">
                  <span className="text-xs font-bold mr-1">{review.rating}.0</span>
                  <Star className="w-3 h-3 fill-[#F4B400] text-[#F4B400] self-center" />
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-grow">
                "{review.text}"
              </p>
              
              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                      <Image 
                        src={img} 
                        alt={`Review image ${idx + 1}`} 
                        fill 
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="https://g.page/r/Cak2vtUI0QLfEBM/review" 
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-black hover:bg-gray-800 md:text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Read All Reviews on
            <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png" alt="Google" className="h-5 ml-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
