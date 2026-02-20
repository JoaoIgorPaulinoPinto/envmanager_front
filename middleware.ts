import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/projects", "/home"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get("env_auth")?.value === "1";
  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/home/:path*", "/projects/:path*"],
};
