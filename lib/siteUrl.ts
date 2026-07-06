/**
 * Canonical site URL, used for metadataBase, sitemap, robots and JSON-LD.
 * On Vercel it resolves automatically; override with NEXT_PUBLIC_SITE_URL
 * (e.g. once you add a custom domain).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/$/, "");
