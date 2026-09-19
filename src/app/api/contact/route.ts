import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { contactValidationError, isEnquiryService, propertyOptions, serviceLabels, timingOptions } from "@/lib/enquiry";
import { enquiryReceiptDetails } from "@/lib/enquiryReceipt";
import { businessInfo, siteUrl } from "@/lib/seoData";
import { PhotoValidationError, prepareEnquiryPhoto } from "@/lib/enquiryPhotos";
import { MAX_TOTAL_PHOTO_BYTES, photoSelectionError } from "@/lib/enquiryPhotoLimits";
import { EnquiryRequestError, readBoundedEnquiryRequest } from "@/lib/enquiryRequest";

export const runtime = "nodejs";

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
    const boundedRequest = await readBoundedEnquiryRequest(request);
    const contentType = boundedRequest.headers.get("content-type") || "";
    let payload: Record<string, unknown> = {};
    let photoFiles: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await boundedRequest.formData().catch(() => { throw new EnquiryRequestError("The enquiry could not be read. Please try again.", 400); });
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
      const body: unknown = await boundedRequest.json().catch(() => { throw new EnquiryRequestError("The enquiry could not be read. Please try again.", 400); });
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
      !propertyOptions.some(option => option.value === propertyType) ||
      !timingOptions.some(option => option.value === preferredTiming) ||
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

    if (isCameraKit && photoFiles.length) {
      return NextResponse.json(
        { success: false, message: "Camera equipment enquiries do not accept door photos. Please remove the photos and try again." },
        { status: 400 },
      );
    }
    const photoError = photoSelectionError(photoFiles);
    if (photoError) {
      return NextResponse.json(
        {
          success: false,
          message: photoError,
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
    const contactEmail = process.env.CONTACT_TO_EMAIL || businessInfo.email;

    if (!smtpUser || !smtpAppPassword) {
      throw new Error("Email delivery is not configured.");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
      auth: {
        user: smtpUser,
        pass: smtpAppPassword,
      },
    });
    const serviceLabel = serviceLabels[service] || service;
    const propertyLabel = propertyOptions.find(option => option.value && option.value === propertyType)?.label || "Not specified";
    const timingLabel = timingOptions.find(option => option.value && option.value === preferredTiming)?.label || "Not specified";
    const receivedAt = new Date();
    const leadId = `ADE-${receivedAt.toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID().slice(0, 8).toUpperCase()}`;

    const operatorDelivery = await transporter.sendMail({
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

    if (!operatorDelivery.accepted?.length) {
      throw new Error("The enquiry email was not accepted.");
    }

    let acknowledgementSent = false;

    if (email) {
      const enquiryName = serviceLabel.toLowerCase().replace(/ enquiry$/, "");
      const receipt = enquiryReceiptDetails(service);
      const receiptParagraphs = [
        `Hi ${name},`,
        `Thank you for contacting ADE Smart Home. We have received your ${enquiryName} enquiry. Your reference is ${leadId}.`,
        receipt.intro,
        receipt.review,
        receipt.next,
        `Text ${businessInfo.phone} or reply to this email to add details.`,
        `${businessInfo.name}\n${siteUrl}/`,
      ];
      try {
        const acknowledgementDelivery = await transporter.sendMail({
          from: `"ADE Smart Home" <${smtpUser}>`,
          to: email,
          replyTo: contactEmail,
          subject: `We received your ${enquiryName} enquiry [${leadId}] | ADE Smart Home`,
          text: receiptParagraphs.join("\n\n"),
          html: receiptParagraphs.map(paragraph => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join(""),
        });
        if (!acknowledgementDelivery.accepted?.length) {
          throw new Error("The acknowledgement email was not accepted.");
        }
        acknowledgementSent = true;
      } catch {
        console.warn("Customer acknowledgement email could not be sent.");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully",
      leadId,
      acknowledgementSent,
    });
  } catch (error) {
    if (error instanceof EnquiryRequestError) {
      return NextResponse.json({ success: false, message: error.message }, { status: error.status });
    }
    if (error instanceof PhotoValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error("Failed to send enquiry email.");
    return NextResponse.json(
      { success: false, message: "Failed to send your enquiry" },
      { status: 500 },
    );
  }
}
