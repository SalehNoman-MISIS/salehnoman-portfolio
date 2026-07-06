"use client";

import { useEffect, useMemo, useState } from "react";
import JsonEditor from "./JsonEditor";
import siteJson from "@/content/site.json";
import aboutJson from "@/content/about.json";
import skillsJson from "@/content/skills.json";
import experienceJson from "@/content/experience.json";
import educationJson from "@/content/education.json";
import projectsJson from "@/content/projects.json";
import moreJson from "@/content/more-projects.json";
import servicesJson from "@/content/services.json";
import testimonialsJson from "@/content/testimonials.json";

type Content = Record<string, unknown>;
const SECTIONS: { id: string; label: string; seed: unknown }[] = [
  { id: "site", label: "Site & Contact", seed: siteJson },
  { id: "about", label: "About", seed: aboutJson },
  { id: "services", label: "Services", seed: servicesJson },
  { id: "skills", label: "Skills", seed: skillsJson },
  { id: "experience", label: "Experience", seed: experienceJson },
  { id: "projects", label: "Projects", seed: projectsJson },
  { id: "more-projects", label: "More builds", seed: moreJson },
  { id: "testimonials", label: "Reviews", seed: testimonialsJson },
  { id: "education", label: "Education", seed: educationJson },
];

type Status = "loading" | "unconfigured" | "login" | "ready";

export default function AdminApp() {
  const [status, setStatus] = useState<Status>("loading");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [busy, setBusy] = useState(false);

  const initial = useMemo<Content>(() => {
    const c: Content = {};
    for (const s of SECTIONS) c[s.id] = structuredClone(s.seed);
    return c;
  }, []);
  const [content, setContent] = useState<Content>(initial);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [active, setActive] = useState(SECTIONS[0].id);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => setStatus(!d.configured ? "unconfigured" : d.authed ? "ready" : "login"))
      .catch(() => setStatus("login"));
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setPassword("");
        setStatus("ready");
      } else {
        setAuthError((await res.json()).error || "Login failed.");
      }
    } catch {
      setAuthError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStatus("login");
  }

  function updateSection(id: string, next: unknown) {
    setContent((c) => ({ ...c, [id]: next }));
    setDirty((d) => new Set(d).add(id));
  }

  async function save() {
    if (dirty.size === 0) return;
    setBusy(true);
    setToast(null);
    const changes: Content = {};
    for (const id of dirty) changes[id] = content[id];
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changes, message: "content: update via admin panel" }),
      });
      const data = await res.json();
      if (res.ok) {
        setDirty(new Set());
        setToast({
          kind: "ok",
          msg:
            data.mode === "github"
              ? "Saved & committed to GitHub — the live site will redeploy in ~1 min."
              : "Saved to your local content files.",
        });
      } else {
        setToast({ kind: "err", msg: data.error || "Save failed." });
      }
    } catch {
      setToast({ kind: "err", msg: "Network error while saving." });
    } finally {
      setBusy(false);
    }
  }

  // ---- render states ----
  if (status === "loading") {
    return <Centered>Loading…</Centered>;
  }

  if (status === "unconfigured") {
    return (
      <Centered>
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold text-[var(--navy)]">Admin isn&apos;t configured yet</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Set an <code className="rounded bg-[var(--header-tint)] px-1 text-[var(--accent-strong)]">ADMIN_PASSWORD</code>{" "}
            environment variable (min 6 characters) in your Vercel project settings (and locally in{" "}
            <code className="rounded bg-[var(--header-tint)] px-1 text-[var(--accent-strong)]">.env.local</code>) to enable the editor.
          </p>
        </div>
      </Centered>
    );
  }

  if (status === "login") {
    return (
      <Centered>
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-6" style={{ boxShadow: "var(--shadow)" }}>
          <div className="mb-5 flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-[var(--accent)] text-sm font-extrabold text-white">SN</span>
            <div>
              <h1 className="text-base font-bold text-[var(--navy)]">Content admin</h1>
              <p className="text-xs text-[var(--muted)]">Private — sign in to edit</p>
            </div>
          </div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--accent)]"
            placeholder="••••••••"
          />
          {authError && <p className="mt-2 text-sm text-red-500">{authError}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="mt-4 w-full rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-strong)] disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </Centered>
    );
  }

  const activeSection = SECTIONS.find((s) => s.id === active)!;

  return (
    <div className="min-h-screen bg-[var(--page)]">
      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-[var(--hairline)] bg-[var(--nav-bg)] backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1100px] items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-[var(--accent)] text-xs font-extrabold text-white">SN</span>
            <span className="text-sm font-bold text-[var(--navy)]">Content admin</span>
            {dirty.size > 0 && (
              <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[11px] font-semibold text-[var(--accent-strong)]">
                {dirty.size} unsaved
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-[var(--hairline)] px-3 py-1.5 text-xs font-semibold text-[var(--navy)] transition-colors hover:border-[var(--accent)]">
              View site ↗
            </a>
            <button
              onClick={save}
              disabled={busy || dirty.size === 0}
              className="rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--accent-strong)] disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button onClick={logout} className="rounded-full border border-[var(--hairline)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent-strong)]">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className={`mx-auto mt-4 w-full max-w-[1100px] px-4`}>
          <div className={`rounded-lg border px-4 py-3 text-sm ${toast.kind === "ok" ? "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-300" : "border-red-500/40 bg-red-500/10 text-red-600"}`}>
            {toast.msg}
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 py-6 md:flex-row">
        {/* section nav */}
        <nav className="flex shrink-0 flex-row flex-wrap gap-1 md:w-52 md:flex-col">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                active === s.id ? "bg-[var(--header-tint)] text-[var(--accent-strong)]" : "text-[var(--muted)] hover:bg-[var(--header-tint)]/60 hover:text-[var(--ink)]"
              }`}
            >
              {s.label}
              {dirty.has(s.id) && <span className="ml-2 size-1.5 rounded-full bg-[var(--accent)]" aria-label="unsaved" />}
            </button>
          ))}
        </nav>

        {/* editor */}
        <main className="min-w-0 flex-1">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[var(--navy)]">{activeSection.label}</h2>
            <p className="text-xs text-[var(--muted)]">Edit the fields below. Changes are saved when you click “Save changes”.</p>
          </div>
          <JsonEditor value={content[active]} onChange={(v) => updateSection(active, v)} />
        </main>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center bg-[var(--page)] p-6">{children}</div>;
}
