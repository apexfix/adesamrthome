import { ExternalLink, Star } from "lucide-react";
import { GOOGLE_BUSINESS_URL, GOOGLE_REVIEW_URL } from "@/lib/seoData";

/** GOOGLE_REVIEW_URL opens the “write a review” box directly; GOOGLE_BUSINESS_URL opens the profile with every review. */
const GOOGLE_WRITE_REVIEW_URL = GOOGLE_REVIEW_URL;
/** Overall Google rating shown above the reviews. TODO(owner): update when the rating or review count changes. */
const GOOGLE_RATING = { value: "5.0", count: 0 /* TODO(owner): number of Google reviews; 0 hides the count */ };

// TODO(owner): fill each review date as shown on Google, ISO format, e.g. "2025-08-14". Empty dates are hidden.
const reviews = [
  {
    id: 1,
    author: "Celia",
    rating: 5,
    date: "",
    text: "I contacted Smartlock to install a smart lock for my new house. John was extremely patient in explaining the different models... the installation was done brilliantly. Unlike many tradies who leave a mess behind, John made sure everything was properly cleaned up.",
  },
  {
    id: 2,
    author: "Longxiang",
    rating: 5,
    date: "",
    text: "John is incredibly professional and skilled. He installed a smart lock on our front door smoothly and without any issues... Even though additional cutting was required, John worked very carefully and cleanly. Just get John to do it properly.",
  },
  {
    id: 3,
    author: "Jingbo Zhou",
    rating: 5,
    date: "",
    text: "Professional, punctual, and paid great attention to detail. John was also very friendly and took the time to clearly explain how the lock works. The whole process was smooth and stress-free. Highly recommend his service.",
  }
];

const formatReviewDate = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric", timeZone: "Australia/Adelaide" }).format(new Date(iso));

function ReviewByline({ review }: { review: (typeof reviews)[number] }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="font-bold text-white">{review.author}</span>{" "}
      <span className="flex gap-0.5" role="img" aria-label={`Rated ${review.rating} out of 5`}>
        {Array.from({ length: review.rating }, (_, star) => (
          <Star key={star} className="h-3.5 w-3.5 fill-[#c5a47e] text-[#c5a47e]" aria-hidden="true" />
        ))}
      </span>{" "}
      <span className="text-sm text-zinc-400">
        Google review{review.date && <>{" · "}<time dateTime={review.date}>{formatReviewDate(review.date)}</time></>}
      </span>
    </span>
  );
}

export function GoogleReviews() {
  return (
    <section id="reviews" className="scroll-mt-20 border-y border-zinc-900 bg-zinc-950 py-20 text-white md:py-24">
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold md:text-5xl">
              Trusted by Adelaide homeowners
            </h2>
            <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">
              Feedback from local customers who chose ADE Smart Home for careful installation,
              clear setup help and a clean finish.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold leading-none">{GOOGLE_RATING.value}</span>{" "}
              <span className="flex gap-1" role="img" aria-label={`Rated ${GOOGLE_RATING.value} out of 5 on Google`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-[#c5a47e] text-[#c5a47e]" aria-hidden="true" />
                ))}
              </span>
            </div>
            <a href={GOOGLE_BUSINESS_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-white underline-offset-4 hover:text-[#d9b98f] hover:underline">
              Google rating{GOOGLE_RATING.count > 0 ? ` · ${GOOGLE_RATING.count} reviews` : ""} · read all on Google
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* One lead review set large, two shorter ones beside it. */}
        <div className="mt-12 grid gap-x-14 gap-y-10 border-t border-zinc-800 pt-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          {reviews.slice(0, 1).map((review) => (
            <figure key={review.id}>
              <blockquote className="max-w-[34ch] text-2xl font-semibold leading-[1.35] text-white md:text-[2rem] md:leading-[1.3]">
                &ldquo;{review.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6"><ReviewByline review={review} /></figcaption>
            </figure>
          ))}
          <div className="divide-y divide-zinc-800">
            {reviews.slice(1).map((review) => (
              <figure key={review.id} className="py-7 first:pt-0 last:pb-0">
                <blockquote className="text-base leading-7 text-zinc-300">&ldquo;{review.text}&rdquo;</blockquote>
                <figcaption className="mt-4"><ReviewByline review={review} /></figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-control inline-flex min-h-12 items-center justify-center gap-2 rounded-md border px-6 text-sm font-bold text-white hover:text-[#d9b98f]"
          >
            <Star className="h-4 w-4 text-[#d9b98f]" aria-hidden="true" />
            <span>Leave a review on Google</span>{" "}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>{" "}
          <p className="text-sm text-zinc-400">Had us install a lock? A short review helps other Adelaide families find us.</p>
        </div>
      </div>
    </section>
  );
}
