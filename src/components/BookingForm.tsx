"use client";

import { useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  Loader2,
  Phone,
  Video,
} from "lucide-react";
import {
  BOOKING_TOPICS,
  MEETING_FORMATS,
  TIME_SLOTS,
  TIME_ZONES,
  guessTimeZone,
  isWeekday,
  timeZoneLabel,
} from "@/lib/booking";

type Status = "idle" | "sending" | "sent" | "error";

const noopSubscribe = () => () => {};

export default function BookingForm({
  email,
  initialTopic,
  range,
}: {
  email: string;
  initialTopic?: string;
  /** Selectable date window, computed on the server per request. */
  range: { min: string; max: string };
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [format, setFormat] = useState(MEETING_FORMATS[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  // The visitor's zone comes from their browser; the server render and
  // hydration use Eastern, then it switches without a mismatch.
  const detectedZone = useSyncExternalStore(
    noopSubscribe,
    guessTimeZone,
    () => "America/Toronto",
  );
  const [chosenZone, setTimeZone] = useState("");
  const timeZone = chosenZone || detectedZone;
  const [confirmed, setConfirmed] = useState("");

  const weekendPicked = date !== "" && !isWeekday(date);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    if (weekendPicked) {
      setStatus("error");
      setError("Appointments run Monday to Friday. Please choose a weekday.");
      return;
    }
    if (!time) {
      setStatus("error");
      setError("Please choose a time slot.");
      return;
    }
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, kind: "booking", time, format }),
      });
      if (!res.ok) {
        const response = await res.json().catch(() => ({}));
        throw new Error(
          response.error ||
            "Your booking could not be sent. Please email us or use WhatsApp.",
        );
      }
      const day = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
      setConfirmed(`${day} at ${time} ${timeZoneLabel(timeZone) ?? ""}`);
      setStatus("sent");
      form.reset();
      setDate("");
      setTime("");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Your booking could not be sent. Please email us or use WhatsApp.",
      );
    }
  }

  const field =
    "mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-base text-text placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const label = "block text-sm font-medium";

  if (status === "sent") {
    return (
      <div
        role="status"
        className="order-1 rounded-2xl border border-accent/40 bg-bg-card p-8 text-center lg:order-2"
      >
        <CalendarCheck className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-4 font-display text-xl font-semibold">
          Your appointment request is in.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          You asked for <strong className="text-text">{confirmed}</strong>.
          We&apos;ll email you to confirm the time, with a calendar invite and
          call details. If that slot is taken, we&apos;ll suggest the closest
          alternatives.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-border px-5 py-3 text-sm hover:border-accent"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="order-1 space-y-6 rounded-2xl border border-border bg-bg-card p-6 sm:p-8 lg:order-2"
    >
      {/* Honeypot: hidden from people, filled in by bots. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset>
        <legend className={label}>
          How would you like to meet? <span className="text-muted">*</span>
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {MEETING_FORMATS.map((f) => {
            const Icon = f === "Phone call" ? Phone : Video;
            const selected = format === f;
            return (
              <label
                key={f}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  selected
                    ? "border-accent bg-accent/10 text-text"
                    : "border-border text-muted hover:border-accent/50"
                }`}
              >
                <input
                  type="radio"
                  name="formatChoice"
                  value={f}
                  checked={selected}
                  onChange={() => setFormat(f)}
                  className="sr-only"
                />
                <Icon className={`h-4 w-4 ${selected ? "text-accent" : ""}`} />
                {f}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Date <span className="text-muted">*</span>
          <input
            type="date"
            name="date"
            required
            min={range.min}
            max={range.max}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            className={`${field} [color-scheme:dark]`}
            aria-describedby="date-hint"
          />
          <span
            id="date-hint"
            className={`mt-1.5 block text-xs ${weekendPicked ? "text-red-300" : "text-muted"}`}
          >
            {weekendPicked
              ? "That's a weekend. Please choose Monday to Friday."
              : "Monday to Friday, up to 60 days ahead."}
          </span>
        </label>
        <label className={label}>
          Your time zone <span className="text-muted">*</span>
          <select
            name="timeZone"
            required
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className={field}
          >
            {TIME_ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset disabled={!date || weekendPicked}>
        <legend className={label}>
          Preferred time <span className="text-muted">*</span>
          <span className="ml-2 text-xs font-normal text-muted">
            {date && !weekendPicked
              ? `in ${timeZoneLabel(timeZone)}`
              : "Pick a date first"}
          </span>
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {TIME_SLOTS.map((slot) => {
            const selected = time === slot;
            return (
              <button
                key={slot}
                type="button"
                aria-pressed={selected}
                onClick={() => setTime(slot)}
                className={`rounded-lg border px-2 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  selected
                    ? "border-accent bg-accent font-semibold text-[#06150d]"
                    : "border-border hover:border-accent/60"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={label}>
          Name <span className="text-muted">*</span>
          <input
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className={field}
          />
        </label>
        <label className={label}>
          Email <span className="text-muted">*</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={field}
          />
        </label>
        <label className={label}>
          Phone{" "}
          {format === "Phone call" ? (
            <span className="text-muted">*</span>
          ) : (
            <span className="text-xs font-normal text-muted">(optional)</span>
          )}
          <input
            type="tel"
            name="phone"
            required={format === "Phone call"}
            autoComplete="tel"
            placeholder="e.g. 416 555 0123"
            className={field}
          />
        </label>
        <label className={label}>
          What would you like to discuss? <span className="text-muted">*</span>
          <select
            name="topic"
            required
            defaultValue={
              initialTopic && BOOKING_TOPICS.includes(initialTopic)
                ? initialTopic
                : ""
            }
            className={field}
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {BOOKING_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={label}>
        Anything we should know beforehand?{" "}
        <span className="text-xs font-normal text-muted">(optional)</span>
        <textarea
          name="message"
          rows={4}
          maxLength={3000}
          placeholder="Your business or project, what you'd like to build or automate, and any deadlines."
          className={field}
        />
      </label>

      <p className="text-xs leading-relaxed text-muted">
        This is a request for a time. We confirm every appointment by email.
        Your details are used only to arrange and hold this call.
      </p>

      {status === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm leading-relaxed text-red-300"
        >
          <p>{error}</p>
          <a href={`mailto:${email}`} className="mt-2 inline-block underline">
            Email us directly
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending your request…
          </>
        ) : (
          <>
            Request this appointment <ArrowUpRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
