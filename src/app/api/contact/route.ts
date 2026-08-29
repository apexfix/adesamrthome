import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function readField(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };

    return entities[character];
  });
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const payload = body && typeof body === 'object' ? body as Record<string, unknown> : {};
    const name = readField(payload.name, 100);
    const phone = readField(payload.phone, 30);
    const email = readField(payload.email, 254);
    const suburb = readField(payload.suburb, 100);
    const service = readField(payload.service, 50);
    const product = readField(payload.product, 150);
    const message = readField(payload.message, 5000);
    const attributionPayload =
      payload.attribution && typeof payload.attribution === 'object'
        ? payload.attribution as Record<string, unknown>
        : {};
    const attribution = {
      source: readField(attributionPayload.source, 100) || 'direct',
      medium: readField(attributionPayload.medium, 100) || 'none',
      campaign: readField(attributionPayload.campaign, 150),
      content: readField(attributionPayload.content, 150),
      term: readField(attributionPayload.term, 150),
      landingPage: readField(attributionPayload.landingPage, 500),
      referrer: readField(attributionPayload.referrer, 500),
    };
    const allowedServices = new Set([
      'supply-install',
      'installation-only',
      'cctv',
      'not-sure',
    ]);
    const phoneDigits = phone.replace(/\D/g, '');

    if (
      !name ||
      phoneDigits.length < 8 ||
      phoneDigits.length > 15 ||
      !allowedServices.has(service) ||
      (email && !/^\S+@\S+\.\S+$/.test(email))
    ) {
      return NextResponse.json(
        { success: false, message: 'Please enter your name and a valid phone number.' },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpAppPassword = process.env.SMTP_APP_PASSWORD;
    const contactEmail = process.env.CONTACT_TO_EMAIL || 'info@adesmarthome.com.au';

    if (!smtpUser || !smtpAppPassword) {
      throw new Error('Email delivery is not configured.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpAppPassword,
      },
    });

    const mailOptions = {
      from: `"ADE Smart Home Website" <${smtpUser}>`,
      to: contactEmail,
      ...(email ? { replyTo: email } : {}),
      subject: `New Website Inquiry: ${product || service}`,
      text: `
        You have received a new inquiry from the SmartLock website contact form.

        Name: ${name}
        Phone: ${phone}
        Email: ${email || 'Not provided'}
        Suburb: ${suburb || 'Not provided'}
        Service: ${service}
        Product: ${product || 'Not specified'}

        Lead source: ${attribution.source}
        Medium: ${attribution.medium}
        Campaign: ${attribution.campaign || 'Not provided'}
        Ad content: ${attribution.content || 'Not provided'}
        Search term: ${attribution.term || 'Not provided'}
        Landing page: ${attribution.landingPage || 'Not recorded'}
        Referrer: ${attribution.referrer || 'Not recorded'}

        Message:
        ${message || 'No additional details provided.'}
      `,
      html: `
        <h3>New Inquiry from ADE Smart Home</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email || 'Not provided')}</p>
        <p><strong>Suburb:</strong> ${escapeHtml(suburb || 'Not provided')}</p>
        <p><strong>Service:</strong> ${escapeHtml(service)}</p>
        <p><strong>Product:</strong> ${escapeHtml(product || 'Not specified')}</p>
        <hr/>
        <h4>Lead source</h4>
        <p><strong>Source:</strong> ${escapeHtml(attribution.source)}</p>
        <p><strong>Medium:</strong> ${escapeHtml(attribution.medium)}</p>
        <p><strong>Campaign:</strong> ${escapeHtml(attribution.campaign || 'Not provided')}</p>
        <p><strong>Ad content:</strong> ${escapeHtml(attribution.content || 'Not provided')}</p>
        <p><strong>Search term:</strong> ${escapeHtml(attribution.term || 'Not provided')}</p>
        <p><strong>Landing page:</strong> ${escapeHtml(attribution.landingPage || 'Not recorded')}</p>
        <p><strong>Referrer:</strong> ${escapeHtml(attribution.referrer || 'Not recorded')}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message || 'No additional details provided.').replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
}
