import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getPosts, getSettings } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";
import { slugify } from "@/lib/slug";
import PostBody from "@/components/PostBody";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl, pageMetadata, validPublishedDate } from "@/lib/seo";
import { BRAND_NAME } from "@/content/site";

export const revalidate = 300;

async function findPost(slug: string) {
  const posts = await getPosts();
  const post = posts.find((p) => (p.slug || slugify(p.title)) === slug);
  return post ? { post, posts } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await findPost(slug);
  if (!found) return { title: "Post not found" };
  const { post } = found;
  return pageMetadata({
    title: `${post.title} | ${BRAND_NAME}`,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.cover,
    type: "article",
    publishedTime: validPublishedDate(post.publishedAt),
    tags: post.tags,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await findPost(slug);
  if (!found) notFound();
  const { post, posts } = found;
  const { profile } = await getSettings();
  const site = getSiteUrl();

  const more = posts
    .filter((p) => (p.slug || slugify(p.title)) !== slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        articleBody: post.body,
        url: `${site}/blog/${slug}`,
        image: absoluteUrl(post.cover || "/og.png"),
        datePublished: validPublishedDate(post.publishedAt),
        keywords: post.tags.join(", ") || undefined,
        author: {
          "@type": "Organization",
          "@id": `${site}#organization`,
          name: profile.name,
          url: site,
        },
        publisher: {
          "@type": "Organization",
          "@id": `${site}#organization`,
          name: profile.name,
          url: site,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": `${site}/blog/${slug}` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${site}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${site}/blog/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd value={jsonLd} />
      <SiteHeader profile={profile} />
      <main
        id="main-content"
        className="min-h-screen px-6 py-14 sm:px-10 lg:py-20"
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" /> All posts
            </Link>
          </div>

          {/* Editorial header: centred title block, author, date, hairline. */}
          <header className="mt-14 text-center">
            <p className="text-sm font-medium text-muted">{profile.name}</p>
            <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
              {post.title}
            </h1>
            {post.publishedAt && (
              <p className="mt-5 text-sm text-muted">{post.publishedAt}</p>
            )}
            <span className="mx-auto mt-8 block h-px w-16 bg-accent/50" />
          </header>

          <article className="mx-auto mt-12 max-w-[68ch]">
            <p className="text-lg leading-[1.8] text-text">{post.excerpt}</p>

            {post.cover && (
              <div className="my-12 overflow-hidden rounded-2xl border border-border bg-bg-elevated">
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={1600}
                  height={900}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            )}

            <div className="mt-10">
              <PostBody body={post.body} />
            </div>

            {post.tags.length > 0 && (
              <div className="mt-14 flex flex-wrap justify-center gap-2 border-t border-border pt-10">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>

          {more.length > 0 && (
            <div className="mt-20 border-t border-border pt-12">
              <h2 className="text-center font-display text-xl font-semibold">
                Keep reading
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {more.map((p) => {
                  const s = p.slug || slugify(p.title);
                  return (
                    <Link
                      key={s}
                      href={`/blog/${s}`}
                      className="rounded-2xl border border-border bg-bg-card p-5 transition hover:border-accent/60"
                    >
                      <h3 className="font-display text-base font-semibold leading-snug">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">
                        {p.excerpt}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-16 rounded-2xl border border-accent/20 bg-accent/5 p-8 text-center sm:p-10">
            <h2 className="font-display text-2xl font-bold">
              Have something like this to build?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Tell me what the system has to do and who uses it, and you get a
              fixed scope, a timeline and a price before anything starts.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#06150d] transition hover:bg-accent-dim"
            >
              Start a project
            </Link>
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
