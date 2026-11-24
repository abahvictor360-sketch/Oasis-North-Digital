/**
 * The canonical absolute URL of the deployed site.
 *
 * Resolution order: an explicit custom domain (NEXT_PUBLIC_SITE_URL) takes
 * priority; otherwise use the established production domain. Preview
 * deployment hostnames must not become canonical origins by accident.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "https:" || url.protocol === "http:")
        return url.origin;
    } catch {
      /* Use the production origin for malformed configuration. */
    }
  }
  return "https://oasisorchardstack.com";
}
