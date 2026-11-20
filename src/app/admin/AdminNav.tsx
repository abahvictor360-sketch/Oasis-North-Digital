"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type AdminLink = { href: string; label: string; badge?: number };

/**
 * Horizontal admin navigation. Primary links sit in the bar; rarely edited
 * collections live under "More". On small screens the bar scrolls sideways.
 */
export default function AdminNav({
  primary,
  more,
}: {
  primary: AdminLink[];
  more: AdminLink[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const tab = (active: boolean) =>
    `relative flex shrink-0 items-center gap-2 whitespace-nowrap px-3 py-3.5 text-sm transition ${
      active
        ? "font-semibold text-text after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-accent"
        : "text-muted hover:text-text"
    }`;

  const moreActive = more.some((m) => isActive(m.href));

  return (
    <nav aria-label="Admin sections" className="-mb-px flex items-center">
      {/* Tabs scroll sideways on small screens; "More" stays outside the
          scroller so its menu is not clipped. */}
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
        {primary.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={isActive(n.href) ? "page" : undefined}
            className={tab(isActive(n.href))}
          >
            {n.label}
            {n.badge ? (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#06150d]">
                {n.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
      {more.length > 0 && (
        <div ref={moreRef} className="relative shrink-0">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className={tab(moreActive)}
          >
            More
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-border bg-bg-card p-1.5 shadow-2xl shadow-black/40 lg:right-auto lg:left-0">
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                Founder profile
              </p>
              {more.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm transition hover:bg-bg-elevated ${
                    isActive(m.href) ? "text-accent" : "text-text"
                  }`}
                >
                  {m.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
