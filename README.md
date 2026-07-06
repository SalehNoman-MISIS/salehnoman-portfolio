# Saleh Noman — Portfolio

A fast, responsive, recruiter-friendly portfolio for **Saleh Noman** — Data
Scientist · Data & Automation Engineer. Built with **Next.js (App Router,
TypeScript)** and **Tailwind CSS v4**, deployed on **Vercel**.

- Single-page scroll (Hero · About · Skills · Experience · Projects · Education ·
  Contact) with a sticky nav, light/dark mode, and subtle motion.
- Dedicated case-study pages at `/projects/[slug]` with real UI screenshots,
  architecture diagrams, and problem / approach / results write-ups.
- SEO out of the box: metadata, Open Graph + Twitter cards, a generated OG image,
  JSON-LD `Person` + `CreativeWork` schema, `sitemap.xml`, `robots.txt`, and a
  full favicon set.

---

## Tech stack

| Area        | Choice |
|-------------|--------|
| Framework   | Next.js 16 (App Router, React 19, TypeScript) |
| Styling     | Tailwind CSS v4 |
| Fonts       | Inter (self-hosted via `@fontsource-variable/inter`) |
| Icons       | Inline lucide-style SVGs (no runtime dependency) |
| Images      | `next/image` (raster) + inline SVG diagrams |
| Deploy      | Vercel (zero-config) |

---

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build locally
npm run gen:assets   # regenerate diagrams, favicons, OG image, headshot placeholder
```

> Requires Node 18.18+ (Node 20+ recommended).

---

## Editing content

Two ways — a visual admin panel, or editing files directly.

### Option 1 — the `/admin` panel (recommended)

A password-protected GUI at **`/admin`** lets you edit **every section** (site,
about, skills, experience, education, projects, more builds) with forms — add /
remove / reorder list items, toggle flags, etc. For any image field (project
thumbnails, gallery shots, your headshot) you can **pick and upload a file
directly** — it's committed to the repo and wired into that field. Clicking
**Save** commits the change to your GitHub repo, which triggers a Vercel
redeploy — so the live site updates in about a minute. Only someone with your
admin password can edit; the page is `noindex`.

**Setup (once):** set these environment variables (see `.env.example`):

| Variable | Where | Purpose |
|----------|-------|---------|
| `ADMIN_PASSWORD` | Vercel + `.env.local` | Gate for `/admin` (min 6 chars). |
| `GITHUB_TOKEN` | Vercel only | Fine-grained token with **Contents: Read and write** on this repo, so Save can commit. |
| `GITHUB_REPO` | optional | `owner/repo` (defaults to this repo). |
| `SESSION_SECRET` | optional | Extra cookie-signing secret (derived from the password if unset). |

- **In Vercel:** Project → **Settings → Environment Variables** → add
  `ADMIN_PASSWORD` and `GITHUB_TOKEN` → redeploy.
- **Locally:** `cp .env.example .env.local`, set `ADMIN_PASSWORD`, run `npm run dev`,
  open `http://localhost:3000/admin`. With no `GITHUB_TOKEN` locally, Save writes
  straight to your `content/*.json` files instead of committing.

> Create the token at **GitHub → Settings → Developer settings → Fine-grained
> tokens** → Repository access: only `salehnoman-portfolio` → Permissions →
> Contents: Read and write.

### Option 2 — edit the content files

The content lives as JSON under [`content/`](content/) and is read through typed
modules in [`data/`](data/):

| File | What it controls |
|------|------------------|
| `data/site.ts` | Name, role, tagline, email, links, résumé paths, headshot |
| `data/about.ts` | About bio + highlight stat cards |
| `data/skills.ts` | Proficiency bars, skill groups, languages |
| `data/experience.ts` | Work-history timeline |
| `data/education.ts` | Education, certifications, honors |
| `data/projects.ts` | Project case studies + galleries |
| `data/more-projects.ts` | The compact "More builds" strip |

Project screenshots/diagrams live in [`assets/screenshots/<slug>/`](assets/screenshots)
(the editable source) and are mirrored to `public/screenshots/<slug>/` (served by
Next.js). After adding or changing images there, run `npm run gen:assets` to
re-mirror them, or copy them into `public/screenshots/<slug>/` manually.

### Add your headshot

Replace **`public/headshot.png`** with your own square photo (~600×600). No code
change needed — the hero picks it up automatically. (A placeholder avatar ships by
default.)

### Enable the contact form (optional)

The contact form works out of the box by opening the visitor's email client. To
receive submissions in your inbox instead, create a free form at
[formspree.io](https://formspree.io) and paste its form id into `FORMSPREE_ID` in
[`components/Contact.tsx`](components/Contact.tsx).

---

## Deploy to Vercel

This is a standard Next.js app — **no configuration needed**.

### 1. Push to a new public GitHub repo

```bash
# from this folder (git is already initialized with an initial commit)
gh repo create salehnoman-portfolio --public --source=. --remote=origin --push
# …or manually:
#   git remote add origin git@github.com:<you>/salehnoman-portfolio.git
#   git branch -M main
#   git push -u origin main
```

### 2. Import it in Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)** and sign in with GitHub.
2. Click **Import** next to your `salehnoman-portfolio` repo.
3. Vercel auto-detects **Next.js** — leave every setting at its default
   (Build Command `next build`, Output `.next`, Install `npm install`).
4. Click **Deploy**. In ~1 minute you get a live URL like
   `https://salehnoman-portfolio.vercel.app`.
5. **(For the `/admin` editor)** In **Settings → Environment Variables** add
   `ADMIN_PASSWORD` and `GITHUB_TOKEN` (see the [admin setup](#option-1--the-admin-panel-recommended)
   above), then redeploy.

Every push to `main` redeploys automatically; pull requests get preview URLs.

### 3. Add a custom domain (later)

1. In the Vercel project → **Settings → Domains**, add your domain
   (e.g. `salehnoman.dev`).
2. At your registrar, point DNS at Vercel:
   - Apex/root domain: an **A record** to `76.76.21.21`, **or** the
     `ALIAS/ANAME` record Vercel shows.
   - `www` (or any subdomain): a **CNAME** to `cname.vercel-dns.com`.
3. Vercel provisions HTTPS automatically once DNS resolves.
4. Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` in
   **Settings → Environment Variables** so canonical URLs, the sitemap, and OG
   tags use your domain. Redeploy.

> **Netlify / other hosts:** it also runs anywhere that supports Next.js.
> On Vercel no env vars are required — the site derives its URL automatically.

---

## Project structure

```
app/                 # App Router: layout, homepage, /projects/[slug], sitemap, robots
components/           # UI components (Header, Hero, Projects, Gallery, …)
data/                # All editable content (typed)
lib/                 # Small helpers (site URL)
public/              # Served assets: screenshots, resume PDFs, favicons, OG image, headshot
assets/screenshots/  # Editable source for screenshots + generated diagrams
scripts/             # gen:assets — diagrams, favicons, OG image, headshot
```

---

## Notes

- Private client projects are shown with **neutral display names**; no client
  brand names, codenames, or source are published here.
- Real UI screenshots were captured from the running apps with any client
  branding neutralized before capture.
