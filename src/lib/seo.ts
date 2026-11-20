import type { Metadata } from "next";
import { getSiteUrl } from "./site-url";

export function absoluteUrl(path: string): string {
  return new URL(path, `${getSiteUrl()}/`).href;
}

export function excerpt(text: string, limit = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const clipped = clean.slice(0, limit - 1);
  const boundary = clipped.lastIndexOf(" ");
  return `${boundary > limit / 2 ? clipped.slice(0, boundary) : clipped}…`;
}

/** Each public page owns its social metadata, including image fallbacks. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/og.png",
  type = "website",
  publishedTime,
  tags,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  tags?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  const preview = { url: absoluteUrl(image || "/og.png"), alt: title };
  const summary = excerpt(description);
  return {
    title,
    description: summary,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: summary,
      url,
      siteName: "Oasis Orchard Stack",
      locale: "en_CA",
      type,
      images: [preview],
      ...(type === "article" ? { publishedTime, tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: summary,
      images: [preview],
    },
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function validPublishedDate(value: string): string | undefined {
  return /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) &&
    !Number.isNaN(Date.parse(value))
    ? value
    : undefined;
}
