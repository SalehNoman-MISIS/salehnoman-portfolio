import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminConfigured, verifySession, SESSION_COOKIE } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const jar = await cookies();
  const authed = verifySession(jar.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ authed, configured: adminConfigured() });
}
