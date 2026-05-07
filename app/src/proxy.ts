/**
 * Next.js Proxy (formerly Middleware) — role-based route protection.
 *
 * /patient/* → requires PATIENT role → unauthenticated or wrong role → /login
 * /doctor/*  → requires DOCTOR role  → unauthenticated or wrong role → /login
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/infrastructure/auth/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("medbridge-session")?.value;
  const session = token ? await decrypt(token) : null;

  if (pathname.startsWith("/patient")) {
    if (!session || session.role !== "PATIENT")
      return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (pathname.startsWith("/doctor")) {
    if (!session || session.role !== "DOCTOR")
      return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
