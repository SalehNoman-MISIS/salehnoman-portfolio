import siteData from "@/content/site.json";

/**
 * Global site metadata + contact info.
 * Edit via the /admin panel, or directly in content/site.json.
 */
export const site = siteData;

/** Anchor navigation (structural — not part of editable content). */
export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
] as const;
