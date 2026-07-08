"use client";

import { useRef, useState, type FormEvent } from "react";
import { site } from "@/data/site";
import Icon from "./Icon";

/**
 * Consultation booking. For fully-automatic delivery, paste a free access key
 * from https://web3forms.com into WEB3FORMS_KEY (or set a Calendly link in
 * site.json → calendly). With neither configured, the form still works: it
 * offers Email / Telegram / Copy so the request always reaches Saleh.
 */
const WEB3FORMS_KEY = "";

const telegram = (site as { telegram?: string }).telegram;
const telegramUrl = (site.links as { telegram?: string }).telegram ?? (telegram ? `https://t.me/${telegram}` : "");
const calendly = (site as { calendly?: string }).calendly;

const methods = [
  { icon: "mail", label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
  telegram ? { icon: "send", label: "Telegram", value: `@${telegram}`, href: telegramUrl, external: true } : null,
  { icon: "linkedin", label: "LinkedIn", value: "in/salehnoman", href: site.links.linkedin, external: true },
  { icon: "map-pin", label: "Location", value: site.locationDetail, href: null, external: false },
].filter(Boolean) as { icon: string; label: string; value: string; href: string | null; external: boolean }[];

type Sent = { name: string; text: string; auto: boolean };

export default function Contact() {
  const [status, setStatus] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  function focusForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => nameRef.current?.focus(), 450);
  }

  function buildText(f: { name: string; email: string; when: string; budget: string; details: string }) {
    return [
      "New consultation request",
      "",
      `Name: ${f.name}`,
      `Email: ${f.email}`,
      f.when ? `Preferred time: ${f.when}` : "",
      f.budget ? `Budget / timeline: ${f.budget}` : "",
      "",
      "Project details:",
      f.details,
    ]
      .filter((l) => l !== "")
      .join("\n");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get("_gotcha") as string)?.length) return;
    const f = {
      name: (data.get("name") as string) ?? "",
      email: (data.get("email") as string) ?? "",
      when: (data.get("when") as string) ?? "",
      budget: (data.get("budget") as string) ?? "",
      details: (data.get("details") as string) ?? "",
    };
    const text = buildText(f);

    if (WEB3FORMS_KEY) {
      setStatus("Sending…");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: `Consultation request from ${f.name}`,
            from_name: f.name,
            email: f.email,
            message: text,
          }),
        });
        if (res.ok) {
          form.reset();
          setStatus("");
          setSent({ name: f.name, text, auto: true });
        } else {
          setStatus("Couldn't send automatically — use Email or Telegram below.");
          setSent({ name: f.name, text, auto: false });
        }
      } catch {
        setStatus("Network issue — use Email or Telegram below.");
        setSent({ name: f.name, text, auto: false });
      }
      return;
    }

    // No auto-delivery configured: always-works multi-channel panel.
    setSent({ name: f.name, text, auto: false });
  }

  const mailtoHref = sent
    ? `mailto:${site.email}?subject=${encodeURIComponent("Consultation request")}&body=${encodeURIComponent(sent.text)}`
    : "#";

  async function copyRequest() {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(sent.text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
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
                <button
                  type="button"
                  onClick={focusForm}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]"
                >
                  <Icon name="calendar" size={18} /> Request a consultation
                </button>
              )}
              {telegram && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-5 py-3 text-sm font-semibold text-[var(--navy)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]"
                >
                  <Icon name="send" size={18} /> Telegram
                </a>
              )}
            </div>
          </div>

          {/* form / confirmation */}
          <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-5 sm:p-6" style={{ boxShadow: "var(--shadow)" }} data-reveal>
            {sent ? (
              <div>
                <div className="flex items-center gap-2 text-[var(--accent-strong)]">
                  <Icon name="check" size={20} />
                  <p className="text-base font-bold">
                    {sent.auto ? `Thanks, ${sent.name}! Your request is on its way.` : `Almost there, ${sent.name} — send your request:`}
                  </p>
                </div>
                {sent.auto ? (
                  <p className="mt-2 text-sm text-[var(--muted)]">I&apos;ll reply by email with next steps and a proposed time. You can also reach me directly below.</p>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">Pick a channel — your details are ready to go and will reach me either way.</p>
                )}

                {!sent.auto && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <a href={mailtoHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
                      <Icon name="mail" size={17} /> Email
                    </a>
                    {telegram && (
                      <a href={telegramUrl} target="_blank" rel="noopener noreferrer" onClick={copyRequest} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--navy)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                        <Icon name="send" size={17} /> Telegram
                      </a>
                    )}
                    <button type="button" onClick={copyRequest} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--navy)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                        <Icon name="check" size={17} /> {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}
                {!sent.auto && telegram && (
                  <p className="mt-2 text-xs text-[var(--muted)]">Telegram opens the chat and copies your details — just paste and send.</p>
                )}

                <pre className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-[var(--hairline)] bg-[var(--page)] p-3 text-xs text-[var(--muted)]">{sent.text}</pre>

                <button type="button" onClick={() => { setSent(null); setStatus(""); }} className="mt-3 text-sm font-semibold text-[var(--accent-strong)] hover:underline">
                  ← Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit}>
                <p className="mb-4 text-sm font-bold text-[var(--navy)]">Tell me about your project</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Name</span>
                    <input ref={nameRef} type="text" name="name" required autoComplete="name" placeholder="Your name" className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Email</span>
                    <input type="email" name="email" required autoComplete="email" placeholder="you@company.com" className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
                  </label>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Preferred date &amp; time <span className="font-normal text-[var(--muted)]">(optional)</span></span>
                    <input type="datetime-local" name="when" className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--accent)]" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Budget / timeline <span className="font-normal text-[var(--muted)]">(optional)</span></span>
                    <input type="text" name="budget" placeholder="e.g. $500–1k · within 2 weeks" className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Project details</span>
                  <textarea name="details" required rows={4} placeholder="What do you need scraped / automated? Which sites, how much data, and what's the goal?" className="w-full resize-y rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]" />
                </label>

                <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <button
                  type="submit"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] sm:w-auto"
                >
                  <Icon name="calendar" size={18} /> Request consultation
                </button>
                {status && <p role="status" aria-live="polite" className="mt-3 text-sm text-[var(--muted)]">{status}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
