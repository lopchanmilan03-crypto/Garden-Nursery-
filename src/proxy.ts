import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  canAccessPath,
  isAuthRole,
} from "@/lib/demo-data";

const protectedPrefixes = [
  "/admin",
  "/dashboard",
  "/employee",
  "/kitchen",
  "/order",
  "/staff",
  "/menu",
  "/demo",
  "/table",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = protectedPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!needsAuth) return NextResponse.next();

  const raw = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  if (!isAuthRole(raw) || !canAccessPath(raw, pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/employee/:path*",
    "/kitchen/:path*",
    "/order/:path*",
    "/staff/:path*",
    "/menu/:path*",
    "/demo/:path*",
    "/table/:path*",
  ],
};
