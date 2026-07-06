"use client";

import { useEffect, useState } from "react";
import { site, navLinks } from "@/data/site";
import Icon from "./Icon";

function currentTheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function Header({ onHome = false }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [isDark, setIsDark] = useState(false);

  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    setIsDark(currentTheme() === "dark");
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // active-section spy (homepage only)
  useEffect(() => {
    if (!onHome) return;
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, [onHome]);

  const toggleTheme = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setIsDark(next === "dark");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-[var(--hairline)] shadow-sm" : "border-transparent"
      }`}
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1140px] items-center justify-between gap-3 px-5 sm:px-6 lg:px-8">
        <a href="/" className="group flex items-center gap-2.5" aria-label={`${site.name} — home`}>
          <span className="grid size-9 place-items-center rounded-lg bg-[var(--accent)] text-sm font-extrabold tracking-tight text-white shadow-sm transition-transform group-hover:scale-105">
            {site.monogram}
          </span>
          <span className="hidden text-sm font-bold text-[var(--navy)] sm:block">{site.name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((l) => {
            const on = active === l.href.replace("#", "");
            return (
              <a
                key={l.href}
                href={hrefFor(l.href)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  on
                    ? "bg-[var(--header-tint)] text-[var(--accent-strong)]"
                    : "text-[var(--muted)] hover:text-[var(--accent-strong)]"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.resume.en}
            download
            className="hidden items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] sm:inline-flex"
          >
            <Icon name="download" size={16} />
            <span className="hidden lg:inline">Résumé</span>
            <span className="lg:hidden">CV</span>
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid size-9 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] text-[var(--navy)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <Icon name={isDark ? "sun" : "moon"} size={18} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] text-[var(--navy)] md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon name={open ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-[var(--hairline)] bg-[var(--page)] px-5 pb-4 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={hrefFor(l.href)}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--header-tint)] hover:text-[var(--accent-strong)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={site.resume.en}
                download
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-2 py-2.5 text-sm font-semibold text-white"
              >
                <Icon name="download" size={16} /> Download Résumé
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
