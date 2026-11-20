import Link from "next/link";
import { Home, Mail } from "lucide-react";
import { BRAND_NAME } from "@/content/site";

export const metadata = {
  title: `Page not found | ${BRAND_NAME}`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="font-display text-7xl font-extrabold text-accent">404</span>
      <h1 className="mt-4 font-display text-2xl font-bold">This page doesn&apos;t exist</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        The link you followed may be broken, or the page may have moved. Here&apos;s how to find
        what you&apos;re looking for.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-[#06150d] transition hover:bg-accent-dim"
        >
          <Home className="h-4 w-4" /> Back to homepage
        </Link>
        <Link
          href="/#contact"
          className="flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition hover:border-accent hover:text-accent"
        >
          <Mail className="h-4 w-4" /> Contact us
        </Link>
      </div>
    </div>
  );
}
