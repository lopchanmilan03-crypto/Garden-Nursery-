"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneShell } from "@/components/phone-nav";
import { demoLogins, restaurant } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn } from "@/lib/utils";

const roleHome = {
  owner: "/admin",
  staff: "/employee",
  kitchen: "/kitchen",
} as const;

export default function LoginPage() {
  const { login, state, ready } = useOps();
  const router = useRouter();
  const [username, setUsername] = useState("owner");
  const [password, setPassword] = useState("owner");
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<"owner" | "staff" | "kitchen">("owner");

  useEffect(() => {
    if (!ready) return;
    if (state.session) {
      router.replace(roleHome[state.session.role]);
    }
  }, [ready, state.session, router]);

  function pickRole(role: "owner" | "staff" | "kitchen") {
    setPicked(role);
    setUsername(role);
    setPassword(role);
    setError("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      setError("Wrong login — try owner / staff / kitchen");
      return;
    }
    const sessionRole =
      demoLogins.find((d) => d.username === username.trim().toLowerCase())
        ?.role ?? picked;
    router.replace(roleHome[sessionRole]);
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
            Cafe ops — login to your role.
          </p>
        </header>

        <div className="animate-rise-delay-1 mt-8 grid grid-cols-3 gap-2">
          {(
            [
              { id: "owner", label: "Owner", tone: "gold" },
              { id: "staff", label: "Staff", tone: "deep" },
              { id: "kitchen", label: "Kitchen", tone: "leaf" },
            ] as const
          ).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => pickRole(r.id)}
              className={cn(
                "flex min-h-[4.25rem] flex-col items-center justify-center rounded-2xl text-sm font-semibold active:scale-[0.98]",
                picked === r.id
                  ? r.tone === "gold"
                    ? "bg-[var(--garden-gold)] text-[var(--garden-deep)] ring-2 ring-[var(--garden-deep)]/20"
                    : r.tone === "deep"
                      ? "bg-[var(--garden-deep)] text-white ring-2 ring-[var(--garden-gold)]/50"
                      : "bg-[var(--garden-leaf)] text-white ring-2 ring-[var(--garden-gold)]/40"
                  : "bg-white/80 text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/12",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={submit}
          className="animate-rise-delay-2 mt-6 space-y-3 rounded-3xl bg-white/90 p-4 ring-1 ring-[var(--garden-leaf)]/10"
        >
          <label className="block text-xs font-medium text-[var(--garden-leaf)]">
            Username
            <input
              className="mt-1 h-12 w-full rounded-xl border border-[var(--garden-leaf)]/15 bg-[var(--garden-sand)] px-3 text-base text-[var(--garden-deep)]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block text-xs font-medium text-[var(--garden-leaf)]">
            Password
            <input
              type="password"
              className="mt-1 h-12 w-full rounded-xl border border-[var(--garden-leaf)]/15 bg-[var(--garden-sand)] px-3 text-base text-[var(--garden-deep)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700">{error}</p>
          ) : (
            <p className="text-xs text-[var(--garden-ink)]/50">
              Demo: owner/owner · staff/staff · kitchen/kitchen
            </p>
          )}
          <button
            type="submit"
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white active:scale-[0.99]"
          >
            Enter
          </button>
        </form>

        <p className="mt-auto pt-8 text-center text-[11px] text-[var(--garden-ink)]/40">
          Asia/Kathmandu · NPR · local demo
        </p>
      </div>
    </PhoneShell>
  );
}
