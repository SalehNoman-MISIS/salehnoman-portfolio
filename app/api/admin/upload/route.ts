import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/adminAuth";
import { saveBinaryFile } from "@/lib/github";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "image";
}

export async function POST(req: Request) {
  const jar = await cookies();
  if (!verifySession(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return NextResponse.json({ error: `Unsupported image type: ${file.type || "unknown"}.` }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 8 MB." }, { status: 413 });
  }

  // Destination folder — restricted to a couple of safe locations under public/.
  const folderRaw = String(form.get("folder") || "uploads");
  const folder = /^(uploads|screenshots\/[a-z0-9-]+)$/.test(folderRaw) ? folderRaw : "uploads";

  const base = slugify(file.name || "image");
  const filename = `${base}-${Date.now().toString(36)}.${ext}`;
  const publicPath = `/${folder}/${filename}`;
  const repoPath = `public/${folder}/${filename}`;

  const buf = Buffer.from(await file.arrayBuffer());
  try {
    const result = await saveBinaryFile(repoPath, buf.toString("base64"), `media: upload ${filename}`);
    return NextResponse.json({ ok: true, path: publicPath, mode: result.mode });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
