import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const display = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

// Site-wide fallback metadata. The homepage (src/app/page.tsx) overrides
// title/description/OG/robots from the admin-editable SEO & AEO settings —
// these values only apply if that fetch fails or on non-homepage routes.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Oasis Orchard Stack | Web Development, Apps & Automation in Canada",
  description:
    "Oasis Orchard Stack is a Canadian studio building fast websites, custom web and mobile apps, and automation for businesses and individuals.",
  keywords: [
    "Oasis Orchard Stack",
    "web development Canada",
    "app development Canada",
    "business automation Canada",
    "AI automation for small business",
    "personal website Canada",
    "website support and hosting",
  ],
  authors: [{ name: "Oasis Orchard Stack" }],
  // llms.txt is supplementary; it is not an alternate representation of every page.
  openGraph: {
    title: "Oasis Orchard Stack | Web Development, Apps & Automation in Canada",
    description:
      "Websites, custom apps and automation for Canadian businesses and individuals, replacing the manual workflows and outdated sites that quietly cost them customers.",
    url: siteUrl,
    siteName: "Oasis Orchard Stack",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oasis Orchard Stack | Web Development, Apps & Automation in Canada",
    description:
      "Websites, custom apps and automation for Canadian businesses and individuals.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      data-scroll-behavior="smooth"
      lang="en-CA"
      className={`${display.variable} ${body.variable} antialiased`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
