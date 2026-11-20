import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { getSettings } from "@/lib/data";
import SiteHeader from "./SiteHeader";
import Footer from "./Footer";
import BookButton from "./BookButton";

/**
 * Chrome for the standalone /work and /services pages: a breadcrumb back to
 * the homepage, the page heading, and a closing call to action. Keeps those
 * pages visually part of the one-page site, with the same header and footer.
 */
export default async function PageShell({
  eyebrow,
  title,
  intro,
  breadcrumb,
  hideCta = false,
  children,
}: {
  hideCta?: boolean;
  eyebrow: string;
  title: string;
  intro?: string;
  breadcrumb?: { href: string; label: string };
  children: ReactNode;
}) {
  const back = breadcrumb ?? { href: "/", label: "Home" };
  const { profile } = await getSettings();
  return (
    <>
      <SiteHeader profile={profile} />
      <main
        id="main-content"
        className="min-h-screen px-6 py-14 sm:px-10 lg:px-16 lg:py-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={back.href}
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" /> {back.label}
            </Link>
          </div>

          <div className="mt-10">
            <span className="section-eyebrow">{eyebrow}</span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
              {intro}
            </p>
          )}

          <div className="mt-12">{children}</div>

          {!hideCta && (
            <div className="mt-16 rounded-2xl border border-accent/20 bg-accent/5 p-8 sm:p-10">
              <h2 className="font-display text-2xl font-bold">
                Have something like this to build?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                Tell us what you need it to do and who uses it, and you get a
                fixed scope, a timeline and a price before anything starts.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <BookButton
                  bookingUrl={profile.bookingUrl}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim"
                />
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition hover:border-accent hover:text-accent"
                >
                  Send a project brief
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
