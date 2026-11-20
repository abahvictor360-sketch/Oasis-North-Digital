import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(path, imports = {}, globals = {}) {
  const context = {
    exports: {},
    URL,
    Response,
    process: { env: {} },
    require: (id) => {
      if (!(id in imports)) throw new Error(`Unexpected import: ${id}`);
      return imports[id];
    },
    ...globals,
  };
  vm.runInNewContext(
    ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    context,
  );
  return context.exports;
}

const site = load("../src/lib/site-url.ts");
const seo = load("../src/lib/seo.ts", { "./site-url": site });
const content = load("../src/content/site.ts");
const projects = load("../src/content/projects.ts");
const slug = load("../src/lib/slug.ts");
const portfolio = load("../src/lib/portfolio.ts", {
  "@/content/projects": projects,
  "./slug": slug,
});

test("canonical origin is normalized and never follows an automatic preview hostname", () => {
  const configured = (env) =>
    load("../src/lib/site-url.ts", {}, { process: { env } }).getSiteUrl();
  assert.equal(
    configured({
      NEXT_PUBLIC_SITE_URL: "https://www.victorabah.com/path/?x=1",
    }),
    "https://www.victorabah.com",
  );
  assert.equal(
    configured({ VERCEL_PROJECT_PRODUCTION_URL: "preview.vercel.app" }),
    "https://www.victorabah.com",
  );
  assert.equal(
    configured({ NEXT_PUBLIC_SITE_URL: "invalid" }),
    "https://www.victorabah.com",
  );
  assert.equal(
    configured({ NEXT_PUBLIC_SITE_URL: "javascript:alert(1)" }),
    "https://www.victorabah.com",
  );
});

test("inner pages get their own canonical, Open Graph and Twitter values with image fallback", () => {
  const metadata = seo.pageMetadata({
    title: "A project",
    description: "A useful project description.",
    path: "/work/example",
  });
  assert.equal(
    metadata.alternates.canonical,
    "https://www.victorabah.com/work/example",
  );
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.twitter.title, metadata.title);
  assert.equal(
    metadata.twitter.images[0].url,
    "https://www.victorabah.com/og.png",
  );
  const remote =
    "https://example.supabase.co/storage/v1/object/public/media/preview.webp";
  assert.equal(seo.absoluteUrl(remote), remote);
  assert.equal(
    seo.pageMetadata({
      title: "Remote",
      description: "Preview",
      path: "/work/remote",
      image: remote,
    }).openGraph.images[0].url,
    remote,
  );
});

test("snippets respect word boundaries and structured data cannot close its script tag", () => {
  const original = "Useful project details ".repeat(20);
  const description = seo.excerpt(original);
  assert.ok(description.length <= 160);
  assert.ok(description.endsWith("…"));
  assert.ok(original.startsWith(`${description.slice(0, -1)} `));
  const source = { description: '</script><script>alert("x")</script>' };
  const json = seo.serializeJsonLd(source);
  assert.equal(json.includes("<"), false);
  assert.deepEqual(JSON.parse(json), source);
});

test("homepage entities match visible selected projects without self-review or app-store claims", () => {
  const { homeStructuredData } = load("../src/lib/structured-data.ts", {
    "@/content/site": content,
    "@/content/projects": projects,
    "./site-url": site,
    "./seo": seo,
    "./portfolio": portfolio,
  });
  const graph = homeStructuredData({
    profile: content.PROFILE,
    about: content.ABOUT,
    education: content.EDUCATION,
    services: content.SERVICES,
    skills: content.SKILLS,
    portfolio: content.PORTFOLIO,
    seo: content.SEO,
  })["@graph"];
  const org = graph.find((node) => node["@type"] === "ProfessionalService");
  assert.equal(org.name, content.PROFILE.name);
  assert.equal(org.areaServed.name, content.PROFILE.location);
  assert.equal(org.description, content.ABOUT.body);
  assert.equal(org.founder.name, content.PROFILE.founder);
  const home = graph.find((node) => node["@type"] === "WebPage");
  assert.equal(home.about["@id"], org["@id"]);
  const work = graph.find((node) => node["@type"] === "ItemList");
  const expected = portfolio
    .featuredPortfolioEntries(content.PORTFOLIO)
    .slice(0, 6);
  assert.equal(work.itemListElement.length, expected.length);
  work.itemListElement.forEach((entry, i) =>
    assert.equal(entry.item.url, seo.absoluteUrl(`/work/${expected[i].slug}`)),
  );
  assert.equal(
    graph.some((node) =>
      ["Review", "SoftwareApplication"].includes(node["@type"]),
    ),
    false,
  );
});

test("sitemap excludes empty blog and does not invent modification timestamps", async () => {
  const make = (posts) =>
    load("../src/app/sitemap.ts", {
      "@/lib/site-url": site,
      "@/lib/seo": seo,
      "@/lib/slug": slug,
      "@/content/site": content,
      "@/lib/data": {
        getPortfolio: async () => content.PORTFOLIO,
        getPosts: async () => posts,
      },
    }).default();
  const empty = await make([]);
  assert.equal(
    empty.some((entry) => entry.url.endsWith("/blog")),
    false,
  );
  assert.equal(
    empty.some((entry) => "lastModified" in entry),
    false,
  );
  const entries = await make([
    { title: "An example post", slug: "", publishedAt: "2026-10-01" },
    { title: "Another post", slug: "another-post", publishedAt: "not-a-date" },
  ]);
  assert.equal(
    entries.find((entry) => entry.url.endsWith("/blog/an-example-post"))
      .lastModified,
    "2026-10-01",
  );
  assert.equal(
    "lastModified" in
      entries.find((entry) => entry.url.endsWith("/blog/another-post")),
    false,
  );
});

test("llms.txt mirrors public biography and derives missing post slugs", async () => {
  const staleSummary = "This is not public biography copy";
  const data = {
    getSettings: async () => ({
      profile: content.PROFILE,
      about: content.ABOUT,
      seo: { ...content.SEO, aiSummary: staleSummary },
    }),
    getPortfolio: async () => content.PORTFOLIO,
    getServices: async () => content.SERVICES,
    getPosts: async () => [
      { title: "An example post", slug: "", excerpt: "Example" },
    ],
  };
  const { GET } = load("../src/app/llms.txt/route.ts", {
    "@/lib/site-url": site,
    "@/lib/slug": slug,
    "@/content/site": content,
    "@/lib/data": data,
  });
  const response = await GET();
  const text = await response.text();
  assert.match(response.headers.get("content-type"), /text\/plain/);
  assert.ok(text.includes(content.ABOUT.body));
  assert.ok(text.includes("https://www.victorabah.com/blog/an-example-post"));
  assert.equal(text.includes(staleSummary), false);
});
