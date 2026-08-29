"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Phone,
  Send,
} from "lucide-react";

const serviceOptions = [
  { value: "supply-install", label: "Supply & install" },
  { value: "installation-only", label: "Installation only" },
  { value: "cctv", label: "CCTV" },
  { value: "not-sure", label: "Not sure" },
] as const;

const initialFormData = {
  service: "supply-install",
  product: "",
  name: "",
  phone: "",
  suburb: "",
  email: "",
  message: "",
};

type ContactFormProps = {
  initialService?: string;
  initialProduct?: string;
};

export function ContactForm({
  initialService,
  initialProduct,
}: ContactFormProps = {}) {
  const selectedService =
    serviceOptions.find((option) => option.value === initialService)?.value ??
    initialFormData.service;
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    service: selectedService,
    product: initialProduct?.trim().slice(0, 150) ?? "",
  }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.message || "We could not send your request. Please call us instead.",
        );
      }

      setSubmitted(true);
      setFormData((current) => ({
        ...initialFormData,
        service: current.service,
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not send your request. Please call us instead.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <section id="quote" className="border-y border-zinc-800 bg-zinc-950 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c5a47e]">
            Fast Adelaide quote
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            Tell Us What You Need
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            Leave your number and service type. We will confirm the next step,
            including any door photos or measurements we need.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <aside className="border border-zinc-800 bg-black p-6 md:p-8">
            <h3 className="text-xl font-bold text-white">Prefer to contact us directly?</h3>
            <div className="mt-6 space-y-3">
              <a
                href="tel:+61431060390"
                className="flex min-h-14 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                0431 060 390
              </a>
              <a
                href="mailto:info@adesmarthome.com.au?subject=Door%20photos%20for%20installation%20check"
                className="flex min-h-14 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
              >
                <Camera className="h-5 w-5" aria-hidden="true" />
                Email door photos
              </a>
            </div>

            <div className="mt-8 border-t border-zinc-800 pt-7">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                What happens next
              </h3>
              <ol className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-400">
                <li><strong className="mr-2 text-[#c5a47e]">1.</strong>We call or email you.</li>
                <li><strong className="mr-2 text-[#c5a47e]">2.</strong>You send door or site photos.</li>
                <li><strong className="mr-2 text-[#c5a47e]">3.</strong>We confirm suitability, price and availability.</li>
              </ol>
              <Link
                href="/blog/smart-lock-door-compatibility-check"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#c5a47e] hover:text-white"
              >
                View door measurement guide
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>

          <div className="relative border border-slate-200 bg-white p-6 shadow-2xl md:p-9">
            {submitted ? (
              <div className="flex min-h-[470px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-14 w-14 text-emerald-600" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-black text-slate-950">Request received</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                  Thank you. We will contact you shortly to confirm the details and next step.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-7 text-sm font-bold text-[#8a6b48] hover:text-black"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black tracking-tight text-slate-950">
                  {formData.product ? `Ask about ${formData.product}` : "Request a callback"}
                </h3>
                <p className="mt-2 text-sm text-slate-600">Name and phone are the only required fields.</p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                  <fieldset>
                    <legend className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      Service needed
                    </legend>
                    <div className="grid grid-cols-2 gap-px bg-slate-300 p-px sm:grid-cols-4">
                      {serviceOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData((current) => ({ ...current, service: option.value }))}
                          className={`min-h-12 px-2 text-xs font-bold transition-colors ${
                            formData.service === option.value
                              ? "bg-slate-950 text-white"
                              : "bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                          aria-pressed={formData.service === option.value}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <input type="hidden" name="product" value={formData.product} />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      Name
                      <input
                        name="name"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      Phone
                      <input
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                        placeholder="04xx xxx xxx"
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      Suburb <span className="font-normal normal-case text-slate-400">optional</span>
                      <input
                        name="suburb"
                        autoComplete="address-level2"
                        value={formData.suburb}
                        onChange={handleChange}
                        className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                        placeholder="e.g. Norwood"
                      />
                    </label>
                    <label className="space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                      Email <span className="font-normal normal-case text-slate-400">optional</span>
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                        placeholder="email@example.com"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    Details <span className="font-normal normal-case text-slate-400">optional</span>
                    <textarea
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full resize-none border border-slate-300 bg-slate-50 p-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                      placeholder="Tell us about your door, existing lock or CCTV needs."
                    />
                  </label>

                  {errorMessage && (
                    <p role="alert" className="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
                      {errorMessage} Call 0431 060 390 if the problem continues.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-14 w-full items-center justify-center gap-3 bg-black px-5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#c5a47e] hover:text-black disabled:cursor-wait disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Request a callback"}
                    {!isSubmitting && <Send className="h-4 w-4" aria-hidden="true" />}
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    No payment required. We confirm scope and pricing before booking.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
