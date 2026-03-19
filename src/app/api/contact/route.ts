import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Create a transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zhuge202322@gmail.com',
        pass: 'hzxz vooq rshk fdti', // App Password
      },
    });

    // Email content
    const mailOptions = {
      from: '"SmartLock Website" <zhuge202322@gmail.com>',
      to: 'smarthomeade@gmail.com', // Recipient email
      replyTo: email, // Allow replying directly to the customer
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
        <h3>New Inquiry from SmartLock Website</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
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
