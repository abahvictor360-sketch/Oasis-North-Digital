import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { createServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { BrandMark } from "@/components/BrandMark";
import { RESOURCES } from "./config";
import { signOut } from "./actions";
import AdminNav, { type AdminLink } from "./AdminNav";

export const metadata = {
  title: "Admin | Oasis Orchard Stack",
  robots: { index: false, follow: false },
};

// Collections that describe the founder's own background. They are kept for
// the record but are not shown on the public site, so they sit under "More".
const PROFILE_ONLY = new Set(["experience", "education", "certifications"]);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-lg p-10 text-center">
        <BrandMark className="mx-auto h-14 w-14" />
        <h1 className="mt-5 font-display text-2xl font-bold">
          Backend not configured
        </h1>
        <p className="mt-3 text-sm text-muted">
          Add <code className="text-accent">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-accent">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code>.env.local</code>, then restart the dev server.
        </p>
      </div>
    );
  }

  const sb = await createServerSupabase();
  const {
    data: { user },
  } = (await sb!.auth.getUser()) ?? { data: { user: null } };

  // Unauthenticated (login page) — render bare, no dashboard chrome.
  if (!user) return <div className="min-h-screen">{children}</div>;

  const { count: unread } = await sb!
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  const resourceLinks = RESOURCES.map((r) => ({
    key: r.key,
    href: `/admin/${r.key}`,
    label: r.label,
  }));
  const primary: AdminLink[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/submissions", label: "Inbox", badge: unread ?? 0 },
    { href: "/admin/general", label: "Site settings" },
    ...resourceLinks.filter((r) => !PROFILE_ONLY.has(r.key)),
  ];
  const more = resourceLinks.filter((r) => PROFILE_ONLY.has(r.key));

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-bg-elevated/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pt-4 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8" />
            <span className="font-display font-bold leading-none">
              Oasis Orchard
              <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">
                Admin
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted md:inline">
              {user.email}
            </span>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:border-accent hover:text-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <form action={signOut}>
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:text-text">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-6xl px-2 lg:px-5">
          <AdminNav primary={primary} more={more} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-5 lg:p-8">{children}</main>
    </div>
  );
}
