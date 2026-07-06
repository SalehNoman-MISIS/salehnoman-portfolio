"use client";

import { useEffect, useRef, useState } from "react";
import { topStrengths, skillGroups, languages } from "@/data/skills";
import Icon from "./Icon";

function SkillBars() {
  const ref = useRef<HTMLUListElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setRun(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className="space-y-4">
      {topStrengths.map((s, i) => (
        <li key={s.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-[var(--ink)]">{s.label}</span>
            <span className="text-xs font-semibold tabular-nums text-[var(--accent-strong)]">{s.value}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--header-tint)] ring-1 ring-inset ring-[var(--hairline)]">
            <div
              className="h-full rounded-full"
              style={{
                width: run ? `${s.value}%` : "0%",
                background: "linear-gradient(90deg, var(--bar-start), var(--bar-end))",
                transition: "width 1.1s cubic-bezier(0.16,1,0.3,1)",
                transitionDelay: `${i * 90}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-16 sm:py-20 lg:py-24" style={{ backgroundColor: "var(--header-tint)" }}>
      <div className="mx-auto w-full max-w-[1140px] px-5 sm:px-6 lg:px-8">
        <header className="mb-10 sm:mb-12" data-reveal>
          <p className="section-title flex items-center gap-2 text-xs sm:text-sm">
            <Icon name="chart" size={16} className="text-[var(--accent)]" />
            <span>Skills</span>
          </p>
          <h2 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-tight text-[var(--navy)] sm:text-3xl lg:text-4xl">
            A full-stack data toolkit — from scraper to model to UI
          </h2>
          <span className="mt-3 block h-0.5 w-12 rounded-full bg-[var(--accent)]" />
        </header>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div data-reveal>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">Top strengths</h3>
            <SkillBars />
          </div>

          <div className="space-y-8">
            <div data-reveal style={{ "--reveal-delay": "100ms" }}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">Toolbox</h3>
              <div className="space-y-5">
                {skillGroups.map((g) => (
                  <div key={g.name}>
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      <Icon name={g.icon} size={15} className="text-[var(--accent)]" />
                      {g.name}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li
                          key={item}
                          className="inline-flex items-center rounded-full border border-[var(--hairline)] bg-[var(--pill-bg)] px-2.5 py-1 text-xs font-medium text-[var(--accent-strong)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal style={{ "--reveal-delay": "160ms" }}>
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--navy)]">
                <Icon name="languages" size={16} className="text-[var(--accent)]" /> Languages
              </h3>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {languages.map((l) => (
                  <li key={l.name} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-[var(--ink)]">
                      <span className="font-medium">{l.name}</span>
                      <span className="text-[var(--muted)]"> · {l.level}</span>
                    </span>
                    <span className="flex shrink-0 gap-1" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`size-2 rounded-full ${i < l.dots ? "bg-[var(--accent)]" : "bg-[var(--hairline)]"}`}
                        />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
