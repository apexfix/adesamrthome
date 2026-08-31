import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const MAX_PHOTO_COUNT = 4;
const MAX_PHOTO_BYTES = 1_000_000;
const MAX_TOTAL_PHOTO_BYTES = 3_500_000;
const allowedPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedServices = new Set([
  "supply-install",
  "installation-only",
  "portfolio-project",
  "not-sure",
]);
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

const serviceLabels: Record<string, string> = {
  "supply-install": "Supply and installation",
  "installation-only": "Installation only",
  "portfolio-project": "Property portfolio / building project",
  "not-sure": "Not sure / recommendation needed",
};

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

function safeFileName(fileName: string, index: number): string {
  const cleaned = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 100);
  return cleaned || `door-photo-${index + 1}.jpg`;
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
        .filter((entry): entry is File => entry instanceof File && entry.size > 0);
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
    const phoneDigits = phone.replace(/\D/g, "");

    if (
      !name ||
      phoneDigits.length < 8 ||
      phoneDigits.length > 15 ||
      !suburb ||
      !allowedServices.has(service) ||
      !allowedPropertyTypes.has(propertyType) ||
      !allowedTimings.has(preferredTiming) ||
      (email && !/^\S+@\S+\.\S+$/.test(email))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete your name, mobile, suburb, property type and preferred timing.",
        },
        { status: 400 },
      );
    }

    const totalPhotoBytes = photoFiles.reduce((total, photo) => total + photo.size, 0);
    if (
      photoFiles.length > MAX_PHOTO_COUNT ||
      totalPhotoBytes > MAX_TOTAL_PHOTO_BYTES ||
      photoFiles.some(
        (photo) => photo.size > MAX_PHOTO_BYTES || !allowedPhotoTypes.has(photo.type),
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
    const attachments = await Promise.all(
      photoFiles.map(async (photo, index) => ({
        filename: safeFileName(photo.name, index),
        content: Buffer.from(await photo.arrayBuffer()),
        contentType: photo.type,
      })),
    );
    const serviceLabel = serviceLabels[service] || service;
    const propertyLabel = propertyLabels[propertyType] || propertyType;
    const timingLabel = timingLabels[preferredTiming] || preferredTiming;

    await transporter.sendMail({
      from: `"ADE Smart Home Website" <${smtpUser}>`,
      to: contactEmail,
      ...(email ? { replyTo: email } : {}),
      subject: `New Website Inquiry: ${product || serviceLabel}`,
      attachments,
      text: `
New enquiry from the ADE Smart Home website.

Name: ${name}
Mobile: ${phone}
Email: ${email || "Not provided"}
Suburb / postcode: ${suburb}
Property type: ${propertyLabel}
Service: ${serviceLabel}
Preferred model: ${product || "Not specified"}
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
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Mobile:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || "Not provided")}</p>
        <p><strong>Suburb / postcode:</strong> ${escapeHtml(suburb)}</p>
        <p><strong>Property type:</strong> ${escapeHtml(propertyLabel)}</p>
        <p><strong>Service:</strong> ${escapeHtml(serviceLabel)}</p>
        <p><strong>Preferred model:</strong> ${escapeHtml(product || "Not specified")}</p>
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

    if (email) {
      try {
        await transporter.sendMail({
          from: `"ADE Smart Home" <${smtpUser}>`,
          to: email,
          replyTo: contactEmail,
          subject: "We received your smart lock enquiry | ADE Smart Home",
          text: `Hi ${name},

Thank you for contacting ADE Smart Home. We have received your smart lock enquiry${photoFiles.length ? ` and ${photoFiles.length} door photo${photoFiles.length === 1 ? "" : "s"}` : ""}.

What happens next:
1. We review the door, current lock and requested service.
2. If we need another photo or measurement, we will ask by SMS or email.
3. We confirm suitability, scope and pricing before any booking.

You can add more door photos by replying to this email, or text 0431 060 390.

ADE Smart Home
Adelaide smart lock supply and installation
https://www.adesmarthome.com.au/
          `,
          html: `
            <p>Hi ${escapeHtml(name)},</p>
            <p>Thank you for contacting ADE Smart Home. We have received your smart lock enquiry${photoFiles.length ? ` and ${photoFiles.length} door photo${photoFiles.length === 1 ? "" : "s"}` : ""}.</p>
            <h3>What happens next</h3>
            <ol>
              <li>We review the door, current lock and requested service.</li>
              <li>If we need another photo or measurement, we will ask by SMS or email.</li>
              <li>We confirm suitability, scope and pricing before any booking.</li>
            </ol>
            <p>You can add more door photos by replying to this email, or text <strong>0431 060 390</strong>.</p>
            <p>ADE Smart Home<br>Adelaide smart lock supply and installation<br><a href="https://www.adesmarthome.com.au/">adesmarthome.com.au</a></p>
          `,
        });
      } catch (customerReplyError) {
        console.warn("Customer acknowledgement email could not be sent:", customerReplyError);
      }
    }

    return NextResponse.json({ success: true, message: "Enquiry sent successfully" });
  } catch (error) {
    console.error("Failed to send enquiry email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send your enquiry" },
      { status: 500 },
    );
  }
}
