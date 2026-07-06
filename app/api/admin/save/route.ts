import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";
import { saveContentFiles } from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Only these content files may be written.
const ALLOWED = new Set(["site", "about", "skills", "experience", "education", "projects", "more-projects"]);

export async function POST(req: Request) {
  const jar = await cookies();
  if (!verifySession(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let payload: { changes?: Record<string, unknown>; message?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const changes = payload.changes ?? {};
  const names = Object.keys(changes);
  if (names.length === 0) {
    return NextResponse.json({ error: "No changes to save." }, { status: 400 });
  }
  for (const n of names) {
    if (!ALLOWED.has(n)) {
      return NextResponse.json({ error: `Unknown content file: ${n}` }, { status: 400 });
    }
  }

  const files = names.map((name) => ({ name, json: changes[name] }));
  const message = payload.message?.trim() || "content: update via admin";

  try {
    const result = await saveContentFiles(files, message);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
