import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminConfigured, checkPassword, createSession, SESSION_COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured. Set an ADMIN_PASSWORD environment variable (min 6 chars)." },
      { status: 503 },
    );
  }
  let password = "";
  try {
    password = (await req.json())?.password ?? "";
  } catch {
    // ignore
  }
  if (!checkPassword(password)) {
    // slow down brute-force attempts a little
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }
  const { value, maxAge } = createSession();
  const jar = await cookies();
  jar.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  return NextResponse.json({ ok: true });
}
