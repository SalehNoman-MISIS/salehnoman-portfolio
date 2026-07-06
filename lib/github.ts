import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Persists edited content JSON. In production (GITHUB_TOKEN set) it commits the
 * files to the repo via the GitHub Contents API, which triggers a Vercel
 * redeploy. In local dev (no token) it writes to the working tree so you can
 * test the admin end-to-end.
 */
export type SaveResult = { mode: "github" | "local"; committed: string[]; url?: string };

const REPO = process.env.GITHUB_REPO || "SalehNoman-MISIS/salehnoman-portfolio";
const BRANCH = process.env.GITHUB_BRANCH || "main";

export async function saveContentFiles(
  files: { name: string; json: unknown }[],
  message: string,
): Promise<SaveResult> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    // Dev fallback — write straight to the local content/ directory.
    const committed: string[] = [];
    for (const f of files) {
      const rel = `content/${f.name}.json`;
      await fs.writeFile(path.join(process.cwd(), rel), JSON.stringify(f.json, null, 2) + "\n", "utf8");
      committed.push(rel);
    }
    return { mode: "local", committed };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sn-portfolio-admin",
  };
  const committed: string[] = [];

  for (const f of files) {
    const rel = `content/${f.name}.json`;
    const apiUrl = `https://api.github.com/repos/${REPO}/contents/${rel}`;

    // current sha (required to update an existing file)
    let sha: string | undefined;
    const cur = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers, cache: "no-store" });
    if (cur.ok) sha = (await cur.json()).sha;

    const body = {
      message: `${message} (${f.name})`,
      content: Buffer.from(JSON.stringify(f.json, null, 2) + "\n").toString("base64"),
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    };
    const res = await fetch(apiUrl, { method: "PUT", headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`GitHub save failed for ${rel}: ${res.status} ${detail.slice(0, 200)}`);
    }
    committed.push(rel);
  }

  return { mode: "github", committed, url: `https://github.com/${REPO}/commits/${BRANCH}` };
}

/**
 * Commit a binary file (e.g. an uploaded image) to `repoPath` (relative to the
 * repo root, e.g. "public/uploads/x.png"). Local-fs fallback in dev.
 */
export async function saveBinaryFile(
  repoPath: string,
  base64: string,
  message: string,
): Promise<{ mode: "github" | "local" }> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    const abs = path.join(process.cwd(), repoPath);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, Buffer.from(base64, "base64"));
    return { mode: "local" };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sn-portfolio-admin",
  };
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${repoPath}`;

  let sha: string | undefined;
  const cur = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers, cache: "no-store" });
  if (cur.ok) sha = (await cur.json()).sha;

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({ message, content: base64, branch: BRANCH, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub upload failed for ${repoPath}: ${res.status} ${detail.slice(0, 200)}`);
  }
  return { mode: "github" };
}
