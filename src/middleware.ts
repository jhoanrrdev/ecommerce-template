import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";

function readAdminSession(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-pathname", pathname);

  const adminEmail = process.env.ADMIN_EMAIL || "";
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || "";
  const isAuthenticated = !!adminEmail && readAdminSession(sessionCookie) === adminEmail;

  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/auth")) {
    if (pathname.startsWith("/admin/login") && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
