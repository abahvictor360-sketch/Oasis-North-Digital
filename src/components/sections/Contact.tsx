"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  PROJECT_TYPES,
  type ProfileData,
  type ContactData,
} from "@/content/site";
import BookButton from "@/components/BookButton";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact({
  profile,
  contact,
}: {
  profile: ProfileData;
  contact: ContactData;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const waLink = `https://wa.me/${profile.phoneRaw}?text=${encodeURIComponent(contact.whatsappMessage)}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      });
      if (!res.ok) {
        const response = await res.json();
        throw new Error(
          response.error ||
            "Your message could not be sent. Please email us or use WhatsApp.",
        );
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Your message could not be sent. Please email us or use WhatsApp.",
      );
    }
  }

  const field =
    "mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-base text-text placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
  const label = "block text-sm font-medium";

  return (
    <section
      id="contact"
      className="scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <span className="section-eyebrow">
          LET&apos;S BUILD SOMETHING USEFUL
        </span>
        <h2 className="mt-4 max-w-3xl text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {contact.headline}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
          Share a little about your business or idea, what you need and the
          timing you have in mind. We can work out the right next step together.
        </p>
        <div className="mt-10 grid items-start gap-10 xl:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="rounded-2xl border border-border bg-bg-card p-6">
              <h3 className="font-display text-lg font-semibold">
                A conversation comes first.
              </h3>
              <ol className="mt-5 space-y-4 text-sm text-muted">
                <li>
                  <span className="mr-3 text-accent">01</span>We review your
                  brief and ask any useful follow-up questions.
                </li>
                <li>
                  <span className="mr-3 text-accent">02</span>We discuss the
                  scope, priorities and the best way to work together.
                </li>
                <li>
                  <span className="mr-3 text-accent">03</span>You review a
                  proposal before committing to a build.
                </li>
              </ol>
              <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted">
                Serving businesses and individuals across {profile.location}.
                Calls booked in your time zone, Pacific to Atlantic.
              </p>
            </div>
            <div className="mt-5 rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <h3 className="font-display text-lg font-semibold">
                Prefer to talk it through?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Book a 30-minute video or phone call at a time that suits you.
              </p>
              <BookButton
                bookingUrl={profile.bookingUrl}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim"
              />
            </div>
            <a
              href={`mailto:${profile.email}`}
              className="mt-5 flex items-center gap-3 py-2 text-sm transition hover:text-accent"
            >
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <span className="break-all">{profile.email}</span>
            </a>
            <a
              href={`tel:+${profile.phoneRaw}`}
              className="flex items-center gap-3 py-3 text-sm transition hover:text-accent"
            >
              <Phone className="h-4 w-4 text-accent" />
              {profile.phone}
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
            >
              <MessageCircle className="h-4 w-4" />
              Prefer WhatsApp? Start here <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          {status === "sent" ? (
            <div
              role="status"
              className="rounded-2xl border border-accent/40 bg-bg-card p-8 text-center"
            >
              <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
              <h3 className="mt-4 font-display text-xl font-semibold">
                Your brief is on its way.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Thanks for getting in touch. we&apos;ll review your message and
                reply to the email address you provided.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 rounded-full border border-border px-5 py-3 text-sm hover:border-accent"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              aria-busy={status === "sending"}
              className="space-y-5 rounded-2xl border border-border bg-bg-card p-6 sm:p-8"
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={label}>
                  Your name <span className="text-muted">*</span>
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    placeholder="Full name"
                    className={field}
                  />
                </label>
                <label className={label}>
                  Email address <span className="text-muted">*</span>
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    placeholder="you@company.com"
                    className={field}
                  />
                </label>
              </div>
              <label className={label}>
                What can we help you with? <span className="text-muted">*</span>
                <select
                  name="projectType"
                  required
                  defaultValue=""
                  className={field}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {PROJECT_TYPES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={label}>
                  Phone <span className="text-xs text-muted">(optional)</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    maxLength={20}
                    autoComplete="tel"
                    placeholder="Include country code"
                    className={field}
                  />
                </label>
                <label className={label}>
                  Budget <span className="text-xs text-muted">(optional)</span>
                  <input
                    name="budget"
                    maxLength={60}
                    placeholder="Amount and currency"
                    className={field}
                  />
                </label>
              </div>
              <label className={label}>
                A little about your project{" "}
                <span className="text-muted">*</span>
                <textarea
                  name="message"
                  required
                  minLength={5}
                  maxLength={3000}
                  rows={5}
                  placeholder="What are you building, who is it for, and when would you like to get started?"
                  className={`${field} resize-y`}
                />
              </label>
              <p className="text-xs leading-relaxed text-muted">
                Your details are used to respond to this enquiry. Fields marked
                * are required.
              </p>
              {status === "error" && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/30 bg-red-400/5 p-4 text-sm leading-relaxed text-red-300"
                >
                  <p>{error}</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-2 inline-block underline"
                  >
                    Email us directly
                  </a>
                </div>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending your brief…
                  </>
                ) : (
                  <>
                    Send project enquiry <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
