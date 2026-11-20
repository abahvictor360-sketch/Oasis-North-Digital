import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";
import { slugify } from "@/lib/slug";
import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, validPublishedDate } from "@/lib/seo";
import { BRAND_NAME } from "@/content/site";

export const revalidate = 300;

const BLOG_DESCRIPTION =
  "Practical writing on POS and inventory, school and clinic systems, online ordering, payments and business application development.";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts();
  return {
    ...pageMetadata({
      title: "Blog | Building the systems businesses run on",
      description: BLOG_DESCRIPTION,
      path: "/blog",
    }),
    robots: { index: posts.length > 0, follow: true },
  };
}

export default async function BlogIndex() {
  const posts = await getPosts();
  const site = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site}/blog`,
    name: `${BRAND_NAME} — Blog`,
    description: BLOG_DESCRIPTION,
    url: `${site}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: `${site}/blog/${p.slug || slugify(p.title)}`,
      datePublished: validPublishedDate(p.publishedAt),
      author: { "@type": "Organization", name: BRAND_NAME, url: site },
    })),
  };

  return (
    <>
      <JsonLd value={jsonLd} />
      <PageShell
        eyebrow="BLOG"
        title="Notes on building the systems businesses run on."
        intro="What we have learned shipping point-of-sale, school, clinic, ordering and booking systems: what to build, what to skip, what it costs, and the things that only show up once real users arrive."
      >
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
            No posts published yet.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {posts.map((post) => {
              const slug = post.slug || slugify(post.title);
              return (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition hover:border-accent/60"
                >
                  {post.cover && (
                    <div className="relative aspect-[16/9] bg-bg-elevated">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.publishedAt && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {post.publishedAt}
                      </span>
                    )}
                    <h2 className="mt-2 font-display text-lg font-semibold leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-accent">
                      Read →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </PageShell>
    </>
  );
}
