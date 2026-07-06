"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/data/site";
import Icon from "./Icon";

/**
 * No-backend consultation form. Replace FORMSPREE_ID with a real Formspree form
 * id (formspree.io) to receive submissions by email; otherwise it opens the
 * visitor's email client with the project brief pre-filled.
 */
const FORMSPREE_ID = "YOUR_FORM_ID";

const telegram = (site as { telegram?: string }).telegram;
const telegramUrl = (site.links as { telegram?: string }).telegram;
const calendly = (site as { calendly?: string }).calendly;

const methods = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
  telegram
    ? { icon: "send", label: "Telegram", value: `@${telegram}`, href: telegramUrl ?? `https://t.me/${telegram}`, external: true }
    : null,
  { icon: "linkedin", label: "LinkedIn", value: "in/salehnoman", href: site.links.linkedin, external: true },
  { icon: "map-pin", label: "Location", value: site.locationDetail, href: null, external: false },
].filter(Boolean) as { icon: string; label: string; value: string; href: string | null; external: boolean }[];

export default function Contact() {
  const [status, setStatus] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get("_gotcha") as string)?.length) return;
    const name = (data.get("name") as string) ?? "";
    const from = (data.get("email") as string) ?? "";
    const budget = (data.get("budget") as string) ?? "";
    const details = (data.get("details") as string) ?? "";

    if (FORMSPREE_ID === "YOUR_FORM_ID") {
      const subject = encodeURIComponent(`Project enquiry from ${name}`);
      const body = encodeURIComponent(
        `${details}\n\n${budget ? `Budget / timeline: ${budget}\n` : ""}— ${name} (${from})`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("Opening your email app… if nothing happens, email or Telegram me directly.");
      return;
    }

    setStatus("Sending…");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        setStatus("Thanks — I'll get back to you shortly!");
      } else {
        setStatus("Something went wrong. Please email or Telegram me directly.");
      }
    } catch {
      setStatus("Network error. Please email or Telegram me directly.");
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "var(--header-tint)" }}>
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-6 lg:px-8">
        <header className="mb-10 sm:mb-12" data-reveal>
          <p className="section-title flex items-center gap-2 text-xs sm:text-sm">
            <Icon name="calendar" size={16} className="text-[var(--accent)]" />
            <span>Work with me</span>
          </p>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-tight text-[var(--navy)] sm:text-3xl lg:text-4xl">
            Start a project or book a consultation
          </h2>
          <span className="mt-3 block h-0.5 w-12 rounded-full bg-[var(--accent)]" />
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
            Tell me a little about your project — scraping, lead generation, automation, or data/ML — and I&apos;ll reply with next steps and a quick plan. {site.openTo}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div className="space-y-3" data-reveal>
            {methods.map((m) =>
              m.href ? (
                <a
                  key={m.label}
                  href={m.href}
                  target={m.external ? "_blank" : undefined}
                  rel={m.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
                  style={{ boxShadow: "var(--shadow)" }}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--header-tint)] text-[var(--accent)]">
                    <Icon name={m.icon} size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{m.label}</span>
                    <span className="block truncate text-sm font-medium text-[var(--navy)]">{m.value}</span>
                  </span>
                  {m.external && <Icon name="arrow-up-right" size={16} className="ml-auto shrink-0 text-[var(--muted)] transition-colors group-hover:text-[var(--accent-strong)]" />}
                </a>
              ) : (
                <div key={m.label} className="flex items-center gap-4 rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-4 py-3.5" style={{ boxShadow: "var(--shadow)" }}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--header-tint)] text-[var(--accent)]">
                    <Icon name={m.icon} size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{m.label}</span>
                    <span className="block text-sm font-medium text-[var(--navy)]">{m.value}</span>
                  </span>
                </div>
              ),
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              {calendly ? (
                <a
                  href={calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                >
                  <Icon name="calendar" size={18} /> Book a call
                </a>
              ) : (
                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent("Consultation request")}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                >
                  <Icon name="calendar" size={18} /> Request a consultation
                </a>
              )}
              {telegram && (
                <a
                  href={telegramUrl ?? `https://t.me/${telegram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-5 py-3 text-sm font-semibold text-[var(--navy)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
                >
                  <Icon name="send" size={18} /> Telegram
                </a>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-5 sm:p-6" style={{ boxShadow: "var(--shadow)" }} data-reveal>
            <p className="mb-4 text-sm font-bold text-[var(--navy)]">Tell me about your project</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Name</span>
                <input type="text" name="name" required autoComplete="name" placeholder="Your name" className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Email</span>
                <input type="email" name="email" required autoComplete="email" placeholder="you@company.com" className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Budget / timeline <span className="font-normal text-[var(--muted)]">(optional)</span></span>
              <input type="text" name="budget" placeholder="e.g. $500–1k · within 2 weeks" className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Project details</span>
              <textarea name="details" required rows={5} placeholder="What do you need scraped / automated? Which sites, how much data, and what's the goal?" className="w-full resize-y rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
            </label>

            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <button
              type="submit"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] sm:w-auto"
            >
              <Icon name="send" size={18} /> Send project brief
            </button>
            <p role="status" aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">{status}</p>
          </form>
        </div>
      </div>
    </section>
  );
}
