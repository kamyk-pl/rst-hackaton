import { NextRequest, NextResponse } from "next/server";
import { ROLE } from "@/lib/constants";

const PUBLIC_PATHS = ["/", "/login"];
const AUTH_COOKIE = "authjs.session-token";
const AUTH_COOKIE_SECURE = "__Secure-authjs.session-token";

function getSessionCookie(req: NextRequest): string | undefined {
  return (
    req.cookies.get(AUTH_COOKIE)?.value ??
    req.cookies.get(AUTH_COOKIE_SECURE)?.value
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionToken = getSessionCookie(req);
  const isLoggedIn = !!sessionToken;

  if (!isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
