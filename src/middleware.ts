import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Check for session cookies
  const hasSessionCookie =
    req.cookies.has("fit_planner_session") ||
    Array.from(req.cookies.getAll()).some(
      (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
    );
  const userRole = req.cookies.get("fit_planner_role")?.value;

  // 1. Guard athlete app routes (/app/*)
  if (pathname.startsWith("/app")) {
    if (!hasSessionCookie) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard admin portal routes (/admin/*)
  if (pathname.startsWith("/admin")) {
    if (!hasSessionCookie) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole && userRole !== "admin") {
      const redirectUrl = new URL("/app/today", req.url);
      redirectUrl.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"]
};
