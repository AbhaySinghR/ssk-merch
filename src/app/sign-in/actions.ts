"use server";

import { isValidPhoneNumber } from "libphonenumber-js";
import { saveRegistration } from "@/lib/registrations";
import { resend, RESEND_FROM_EMAIL } from "@/lib/resend";
import type { RegisterState, RegisterFieldErrors } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const title = String(formData.get("title") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const schoolNumber = String(formData.get("schoolNumber") ?? "").trim();
  const batch = String(formData.get("batch") ?? "").trim();

  const errors: RegisterFieldErrors = {};

  if (!title) errors.title = "Please select a title.";
  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhoneNumber(phone)) {
    errors.phone = "Enter a valid phone number for the selected country.";
  }
  if (!schoolNumber) errors.schoolNumber = "School number is required.";
  if (!batch) errors.batch = "Batch is required.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "", errors };
  }

  await saveRegistration({
    title,
    firstName,
    lastName,
    email,
    phone,
    schoolNumber,
    batch,
    registeredAt: new Date().toISOString(),
  });

  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not set — skipping confirmation email for",
      email,
    );
    return {
      success: true,
      message:
        "You're registered! Email sending isn't configured yet, but your details are saved.",
      errors: {},
    };
  }

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: "Welcome to Sainik School Kapurthala Merch — You're registered!",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; background:#2c0a0a; padding:32px; color:#f5f0e8;">
          <h1 style="font-family: Georgia, serif; color:#c9a84c; font-size:24px; margin-bottom:16px;">Let's get connected</h1>
          <p>Dear ${title} ${firstName} ${lastName},</p>
          <p>Thank you for registering with <strong>Sainik School Kapurthala Merch</strong> — the official alumni merchandise store for Sainik School Kapurthala.</p>
          <p>We've recorded your details against batch <strong>${batch}</strong> and school number <strong>${schoolNumber}</strong>. You'll be the first to know about new drops, alumni-exclusive deals, and community updates.</p>
          <p style="margin-top:24px; letter-spacing:0.2em; font-size:11px; color:#a89080;">DISCIPLINE &middot; HONOUR &middot; SERVICE</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return {
      success: true,
      message:
        "You're registered! We couldn't send the confirmation email right now, but your details are saved.",
      errors: {},
    };
  }

  return {
    success: true,
    message: "You're registered! Check your inbox for a confirmation email.",
    errors: {},
  };
}
