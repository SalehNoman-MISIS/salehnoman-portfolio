import Image from "next/image";
import { site } from "@/data/site";
import Icon from "./Icon";
import InteractiveNeuralVortex from "./ui/interactive-neural-vortex-background";

const stats = [
  { value: "5.0/5.0", label: "GPA · Red Diploma" },
  { value: "100%", label: "Fortune-500 ATS detection" },
  { value: "8+", label: "Shipped projects" },
];

export default function Hero() {
  return (
    <section className="hero-band relative overflow-hidden">
      {/* interactive WebGL background — deep dark-blue on light theme, bright on dark */}
      <InteractiveNeuralVortex className="opacity-70" />

      {/* legibility overlays (theme-aware via var(--page)) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, var(--page) 0%, color-mix(in srgb, var(--page) 55%, transparent) 44%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
        style={{ background: "linear-gradient(to bottom, transparent, var(--page))" }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1140px] items-center gap-10 px-5 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-8 lg:pb-28 lg:pt-28">
        <div>
          <p
            className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)] backdrop-blur"
            data-reveal
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-[var(--accent)] opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
            </span>
            Open to Data Science, ML &amp; Automation roles — Moscow &amp; remote
          </p>

          <h1
            className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--navy)] sm:text-5xl lg:text-6xl"
            data-reveal
            style={{ "--reveal-delay": "60ms" }}
          >
            {site.name}
          </h1>

          <p
            className="mt-4 text-lg font-semibold text-[var(--accent-strong)] sm:text-xl"
            data-reveal
            style={{ "--reveal-delay": "120ms" }}
          >
            {site.role}
          </p>
          <p
            className="mt-1 text-sm font-medium text-[var(--muted)] sm:text-base"
            data-reveal
            style={{ "--reveal-delay": "150ms" }}
          >
            {site.tagline}
          </p>

          <p
            className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ink)] sm:text-lg"
            data-reveal
            style={{ "--reveal-delay": "200ms" }}
          >
            {site.valueProp}
          </p>

          <div
            className="mt-8 flex flex-wrap items-center gap-3"
            data-reveal
            style={{ "--reveal-delay": "260ms" }}
          >
            <a
              href="#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] sm:text-base"
            >
              View Projects <Icon name="arrow-right" size={18} />
            </a>
            <a
              href={site.resume.en}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--navy)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] sm:text-base"
            >
              <Icon name="download" size={18} /> Download Résumé
            </a>
          </div>

          <div
            className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]"
            data-reveal
            style={{ "--reveal-delay": "320ms" }}
          >
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--accent-strong)]">
              <Icon name="mail" size={17} /> Email
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--accent-strong)]">
              <Icon name="linkedin" size={17} /> LinkedIn
            </a>
            <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--accent-strong)]">
              <Icon name="github" size={17} /> GitHub
            </a>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="map-pin" size={17} /> {site.location}
            </span>
          </div>
        </div>

        {/* headshot + stats */}
        <div className="flex flex-col items-center" data-reveal style={{ "--reveal-delay": "220ms" }}>
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-full opacity-50 blur-2xl"
              style={{ background: "radial-gradient(circle, var(--bar-start), transparent 70%)" }}
              aria-hidden="true"
            />
            {/*
              HEADSHOT: replace /public/headshot.png with your own square photo
              (~600×600). No code change needed.
            */}
            <div className="relative size-44 overflow-hidden rounded-full border-4 border-[var(--page)] shadow-2xl ring-1 ring-[var(--hairline)] sm:size-52 lg:size-56">
              <Image src={site.headshot} alt={`${site.name} — headshot`} fill sizes="224px" priority className="object-cover" />
            </div>
            <span className="absolute bottom-2 right-2 grid size-11 place-items-center rounded-full border-4 border-[var(--page)] bg-gradient-to-br from-[var(--bar-start)] to-[var(--accent-strong)] text-xs font-extrabold text-white shadow-md">
              {site.monogram}
            </span>
          </div>

          <dl className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-3 text-center backdrop-blur" style={{ boxShadow: "var(--shadow)" }}>
                <dt className="text-lg font-extrabold text-[var(--navy)]">{s.value}</dt>
                <dd className="mt-0.5 text-[11px] leading-tight text-[var(--muted)]">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 flex w-full max-w-sm items-center gap-2 rounded-xl border border-[var(--hairline)] bg-[var(--card)] px-3 py-2.5 backdrop-blur" style={{ boxShadow: "var(--shadow)" }}>
            <Icon name="sparkles" size={18} className="shrink-0 text-[var(--accent)]" />
            <p className="text-xs font-medium text-[var(--ink)]">
              Builds production tools fast with AI coding assistants (Claude / GPT SDKs)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
