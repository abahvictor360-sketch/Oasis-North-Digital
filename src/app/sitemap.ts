import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getPortfolio, getPosts } from "@/lib/data";
import { withSlugs, slugify } from "@/lib/slug";
import { SERVICE_PAGES } from "@/content/site";
import { validPublishedDate } from "@/lib/seo";

export const revalidate = 300;

// Omit modification dates when no real content timestamp is available.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const [portfolio, posts] = await Promise.all([getPortfolio(), getPosts()]);

  return [
    { url: `${site}/` },
    { url: `${site}/services` },
    { url: `${site}/book` },
    ...SERVICE_PAGES.map((s) => ({
      url: `${site}/services/${s.slug}`,
    })),
    { url: `${site}/work` },
    ...withSlugs(portfolio, (p) => p.title).map(({ slug }) => ({
      url: `${site}/work/${slug}`,
    })),
    ...(posts.length ? [{ url: `${site}/blog` }] : []),
    ...posts.map((p) => ({
      url: `${site}/blog/${p.slug || slugify(p.title)}`,
      ...(validPublishedDate(p.publishedAt)
        ? { lastModified: p.publishedAt }
        : {}),
    })),
  ];
}
