import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getPortfolio, getSettings } from "@/lib/data";
import { withSlugs } from "@/lib/slug";
import { getSiteUrl } from "@/lib/site-url";
import PageShell from "@/components/PageShell";
import { PROJECT_PRESENTATION } from "@/content/projects";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { BRAND_NAME } from "@/content/site";

export const revalidate = 300;

async function findProject(slug: string) {
  const portfolio = await getPortfolio();
  const entries = withSlugs(portfolio, (p) => p.title);
  const match = entries.find((e) => e.slug === slug);
  return match ? { project: match.item, all: entries } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await findProject(slug);
  if (!found) return { title: "Project not found" };
  const { project } = found;
  const kind = project.category === "App Development" ? "app" : "website";
  return pageMetadata({
    title: `${project.title} — ${kind} built by ${BRAND_NAME}`,
    description: PROJECT_PRESENTATION[slug]?.summary ?? project.description,
    path: `/work/${slug}`,
    image: project.image || undefined,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await findProject(slug);
  if (!found) notFound();
  const { project, all } = found;
  const { profile } = await getSettings();
  const site = getSiteUrl();
  const isApp = project.category === "App Development";
  const presentation = PROJECT_PRESENTATION[slug];

  const related = all
    .filter((e) => e.item.category === project.category && e.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${absoluteUrl(`/work/${slug}`)}#project`,
        name: project.title,
        description: project.description,
        url: absoluteUrl(`/work/${slug}`),
        image: project.image ? absoluteUrl(project.image) : undefined,
        about: project.link
          ? { "@type": "Thing", name: project.title, url: project.link }
          : undefined,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": absoluteUrl(`/work/${slug}`),
        },
        creator: {
          "@type": "Organization",
          "@id": `${site}#organization`,
          name: profile.name,
          url: absoluteUrl("/"),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${site}/work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: `${site}/work/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd value={jsonLd} />
      <PageShell
        eyebrow={project.category}
        title={project.title}
        intro={presentation?.summary}
        breadcrumb={{ href: "/work", label: "All work" }}
      >
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {presentation?.focus ?? project.category} · Design &amp; development
          </p>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim"
            >
              Explore live project <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
        {project.video ? (
          <video
            src={project.video}
            poster={project.image || undefined}
            controls
            playsInline
            className="max-h-[600px] w-full rounded-2xl border border-border bg-black"
          />
        ) : project.image ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            <Image
              src={project.image}
              alt={`${project.title} — ${isApp ? "application" : "website"} built by ${profile.name}`}
              width={1600}
              height={1000}
              className="h-[300px] w-full object-cover object-top sm:h-[480px]"
              priority
            />
            <a
              href={project.image}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border-t border-border px-5 py-3 text-xs text-muted transition hover:text-accent"
            >
              Open full project preview <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-xl font-semibold">The project</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted">
              {project.description}
            </p>
            {presentation && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold">
                  Inside the build
                </h2>
                <ul className="mt-4 space-y-3">
                  {presentation.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-muted"
                    >
                      <span className="text-accent" aria-hidden="true">
                        ↗
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-bg-card p-6">
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted">Type</dt>
                <dd className="mt-1 font-medium">{project.category}</dd>
              </div>
              <div>
                <dt className="text-muted">Built by</dt>
                <dd className="mt-1 font-medium">
                  {profile.name}, {profile.location}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Role</dt>
                <dd className="mt-1 font-medium">Design and development</dd>
              </div>
            </dl>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim"
              >
                Visit live site <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-xl font-semibold">
              More {project.category.toLowerCase()}
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              {related.map(({ item, slug: s }) => (
                <Link
                  key={s}
                  href={`/work/${s}`}
                  className="rounded-2xl border border-border bg-bg-card p-5 transition hover:border-accent/60"
                >
                  <h3 className="font-display text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageShell>
    </>
  );
}
