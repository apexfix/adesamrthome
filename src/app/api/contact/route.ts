import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { contactValidationError, isEnquiryService, serviceLabels } from "@/lib/enquiry";
import { PhotoValidationError, prepareEnquiryPhoto } from "@/lib/enquiryPhotos";

export const runtime = "nodejs";

const MAX_PHOTO_COUNT = 4;
const MAX_PHOTO_BYTES = 1_000_000;
const MAX_TOTAL_PHOTO_BYTES = 3_500_000;
const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedPropertyTypes = new Set([
  "house",
  "apartment",
  "airbnb-rental",
  "new-build",
  "commercial-other",
]);
const allowedTimings = new Set([
  "as-soon-as-possible",
  "within-one-week",
  "within-two-to-four-weeks",
  "flexible",
]);


const propertyLabels: Record<string, string> = {
  house: "House",
  apartment: "Apartment",
  "airbnb-rental": "Airbnb / rental",
  "new-build": "New build",
  "commercial-other": "Commercial / other",
};

const timingLabels: Record<string, string> = {
  "as-soon-as-possible": "As soon as possible",
  "within-one-week": "Within 1 week",
  "within-two-to-four-weeks": "Within 2–4 weeks",
  flexible: "Flexible / researching",
};

function readField(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function parseAttribution(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") return value as Record<string, unknown>;
  if (typeof value !== "string" || !value) return {};

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, unknown> = {};
    let photoFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      [
        "name",
        "phone",
        "email",
        "suburb",
        "service",
        "product",
        "propertyType",
        "preferredTiming",
        "message",
        "attribution",
      ].forEach((field) => {
        const value = formData.get(field);
        payload[field] = typeof value === "string" ? value : "";
      });
      photoFiles = formData
        .getAll("photos")
        .filter((entry): entry is File => entry instanceof File);
    } else {
      const body: unknown = await request.json();
      payload = body && typeof body === "object" ? body as Record<string, unknown> : {};
    }

    const name = readField(payload.name, 100);
    const phone = readField(payload.phone, 30);
    const email = readField(payload.email, 254);
    const suburb = readField(payload.suburb, 120);
    const service = readField(payload.service, 50);
    const product = readField(payload.product, 150);
    const propertyType = readField(payload.propertyType, 50);
    const preferredTiming = readField(payload.preferredTiming, 50);
    const message = readField(payload.message, 5000);
    const attributionPayload = parseAttribution(payload.attribution);
    const attribution = {
      source: readField(attributionPayload.source, 100) || "direct",
      medium: readField(attributionPayload.medium, 100) || "none",
      campaign: readField(attributionPayload.campaign, 150),
      content: readField(attributionPayload.content, 150),
      term: readField(attributionPayload.term, 150),
      gclid: readField(attributionPayload.gclid, 300),
      wbraid: readField(attributionPayload.wbraid, 300),
      gbraid: readField(attributionPayload.gbraid, 300),
      fbclid: readField(attributionPayload.fbclid, 300),
      landingPage: readField(attributionPayload.landingPage, 500),
      referrer: readField(attributionPayload.referrer, 500),
    };
    const contactError = contactValidationError(phone, email);
    const isCameraKit = service === "security-camera-kit";

    if (
      !name ||
      !suburb ||
      !isEnquiryService(service) ||
      (propertyType && !allowedPropertyTypes.has(propertyType)) ||
      (preferredTiming && !allowedTimings.has(preferredTiming)) ||
      contactError
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            contactError || "Please complete your name, suburb and service, and check any optional selections.",
        },
        { status: 400 },
      );
    }

    const totalPhotoBytes = photoFiles.reduce((total, photo) => total + photo.size, 0);
    if (isCameraKit && photoFiles.length) {
      return NextResponse.json(
        { success: false, message: "Camera equipment enquiries do not accept door photos. Please remove the photos and try again." },
        { status: 400 },
      );
    }
    if (
      photoFiles.length > MAX_PHOTO_COUNT ||
      totalPhotoBytes > MAX_TOTAL_PHOTO_BYTES ||
      photoFiles.some(
        (photo) => !photo.size || photo.size > MAX_PHOTO_BYTES || !allowedPhotoTypes.has(photo.type),
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload up to four JPEG, PNG or WebP photos. Each photo must be under 1 MB.",
        },
        { status: 400 },
      );
    }

    // Bound concurrent decoding per request; no mail is attempted unless all photos pass.
    const attachments = [];
    for (let index = 0; index < photoFiles.length; index += 1) {
      attachments.push(await prepareEnquiryPhoto(photoFiles[index], index));
    }
    if (attachments.reduce((bytes, attachment) => bytes + attachment.content.length, 0) > MAX_TOTAL_PHOTO_BYTES) {
      return NextResponse.json(
        { success: false, message: "These photos are too large to send together. Please remove a photo and try again." },
        { status: 400 },
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpAppPassword = process.env.SMTP_APP_PASSWORD;
    const contactEmail = process.env.CONTACT_TO_EMAIL || "info@adesmarthome.com.au";

    if (!smtpUser || !smtpAppPassword) {
      throw new Error("Email delivery is not configured.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpAppPassword,
      },
    });
    const serviceLabel = serviceLabels[service] || service;
    const propertyLabel = propertyLabels[propertyType] || "Not specified";
    const timingLabel = timingLabels[preferredTiming] || "Not specified";
    const receivedAt = new Date();
    const leadId = `ADE-${receivedAt.toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID().slice(0, 8).toUpperCase()}`;

    await transporter.sendMail({
      from: `"ADE Smart Home Website" <${smtpUser}>`,
      to: contactEmail,
      ...(email ? { replyTo: email } : {}),
      subject: `New Website Inquiry [${leadId}]: ${product || serviceLabel}`,
      attachments,
      text: `
New enquiry from the ADE Smart Home website.

Lead ID: ${leadId}
Received: ${receivedAt.toLocaleString("en-AU", { timeZone: "Australia/Adelaide" })}
Name: ${name}
Mobile: ${phone}
Email: ${email || "Not provided"}
Suburb / postcode: ${suburb}
Property type: ${propertyLabel}
Service: ${serviceLabel}
${isCameraKit ? "Preferred equipment package" : "Preferred model"}: ${product || "Not specified"}
Preferred timing: ${timingLabel}
Door photos attached: ${photoFiles.length}

Lead source: ${attribution.source}
Medium: ${attribution.medium}
Campaign: ${attribution.campaign || "Not provided"}
Ad content: ${attribution.content || "Not provided"}
Search term: ${attribution.term || "Not provided"}
Google click ID (gclid): ${attribution.gclid || "Not provided"}
Google web-to-app ID (wbraid): ${attribution.wbraid || "Not provided"}
Google app-to-web ID (gbraid): ${attribution.gbraid || "Not provided"}
Meta click ID (fbclid): ${attribution.fbclid || "Not provided"}
Landing page: ${attribution.landingPage || "Not recorded"}
Referrer: ${attribution.referrer || "Not recorded"}

Additional details:
${message || "No additional details provided."}
      `,
      html: `
        <h2>New ADE Smart Home enquiry</h2>
        <p><strong>Lead ID:</strong> ${leadId}</p>
        <p><strong>Received:</strong> ${escapeHtml(receivedAt.toLocaleString("en-AU", { timeZone: "Australia/Adelaide" }))}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
        <p><strong>Suburb / postcode:</strong> ${escapeHtml(suburb)}</p>
        <p><strong>Property type:</strong> ${escapeHtml(propertyLabel)}</p>
        <p><strong>Service:</strong> ${escapeHtml(serviceLabel)}</p>
        <p><strong>${isCameraKit ? "Preferred equipment package" : "Preferred model"}:</strong> ${escapeHtml(product || "Not specified")}</p>
        <p><strong>Preferred timing:</strong> ${escapeHtml(timingLabel)}</p>
        <p><strong>Door photos attached:</strong> ${photoFiles.length}</p>
        <hr>
        <h3>Lead source</h3>
        <p><strong>Source:</strong> ${escapeHtml(attribution.source)}</p>
        <p><strong>Medium:</strong> ${escapeHtml(attribution.medium)}</p>
        <p><strong>Campaign:</strong> ${escapeHtml(attribution.campaign || "Not provided")}</p>
        <p><strong>Ad content:</strong> ${escapeHtml(attribution.content || "Not provided")}</p>
        <p><strong>Search term:</strong> ${escapeHtml(attribution.term || "Not provided")}</p>
        <p><strong>Google click ID (gclid):</strong> ${escapeHtml(attribution.gclid || "Not provided")}</p>
        <p><strong>Google web-to-app ID (wbraid):</strong> ${escapeHtml(attribution.wbraid || "Not provided")}</p>
        <p><strong>Google app-to-web ID (gbraid):</strong> ${escapeHtml(attribution.gbraid || "Not provided")}</p>
        <p><strong>Meta click ID (fbclid):</strong> ${escapeHtml(attribution.fbclid || "Not provided")}</p>
        <p><strong>Landing page:</strong> ${escapeHtml(attribution.landingPage || "Not recorded")}</p>
        <p><strong>Referrer:</strong> ${escapeHtml(attribution.referrer || "Not recorded")}</p>
        <hr>
        <h3>Additional details</h3>
        <p>${escapeHtml(message || "No additional details provided.").replace(/\n/g, "<br>")}</p>
      `,
    });

    let acknowledgementSent = false;

    if (email) {
      const enquiryName = isCameraKit ? "camera equipment" : "smart lock";
      const receiptParagraphs = [
        `Hi ${name},`,
        `Thank you for contacting ADE Smart Home. We have received your ${enquiryName} enquiry. Your reference is ${leadId}.`,
        isCameraKit
          ? "We will review your preferred equipment package and confirm availability, package contents and pricing before you order."
          : "We will review your requested service and any door photos, then confirm compatibility, installation scope and pricing before booking.",
        "We will contact you by SMS or email if we need any further details.",
        isCameraKit
          ? "You can reply with the equipment model, package name or quantity required."
          : "You can reply with more photos of the outside, inside, door edge and frame, or send them later by SMS.",
        "Text 0431060390 or reply to this email to add details.",
        "ADE Smart Home\nhttps://www.adesmarthome.com.au/",
      ];
      try {
        await transporter.sendMail({
          from: `"ADE Smart Home" <${smtpUser}>`,
          to: email,
          replyTo: contactEmail,
          subject: `We received your ${enquiryName} enquiry [${leadId}] | ADE Smart Home`,
          text: receiptParagraphs.join("\n\n"),
          html: receiptParagraphs.map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join(""),
        });
        acknowledgementSent = true;
      } catch (customerReplyError) {
        console.warn("Customer acknowledgement email could not be sent:", customerReplyError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully",
      leadId,
      acknowledgementSent,
    });
  } catch (error) {
    if (error instanceof PhotoValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error("Failed to send enquiry email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send your enquiry" },
      { status: 500 },
    );
  }
}
