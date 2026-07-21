import Image from "next/image";
import { site, navLinks } from "@/data/site";
import Icon from "./Icon";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--hairline)] bg-[var(--page)]">
      <div className="mx-auto w-full max-w-[1140px] px-5 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="/" className="flex items-center gap-2.5">
              <span className="block size-10 shrink-0">
                <Image src="/logo-mark-navy.png" alt="" width={40} height={40} className="logo-light size-10 object-contain" />
                <Image src="/logo-mark-white.png" alt="" width={40} height={40} className="logo-dark size-10 object-contain" />
              </span>
              <span className="text-sm font-bold text-[var(--navy)]">{site.name}</span>
            </a>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {site.role}. {site.valueProp}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a href={`mailto:${site.email}`} aria-label="Email" className="grid size-9 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] text-[var(--navy)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)]">
                <Icon name="mail" size={17} />
              </a>
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid size-9 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] text-[var(--navy)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)]">
                <Icon name="linkedin" size={17} />
              </a>
              <a href={site.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-9 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] text-[var(--navy)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)]">
                <Icon name="github" size={17} />
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
            {navLinks.map((l) => (
              <a key={l.href} href={`/${l.href}`} className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]">
                {l.label}
              </a>
            ))}
            <a href={site.resume.en} download className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]">Résumé (EN)</a>
            <a href={site.resume.ru} download className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]">Résumé (RU)</a>
          </nav>
        </div>

        <div className="mt-10 border-t border-[var(--hairline)] pt-6 text-xs text-[var(--muted)]">
          <p>© {year} {site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
