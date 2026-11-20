import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Inbox,
  MessageSquare,
  Settings,
} from "lucide-react";
import { createServerSupabase } from "@/lib/supabase";
import { BOOKING_PROJECT_TYPE } from "@/lib/booking";
import { RESOURCES } from "./config";

export const dynamic = "force-dynamic";

const PROFILE_ONLY = new Set(["experience", "education", "certifications"]);

export default async function AdminDashboard() {
  const sb = await createServerSupabase();

  async function count(
    table: string,
    filter?: { unread?: boolean; bookings?: boolean; enquiries?: boolean },
  ) {
    if (!sb) return 0;
    let q = sb.from(table).select("*", { count: "exact", head: true });
    if (filter?.unread) q = q.eq("is_read", false);
    if (filter?.bookings) q = q.eq("project_type", BOOKING_PROJECT_TYPE);
    if (filter?.enquiries)
      q = q.or(
        `project_type.is.null,project_type.neq."${BOOKING_PROJECT_TYPE}"`,
      );
    const { count: c } = await q;
    return c ?? 0;
  }

  const [newBookings, newEnquiries, total, ...counts] = await Promise.all([
    count("submissions", { unread: true, bookings: true }),
    count("submissions", { unread: true, enquiries: true }),
    count("submissions"),
    ...RESOURCES.map((r) => count(r.table)),
  ]);

  const inboxCards = [
    {
      href: "/admin/submissions?view=bookings",
      icon: CalendarDays,
      value: newBookings,
      label: "New appointment requests",
      hint: "Reply to confirm the time",
    },
    {
      href: "/admin/submissions?view=enquiries",
      icon: MessageSquare,
      value: newEnquiries,
      label: "New project enquiries",
      hint: "From the contact form",
    },
    {
      href: "/admin/submissions",
      icon: Inbox,
      value: total,
      label: "All messages",
      hint: "Bookings and enquiries",
    },
  ];

  const content = RESOURCES.map((r, i) => ({ ...r, count: counts[i] }));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">
        Bookings, enquiries and every section of the live site. Changes publish
        immediately.
      </p>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Inbox
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {inboxCards.map(({ href, icon: Icon, value, label, hint }) => (
          <Link
            key={label}
            href={href}
            className={`group rounded-2xl border bg-bg-card p-6 transition hover:border-accent/60 ${
              value > 0 && label.startsWith("New")
                ? "border-accent/40"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-accent" />
              <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-accent" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold">{value}</p>
            <p className="mt-1 text-sm font-medium">{label}</p>
            <p className="mt-0.5 text-xs text-muted">{hint}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Website content
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/general"
          className="rounded-2xl border border-dashed border-border p-6 transition hover:border-accent/60"
        >
          <Settings className="h-5 w-5 text-accent" />
          <p className="mt-4 font-display font-semibold">Site settings</p>
          <p className="mt-1 text-xs text-muted">
            Studio details, hero, about, contact, booking link & SEO
          </p>
        </Link>
        {content
          .filter((r) => !PROFILE_ONLY.has(r.key))
          .map((r) => (
            <Link
              key={r.key}
              href={`/admin/${r.key}`}
              className="rounded-2xl border border-border bg-bg-card p-6 transition hover:border-accent/60"
            >
              <p className="font-display text-3xl font-bold text-accent">
                {r.count}
              </p>
              <p className="mt-1 text-sm text-muted">{r.label}</p>
            </Link>
          ))}
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Founder profile
        <span className="ml-2 normal-case tracking-normal text-muted/70">
          (kept on record, not shown on the site)
        </span>
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {content
          .filter((r) => PROFILE_ONLY.has(r.key))
          .map((r) => (
            <Link
              key={r.key}
              href={`/admin/${r.key}`}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-text"
            >
              {r.label} · {r.count}
            </Link>
          ))}
      </div>
    </div>
  );
}
