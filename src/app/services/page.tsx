import Link from "next/link";
import type { Metadata } from "next";
import { BRAND_NAME, SERVICE_PAGES } from "@/content/site";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = pageMetadata({
  title: `Services | Web development, apps & automation in Canada | ${BRAND_NAME}`,
  description:
    "Website development, custom app development, business automation and AI, and ongoing support & hosting for businesses and individuals across Canada.",
  path: "/services",
});

export default function ServicesIndex() {
  return (
    <PageShell
      eyebrow="SERVICES"
      title="What we build, and what you get."
      intro="Explore each service, who it is for and what a project can include, with examples from the portfolio."
    >
      <JsonLd
        value={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: absoluteUrl("/services"),
          name: `${BRAND_NAME} services`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: SERVICE_PAGES.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.service,
              url: absoluteUrl(`/services/${s.slug}`),
            })),
          },
        }}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {SERVICE_PAGES.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="rounded-2xl border border-border bg-bg-card p-6 transition hover:border-accent/60"
          >
            <h2 className="font-display text-xl font-semibold">{s.service}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{s.intro}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-accent">
              Read more →
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
