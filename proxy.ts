import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthConfigError, SESSION_COOKIE, readSessionToken } from "@/lib/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login" || pathname === "/admin/login/";
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    if (isLogin) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const session = readSessionToken(token);
    if (!session && !isLogin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch (error) {
    if (error instanceof AuthConfigError) {
      return new NextResponse("Admin sign-in is not configured.", { status: 500 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
