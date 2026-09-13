import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageSquareText } from "lucide-react";
import { businessInfo } from "@/lib/seoData";

export default function NotFound() {
  return (
    <main className="min-h-[65svh] px-5 pb-20 pt-[max(160px,var(--site-header-clearance))] text-white sm:px-8" data-not-found>
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-[#d9b98f]">404 / PAGE NOT FOUND</p>
        <h1 className="mt-5 break-words text-3xl font-bold leading-tight sm:text-4xl">We couldn&apos;t find that page</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
          The link may be out of date, or the address may be incorrect. You can return home or browse our current products and installation services.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 [&>a]:min-w-0 [&>a]:max-w-full [&>a>span]:min-w-0 [&>a>span]:break-words">
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-[12px] rounded-md bg-[#d9b98f] px-[20px] py-3 font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b98f]">
            <ArrowLeft className="h-[20px] w-[20px] shrink-0" aria-hidden="true" />
            <span>Back to home</span>
          </Link>
          <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-[12px] rounded-md border border-zinc-500 px-[20px] py-3 font-semibold hover:bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b98f]">
            <span>Browse products</span>
            <ArrowRight className="h-[20px] w-[20px] shrink-0" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 border-t border-zinc-700 pt-5">
          <a href={`sms:${businessInfo.phoneInternational}`} className="inline-flex min-h-12 max-w-full items-center gap-[12px] text-[#d9b98f] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9b98f]">
            <MessageSquareText className="h-[20px] w-[20px] shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">Text {businessInfo.phone}</span>
          </a>
        </div>
      </div>
    </main>
  );
}
