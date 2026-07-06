import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectsByOrder, getProject } from "@/data/projects";
import { site } from "@/data/site";
import { siteUrl } from "@/lib/siteUrl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Icon from "@/components/Icon";

export function generateStaticParams() {
  return projectsByOrder.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const ogImage = `/screenshots/${project.slug}/${project.thumb}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      type: "article",
      images: [{ url: ogImage.endsWith(".svg") ? "/og-image.png" : ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      images: [ogImage.endsWith(".svg") ? "/og-image.png" : ogImage],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projectsByOrder.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? projectsByOrder[idx - 1] : null;
  const next = idx < projectsByOrder.length - 1 ? projectsByOrder[idx + 1] : null;

  const sections = [
    { label: "Problem", body: project.problem, icon: "target" },
    { label: "Approach", body: project.approach, icon: "code" },
    { label: "Results", body: project.results, icon: "chart" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    abstract: project.oneLiner,
    description: project.summary,
    keywords: project.tech.join(", "),
    author: { "@type": "Person", name: site.name, url: siteUrl },
    ...(project.links.github ? { codeRepository: project.links.github } : {}),
  };

  return (
    <>
      <Header />
      <main id="main">
        <div style={{ background: "linear-gradient(180deg, var(--header-tint) 0%, var(--page) 100%)" }}>
          <div className="mx-auto w-full max-w-[900px] px-5 pb-8 pt-8 sm:px-6 lg:px-8">
            <a href="/#projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--accent-strong)]">
              <Icon name="arrow-left" size={16} /> All projects
            </a>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[var(--accent)]/12 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--accent-strong)] ring-1 ring-inset ring-[var(--accent)]/25">
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)]">
                  <Icon name="sparkles" size={13} /> Featured
                </span>
              )}
              {project.year && <span className="text-xs text-[var(--muted)]">{project.year}</span>}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[var(--navy)] sm:text-4xl lg:text-[2.75rem]">
              {project.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--ink)]">{project.oneLiner}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.links.demo && (
                <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
                  <Icon name="external" size={16} /> Live demo
                </a>
              )}
              {project.links.github ? (
                <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-4 py-2 text-sm font-semibold text-[var(--navy)] transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                  <Icon name="github" size={16} /> View source
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-4 py-2 text-sm font-medium text-[var(--muted)]">
                  <Icon name="github" size={16} /> Private repository
                </span>
              )}
            </div>
          </div>
        </div>

        <article className="mx-auto w-full max-w-[900px] px-5 py-10 sm:px-6 lg:px-8">
          {project.metrics.length > 0 && (
            <dl className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4" data-reveal>
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-4 text-center">
                  <dt className="text-xl font-extrabold tracking-tight text-[var(--navy)] sm:text-2xl">{m.value}</dt>
                  <dd className="mt-1 text-[11px] leading-tight text-[var(--muted)]">{m.label}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mb-10" data-reveal>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">Tech stack</h2>
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li key={t} className="inline-flex items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-2.5 py-1 text-xs font-medium text-[var(--accent-strong)]">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.label} data-reveal>
                <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-[var(--navy)]">
                  <span className="grid size-8 place-items-center rounded-lg bg-[var(--header-tint)] text-[var(--accent)]">
                    <Icon name={s.icon} size={17} />
                  </span>
                  {s.label}
                </h2>
                <p className="text-base leading-relaxed text-[var(--ink)]">{s.body}</p>
              </section>
            ))}
          </div>

          {project.highlights.length > 0 && (
            <section className="mt-10" data-reveal>
              <h2 className="mb-4 text-lg font-bold text-[var(--navy)]">Notable engineering</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2.5 rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-4 text-sm leading-relaxed text-[var(--ink)]">
                    <Icon name="check" size={17} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.gallery.length > 0 && (
            <section className="mt-12" data-reveal>
              <h2 className="mb-2 text-lg font-bold text-[var(--navy)]">Screenshots &amp; diagrams</h2>
              <p className="mb-5 text-sm text-[var(--muted)]">
                {project.repoVisibility === "private"
                  ? "Real UI captures and figures — source is private and client brands are not shown."
                  : "Figures and outputs from the project."}
              </p>
              <Gallery slug={project.slug} items={project.gallery} />
            </section>
          )}

          {project.deepDive.length > 0 && (
            <section className="prose-body mt-12" data-reveal>
              <h2>Deep dive</h2>
              {project.deepDive.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code>$1</code>") }} />
              ))}
            </section>
          )}

          <nav className="mt-14 flex flex-col gap-3 border-t border-[var(--hairline)] pt-8 sm:flex-row sm:justify-between" aria-label="More projects">
            {prev ? (
              <a href={`/projects/${prev.slug}`} className="group flex flex-1 items-center gap-3 rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                <Icon name="arrow-left" size={18} className="shrink-0 text-[var(--accent)] transition-transform group-hover:-translate-x-1" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Previous</span>
                  <span className="block truncate text-sm font-bold text-[var(--navy)]">{prev.title}</span>
                </span>
              </a>
            ) : (
              <span className="hidden flex-1 sm:block" />
            )}
            {next && (
              <a href={`/projects/${next.slug}`} className="group flex flex-1 items-center justify-end gap-3 rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-4 text-right transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]">
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Next</span>
                  <span className="block truncate text-sm font-bold text-[var(--navy)]">{next.title}</span>
                </span>
                <Icon name="arrow-right" size={18} className="shrink-0 text-[var(--accent)] transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </nav>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
