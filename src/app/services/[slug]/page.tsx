import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { SERVICE_PAGES, FAQS } from "@/content/site";
import { getPortfolio, getSettings } from "@/lib/data";
import { withSlugs } from "@/lib/slug";
import { getSiteUrl } from "@/lib/site-url";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = SERVICE_PAGES.find((s) => s.slug === slug);
  if (!page) return { title: "Service not found" };
  return pageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/services/${page.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SERVICE_PAGES.find((s) => s.slug === slug);
  if (!page) notFound();

  const [portfolio, { profile }] = await Promise.all([
    getPortfolio(),
    getSettings(),
  ]);
  const site = getSiteUrl();
  const proof = withSlugs(portfolio, (p) => p.title)
    .filter((e) => (page.category ? e.item.category === page.category : true))
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: page.service,
        description: page.metaDescription,
        serviceType: page.sells,
        url: `${site}/services/${page.slug}`,
        provider: {
          "@type": "Organization",
          "@id": `${site}#organization`,
          name: profile.name,
          url: site,
        },
        areaServed: { "@type": "Country", name: "Canada" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${site}/services`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.service,
            item: `${site}/services/${page.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd value={jsonLd} />
      <PageShell
        eyebrow={page.service}
        title={page.title}
        intro={page.intro}
        breadcrumb={{ href: "/services", label: "All services" }}
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Who it is for
            </h2>
            <ul className="mt-5 space-y-3">
              {page.sells.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">What you get</h2>
            <ul className="mt-5 space-y-3">
              {page.deliverables.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {proof.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-semibold">
              Work that proves it
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {proof.map(({ item, slug: s }) => (
                <Link
                  key={s}
                  href={`/work/${s}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-bg-card transition hover:border-accent/60"
                >
                  <div className="relative aspect-[4/3] bg-bg-elevated">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={`${item.title} — built by ${profile.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="font-display text-xl font-semibold">
            Common questions
          </h2>
          <div className="mt-5 space-y-3">
            {FAQS.slice(0, 4).map((f) => (
              <details
                key={f.question}
                className="rounded-2xl border border-border bg-bg-card p-5"
              >
                <summary className="cursor-pointer list-none font-medium">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
          <Link
            href="/#faq"
            className="mt-5 inline-block text-sm font-semibold text-accent"
          >
            All questions →
          </Link>
        </div>
      </PageShell>
    </>
  );
}
