import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { PROJECT_TYPES } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";
import {
  BOOKING_PROJECT_TYPE,
  describeBooking,
  validateBooking,
} from "@/lib/booking";

type Submission = {
  name: string;
  email: string;
  phone: string;
  project_type: string | null;
  budget: string | null;
  message: string;
  created_at: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts digits with optional +, spaces, dashes, parens; the digit-count
// check (7–15, matching E.164) is what actually screens out fake numbers.
const PHONE_SHAPE_RE = /^[0-9()+\-\s]{7,20}$/;

const MAX = {
  name: 100,
  email: 254,
  phone: 20,
  projectType: 60,
  budget: 60,
  message: 3000,
};

/** Trim, collapse control/newline characters, and cap length. */
function clean(value: unknown, maxLen: number): string {
  return String(value ?? "")
    .replace(/[\r\n\t\x00-\x1F\x7F]/g, " ")
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(email: string) {
  return email.length <= MAX.email && EMAIL_RE.test(email);
}

function isValidPhone(phone: string) {
  if (!PHONE_SHAPE_RE.test(phone)) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

// --------------------------------------------------------------------------
// Best-effort rate limiting.
//
// The anon Supabase client can't count existing submissions to enforce a
// limit — RLS deliberately blocks anon reads on this table (visitors must
// never be able to see other people's messages), which is the correct
// tradeoff. Instead we keep a short-lived in-memory window per server
// instance. It resets on cold start and isn't shared across instances/
// regions, but it stops the common case (a script or an impatient user
// firing repeated requests at one warm instance) with zero extra
// infrastructure. For airtight protection add a CAPTCHA (e.g. Cloudflare
// Turnstile) in front of the form.
// --------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 4;
const recentRequests = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (recentRequests.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  timestamps.push(now);
  recentRequests.set(key, timestamps);

  // Bound memory growth: drop old keys occasionally.
  if (recentRequests.size > 5000) {
    for (const [k, v] of recentRequests) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS))
        recentRequests.delete(k);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX;
}

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Email the submission to the site owner via Resend.
 * Returns true only when the provider accepts the notification.
 */
async function sendNotificationEmail(s: Submission) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  // Production alerts require a verified sender; the Resend sandbox cannot
  // deliver to arbitrary notification inboxes.
  if (!apiKey || !to || !from) return false;
  const isBooking = s.project_type === BOOKING_PROJECT_TYPE;

  const resend = new Resend(apiKey);
  const inboxUrl = `${getSiteUrl()}/admin/submissions`;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: s.email,
      subject: `${isBooking ? "New consultation booking" : "New project enquiry"} from ${s.name}`,
      text: [
        `Name: ${s.name}`,
        `Email: ${s.email}`,
        `Phone: ${s.phone || "Not provided"}`,
        `Project type: ${s.project_type ?? "N/A"}`,
        `Budget: ${s.budget ?? "N/A"}`,
        "",
        "Message:",
        s.message,
        "",
        `View enquiries: ${inboxUrl}`,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px">
          <h2 style="margin:0 0 12px">${isBooking ? "New consultation booking" : "New project enquiry"}</h2>
          <p><strong>Name:</strong> ${escapeHtml(s.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(s.email)}">${escapeHtml(s.email)}</a></p>
          <p><strong>Phone:</strong> ${escapeHtml(s.phone || "Not provided")}</p>
          <p><strong>Project type:</strong> ${escapeHtml(s.project_type ?? "N/A")}</p>
          <p><strong>Budget:</strong> ${escapeHtml(s.budget ?? "N/A")}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${escapeHtml(s.message)}</p>
          <p><a href="${escapeHtml(inboxUrl)}">View enquiries in your portfolio inbox</a></p>
        </div>
      `,
    });
    if (error) {
      console.error("Contact notification was rejected:", error.message);
      return false;
    }
    return Boolean(data?.id);
  } catch (err) {
    // Don't fail the request if email delivery hiccups — it's already saved.
    console.error(
      "Resend email failed:",
      err instanceof Error ? err.message : err,
    );
    return false;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  // Honeypot: a hidden field real visitors never fill in. Bots that
  // autofill every input trip it — pretend success without doing anything.
  if (String(body.website ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "You're sending messages too fast. Please try again shortly, or use WhatsApp.",
      },
      { status: 429 },
    );
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email).toLowerCase();
  const phone = clean(body.phone, MAX.phone);
  const isBooking = body.kind === "booking";
  let message = clean(body.message, MAX.message);
  const projectTypeRaw = clean(body.projectType, MAX.projectType);
  const budget = clean(body.budget, MAX.budget) || null;

  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 422 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 422 },
    );
  }
  if (phone && !isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Please enter a valid phone number." },
      { status: 422 },
    );
  }
  if (isBooking) {
    const result = validateBooking(body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }
    if (result.booking.format === "Phone call" && !phone) {
      return NextResponse.json(
        { error: "Please add a phone number so we can call you." },
        { status: 422 },
      );
    }
    // The booking details lead the message; the visitor's notes follow.
    message = [
      describeBooking(result.booking),
      message ? `\nNotes:\n${message}` : "",
    ]
      .join("\n")
      .trim();
  } else if (!message || message.length < 5) {
    return NextResponse.json(
      { error: "Please enter a short message." },
      { status: 422 },
    );
  }
  const projectType = isBooking
    ? BOOKING_PROJECT_TYPE
    : PROJECT_TYPES.includes(projectTypeRaw)
      ? projectTypeRaw
      : null;
  if (!projectType) {
    return NextResponse.json(
      { error: "Please choose a valid project type." },
      { status: 422 },
    );
  }

  const submission: Submission = {
    name,
    email,
    phone,
    project_type: projectType,
    budget,
    message,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const supabase = await createServerSupabase();

    let { error } = await supabase!.from("submissions").insert(submission);

    // The `phone` column may not exist yet on older deployments — fall back
    // to embedding it in the message rather than failing the whole request.
    if (
      error &&
      /phone/i.test(error.message) &&
      /column/i.test(error.message)
    ) {
      const { phone: _phone, ...withoutPhone } = submission;
      void _phone;
      ({ error } = await supabase!.from("submissions").insert({
        ...withoutPhone,
        message: `Phone: ${phone}\n\n${message}`,
      }));
    }

    if (error) {
      console.error("Supabase insert failed:", error.message);
      return NextResponse.json(
        { error: "Could not save your message. Please try WhatsApp." },
        { status: 500 },
      );
    }
  }

  // A saved enquiry is successful even if the optional notification fails.
  // Without a database, the email provider must accept it before we say sent.
  const emailed = await sendNotificationEmail(submission);
  if (!isSupabaseConfigured && !emailed) {
    return NextResponse.json(
      {
        error:
          "The enquiry form is temporarily unavailable. Please email us directly or use WhatsApp; your message has not been sent.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
