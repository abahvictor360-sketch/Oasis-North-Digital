import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { ReactNode } from "react";

/**
 * "Book an appointment" link. Opens the on-site /book page, or the studio's
 * own scheduler (Cal.com, Calendly…) when PROFILE.bookingUrl is set.
 */
export default function BookButton({
  bookingUrl,
  className,
  children = "Book an appointment",
  icon = true,
  onClick,
}: {
  bookingUrl?: string;
  className?: string;
  children?: ReactNode;
  icon?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      {icon && <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />}
      {children}
    </>
  );
  const url = bookingUrl?.trim();
  if (url && /^https?:\/\//.test(url)) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href="/book" onClick={onClick} className={className}>
      {content}
    </Link>
  );
}
