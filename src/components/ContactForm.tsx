"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  ImagePlus,
  MessageSquareText,
  Send,
  X,
} from "lucide-react";
import { captureLeadAttribution, trackEvent } from "@/lib/analytics";
import { businessInfo } from "@/lib/seoData";

const serviceOptions = [
  { value: "supply-install", label: "Supply & install" },
  {
    value: "installation-only",
    label: "Installation only (other compatible brands supported)",
  },
  { value: "portfolio-project", label: "Property / project" },
  { value: "not-sure", label: "Not sure" },
] as const;

const propertyOptions = [
  { value: "", label: "Select property type" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "airbnb-rental", label: "Airbnb / rental" },
  { value: "new-build", label: "New build" },
  { value: "commercial-other", label: "Commercial / other" },
] as const;

const timingOptions = [
  { value: "", label: "Select preferred timing" },
  { value: "as-soon-as-possible", label: "As soon as possible" },
  { value: "within-one-week", label: "Within 1 week" },
  { value: "within-two-to-four-weeks", label: "Within 2–4 weeks" },
  { value: "flexible", label: "Flexible / researching" },
] as const;

const initialFormData = {
  service: "supply-install",
  product: "",
  name: "",
  phone: "",
  suburb: "",
  email: "",
  propertyType: "",
  preferredTiming: "",
  message: "",
};

const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 850_000;
const MAX_PHOTO_DIMENSION = 1600;
const acceptedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type ContactFormProps = {
  initialService?: string;
  initialProduct?: string;
};

