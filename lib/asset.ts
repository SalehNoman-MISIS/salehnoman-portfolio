/**
 * Resolve a project image reference to a public URL.
 * Accepts either a bare filename (resolved under /screenshots/<slug>/) or an
 * absolute path (e.g. an uploaded "/uploads/…" image), used as-is.
 */
export function assetSrc(slug: string, file: string): string {
  if (!file) return "";
  return file.startsWith("/") ? file : `/screenshots/${slug}/${file}`;
}
