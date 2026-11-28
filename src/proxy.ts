import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  canAccessPath,
  isAuthRole,
} from "@/lib/demo-data";

/**
 * Soft gate: only redirect when a role cookie is present but not allowed.
 * Missing cookie lets the request through so client AuthGate + localStorage
 * session can complete role-tap navigation (avoids bounce-to-home bug).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  if (!raw) return NextResponse.next();
  if (!isAuthRole(raw)) return NextResponse.next();
  if (canAccessPath(raw, pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/employee",
    "/employee/:path*",
    "/cashier",
    "/cashier/:path*",
    "/kitchen",
    "/kitchen/:path*",
    "/order",
    "/order/:path*",
    "/staff",
    "/staff/:path*",
    "/menu",
    "/menu/:path*",
    "/demo",
    "/demo/:path*",
    "/table",
    "/table/:path*",
  ],
};
