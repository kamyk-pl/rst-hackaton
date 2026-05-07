"use server";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

export async function debugSession() {
  const store = await cookies();
  const allCookies = store.getAll().map(c => `${c.name}=${c.value.substring(0,20)}`).join(", ");
  const token = store.get("authjs.session-token")?.value;
  let decoded: Record<string, unknown> | null = null;
  if (token) {
    try {
      decoded = await decode({ token, secret: process.env.AUTH_SECRET!, salt: "authjs.session-token" }) as Record<string, unknown>;
    } catch (e: unknown) {
      decoded = { error: (e as Error).message };
    }
  }
  console.log("[DEBUG] cookies:", allCookies);
  console.log("[DEBUG] decoded:", JSON.stringify(decoded));
  return { cookies: allCookies, decoded };
}
