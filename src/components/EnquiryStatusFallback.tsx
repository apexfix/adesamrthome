import Link from "next/link";
import { Mail, MessageSquareText } from "lucide-react";
import { businessInfo } from "@/lib/seoData";

export function EnquiryStatusFallback() {
  return (
    <div data-enquiry-thank-you className="mx-auto max-w-5xl px-5 pb-14 pt-6 text-white wrap-anywhere sm:px-8 md:pb-20">
      <p className="text-sm font-bold text-[#d9b98f]">ADE Smart Home</p>
      <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Enquiry details</h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300">We cannot confirm a submission from this page. If you have already sent an enquiry, check with us by SMS or email before sending another copy.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent("Hi ADE Smart Home, could you help me check my enquiry?")}`} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-[#d9b98f] px-4 py-3 text-base font-bold text-black">
          <MessageSquareText className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Check by SMS</span>
        </a>
        <a href={`mailto:${businessInfo.email}?subject=Check%20my%20enquiry`} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md border border-zinc-600 px-4 py-3 text-base font-bold text-[#d9b98f]">
          <Mail className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Check by email</span>
        </a>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-base font-bold text-[#d9b98f]">
        <Link href="/contact" className="inline-flex min-h-12 items-center">Start an enquiry</Link>
        <Link href="/" className="inline-flex min-h-12 items-center text-zinc-300">Return home</Link>
      </div>
    </div>
  );
}
