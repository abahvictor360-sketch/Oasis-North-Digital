import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { SERVICE_PAGES, type ProfileData } from "@/content/site";
import { SocialIcon } from "./icons";
import { BrandMark, MapleLeaf } from "./BrandMark";
import BookButton from "./BookButton";

const COMPANY = [
  { href: "/work", label: "Our work" },
  { href: "/#process", label: "How we work" },
  { href: "/#about", label: "About the studio" },
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Insights" },
  { href: "/#contact", label: "Contact" },
];

export default function Footer({ profile: PROFILE }: { profile: ProfileData }) {
  return (
    <footer className="border-t border-border bg-bg-elevated px-6 pt-14 pb-28 sm:px-10 sm:pb-24 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <span className="font-display text-lg font-bold">
              {PROFILE.name}
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Websites, custom apps and automation for businesses and individuals
            across Canada.
          </p>
          <div className="mt-6 flex gap-3">
            {PROFILE.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:border-accent hover:text-accent"
              >
                <SocialIcon name={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links to every service and the work index: how crawlers reach
            those pages from the single-page site, and how a visitor does too. */}
        <nav aria-label="Services">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
            Services
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {SERVICE_PAGES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-muted transition hover:text-accent"
                >
                  {s.service === "Canada" ? "Serving all of Canada" : s.service}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
            Company
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {COMPANY.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted transition hover:text-accent"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text">
            Get in touch
          </p>
          <ul className="mt-4 space-y-4 text-sm text-muted">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a
                href={`mailto:${PROFILE.email}`}
                className="break-all hover:text-text"
              >
                {PROFILE.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:+${PROFILE.phoneRaw}`} className="hover:text-text">
                {PROFILE.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>
                {PROFILE.location}
                <span className="mt-1 block text-xs">
                  Remote across Canada · Pacific to Atlantic
                </span>
              </span>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <BookButton
              bookingUrl={PROFILE.bookingUrl}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim"
            />
            <Link
              href="/#contact"
              className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
            >
              Get a quote
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
        </p>
        <p className="flex items-center gap-2">
          <MapleLeaf className="h-3.5 w-3.5 text-[#ef4444]" />
          Proudly built in Canada
        </p>
      </div>
    </footer>
  );
}
