"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
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
  // On the homepage, only show links whose section exists (some are conditional).
  const [links, setLinks] = useState<readonly { href: string; label: string }[]>(navLinks);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  useEffect(() => {
    setIsDark(currentTheme() === "dark");
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    // Drop nav links whose section isn't rendered (e.g. Reviews before any exist).
    setLinks(navLinks.filter((l) => document.getElementById(l.href.replace("#", ""))));
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
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
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 border-b backdrop-blur-md transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-[var(--hairline)] shadow-sm" : "border-transparent"
      }`}
      style={{ backgroundColor: "var(--nav-bg)" }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1140px] items-center justify-between gap-3 px-5 sm:px-6 lg:px-8">
        <motion.a
          href="/"
          className="group flex items-center gap-2.5"
          aria-label={`${site.name} — home`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            className="block size-10 shrink-0"
            whileHover={{ rotate: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Image src="/logo-mark-navy.png" alt="" width={40} height={40} priority className="logo-light size-10 object-contain" />
            <Image src="/logo-mark-white.png" alt="" width={40} height={40} priority className="logo-dark size-10 object-contain" />
          </motion.span>
          <span className="hidden text-sm font-bold text-[var(--navy)] sm:block">{site.name}</span>
        </motion.a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => {
            const on = active === l.href.replace("#", "");
            return (
              <a
                key={l.href}
                href={hrefFor(l.href)}
                className={`relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  on ? "text-[var(--accent-strong)]" : "text-[var(--muted)] hover:text-[var(--accent-strong)]"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-[var(--header-tint)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <motion.a
            href={site.resume.en}
            download
            className="hidden items-center gap-1.5 rounded-full bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm sm:inline-flex"
            whileHover={{ y: -2, boxShadow: "0 8px 20px rgb(31 95 166 / 0.35)" }}
            whileTap={{ scale: 0.96 }}
          >
            <Icon name="download" size={16} />
            <span className="hidden lg:inline">Résumé</span>
            <span className="lg:hidden">CV</span>
          </motion.a>
          <motion.button
            type="button"
            onClick={toggleTheme}
            className="grid size-9 place-items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] text-[var(--navy)]"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
            whileHover={{ rotate: 18, scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon name={isDark ? "sun" : "moon"} size={18} />
          </motion.button>
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

      {/* scroll-progress bar */}
      <motion.div
        className="scroll-progress absolute bottom-0 left-0 h-0.5 w-full origin-left"
        style={{ scaleX: progress, background: "linear-gradient(90deg, var(--bar-start), var(--accent))" }}
        aria-hidden="true"
      />

      {open && (
        <motion.nav
          aria-label="Mobile"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-[var(--hairline)] bg-[var(--page)] px-5 pb-4 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
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
        </motion.nav>
      )}
    </motion.header>
  );
}