function formatFileSize(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function compressPhoto(file: File, index: number): Promise<File> {
  if (!acceptedPhotoTypes.has(file.type)) {
    throw new Error("Please use JPEG, PNG or WebP photos.");
  }

  if (file.size <= MAX_PHOTO_BYTES) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = document.createElement("img");
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("One photo could not be prepared. Please try a JPEG image."));
      element.src = objectUrl;
    });
    const scale = Math.min(
      1,
      MAX_PHOTO_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("One photo could not be prepared. Please try again.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.72);
    });

    if (!blob || blob.size > 1_000_000) {
      throw new Error("One photo is still too large. Please crop it or choose a smaller image.");
    }

    const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-");
    return new File([blob], `${baseName || `door-photo-${index + 1}`}.jpg`, {
      type: "image/jpeg",
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function ContactForm({
  initialService,
  initialProduct,
}: ContactFormProps = {}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formStartedRef = useRef(false);
  const completedRef = useRef(false);
  const abandonmentTrackedRef = useRef(false);
  const validationErrorTrackedRef = useRef(false);
  const selectedService =
    serviceOptions.find((option) => option.value === initialService)?.value ??
    initialFormData.service;
  const [formData, setFormData] = useState(() => ({
    ...initialFormData,
    service: selectedService,
    product: initialProduct?.trim().slice(0, 150) ?? "",
  }));
  const [photos, setPhotos] = useState<File[]>([]);
  const [isPreparingPhotos, setIsPreparingPhotos] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [photoError, setPhotoError] = useState("");
  const latestFunnelStateRef = useRef({
    service: selectedService,
    product: initialProduct?.trim().slice(0, 150) ?? "",
    photoCount: 0,
  });

  useEffect(() => {
    latestFunnelStateRef.current = {
      service: formData.service,
      product: formData.product,
      photoCount: photos.length,
    };
  }, [formData.service, formData.product, photos.length]);

  useEffect(() => {
    const trackAbandonment = () => {
      if (
        !formStartedRef.current ||
        completedRef.current ||
        abandonmentTrackedRef.current
      ) {
        return;
      }

      abandonmentTrackedRef.current = true;
      const latest = latestFunnelStateRef.current;
      trackEvent("form_abandon", {
        form_name: "website_enquiry",
        service: latest.service,
        product: latest.product || "not-specified",
        photo_count: latest.photoCount,
        photo_status:
          latest.photoCount >= 4
            ? "complete"
            : latest.photoCount > 0
              ? "partial"
              : "none",
      });
    };

    window.addEventListener("pagehide", trackAbandonment);
    return () => {
      window.removeEventListener("pagehide", trackAbandonment);
      trackAbandonment();
    };
  }, []);

  const trackFormStart = () => {
    if (formStartedRef.current) return;

    formStartedRef.current = true;
    trackEvent("form_start", {
      form_name: "website_enquiry",
      service: formData.service,
      product: formData.product || "not-specified",
    });
  };

  const handleServiceSelection = (service: string) => {
    trackFormStart();
    setFormData((current) => ({ ...current, service }));
    trackEvent("form_service_selected", {
      form_name: "website_enquiry",
      service,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || isPreparingPhotos) return;

    trackFormStart();
    trackEvent("form_submit_attempt", {
      form_name: "website_enquiry",
      service: formData.service,
      product: formData.product || "not-specified",
      photo_count: photos.length,
    });
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      payload.append("attribution", JSON.stringify(captureLeadAttribution()));
      photos.forEach((photo) => payload.append("photos", photo, photo.name));

      const response = await fetch("/api/contact", {
        method: "POST",
        body: payload,
      });
      const result = (await response.json().catch(() => null)) as
        | { message?: string; leadId?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.message || "We could not send your request. Please text or email us instead.",
        );
      }

      completedRef.current = true;
      try {
        sessionStorage.setItem(
          "ade_completed_lead",
          JSON.stringify({
            service: formData.service,
            product: formData.product,
            photoCount: photos.length,
            preferredTiming: formData.preferredTiming,
            leadId: result?.leadId,
          }),
        );
      } catch {
        trackEvent("lead_storage_error", {
          form_name: "website_enquiry",
          service: formData.service,
          photo_count: photos.length,
        });
      }
      trackEvent("form_submit_success", {
        form_name: "website_enquiry",
        service: formData.service,
        product: formData.product || "not-specified",
        photo_count: photos.length,
      });
      router.push("/contact/thank-you");
    } catch (error) {
      trackEvent("form_submit_error", {
        form_name: "website_enquiry",
        service: formData.service,
        photo_count: photos.length,
      });
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not send your request. Please text or email us instead.",
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePhotoSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = "";
    setPhotoError("");

    if (!selectedFiles.length) return;
    if (photos.length + selectedFiles.length > MAX_PHOTOS) {
      setPhotoError(`Please add no more than ${MAX_PHOTOS} photos.`);
      trackEvent("form_photo_error", {
        form_name: "website_enquiry",
        reason: "maximum-photo-count",
        attempted_photo_count: photos.length + selectedFiles.length,
      });
      return;
    }

    trackFormStart();
    setIsPreparingPhotos(true);

    try {
      const prepared = await Promise.all(
        selectedFiles.map((file, index) => compressPhoto(file, photos.length + index)),
      );
      setPhotos((current) => [...current, ...prepared]);
      trackEvent("form_photo_added", {
        form_name: "website_enquiry",
        selected_photo_count: prepared.length,
        total_photo_count: photos.length + prepared.length,
      });
    } catch (error) {
      trackEvent("form_photo_error", {
        form_name: "website_enquiry",
        reason: "photo-preparation-failed",
      });
      setPhotoError(
        error instanceof Error ? error.message : "The selected photos could not be prepared.",
      );
    } finally {
      setIsPreparingPhotos(false);
    }
  };

  const handleInvalid = (event: React.FormEvent<HTMLFormElement>) => {
    if (validationErrorTrackedRef.current) return;

    validationErrorTrackedRef.current = true;
    const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    trackEvent("form_validation_error", {
      form_name: "website_enquiry",
      field_name: field.name || "unknown",
      service: formData.service,
      photo_count: photos.length,
    });

    window.setTimeout(() => {
      validationErrorTrackedRef.current = false;
    }, 1000);
  };

  return (
    <section id="quote" className="border-y border-zinc-800 bg-zinc-950 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c5a47e]">
            Fast Adelaide quote
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            Tell Us About Your Door
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            Add your suburb, preferred timing and door photos for a faster compatibility check.
            We will review the details and reply by SMS or email with the next step.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <aside className="border border-zinc-800 bg-black p-6 md:p-8">
            <h3 className="text-xl font-bold text-white">Prefer to message us directly?</h3>
            <div className="mt-6 space-y-3">
              <a
                href={`sms:${businessInfo.phoneInternational}?body=Hi%20ADE%20Smart%20Home%2C%20I%20would%20like%20a%20smart%20lock%20quote.`}
                className="flex min-h-14 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
              >
                <MessageSquareText className="h-5 w-5" aria-hidden="true" />
                Text 0431 060 390
              </a>
              <a
                href={`mailto:${businessInfo.email}?subject=Door%20photos%20for%20installation%20check`}
                className="flex min-h-14 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
              >
                <Camera className="h-5 w-5" aria-hidden="true" />
                Email door photos
              </a>
            </div>

            <div className="mt-8 border-t border-zinc-800 pt-7">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                Helpful photo angles
              </h3>
              <ol className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-400">
                <li><strong className="mr-2 text-[#c5a47e]">1.</strong>Outside face of the door.</li>
                <li><strong className="mr-2 text-[#c5a47e]">2.</strong>Inside face and current lock.</li>
                <li><strong className="mr-2 text-[#c5a47e]">3.</strong>Door edge and door frame.</li>
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
            <h3 className="text-2xl font-black tracking-tight text-slate-950">
              {formData.product ? `Ask about ${formData.product}` : "Request an installation quote"}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Name, mobile, email, suburb, property type and preferred timing are required.
              Door photos are recommended to get a faster quote.
            </p>

            <form
              onSubmit={handleSubmit}
              onFocusCapture={trackFormStart}
              onInvalidCapture={handleInvalid}
              className="mt-7 space-y-5"
            >
              <fieldset>
                <legend className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Service needed
                </legend>
                <div className="grid grid-cols-2 gap-px bg-slate-300 p-px sm:grid-cols-4">
                  {serviceOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleServiceSelection(option.value)}
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
                  Mobile
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
                  Suburb / postcode
                  <input
                    name="suburb"
                    autoComplete="postal-code"
                    required
                    value={formData.suburb}
                    onChange={handleChange}
                    className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                    placeholder="e.g. Norwood 5067"
                  />
                </label>
                <label className="space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Email
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                    placeholder="email@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Property type
                  <select
                    name="propertyType"
                    required
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                  >
                    {propertyOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Preferred timing
                  <select
                    name="preferredTiming"
                    required
                    value={formData.preferredTiming}
                    onChange={handleChange}
                    className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                  >
                    {timingOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                Preferred model <span className="font-normal normal-case text-slate-400">optional</span>
                <input
                  name="product"
                  list="smart-lock-models"
                  value={formData.product}
                  onChange={handleChange}
                  className="h-12 w-full border border-slate-300 bg-slate-50 px-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                  placeholder="e.g. Lockin X9, customer-supplied lock, or not sure"
                />
                <datalist id="smart-lock-models">
                  <option value="Not sure – please recommend" />
                  <option value="Customer-supplied smart lock" />
                  <option value="Other brand smart lock (compatible model link)" />
                  <option value="Philips lock" />
                  <option value="Samsung lock" />
                  <option value="Aqara lock" />
                  <option value="Yale lock" />
                  <option value="Lockin X9" />
                  <option value="Lockin SV40" />
                  <option value="Lockin S6 Max" />
                  <option value="Lockin V5 Max" />
                </datalist>
              </label>

              <fieldset>
                <legend className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                  Door photos <span className="font-normal normal-case text-slate-400">recommended, up to 4</span>
                </legend>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPreparingPhotos || photos.length >= MAX_PHOTOS}
                  className="mt-2 flex min-h-20 w-full items-center justify-center gap-3 border border-dashed border-slate-400 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition-colors hover:border-[#9c7953] hover:bg-[#f8f3ec] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ImagePlus className="h-5 w-5 text-[#8a6b48]" aria-hidden="true" />
                  {isPreparingPhotos
                    ? "Preparing photos…"
                    : photos.length
                      ? "Add another photo"
                      : "Add door photos"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handlePhotoSelection}
                  className="sr-only"
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Best angles: outside face, inside lock side, door edge, and frame.
                  Large images are resized before sending.
                </p>
                {photos.length > 0 && (
                  <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                    {photos.map((photo, index) => (
                      <li key={`${photo.name}-${photo.lastModified}-${index}`} className="flex min-h-11 items-center justify-between gap-3 py-2 text-xs text-slate-600">
                        <span className="min-w-0 truncate">{index + 1}. {photo.name} · {formatFileSize(photo.size)}</span>
                        <button
                          type="button"
                          onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-black"
                          aria-label={`Remove ${photo.name}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {photoError && <p className="mt-2 text-sm text-red-700">{photoError}</p>}
              </fieldset>

              <label className="block space-y-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                Anything else? <span className="font-normal normal-case text-slate-400">optional</span>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full resize-none border border-slate-300 bg-slate-50 p-4 text-sm font-normal normal-case text-slate-950 outline-none transition-colors focus:border-[#9c7953]"
                  placeholder="Tell us about the existing lock, security screen, building access or any special requirements."
                />
              </label>

              {errorMessage && (
                <p role="alert" className="border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {errorMessage} Text 0431 060 390 or email us if the problem continues.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isPreparingPhotos}
                className="flex h-14 w-full items-center justify-center gap-3 bg-black px-5 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#c5a47e] hover:text-black disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Request an installation quote"}
                {!isSubmitting && <Send className="h-4 w-4" aria-hidden="true" />}
              </button>
              <p className="text-center text-xs text-slate-500">
                No payment required. We confirm scope and pricing before booking. By submitting,
                you agree that we may use these details and photos to respond to your enquiry. See our{" "}
                <Link href="/privacy-policy" className="font-semibold text-[#8a6b48] underline underline-offset-2 hover:text-black">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
