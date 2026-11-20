/**
 * Consultation booking rules, shared by the /book form and /api/contact so
 * the options a visitor sees are exactly the ones the server accepts.
 *
 * A booking is a *request* for a time: it is saved and emailed like any
 * enquiry, and the studio confirms the slot by email. To use a live
 * scheduler instead (Cal.com, Calendly…), set PROFILE.bookingUrl.
 */

/** Stored as the submission's project type so bookings stand out in the inbox. */
export const BOOKING_PROJECT_TYPE = "Consultation booking";

export const MEETING_LENGTH = "30-minute";

export const MEETING_FORMATS = ["Video call", "Phone call"];

export const BOOKING_TOPICS = [
  "Website",
  "Personal website or portfolio",
  "Web or mobile app",
  "Business automation",
  "AI assistant or feature",
  "Support & hosting",
  "Not sure yet",
];

/** Canada's six time zones, west to east. */
export const TIME_ZONES = [
  { id: "America/Vancouver", label: "Pacific Time (PT)" },
  { id: "America/Edmonton", label: "Mountain Time (MT)" },
  { id: "America/Winnipeg", label: "Central Time (CT)" },
  { id: "America/Toronto", label: "Eastern Time (ET)" },
  { id: "America/Halifax", label: "Atlantic Time (AT)" },
  { id: "America/St_Johns", label: "Newfoundland Time (NT)" },
];

/** Half-hour starts across the business day, in the visitor's own zone. */
export const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

/** How far ahead a visitor may request a slot. */
export const BOOKING_WINDOW_DAYS = 60;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD for a Date, read in UTC so server and tests agree. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** The earliest and latest dates a visitor can pick, relative to `now`. */
export function bookingDateRange(now: Date = new Date()) {
  return {
    min: isoDate(new Date(now.getTime() + DAY_MS)),
    max: isoDate(new Date(now.getTime() + BOOKING_WINDOW_DAYS * DAY_MS)),
  };
}

export function isWeekday(date: string): boolean {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day !== 0 && day !== 6;
}

export function timeZoneLabel(id: string): string | undefined {
  return TIME_ZONES.find((z) => z.id === id)?.label;
}

/** A Canadian zone matching the browser, or Eastern as the default. */
export function guessTimeZone(): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TIME_ZONES.some((z) => z.id === zone)) return zone;
    const aliases: Record<string, string> = {
      "America/Montreal": "America/Toronto",
      "America/Regina": "America/Winnipeg",
      "America/Moncton": "America/Halifax",
      "America/Glace_Bay": "America/Halifax",
      "America/Whitehorse": "America/Vancouver",
      "America/Yellowknife": "America/Edmonton",
    };
    if (aliases[zone]) return aliases[zone];
  } catch {
    /* Fall through to the default. */
  }
  return "America/Toronto";
}

export type Booking = {
  date: string;
  time: string;
  timeZone: string;
  format: string;
  topic: string;
};

export type BookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; error: string };

export function validateBooking(
  input: Record<string, unknown>,
  now: Date = new Date(),
): BookingResult {
  const date = String(input.date ?? "").trim();
  const time = String(input.time ?? "").trim();
  const timeZone = String(input.timeZone ?? "").trim();
  const format = String(input.format ?? "").trim();
  const topic = String(input.topic ?? "").trim();
  const { min, max } = bookingDateRange(now);

  if (
    !DATE_RE.test(date) ||
    Number.isNaN(Date.parse(`${date}T12:00:00Z`)) ||
    isoDate(new Date(`${date}T12:00:00Z`)) !== date
  )
    return { ok: false, error: "Please choose a date for your appointment." };
  if (date < min || date > max)
    return {
      ok: false,
      error: `Please choose a date between tomorrow and the next ${BOOKING_WINDOW_DAYS} days.`,
    };
  if (!isWeekday(date))
    return {
      ok: false,
      error: "Appointments run Monday to Friday. Please choose a weekday.",
    };
  if (!TIME_SLOTS.includes(time))
    return { ok: false, error: "Please choose a time slot." };
  if (!timeZoneLabel(timeZone))
    return { ok: false, error: "Please choose your time zone." };
  if (!MEETING_FORMATS.includes(format))
    return { ok: false, error: "Please choose a video or phone call." };
  if (!BOOKING_TOPICS.includes(topic))
    return { ok: false, error: "Please choose what you'd like to discuss." };

  return { ok: true, booking: { date, time, timeZone, format, topic } };
}

/** Human-readable summary for the inbox and notification email. */
export function describeBooking(b: Booking): string {
  const day = new Date(`${b.date}T12:00:00Z`).toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
  return [
    `Requested appointment: ${day} at ${b.time} ${timeZoneLabel(b.timeZone)}`,
    `Format: ${MEETING_LENGTH} ${b.format.toLowerCase()}`,
    `Topic: ${b.topic}`,
  ].join("\n");
}
