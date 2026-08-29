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
    const email = readField(payload.email, 254);
    const subject = readField(payload.subject, 150);
    const message = readField(payload.message, 5000);

    if (!name || !subject || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please complete all fields with a valid email address.' },
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
      replyTo: email,
      subject: `New Inquiry: ${subject}`,
      text: `
        You have received a new inquiry from the SmartLock website contact form.

        Name: ${name}
        Email: ${email}
        Subject: ${subject}

        Message:
        ${message}
      `,
      html: `
        <h3>New Inquiry from ADE Smart Home</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
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
