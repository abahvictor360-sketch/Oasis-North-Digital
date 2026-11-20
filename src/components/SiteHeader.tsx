"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { NAV_ITEMS, SERVICE_PAGES, type ProfileData } from "@/content/site";
import { BrandMark, MapleLeaf } from "./BrandMark";
import { SocialIcon } from "./icons";
import BookButton from "./BookButton";

// "Home" is the logo and "Contact" is the call to action, so the text links
// cover the sections in between. Services gets a dropdown of its pages.
const LINKS = NAV_ITEMS.filter(({ id }) => id !== "home" && id !== "contact");

export default function SiteHeader({ profile }: { profile: ProfileData }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Section links resolve on any page: same-page anchors on the homepage,
  // a jump back to the homepage section everywhere else.
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    if (menuOpen) dialog.showModal();
    else dialog.close();
    const previous = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Highlight the section in view (homepage only).
  useEffect(() => {
    if (!onHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  // Close the services dropdown on outside click or Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!servicesRef.current?.contains(e.target as Node))
        setServicesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const linkClass = (id: string) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition hover:text-text ${
      active === id ? "text-accent" : "text-muted"
    }`;

  const logo = profile.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.logo}
      alt={profile.name}
      className="h-9 w-auto max-w-[180px] object-contain"
    />
  ) : (
    <span className="flex items-center gap-2.5">
      <BrandMark className="h-9 w-9 shrink-0" />
      <span className="font-display text-[1.05rem] font-bold leading-none tracking-tight">
        Oasis Orchard
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent">
          Stack
        </span>
      </span>
    </span>
  );

  return (
    <>
      {/* Utility strip: where we are, and the quickest ways to reach us */}
      <div className="hidden border-b border-border bg-bg-elevated text-xs text-muted md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-2 sm:px-10 lg:px-12 box-content">
          <p className="flex items-center gap-2">
            <MapleLeaf className="h-3.5 w-3.5 text-[#ef4444]" />
            Proudly Canadian · For businesses & individuals, coast to coast ·
            Quotes in CAD
          </p>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 transition hover:text-text"
            >
              <Mail className="h-3.5 w-3.5 text-accent" />
              {profile.email}
            </a>
            <a
              href={`tel:+${profile.phoneRaw}`}
              className="hidden items-center gap-1.5 transition hover:text-text lg:flex"
            >
              <Phone className="h-3.5 w-3.5 text-accent" />
              {profile.phone}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 border-b backdrop-blur transition-colors ${
          scrolled ? "border-border bg-bg/90" : "border-transparent bg-bg/70"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-6 sm:px-10 lg:px-12 box-content">
          <Link href="/" aria-label={`${profile.name} home`}>
            {logo}
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {LINKS.map(({ id, label }) =>
              id === "services" ? (
                <div key={id} ref={servicesRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={servicesOpen}
                    aria-controls="services-menu"
                    onClick={() => setServicesOpen((o) => !o)}
                    className={`flex items-center gap-1 ${linkClass(id)}`}
                  >
                    {label}
                    <ChevronDown
                      className={`h-4 w-4 transition ${servicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {servicesOpen && (
                    <div
                      id="services-menu"
                      className="absolute left-1/2 top-full mt-3 w-[22rem] -translate-x-1/2 rounded-2xl border border-border bg-bg-card p-2 shadow-2xl shadow-black/40"
                    >
                      {SERVICE_PAGES.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          onClick={() => setServicesOpen(false)}
                          className="block rounded-xl px-4 py-3 transition hover:bg-bg-elevated"
                        >
                          <span className="block text-sm font-semibold">
                            {s.service === "Canada"
                              ? "Serving all of Canada"
                              : s.service}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                            {s.title}
                          </span>
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={() => setServicesOpen(false)}
                        className="mt-1 flex items-center justify-between rounded-xl border-t border-border px-4 py-3 text-sm font-semibold text-accent"
                      >
                        All services <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={id}
                  href={href(id)}
                  aria-current={active === id ? "location" : undefined}
                  className={linkClass(id)}
                >
                  {label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={href("contact")}
              className="hidden items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent xl:inline-flex"
            >
              Get a quote
            </a>
            <BookButton
              bookingUrl={profile.bookingUrl}
              className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim sm:inline-flex"
            >
              Book appointment
            </BookButton>
            <BookButton
              bookingUrl={profile.bookingUrl}
              icon={false}
              className="flex h-10 items-center rounded-lg bg-accent px-3 text-sm font-semibold text-[#06150d] sm:hidden"
            >
              Book
            </BookButton>
            <button
              ref={toggleRef}
              type="button"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-accent lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <dialog
        ref={menuRef}
        id="mobile-navigation"
        aria-label="Site navigation"
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg p-6 text-text backdrop:bg-black/70"
        onCancel={() => setMenuOpen(false)}
        onClose={() => {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }}
      >
        <div className="flex items-center justify-between">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            {logo}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Mobile navigation" className="mt-10 flex flex-col">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={href(id)}
              onClick={() => setMenuOpen(false)}
              className={`border-b border-border py-4 font-display text-2xl font-semibold ${
                active === id ? "text-accent" : "text-text"
              }`}
            >
              {label}
            </a>
          ))}
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Services
          </p>
          <div className="mt-3 grid gap-2">
            {SERVICE_PAGES.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                onClick={() => setMenuOpen(false)}
                className="text-base text-muted transition hover:text-accent"
              >
                {s.service === "Canada" ? "Serving all of Canada" : s.service}
              </Link>
            ))}
          </div>
          <BookButton
            bookingUrl={profile.bookingUrl}
            onClick={() => setMenuOpen(false)}
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-[#06150d]"
          />
          <a
            href={href("contact")}
            onClick={() => setMenuOpen(false)}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 font-semibold"
          >
            Get a quote <ArrowUpRight className="h-4 w-4" />
          </a>
          <div className="mt-8 flex items-center gap-3">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-muted"
              >
                <SocialIcon name={s.icon} className="h-5 w-5" />
              </a>
            ))}
            <span className="ml-auto flex items-center gap-2 text-xs text-muted">
              <MapleLeaf className="h-3.5 w-3.5 text-[#ef4444]" /> Proudly
              Canadian
            </span>
          </div>
        </nav>
      </dialog>
    </>
  );
}
