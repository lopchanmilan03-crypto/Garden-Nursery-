"use client";

import Link from "next/link";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { restaurant } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";

const roles = [
  {
    href: "/admin",
    label: "Admin",
    hint: "Menu, stock, staff, day close",
    role: "owner" as const,
    tone: "gold" as const,
  },
  {
    href: "/employee",
    label: "Employee",
    hint: "Take table orders & payments",
    role: "waiter" as const,
    tone: "deep" as const,
  },
  {
    href: "/kitchen",
    label: "Kitchen",
    hint: "Cook and mark plates ready",
    role: "kitchen" as const,
    tone: "leaf" as const,
  },
];

export default function HomePage() {
  const { setRole } = useOps();

  return (
    <PhoneShell footer={<PhoneNav />}>
      <div className="flex min-h-[100svh] flex-col bg-[linear-gradient(180deg,#e8f2ea_0%,var(--garden-sand)_45%)] px-5 pb-24 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <header className="pt-2">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
            Staff only · {restaurant.location}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[2.35rem] leading-none tracking-tight text-[var(--garden-deep)]">
            {restaurant.name}
          </h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-[var(--garden-ink)]/65">
            Phone tools for the patio cafe — pick your role.
          </p>
        </header>

        <div className="mt-auto flex flex-col gap-3 pb-4">
          {roles.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => setRole(r.role)}
              className={
                r.tone === "gold"
                  ? "flex min-h-[5rem] flex-col justify-center rounded-2xl bg-[var(--garden-gold)] px-5 text-[var(--garden-deep)] active:scale-[0.99]"
                  : r.tone === "deep"
                    ? "flex min-h-[5rem] flex-col justify-center rounded-2xl bg-[var(--garden-deep)] px-5 text-white active:scale-[0.99]"
                    : "flex min-h-[5rem] flex-col justify-center rounded-2xl bg-[var(--garden-leaf)] px-5 text-white active:scale-[0.99]"
              }
            >
              <span className="text-xl font-semibold">{r.label}</span>
              <span
                className={
                  r.tone === "gold"
                    ? "mt-1 text-sm opacity-70"
                    : "mt-1 text-sm text-white/75"
                }
              >
                {r.hint}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}
