/**
 * Infrastructure adapter: stateless JWT session management.
 *
 * encrypt/decrypt are pure crypto functions (testable without Next.js context).
 * createSession/getSession/deleteSession interact with Next.js cookies() and
 * must be called from Server Components, Server Actions, or Route Handlers.
 */
import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "@/domain/auth/types";

const SESSION_COOKIE = "medbridge-session";

let _secret: Uint8Array | undefined;
function getSecret(): Uint8Array {
  if (_secret) return _secret;
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET env var is required in production");
    }
    // Allow dev/test to run without the env var set in shell (it is in .env)
    _secret = new TextEncoder().encode("dev-secret-change-me-in-production");
  } else {
    _secret = new TextEncoder().encode(secret);
  }
  return _secret;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    const { userId, role, domainEntityId } = payload as Record<string, unknown>;
    if (
      typeof userId !== "string" ||
      (role !== "PATIENT" && role !== "DOCTOR") ||
      typeof domainEntityId !== "string"
    ) {
      return null;
    }
    return { userId, role, domainEntityId };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload): Promise<void> {
  // Dynamically imported to avoid importing next/headers in test environments.
  const { cookies } = await import("next/headers");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decrypt(token);
}

export async function deleteSession(): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
