"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ImagePlus,
  Mail,
  MessageSquareText,
  Send,
  X,
} from "lucide-react";
import { captureLeadAttribution, trackEvent } from "@/lib/analytics";
import { businessInfo } from "@/lib/seoData";
import { analyticsProductId, contactValidationIssue, propertyOptions, serviceOptions, timingOptions } from "@/lib/enquiry";
import { ContactCopyButton } from "@/components/ContactCopyButton";
import { MAX_PHOTO_COUNT as MAX_PHOTOS, MAX_PHOTO_BYTES as MAX_PREPARED_PHOTO_BYTES, PHOTO_MIME_TYPES, photoSelectionError } from "@/lib/enquiryPhotoLimits";
import { checkEnquiryPhotoMetadata } from "@/lib/enquiryPhotoMetadata";
import { EnquiryPhotoPreview } from "@/components/EnquiryPhotoPreview";
import { readEnquiryResponse, uncertainDeliveryMessage } from "@/lib/enquiryDelivery";
import { ENQUIRY_RECEIPT_KEY, enquiryReceiptDetails } from "@/lib/enquiryReceipt";
import { SelectionIndicator } from "@/components/SelectionIndicator";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

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

const MAX_PHOTO_BYTES = 850_000;
const MAX_PHOTO_DIMENSION = 1600;
const acceptedPhotoTypes = new Set(PHOTO_MIME_TYPES);

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

  const metadata = await checkEnquiryPhotoMetadata(file);

  if (file.size <= MAX_PHOTO_BYTES && Math.max(metadata.width, metadata.height) <= MAX_PHOTO_DIMENSION) {
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

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.72);
    });

    if (!blob || blob.size > MAX_PREPARED_PHOTO_BYTES) {
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
  const SectionHeading = compact ? "h2" : "h3";
  const enhanced = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pendingContactFocus = useRef<"phone" | "email" | null>(null);
  const contactHintId = useId();
  const contactErrorId = useId();
  const [contactValidationAttempt, setContactValidationAttempt] = useState(0);
  const photoSelectionRef = useRef(0);
  const submittingRef = useRef(false);
  const deliveryRequestRef = useRef<{ controller: AbortController; timer: number } | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [confirmedLeadId, setConfirmedLeadId] = useState<string | null>(null);
  const formStartedRef = useRef(false);
  const completedRef = useRef(false);
  const abandonmentTrackedRef = useRef(false);
  const validationErrorTrackedRef = useRef(false);
  const validationResetTimerRef = useRef<number | null>(null);
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
  const [isDeliveryUncertain, setIsDeliveryUncertain] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [photoError, setPhotoError] = useState("");
  const isCameraKitEnquiry = formData.service === "security-camera-kit";
  const photoLimitError = isCameraKitEnquiry ? null : photoSelectionError(photos);
  const contactIssue = contactValidationAttempt ? contactValidationIssue(formData.phone, formData.email) : null;
  const latestFunnelStateRef = useRef({
    service: selectedService,
    product: initialProduct?.trim().slice(0, 150) ?? "",
    photoCount: 0,
  });

  useEffect(() => () => { photoSelectionRef.current += 1; }, []);
  useEffect(() => {
    if (confirmedLeadId) receiptRef.current?.focus();
  }, [confirmedLeadId]);
  useEffect(() => () => {
    if (validationResetTimerRef.current !== null) window.clearTimeout(validationResetTimerRef.current);
    const request = deliveryRequestRef.current;
    deliveryRequestRef.current = null;
    if (request) {
      window.clearTimeout(request.timer);
      request.controller.abort();
    }
  }, []);

  useEffect(() => {
    const field = pendingContactFocus.current;
    pendingContactFocus.current = null;
    if (field) (field === "phone" ? contactInputRef : emailInputRef).current?.focus();
  }, [contactValidationAttempt]);

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
    setContactValidationAttempt(0);
    setIsDeliveryUncertain(false);
    trackEvent("form_service_selected", {
      form_name: "website_enquiry",
      service,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current || isPreparingPhotos || photoLimitError) return;

    const contactError = contactValidationIssue(formData.phone, formData.email);
    if (contactError) {
      pendingContactFocus.current = contactError.fields[0];
      setContactValidationAttempt(current => current + 1);
      return;
    }
    if (!navigator.onLine) {
      setErrorMessage("You're offline. Reconnect to send your enquiry, or contact us by SMS.");
      setIsDeliveryUncertain(false);
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
    setIsDeliveryUncertain(false);
    const request = { controller: new AbortController(), timer: 0 };
    deliveryRequestRef.current = request;
    let timedOut = false;
    let failure: { message: string; uncertain: boolean } | null = null;
    let acceptedLeadId: string | null = null;
    request.timer = window.setTimeout(() => {
      timedOut = true;
      request.controller.abort();
    }, 30_000);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      payload.append("attribution", JSON.stringify(captureLeadAttribution()));
      if (!isCameraKitEnquiry) photos.forEach((photo) => payload.append("photos", photo, photo.name));

      const response = await fetch("/api/contact", {
        method: "POST",
        body: payload,
        signal: request.controller.signal,
      });
      const body: unknown = await response.json().catch(() => null);
      if (deliveryRequestRef.current !== request) return;
      if (request.controller.signal.aborted) throw new Error("Request interrupted");
      const result = readEnquiryResponse(response.status, body);
      if ("message" in result) {
        failure = result;
        throw new Error(result.message);
      }

      acceptedLeadId = result.leadId;
      completedRef.current = true;
      try {
        sessionStorage.setItem(ENQUIRY_RECEIPT_KEY, JSON.stringify({ leadId: result.leadId, service: formData.service }));
        sessionStorage.setItem(
          "ade_completed_lead",
          JSON.stringify({
            service: formData.service,
            product: analyticsProductId(formData.product),
            photoCount: isCameraKitEnquiry ? 0 : photos.length,
            preferredTiming: formData.preferredTiming,
            leadId: result.leadId,
          }),
        );
      } catch {
        setConfirmedLeadId(result.leadId);
        trackEvent("lead_storage_error", {
          form_name: "website_enquiry",
          service: formData.service,
          photo_count: photos.length,
        });
        return;
      }
      trackEvent("form_submit_success", {
        form_name: "website_enquiry",
        service: formData.service,
        product: formData.product || "not-specified",
        photo_count: photos.length,
      });
      router.push(`/contact/thank-you?service=${encodeURIComponent(formData.service)}`);
    } catch {
      if (deliveryRequestRef.current !== request) return;
      if (acceptedLeadId) {
        setConfirmedLeadId(acceptedLeadId);
        return;
      }
      trackEvent("form_submit_error", {
        form_name: "website_enquiry",
        service: formData.service,
        photo_count: photos.length,
      });
      setErrorMessage(failure?.message ?? `${timedOut ? "The request timed out. " : ""}${uncertainDeliveryMessage}`);
      setIsDeliveryUncertain(failure?.uncertain ?? true);
      setIsSubmitting(false);
      submittingRef.current = false;
    } finally {
      window.clearTimeout(request.timer);
      if (deliveryRequestRef.current === request) deliveryRequestRef.current = null;
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
      const results: PromiseSettledResult<File>[] = [];
      // Prepare one image at a time instead of decoding four full-size originals together.
      for (const [index, file] of selectedFiles.entries()) {
        if (selection !== photoSelectionRef.current) return;
        try {
          results.push({ status: "fulfilled", value: await compressPhoto(file, photos.length + index) });
        } catch (reason) {
          results.push({ status: "rejected", reason });
        }
      }
      if (selection !== photoSelectionRef.current) return;
      const prepared = results.flatMap(result => result.status === "fulfilled" ? [result.value] : []);
      const failures = results.flatMap((result, index) => {
        if (result.status !== "rejected") return [];
        const name = selectedFiles[index].name;
        const label = name.length > 40 ? `${name.slice(0, 24)}...${name.slice(-12)}` : name;
        return [`${label}: ${result.reason instanceof Error ? result.reason.message : "Please choose another photo."}`];
      });
      if (prepared.length) {
        setPhotos((current) => [...current, ...prepared]);
        trackEvent("form_photo_added", {
          form_name: "website_enquiry",
          selected_photo_count: prepared.length,
          total_photo_count: photos.length + prepared.length,
        });
      }
      if (failures.length) {
        setPhotoError(`Could not add ${failures.length} ${failures.length === 1 ? "photo" : "photos"}. ${failures.join(" ")}`);
        // Filenames may contain personal information; report counts only.
        trackEvent("form_photo_error", {
          form_name: "website_enquiry",
          reason: "photo-preparation-failed",
          failed_photo_count: failures.length,
        });
      }
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
    const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (field.name === "phone" || field.name === "email") setContactValidationAttempt(current => current + 1);
    if (validationErrorTrackedRef.current) return;

    validationErrorTrackedRef.current = true;
    trackEvent("form_validation_error", {
      form_name: "website_enquiry",
      field_name: field.name || "unknown",
      service: formData.service,
      photo_count: photos.length,
    });

    validationResetTimerRef.current = window.setTimeout(() => {
      validationResetTimerRef.current = null;
      validationErrorTrackedRef.current = false;
    }, 1000);
  };

  if (confirmedLeadId) {
    const referenceMessage = `Hi ADE Smart Home, I would like to add details to enquiry ${confirmedLeadId}.`;
    return (
      <section id="quote" className="quote-section border-y border-zinc-800 bg-zinc-950 px-5 py-12 text-white md:px-8 md:py-16">
        <div ref={receiptRef} data-enquiry-receipt role="status" tabIndex={-1} className="mx-auto max-w-3xl wrap-anywhere focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#d9b98f]">
          <CheckCircle2 className="enquiry-received-icon mb-5 h-10 w-10 text-emerald-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">Your enquiry has been received.</h2>
          <p className="mt-5 text-base leading-relaxed text-zinc-300">No need to send it again. Please keep your reference number:</p>
          <p className="mt-3 text-xl font-bold leading-relaxed text-[#d9b98f]">{confirmedLeadId}</p>
          <p className="mt-5 text-base leading-relaxed text-zinc-300">{enquiryReceiptDetails(formData.service).intro}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={`sms:${businessInfo.phoneInternational}?body=${encodeURIComponent(referenceMessage)}`} className="inline-flex min-h-12 items-center gap-3 border border-zinc-600 px-4 py-3 text-base font-bold text-[#d9b98f]">
              <MessageSquareText className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Add details by SMS</span>
            </a>
            <a href={`mailto:${businessInfo.email}?subject=${encodeURIComponent(`Enquiry ${confirmedLeadId}`)}`} className="inline-flex min-h-12 items-center gap-3 border border-zinc-600 px-4 py-3 text-base font-bold text-[#d9b98f]">
              <Mail className="h-5 w-5 shrink-0" aria-hidden="true" /><span>Add details by email</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

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
          <div className="enquiry-contact-options order-2 min-w-0 self-start border-t border-white/15 py-6 wrap-anywhere lg:order-1 lg:border-t-0 lg:py-8">
            <SectionHeading className="text-xl font-bold text-white">Prefer to message us directly?</SectionHeading>
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
          </div>

          <div className="enquiry-panel relative order-1 min-w-0 rounded-lg border p-5 md:p-9 lg:order-2">
            <SectionHeading className="break-words text-2xl font-bold text-white">
              {formData.product
                ? `Ask about ${formData.product}`
                : isCameraKitEnquiry
                  ? "Request a security camera quote"
                  : "Request an installation quote"}
            </SectionHeading>
            <p id={contactHintId} className="enquiry-muted mt-3 text-base leading-7">
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
                <div className="enquiry-services relative grid gap-px overflow-hidden rounded-md border">
                  <SelectionIndicator activeKey={formData.service} />
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
                    aria-invalid={contactIssue?.fields.includes("phone") || undefined}
                    aria-describedby={`${contactHintId}${contactIssue?.fields.includes("phone") ? ` ${contactErrorId}` : ""}`}
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
                    ref={emailInputRef}
                    aria-invalid={contactIssue?.fields.includes("email") || undefined}
                    aria-describedby={`${contactHintId}${contactIssue?.fields.includes("email") ? ` ${contactErrorId}` : ""}`}
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="enquiry-input h-12 w-full px-4 font-normal"
                    placeholder="email@example.com"
                  />
                </label>
              </div>

              {contactIssue && <p id={contactErrorId} role="alert" className="enquiry-error border-l-4 px-3 py-3 text-sm">{contactIssue.message}</p>}

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

              <div key={formData.service} data-enquiry-service-fields data-enhanced={enhanced} className="space-y-5">
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
                  {" "}Prepared photos can be up to 1 MB each and 3.5 MB combined.
                </p>
                {photos.length === MAX_PHOTOS && !photoLimitError && (
                  <p role="status" className="enquiry-success mt-3 border-l-4 px-3 py-3 text-sm font-semibold">
                    Four photos added. This gives us a better starting point for the door check.
                  </p>
                )}
                {photos.length > 0 && (
                  <ul className="enquiry-photos mt-3 divide-y divide-zinc-700 border-y border-zinc-700">
                    {photos.map((photo, index) => (
                      <li key={`${photo.name}-${photo.lastModified}-${index}`} className="enquiry-photo-row enquiry-muted py-3 text-sm">
                        <EnquiryPhotoPreview photo={photo} />
                        <span className="enquiry-photo-caption min-w-0 break-words">{index + 1}. {photo.name} · {formatFileSize(photo.size)}</span>
                        <button
                          type="button"
                          disabled={isSubmitting || isPreparingPhotos}
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
                {photoError && <p role="alert" className="enquiry-error mt-3 border-l-4 px-3 py-3 text-sm [overflow-wrap:anywhere]">{photoError}</p>}
                {photoLimitError && <p role="alert" className="enquiry-error mt-3 border-l-4 px-3 py-3 text-sm">{photoLimitError}</p>}
              </fieldset>}

              </div>

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
                disabled={isSubmitting || isPreparingPhotos || Boolean(photoLimitError)}
                className="enquiry-submit flex min-h-14 w-full items-center justify-center gap-3 rounded-md px-5 py-3 text-base font-bold"
              >
                <span className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] items-center text-center">
                <span aria-hidden="true" className="invisible col-start-1 row-start-1">Request an installation quote</span>
                <span className="col-start-1 row-start-1">{isSubmitting
                  ? "Sending…"
                  : isDeliveryUncertain
                    ? "Send another copy"
                  : isCameraKitEnquiry
                    ? "Request product enquiry"
                    : "Request an installation quote"}</span>
                </span>
                <Send className={`h-4 w-4 shrink-0 ${isSubmitting ? "invisible" : ""}`} aria-hidden="true" />
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
