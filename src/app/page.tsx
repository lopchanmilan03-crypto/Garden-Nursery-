"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneShell } from "@/components/phone-nav";
import { restaurant, roleProfiles, type AuthRole } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn } from "@/lib/utils";

const roleHome = {
  owner: "/admin",
  staff: "/employee",
  kitchen: "/kitchen",
  cashier: "/cashier",
} as const;

const tones: Record<
  AuthRole,
  "gold" | "deep" | "leaf" | "moss"
> = {
  owner: "gold",
  staff: "deep",
  kitchen: "leaf",
  cashier: "moss",
};

const labels: Record<AuthRole, string> = {
  owner: "Owner",
  staff: "Staff",
  kitchen: "Kitchen",
  cashier: "Cashier",
};

export default function LoginPage() {
  const { enterAs, state, ready } = useOps();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigating = useRef(false);

  useEffect(() => {
    if (!ready || !state.session || navigating.current) return;
    navigating.current = true;
    const href = roleHome[state.session.role];
    void enterAs(state.session.role).finally(() => {
      window.location.assign(href);
    });
  }, [ready, state.session, enterAs]);

  async function pickRole(role: AuthRole) {
    if (busy || navigating.current) return;
    setBusy(true);
    setError("");
    navigating.current = true;
    try {
      const ok = await enterAs(role);
      if (!ok) {
        navigating.current = false;
        setBusy(false);
        setError("Could not start session — try again");
        return;
      }
      window.location.assign(roleHome[role]);
    } catch {
      navigating.current = false;
      setBusy(false);
      setError("Could not start session — try again");
    }
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
            const tone = tones[r.role];
            return (
              <button
                key={r.role}
                type="button"
                disabled={busy}
                onClick={() => pickRole(r.role)}
                className={cn(
                  "flex min-h-[4.75rem] flex-col justify-center rounded-2xl px-5 text-left active:scale-[0.99] disabled:opacity-60",
                  tone === "gold"
                    ? "bg-[var(--garden-gold)] text-[var(--garden-deep)]"
                    : tone === "deep"
                      ? "bg-[var(--garden-deep)] text-white"
                      : tone === "leaf"
                        ? "bg-[var(--garden-leaf)] text-white"
                        : "bg-[var(--garden-moss)] text-white",
                )}
              >
                <span className="text-xl font-semibold">{labels[r.role]}</span>
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
