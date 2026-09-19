"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, MessageSquareText } from "lucide-react";
import { businessInfo } from "@/lib/seoData";
import { ENQUIRY_RECEIPT_KEY, enquiryReceiptDetails, parseEnquiryReceipt } from "@/lib/enquiryReceipt";
import { EnquiryStatusFallback } from "@/components/EnquiryStatusFallback";

function readReceipt() {
  try { return sessionStorage.getItem(ENQUIRY_RECEIPT_KEY); } catch { return null; }
}

export function EnquiryThankYou() {
  const [raw, setRaw] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setRaw(readReceipt());
    // Read browser-only receipt state after the initial server-matched render.
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);
  const receipt = parseEnquiryReceipt(raw);
  if (!receipt) return <EnquiryStatusFallback />;
  const details = enquiryReceiptDetails(receipt.service);
  const isCameraKit = receipt.service === "security-camera-kit";
  const photoFollowUp = receipt.service === "supply-install" || receipt.service === "installation-only";
  const sms = `Hi ADE Smart Home, I would like to add details to enquiry ${receipt.leadId}.`;
  const steps = [
    { title: "We review the details", detail: details.review },
    { title: "We ask for anything missing", detail: "We will contact you by SMS or email if we need more information." },
    { title: "You receive the next step", detail: details.next },
  ];
  return (
    <div data-enquiry-thank-you className="mx-auto max-w-5xl px-5 pb-14 pt-6 text-white wrap-anywhere sm:px-8 md:pb-20">
      <section className="border-b border-zinc-800 pb-9" aria-live="polite">
        <CheckCircle2 className="enquiry-received-icon mb-6 h-12 w-12 text-emerald-400" aria-hidden="true" />
        <p className="text-sm font-bold text-[#d9b98f]">Enquiry received</p>
        <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">Thank You. We Have Your Details.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300">{details.intro}</p>
        <div className="mt-6 border-l-2 border-[#d9b98f] pl-4">
          <p className="text-sm text-zinc-400">Your saved enquiry reference</p>
          <p data-enquiry-reference className="mt-2 text-xl font-bold leading-relaxed text-[#d9b98f]">{receipt.leadId}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">No need to send it again. Please keep this reference for any follow-up.</p>
        </div>
      </section>
      <section className="pt-9">
        <h2 className="text-2xl font-bold">What happens next</h2>
        <div className="mt-6 grid border-y border-zinc-800 md:grid-cols-3">
          {steps.map((step, index) => <article key={step.title} data-process-step className={`min-w-0 py-6 md:px-6 ${index > 0 ? "border-t border-zinc-800 md:border-l md:border-t-0" : ""}`}>
            <p data-step-number className="text-sm font-bold text-[#d9b98f]">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{step.detail}</p>
          </article>)}
        </div>
      </section>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(sms)}`} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-[#d9b98f] px-4 py-3 text-base font-bold text-black">
          <MessageSquareText className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Add Details by SMS</span>
        </a>
        <a href={`mailto:${businessInfo.email}?subject=${encodeURIComponent(`Enquiry ${receipt.leadId}`)}`} className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md border border-zinc-600 px-4 py-3 text-base font-bold text-[#d9b98f]">
          <Mail className="h-5 w-5 shrink-0" aria-hidden="true" /><span>{photoFollowUp ? "Email More Door Photos" : "Email More Details"}</span>
        </a>
      </div>
      <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-base">
        <Link href={isCameraKit ? "/products/security-camera-kits" : photoFollowUp ? "/blog/smart-lock-door-compatibility-check" : "/products"} className="inline-flex min-h-12 items-center gap-2 font-bold text-[#d9b98f]">
          <span>{isCameraKit ? "Browse camera equipment" : photoFollowUp ? "Check door photo requirements" : "Browse products and services"}</span><ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
        <Link href="/" className="inline-flex min-h-12 items-center font-bold text-zinc-300">Return home</Link>
      </div>
    </div>
  );
}
