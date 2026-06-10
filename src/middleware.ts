import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE, isAdmin } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  // School dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!session || session.role !== "school") {
      const url = req.nextUrl.clone();
      url.pathname = "/school-login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Company dashboard
  if (pathname.startsWith("/company") && pathname !== "/company-login") {
    if (!session || session.role !== "company") {
      const url = req.nextUrl.clone();
      url.pathname = "/company-login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Study Centre dashboard
  if (pathname.startsWith("/centre") && pathname !== "/centre-login") {
    if (!session || session.role !== "centre") {
      const url = req.nextUrl.clone();
      url.pathname = "/centre-login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Individual account
  if (pathname.startsWith("/individual/account")) {
    if (!session || session.role !== "individual") {
      const url = req.nextUrl.clone();
      url.pathname = "/individual/login";
      return NextResponse.redirect(url);
    }
  }

  // Super admin
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session || !isAdmin(session.role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/individual/account/:path*", "/company/:path*", "/centre/:path*"],
};
