import { getSiteUrl } from "@/lib/site-url";
import { getSettings, getPortfolio, getServices, getPosts } from "@/lib/data";
import { slugify, withSlugs } from "@/lib/slug";
import { SERVICE_PAGES, FAQS } from "@/content/site";

export const revalidate = 300;

/**
 * /llms.txt — a plain-text brief for AI assistants and answer engines, in the
 * supplementary llms.txt convention. It mirrors public text and is not a
 * ranking signal or a replacement for normal indexing and page content.
 */
export async function GET() {
  const site = getSiteUrl();
  const [{ profile, about }, portfolio, services, posts] = await Promise.all([
    getSettings(),
    getPortfolio(),
    getServices(),
    getPosts(),
  ]);
  const entries = withSlugs(portfolio, (p) => p.title);

  const lines = [
    `# ${profile.name}`,
    "",
    `> ${profile.role} serving businesses and individuals across ${profile.location}. Founded by ${profile.founder}.`,
    "",
    `Contact: ${profile.email} · ${profile.phone} · ${site}`,
    "",
    "## About",
    about.body,
    "",
    "## Services",
    ...services.map((s) => `- **${s.title}**: ${s.description}`),
    "",
    "## Service pages",
    ...SERVICE_PAGES.map(
      (s) =>
        `- [${s.service}](${site}/services/${s.slug}): ${s.metaDescription}`,
    ),
    "",
    "## Work",
    ...entries.map(
      ({ item, slug }) =>
        `- [${item.title}](${site}/work/${slug}) — ${item.category}${item.link ? ` · live: ${item.link}` : ""}\n  ${item.description}`,
    ),
    "",
    ...(posts.length
      ? [
          "## Writing",
          ...posts.map(
            (p) =>
              `- [${p.title}](${site}/blog/${p.slug || slugify(p.title)}): ${p.excerpt}`,
          ),
          "",
        ]
      : []),
    "## Questions and answers",
    ...FAQS.map((f) => `### ${f.question}\n${f.answer}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
