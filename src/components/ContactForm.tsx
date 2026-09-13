"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Camera,
  ImagePlus,
  Mail,
  MessageSquareText,
  Send,
  X,
} from "lucide-react";
import { captureLeadAttribution, trackEvent } from "@/lib/analytics";
import { businessInfo } from "@/lib/seoData";
import { analyticsProductId, contactValidationError, serviceOptions } from "@/lib/enquiry";
import { ContactCopyButton } from "@/components/ContactCopyButton";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

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

const photoChecklist = [
  { title: "Outside face", detail: "Show the full door and outside lock." },
  { title: "Inside face", detail: "Show the inside door and current lock." },
  { title: "Door edge", detail: "Show the latch or mortise in the door edge." },
  { title: "Door frame", detail: "Show the strike area and nearby clearance." },
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
  compact?: boolean;
  mixedServices?: boolean;
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
  compact = false,
  mixedServices = false,
  initialService,
  initialProduct,
}: ContactFormProps = {}) {
  const enhanced = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const photoSelectionRef = useRef(0);
  const submittingRef = useRef(false);
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
  const isCameraKitEnquiry = formData.service === "security-camera-kit";
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
    if (service === formData.service || submittingRef.current) return;
    trackFormStart();
    photoSelectionRef.current += 1;
    setIsPreparingPhotos(false);
    setFormData((current) => ({ ...current, service, product: "" }));
    setPhotos([]);
    setPhotoError("");
    setErrorMessage("");
    trackEvent("form_service_selected", {
      form_name: "website_enquiry",
      service,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current || isPreparingPhotos) return;

    const contactError = contactValidationError(formData.phone, formData.email);
    if (contactError) {
      setErrorMessage(contactError);
      contactInputRef.current?.focus();
      return;
    }

    trackFormStart();
    trackEvent("form_submit_attempt", {
      form_name: "website_enquiry",
      service: formData.service,
      product: formData.product || "not-specified",
      photo_count: photos.length,
    });
    setIsSubmitting(true);
    submittingRef.current = true;
    setErrorMessage("");

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      payload.append("attribution", JSON.stringify(captureLeadAttribution()));
      if (!isCameraKitEnquiry) photos.forEach((photo) => payload.append("photos", photo, photo.name));

      const response = await fetch("/api/contact", {
        method: "POST",
        body: payload,
      });
      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string; leadId?: string }
        | null;

      if (!response.ok || result?.success !== true || !result.leadId) {
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
            product: analyticsProductId(formData.product),
            photoCount: isCameraKitEnquiry ? 0 : photos.length,
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
      router.push(`/contact/thank-you?service=${encodeURIComponent(formData.service)}`);
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
      submittingRef.current = false;
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
    const selection = ++photoSelectionRef.current;
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
      if (selection !== photoSelectionRef.current) return;
      setPhotos((current) => [...current, ...prepared]);
      trackEvent("form_photo_added", {
        form_name: "website_enquiry",
        selected_photo_count: prepared.length,
        total_photo_count: photos.length + prepared.length,
      });
    } catch (error) {
      if (selection !== photoSelectionRef.current) return;
      trackEvent("form_photo_error", {
        form_name: "website_enquiry",
        reason: "photo-preparation-failed",
      });
      setPhotoError(
        error instanceof Error ? error.message : "The selected photos could not be prepared.",
      );
    } finally {
      if (selection === photoSelectionRef.current) setIsPreparingPhotos(false);
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
    <section id="quote" className={`quote-section border-y border-zinc-800 bg-zinc-950 ${compact ? "py-8 md:py-12" : "py-16 md:py-24"}`}>
      <div className="container mx-auto max-w-[1500px] px-5 md:px-8 xl:px-10">
        {!compact && <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-[#c5a47e]">
            Fast Adelaide quote
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            {isCameraKitEnquiry ? "Camera Equipment Enquiry" : mixedServices ? "Product and Service Enquiries" : "Tell Us About Your Door"}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
            {mixedServices
              ? "Smart locks, installation-only service or CCTV camera kits. Choose your service below and we will reply by SMS or email."
              : isCameraKitEnquiry
              ? "Tell us which equipment package interests you. We will confirm availability and reply by SMS or email."
              : "Add your suburb, preferred timing and door photos for a faster compatibility check. We will review the details and reply by SMS or email with the next step."}
          </p>
        </div>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-12">
          <aside className="order-2 min-w-0 self-start border-t border-white/15 py-6 wrap-anywhere lg:order-1 lg:border-t-0 lg:py-8">
            <h3 className="text-xl font-bold text-white">Prefer to message us directly?</h3>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
              <a
                href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(isCameraKitEnquiry ? `Hi ADE Smart Home, I am interested in ${formData.product || "a Dahua security camera kit"}.` : "Hi ADE Smart Home, I would like a smart lock quote.")}`}
                className="flex min-h-14 min-w-0 flex-1 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
              >
                <MessageSquareText className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0">Text {businessInfo.phone}</span>
              </a>
              <ContactCopyButton value={businessInfo.phone} label="Phone number" />
              </div>
              <div className="flex items-center gap-2">
              <a
                href={`mailto:${businessInfo.email}?subject=${isCameraKitEnquiry ? "Dahua%20camera%20kit%20enquiry" : "Door%20photos%20for%20installation%20check"}`}
                className="flex min-h-14 min-w-0 flex-1 items-center gap-3 border border-zinc-800 px-4 text-sm font-bold text-white transition-colors hover:border-[#c5a47e] hover:text-[#c5a47e]"
              >
                <span aria-hidden="true">{isCameraKitEnquiry ? <Mail className="h-5 w-5" /> : <Camera className="h-5 w-5" />}</span>
                <span className="min-w-0">{isCameraKitEnquiry ? "Email product enquiry" : "Email door photos"}<span className="mt-1 block text-sm font-normal">{businessInfo.email}</span></span>
              </a>
              <ContactCopyButton value={businessInfo.email} label="Email address" />
              </div>
            </div>

            {isCameraKitEnquiry ? (
              <div className="mt-8 border-t border-zinc-800 pt-7">
                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                  Camera package options
                </h3>
                <ul className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-400">
                  <li><strong className="text-[#c5a47e]">A$443</strong> Dahua 5MP two-camera kit</li>
                  <li><strong className="text-[#c5a47e]">A$590</strong> Dahua 6MP Smart Dual Light two-camera kit</li>
                  <li>Each equipment package has two cameras and one four-channel PoE recorder. Tell us your preferred kit below.</li>
                </ul>
              </div>
            ) : <div className="mt-8 border-t border-zinc-800 pt-7">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
                Four helpful photo angles
              </h3>
              <ol className="mt-5 list-none space-y-4 text-sm leading-relaxed text-zinc-400">
                {photoChecklist.map((photo, index) => (
                  <li key={photo.title}>
                    <strong className="mr-2 text-[#c5a47e]">{index + 1}.</strong>
                    {photo.title}. {photo.detail}
                  </li>
                ))}
              </ol>
              <Link
                href="/blog/smart-lock-door-compatibility-check"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#c5a47e] hover:text-white"
              >
                <span className="min-w-0">View door measurement guide</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>}
          </aside>

          <div className="enquiry-panel relative order-1 min-w-0 rounded-lg border p-5 md:p-9 lg:order-2">
            <h3 className="break-words text-2xl font-bold text-white">
              {formData.product
                ? `Ask about ${formData.product}`
                : isCameraKitEnquiry
                  ? "Request a security camera quote"
                  : "Request an installation quote"}
            </h3>
            <p className="enquiry-muted mt-3 text-base leading-7">
              {isCameraKitEnquiry
                ? "Leave your name, suburb and mobile or email. We will confirm the equipment and availability before you order."
                : "Leave your name, suburb and mobile or email. Photos are optional and can be sent later. Compatible locks bought elsewhere are welcome."}
            </p>

              <div className="enquiry-direct mt-5 flex flex-wrap items-center gap-x-6 border-y border-[#3f3f46] py-1">
                <a href={`sms:${businessInfo.phoneInternational}`} className="flex min-h-12 items-center gap-3 text-[#d9b98f] underline underline-offset-4">
                  <MessageSquareText className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Enquire by SMS</span>
                </a>
                <a href={`mailto:${businessInfo.email}`} className="flex min-h-12 items-center gap-3 text-[#d9b98f] underline underline-offset-4">
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">Enquire by email</span>
                </a>
              </div>

            <form
              method="post"
              action="/api/contact"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              onFocusCapture={trackFormStart}
              onInvalidCapture={handleInvalid}
              className="mt-7 [&_input]:text-base [&_select]:text-base [&_textarea]:text-base"
            >
              <fieldset disabled={!enhanced} aria-label="Enquiry details" className="space-y-5">
              <fieldset disabled={isSubmitting}>
                <legend className="mb-2 enquiry-label">
                  Service needed
                </legend>
                <div className="enquiry-services grid grid-cols-2 gap-px overflow-hidden rounded-md border [&>button:last-child]:col-span-2">
                  {serviceOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleServiceSelection(option.value)}
                      className="enquiry-service min-h-12 px-3 py-3 text-sm font-semibold"
                      aria-pressed={formData.service === option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 enquiry-label">
                  Name
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="enquiry-input h-12 w-full px-4 font-normal"
                    placeholder="Your name"
                  />
                </label>
                <label className="space-y-2 enquiry-label">
                  Mobile
                  <input
                    name="phone"
                    ref={contactInputRef}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="enquiry-input h-12 w-full px-4 font-normal"
                    placeholder="04xx xxx xxx"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 enquiry-label">
                  Suburb / postcode
                  <input
                    name="suburb"
                    autoComplete="postal-code"
                    required
                    value={formData.suburb}
                    onChange={handleChange}
                    className="enquiry-input h-12 w-full px-4 font-normal"
                    placeholder="e.g. Norwood 5067"
                  />
                </label>
                <label className="space-y-2 enquiry-label">
                  Email
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="enquiry-input h-12 w-full px-4 font-normal"
                    placeholder="email@example.com"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 enquiry-label">
                  Property type <span className="font-normal normal-case">optional</span>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="enquiry-input h-12 w-full px-4 font-normal"
                  >
                    {propertyOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 enquiry-label">
                  Preferred timing <span className="font-normal normal-case">optional</span>
                  <select
                    name="preferredTiming"
                    value={formData.preferredTiming}
                    onChange={handleChange}
                    className="enquiry-input h-12 w-full px-4 font-normal"
                  >
                    {timingOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block space-y-2 enquiry-label">
                {isCameraKitEnquiry ? "Preferred package" : "Preferred model"} <span className="enquiry-muted font-normal">optional</span>
                <input
                  name="product"
                  list="smart-lock-models"
                  value={formData.product}
                  onChange={handleChange}
                  className="enquiry-input h-12 w-full px-4 font-normal"
                  placeholder={isCameraKitEnquiry ? "e.g. Dahua 6MP Smart Dual Light kit" : "e.g. Lockin X9, customer-supplied lock, or not sure"}
                />
                <datalist id="smart-lock-models">
                  {!isCameraKitEnquiry && <>
                  <option value="Not sure – please recommend" />
                  <option value="Customer-supplied smart lock" />
                  <option value="Other brand smart lock (compatible model link)" />
                  <option value="Philips lock" />
                  <option value="Samsung lock" />
                  <option value="Aqara lock" />
                  <option value="Yale lock" />
                  <option value="Lockin X9" />
                  <option value="Lockin OLA Slim (single-side fingerprint)" />
                  <option value="Lockin SV40" />
                  <option value="Lockin S6 Max" />
                  <option value="Lockin V5 Max" />
                  <option value="Kaadas K70 SE" />
                  </>}
                  {isCameraKitEnquiry && <>
                  <option value="Dahua 5MP 2-Camera PoE Security Kit" />
                  <option value="Dahua 6MP Smart Dual Light 2-Camera PoE Kit" />
                  </>}
                </datalist>
              </label>

              {!isCameraKitEnquiry && <fieldset>
                <legend className="enquiry-label">
                  Door photos <span className="enquiry-muted font-normal">recommended for a more accurate quote</span>
                </legend>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-y border-zinc-700 py-3">
                  <p className="enquiry-muted text-sm">Outside, inside, door edge and frame</p>
                  <p className="text-sm font-semibold text-[#d9b98f]" aria-live="polite">
                    {photos.length} of {MAX_PHOTOS} added
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || isPreparingPhotos || photos.length >= MAX_PHOTOS}
                  className="enquiry-upload mt-3 flex min-h-20 w-full items-center justify-center gap-3 rounded-md border border-dashed px-4 py-3 text-base font-semibold"
                >
                  <ImagePlus className="h-5 w-5 shrink-0 text-[#d9b98f]" aria-hidden="true" />
                  {isPreparingPhotos
                    ? "Preparing photos…"
                    : photos.length >= MAX_PHOTOS
                      ? "Four photos added"
                      : photos.length
                      ? "Add another photo"
                      : "Add door photos"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  aria-label="Upload door photos"
                  onChange={handlePhotoSelection}
                  disabled={isPreparingPhotos || isSubmitting}
                  className="sr-only"
                />
                <p className="enquiry-muted mt-3 text-sm leading-6">
                  Send what you have; more photos can be added later by SMS or email.
                  Up to four JPEG, PNG or WebP images. Large photos are resized before sending.
                </p>
                {photos.length === MAX_PHOTOS && (
                  <p role="status" className="enquiry-success mt-3 border-l-4 px-3 py-3 text-sm font-semibold">
                    Four photos added. This gives us a better starting point for the door check.
                  </p>
                )}
                {photos.length > 0 && (
                  <ul className="mt-3 divide-y divide-zinc-700 border-y border-zinc-700">
                    {photos.map((photo, index) => (
                      <li key={`${photo.name}-${photo.lastModified}-${index}`} className="enquiry-muted flex min-h-12 items-center justify-between gap-3 py-2 text-sm">
                        <span className="min-w-0 truncate">{index + 1}. {photo.name} · {formatFileSize(photo.size)}</span>
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setPhotos((current) => current.filter((_, photoIndex) => photoIndex !== index))}
                          className="enquiry-remove inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md"
                          aria-label={`Remove ${photo.name}`}
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {photoError && <p role="alert" className="enquiry-error mt-3 border-l-4 px-3 py-3 text-sm">{photoError}</p>}
              </fieldset>}

              <label className="block space-y-2 enquiry-label">
                Anything else? <span className="enquiry-muted font-normal">optional</span>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="enquiry-input w-full resize-y p-4 font-normal"
                  placeholder={isCameraKitEnquiry ? "Enter the package name, quantity or a question about listed product specifications." : "Tell us about the existing lock, security screen, building access or any special requirements."}
                />
              </label>

              {errorMessage && (
                <p role="alert" className="enquiry-error border-l-4 px-4 py-3 text-base leading-6">
                  {errorMessage} Text 0431060390 or email us if the problem continues.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isPreparingPhotos}
                className="enquiry-submit flex min-h-14 w-full items-center justify-center gap-3 rounded-md px-5 py-3 text-base font-bold"
              >
                {isSubmitting
                  ? "Sending…"
                  : isCameraKitEnquiry
                    ? "Request product enquiry"
                    : "Request an installation quote"}
                {!isSubmitting && <Send className="h-4 w-4" aria-hidden="true" />}
              </button>
              <p className="enquiry-muted text-center text-sm leading-6">
                <span>{isCameraKitEnquiry ? "No payment required. We confirm package contents and pricing before you order." : "No payment required. We confirm scope and pricing before booking."}</span>{" "}By submitting,
                you agree that we may use these details and photos to respond to your enquiry. See our{" "}
                <Link href="/privacy-policy" className="font-semibold text-[#d9b98f] underline underline-offset-4 hover:text-white">
                  Privacy Policy
                </Link>
                .
              </p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
