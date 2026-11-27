"use client";

import { useEffect, useMemo } from "react";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  queued: "New",
  preparing: "Cooking",
  ready: "Ready",
};

export default function KitchenPage() {
  const { state, setRole, bumpKitchenTicket, ready } = useOps();

  useEffect(() => {
    setRole("kitchen");
  }, [setRole]);

  const active = useMemo(
    () => state.kitchenTickets.filter((t) => t.status !== "bumped"),
    [state.kitchenTickets],
  );

  if (!ready) {
    return (
      <PhoneShell footer={<PhoneNav />}>
        <p className="flex flex-1 items-center justify-center text-sm opacity-60">
          Loading…
        </p>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell footer={<PhoneNav />}>
      <header className="sticky top-0 z-20 border-b border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
            Kitchen
          </p>
          <p className="rounded-full bg-[var(--garden-fog)] px-3 py-1 text-xs font-semibold text-[var(--garden-deep)]">
            {active.length} open
          </p>
        </div>
      </header>

      <div className="space-y-3 px-4 pb-24 pt-4">
        {active.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-[var(--garden-ink)]/50 ring-1 ring-[var(--garden-leaf)]/10">
            Quiet pass — no plates waiting
          </p>
        ) : (
          active.map((ticket) => (
            <article
              key={ticket.id}
              className={cn(
                "rounded-2xl bg-white p-4 ring-1",
                ticket.status === "ready"
                  ? "ring-emerald-300/70 bg-emerald-50/40"
                  : "ring-[var(--garden-leaf)]/10",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                    {ticket.table ?? "Walk-in"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--garden-ink)]/50">
                    {ticket.placedAt} · {ticket.waiter}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--garden-fog)] px-2.5 py-1 text-xs font-semibold">
                  {statusLabel[ticket.status] ?? ticket.status}
                </span>
              </div>
              <ul className="mt-3 space-y-1 border-t border-[var(--garden-leaf)]/10 pt-3 text-sm">
                {ticket.lines.map((line, i) => (
                  <li
                    key={`${line.menuItemId}-${i}`}
                    className="flex justify-between gap-2"
                  >
                    <span>{line.name}</span>
                    <span className="tabular-nums font-medium">×{line.qty}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[var(--garden-ink)]/45">
                {formatNpr(ticket.total)}
              </p>
              <button
                type="button"
                className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
                onClick={() => {
                  if (ticket.status === "queued")
                    bumpKitchenTicket(ticket.id, "preparing");
                  else if (ticket.status === "preparing")
                    bumpKitchenTicket(ticket.id, "ready");
                  else bumpKitchenTicket(ticket.id, "bumped");
                }}
              >
                {ticket.status === "queued"
                  ? "Start"
                  : ticket.status === "preparing"
                    ? "Mark ready"
                    : "Served"}
              </button>
            </article>
          ))
        )}
      </div>
    </PhoneShell>
  );
}
