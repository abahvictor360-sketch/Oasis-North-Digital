# SEO and answer-engine audit

Audit date: 19 October 2026. Scope: public HTTP responses on `https://oasisorchardstack.com`, repository implementation, and the local production build. Search Console, Bing Webmaster Tools, analytics and field performance data were not available.

## Live baseline

- The non-www domain redirects to the established www domain. Public homepage, project and service pages respond with HTTP 200 and have canonical URLs.
- `robots.txt`, `sitemap.xml` and `llms.txt` respond successfully. Public content is crawlable under the wildcard robots rule.
- The admin login already has `noindex, nofollow`.
- CMS settings override some fallback titles and descriptions. Custom wording is preserved.
- The live CMS location field contains `Freelancer`, which is a work status. It appears in the machine-readable brief as a location even though the public biography identifies Lagos.

## Corrections in this change

| Area                        | Correction                                                                                                                                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical origin            | Use the established www production domain by default. Normalize explicit configured origins and avoid using preview hostnames automatically.                                                              |
| Search and social metadata  | Each public page supplies its canonical, Open Graph and Twitter title, description, URL and image fallback. Project descriptions use documented summaries where available and shorten at word boundaries. |
| Person and website identity | Link the homepage profile, website, services and project authorship through one stable Person identifier. Derive the description from visible biography text.                                             |
| Location                    | Refresh the specific invalid CMS value `Freelancer` to the known Lagos fallback. Preserve legitimate custom locations.                                                                                    |
| Project markup              | Describe portfolio case studies as creative work with internal URLs and creator attribution. Resolve local and remotely hosted image URLs correctly.                                                      |
| Visible-content consistency | The homepage work list describes the same six projects displayed initially. The work archive exposes the complete collection.                                                                             |
| Testimonials                | Preserve visible testimonials without emitting self-serving business review markup or implying review-star eligibility.                                                                                   |
| JSON-LD safety              | Escape `<` in serialized structured data so CMS strings cannot close a script element.                                                                                                                    |
| Sitemap accuracy            | Remove request-time modification dates for undated content. Omit an empty blog index; use known publication dates only where available.                                                                   |
| Empty blog                  | Keep an empty blog usable but set `noindex, follow` until articles exist.                                                                                                                                 |
| Machine-readable brief      | Mirror public biography, services, projects and FAQs. Derive missing article slugs consistently with article routes.                                                                                      |
| Content freshness           | Admin writes invalidate the public archive/detail pages, sitemap and brief as well as the homepage.                                                                                                       |

FAQ markup remains a description of visible answers, not a promise of search features. Google removed its FAQ rich-result feature in May 2026; there is no reason to invent FAQ ratings or change accurate answers to chase that feature.

## Verification

Completed checks: 20 automated tests passed, repository lint passed, and the production build passed. The local production audit passed for all 47 indexable pages and 40 social-image URLs, including canonical/social metadata, JSON-LD parsing, sitemap coverage, robots rules, empty-blog noindex and genuine 404 responses.

Automated tests cover metadata inheritance, canonical normalization, remote image URLs, snippet boundaries, script-safe JSON-LD, homepage graph/content agreement, sitemap timestamps, missing article slugs and CMS location handling. The production crawl checks public page status, canonical URLs, social metadata, JSON parsing, headings, image paths, sitemap contents and index controls. These checks do not establish rankings, actual Google index inclusion, Core Web Vitals or third-party rich-result approval.

## Account-side follow-through

1. Inspect the www homepage and representative service/project URLs in Google Search Console, then submit `https://oasisorchardstack.com/sitemap.xml` if it is not already submitted.
2. Inspect indexing exclusions and selected canonical URLs after recrawl. Review Bing Webmaster Tools similarly if used.
3. Measure real search impressions, enquiries and field performance before making claims about improvement. Add dated, client-approved project outcomes when available; avoid manufactured traffic or conversion results.

## References

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): ordinary SEO, useful accessible text and structured data that matches visible content remain the foundation. Special AI files or schema are not required.
- [Google: sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): modification dates should describe actual significant updates.
- [Google: profile-page structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page): identify the person who is the subject of a profile.
- [Google: review snippet guidance](https://developers.google.com/search/docs/appearance/structured-data/review-snippet): self-serving organization/business reviews are not eligible for review stars.
- [Google Search documentation updates](https://developers.google.com/search/updates): FAQ rich-result retirement and clarification that llms.txt is not required for Google Search.

`llms.txt` is supplementary and maintained for systems that choose to use it. It is not a substitute for indexable pages, accurate content, authority or search performance measurement.
