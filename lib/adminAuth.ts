import "server-only";
import crypto from "node:crypto";

/**
 * Minimal, dependency-free admin auth: a single password (env ADMIN_PASSWORD)
 * gates a signed, http-only session cookie. No database, no third-party service.
 */
export const SESSION_COOKIE = "sn_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  // Prefer an explicit secret; otherwise derive one from the password so a
  // single env var is enough to get started.
  const s = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
  return crypto.createHash("sha256").update(`sn::${s}`).digest("hex");
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 6);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still do a comparison to keep timing roughly constant.
    crypto.timingSafeEqual(b, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

export function createSession(): { value: string; maxAge: number } {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(exp);
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return { value: `${Buffer.from(payload).toString("base64url")}.${sig}`, maxAge: MAX_AGE_SECONDS };
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const [p, sig] = token.split(".");
  if (!p || !sig) return false;
  let payload: string;
  try {
    payload = Buffer.from(p, "base64url").toString();
  } catch {
    return false;
  }
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}
