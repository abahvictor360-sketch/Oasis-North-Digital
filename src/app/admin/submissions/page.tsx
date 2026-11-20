import Link from "next/link";
import { Mail, Trash2, Check, Circle, CalendarDays } from "lucide-react";
import { BOOKING_PROJECT_TYPE } from "@/lib/booking";
import { createServerSupabase } from "@/lib/supabase";
import { toggleSubmissionRead, deleteSubmission } from "../actions";

export const dynamic = "force-dynamic";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  project_type: string | null;
  budget: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

const VIEWS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "bookings", label: "Appointments" },
  { key: "enquiries", label: "Enquiries" },
] as const;

const isBooking = (s: Submission) => s.project_type === BOOKING_PROJECT_TYPE;

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view: rawView } = await searchParams;
  const view = VIEWS.some((v) => v.key === rawView) ? rawView! : "all";
  const sb = await createServerSupabase();
  const { data } = (await sb!
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })) ?? { data: [] };
  const all = (data ?? []) as Submission[];
  const counts: Record<string, number> = {
    all: all.length,
    unread: all.filter((s) => !s.is_read).length,
    bookings: all.filter(isBooking).length,
    enquiries: all.filter((s) => !isBooking(s)).length,
  };
  const rows = all.filter((s) =>
    view === "unread"
      ? !s.is_read
      : view === "bookings"
        ? isBooking(s)
        : view === "enquiries"
          ? !isBooking(s)
          : true,
  );

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Inbox</h1>
      <p className="mt-1 text-sm text-muted">
        Appointment requests from /book and project enquiries from the contact
        form.
      </p>

      <div className="mt-6 mb-6 flex flex-wrap gap-2">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={
              v.key === "all"
                ? "/admin/submissions"
                : `/admin/submissions?view=${v.key}`
            }
            aria-current={view === v.key ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              view === v.key
                ? "border-accent bg-accent/10 text-text"
                : "border-border text-muted hover:text-text"
            }`}
          >
            {v.label}
            <span className="ml-1.5 text-xs text-muted">{counts[v.key]}</span>
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
          {view === "all"
            ? "No messages yet. Appointment requests and contact-form enquiries land here."
            : "Nothing here right now."}
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((s) => (
            <article
              key={s.id}
              className={`rounded-2xl border p-5 ${
                s.is_read
                  ? "border-border bg-bg-card"
                  : "border-accent/40 bg-bg-card"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!s.is_read && (
                      <Circle className="h-2.5 w-2.5 fill-accent text-accent" />
                    )}
                    {isBooking(s) && (
                      <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                        <CalendarDays className="h-3 w-3" /> Appointment
                      </span>
                    )}
                    <h3 className="font-semibold">{s.name}</h3>
                    <a
                      href={`mailto:${s.email}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {s.email}
                    </a>
                    {s.phone && (
                      <a
                        href={`tel:${s.phone}`}
                        className="text-sm text-muted hover:text-accent"
                      >
                        {s.phone}
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(s.created_at).toLocaleString()}
                    {s.project_type && !isBooking(s)
                      ? ` · ${s.project_type}`
                      : ""}
                    {s.budget ? ` · Budget: ${s.budget}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <form action={toggleSubmissionRead}>
                    <input type="hidden" name="id" value={s.id} />
                    <input
                      type="hidden"
                      name="is_read"
                      value={String(s.is_read)}
                    />
                    <button
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted hover:text-accent"
                      title={s.is_read ? "Mark unread" : "Mark read"}
                    >
                      {s.is_read ? (
                        <Mail className="h-3.5 w-3.5" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      {s.is_read ? "Unread" : "Read"}
                    </button>
                  </form>
                  <form action={deleteSubmission}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      className="rounded-lg border border-border p-1.5 text-muted hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted">
                {s.message}
              </p>
              {isBooking(s) && (
                <a
                  href={`mailto:${s.email}?subject=${encodeURIComponent("Your consultation with Oasis Orchard Stack")}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-[#06150d] transition hover:bg-accent-dim"
                >
                  <Mail className="h-3.5 w-3.5" /> Reply to confirm
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
