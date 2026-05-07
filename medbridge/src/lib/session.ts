"use server";

import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";

const SECRET = process.env.AUTH_SECRET!;
const COOKIE_NAME = "authjs.session-token";

export async function getSession(): Promise<{ id: string; role: string; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const decoded = await decode({ token, secret: SECRET, salt: COOKIE_NAME });
    if (!decoded?.id || !decoded?.role) return null;
    return {
      id: decoded.id as string,
      role: decoded.role as string,
      email: (decoded.email as string) ?? "",
    };
  } catch {
    return null;
  }
}
