"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { useOps } from "@/lib/ops-store";
import type { AuthRole } from "@/lib/demo-data";

export function AuthGate({
  allow,
  children,
}: {
  allow: AuthRole[];
  children: React.ReactNode;
}) {
  const { state, ready } = useOps();
  const router = useRouter();
  const session = state.session;

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace("/");
      return;
    }
    if (session.role === "owner") return;
    if (!allow.includes(session.role)) {
      const home =
        session.role === "kitchen"
          ? "/kitchen"
          : session.role === "cashier"
            ? "/cashier"
            : session.role === "staff"
              ? "/employee"
              : "/admin";
      router.replace(home);
    }
  }, [ready, session, allow, router]);

  if (!ready || !session) {
    return (
      <PhoneShell footer={<PhoneNav />}>
        <p className="flex flex-1 items-center justify-center text-sm opacity-60">
          Loading…
        </p>
      </PhoneShell>
    );
  }

  if (session.role !== "owner" && !allow.includes(session.role)) {
    return (
      <PhoneShell footer={<PhoneNav />}>
        <p className="flex flex-1 items-center justify-center text-sm opacity-60">
          Redirecting…
        </p>
      </PhoneShell>
    );
  }

  return <>{children}</>;
}
