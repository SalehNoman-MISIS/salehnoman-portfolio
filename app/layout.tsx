import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/siteUrl";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Saleh Noman",
    "Data Scientist",
    "Data Engineer",
    "Machine Learning",
    "Web Scraping",
    "ETL",
    "Python",
    "AI-assisted development",
    "Moscow",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: "/",
    images: [{ url: "/og-image.png?v=3", width: 1200, height: 630, alt: `${site.name} — ${site.role}` }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.description,
    images: ["/og-image.png?v=3"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2e73b8",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Data Scientist · Data & Automation Engineer",
  description: site.description,
  email: `mailto:${site.email}`,
  url: siteUrl,
  image: `${siteUrl}/og-image.png`,
  address: { "@type": "PostalAddress", addressLocality: "Moscow", addressCountry: "RU" },
  alumniOf: [{ "@type": "CollegeOrUniversity", name: 'National University of Science and Technology "MISIS"' }],
  knowsLanguage: ["Arabic", "English", "Russian", "Japanese"],
  knowsAbout: ["Data Science", "Machine Learning", "Web Scraping", "ETL", "Data Engineering", "Python", "AI-Assisted Development"],
  sameAs: [site.links.linkedin, site.links.github],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        <Reveal />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
