"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneShell } from "@/components/phone-nav";
import { restaurant, roleProfiles, type AuthRole } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn } from "@/lib/utils";

const roleHome = {
  owner: "/admin",
  staff: "/employee",
  kitchen: "/kitchen",
} as const;

export default function LoginPage() {
  const { enterAs, logout, state, ready } = useOps();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const restored = useRef(false);

  useEffect(() => {
    if (!ready || !state.session || restored.current) return;
    restored.current = true;
    let cancelled = false;
    (async () => {
      const role = state.session!.role;
      const ok = await enterAs(role);
      if (cancelled) return;
      if (ok) router.replace(roleHome[role]);
      else await logout();
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, state.session, enterAs, logout, router]);

  async function pickRole(role: AuthRole) {
    setBusy(true);
    setError("");
    const ok = await enterAs(role);
    setBusy(false);
    if (!ok) {
      setError("Could not start session — try again");
      return;
    }
    router.replace(roleHome[role]);
  }

  if (!ready) {
    return (
      <PhoneShell>
        <p className="flex flex-1 items-center justify-center text-sm opacity-60">
          Loading…
        </p>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell>
      <div className="flex min-h-[100svh] flex-col bg-[linear-gradient(180deg,#e8f2ea_0%,var(--garden-sand)_42%)] px-5 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))]">
        <header className="animate-rise pt-2">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
            Staff only · {restaurant.location}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[2.35rem] leading-none tracking-tight text-[var(--garden-deep)]">
            {restaurant.name}
          </h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-[var(--garden-ink)]/65">
            Cafe ops — tap your role to enter.
          </p>
        </header>

        <div className="animate-rise-delay-1 mt-auto flex flex-col gap-3 pb-4">
          {roleProfiles.map((r) => {
            const tone =
              r.role === "owner"
                ? "gold"
                : r.role === "staff"
                  ? "deep"
                  : "leaf";
            return (
              <button
                key={r.role}
                type="button"
                disabled={busy}
                onClick={() => pickRole(r.role)}
                className={cn(
                  "flex min-h-[5rem] flex-col justify-center rounded-2xl px-5 text-left active:scale-[0.99] disabled:opacity-60",
                  tone === "gold"
                    ? "bg-[var(--garden-gold)] text-[var(--garden-deep)]"
                    : tone === "deep"
                      ? "bg-[var(--garden-deep)] text-white"
                      : "bg-[var(--garden-leaf)] text-white",
                )}
              >
                <span className="text-xl font-semibold">
                  {r.role === "owner"
                    ? "Owner"
                    : r.role === "staff"
                      ? "Staff"
                      : "Kitchen"}
                </span>
                <span
                  className={
                    tone === "gold"
                      ? "mt-1 text-sm opacity-70"
                      : "mt-1 text-sm text-white/75"
                  }
                >
                  {r.displayName} · {r.hint}
                </span>
              </button>
            );
          })}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </div>

        <p className="pt-4 text-center text-[11px] text-[var(--garden-ink)]/40">
          Asia/Kathmandu · NPR · local demo
        </p>
      </div>
    </PhoneShell>
  );
}
