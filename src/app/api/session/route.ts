import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  isAuthRole,
  type AuthRole,
} from "@/lib/demo-data";

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
  res.cookies.set(SESSION_COOKIE, role, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
