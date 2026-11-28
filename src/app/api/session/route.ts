import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  isAuthRole,
  type AuthRole,
} from "@/lib/demo-data";

function setRoleCookie(res: NextResponse, role: string, maxAge: number) {
  const secure =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL === "1"
      ? true
      : false;
  res.cookies.set(SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    // Avoid Secure cookies on hosts that aren't clearly HTTPS production
    // (e.g. some preview/app runtimes) — missing cookie caused role-tap bounce.
    secure,
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const role =
    body && typeof body === "object" && "role" in body
      ? String((body as { role: unknown }).role)
      : "";
  if (!isAuthRole(role)) {
    return NextResponse.json({ error: "Unknown role" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, role: role as AuthRole });
  setRoleCookie(res, role, 60 * 60 * 12);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  setRoleCookie(res, "", 0);
  return res;
}
