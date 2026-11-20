import type { Metadata } from "next";
import { CalendarCheck, Clock, MapPin, MessagesSquare } from "lucide-react";
import PageShell from "@/components/PageShell";
import BookingForm from "@/components/BookingForm";
import JsonLd from "@/components/JsonLd";
import { BRAND_NAME } from "@/content/site";
import { getSettings } from "@/lib/data";
import { bookingDateRange } from "@/lib/booking";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Book an Appointment | ${BRAND_NAME}`,
  description:
    "Book a 30-minute video or phone consultation with Oasis Orchard Stack about your website, app or business automation. Monday to Friday, in your Canadian time zone.",
  path: "/book",
});

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Pick a day and time",
    body: "Choose a weekday slot in your own time zone, and whether you'd prefer video or phone.",
  },
  {
    icon: MessagesSquare,
    title: "We confirm by email",
    body: "You get a confirmation with a calendar invite and call details. If the slot is taken, we suggest the nearest alternatives.",
  },
  {
    icon: Clock,
    title: "A focused 30 minutes",
    body: "We talk through your goals, what to build or automate first, and a realistic timeline and budget range. You leave with clear next steps.",
  },
];

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const [{ profile }, { topic }] = await Promise.all([
    getSettings(),
    searchParams,
  ]);
  return (
    <PageShell
      eyebrow="BOOK AN APPOINTMENT"
      title="Book a 30-minute consultation."
      intro="Tell us when suits you and what you'd like to discuss. It's a conversation, not a sales pitch: bring your idea, your current website or the process that's eating your team's time."
      hideCta
    >
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `Book an appointment with ${BRAND_NAME}`,
          url: absoluteUrl("/book"),
          potentialAction: {
            "@type": "ScheduleAction",
            target: absoluteUrl("/book"),
          },
        }}
      />
      <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="order-2 space-y-4 lg:order-1">
          <ol className="space-y-4">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="rounded-2xl border border-border bg-bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h2 className="font-display text-base font-semibold">
                    <span className="mr-2 text-accent">0{i + 1}</span>
                    {title}
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {body}
                </p>
              </li>
            ))}
          </ol>
          <p className="flex items-start gap-3 rounded-2xl border border-border p-5 text-sm leading-relaxed text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            Appointments run Monday to Friday, 9:00 AM to 5:00 PM in your local
            time, for businesses and individuals anywhere in Canada.
          </p>
        </aside>
        <BookingForm
          email={profile.email}
          initialTopic={topic}
          range={bookingDateRange()}
        />
      </div>
    </PageShell>
  );
}
