"use client";

import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { PhoneNav, PhoneShell, type NavTab } from "@/components/phone-nav";
import { stockAlertLevel } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  queued: "New",
  preparing: "Cooking",
  ready: "Ready",
};

export default function KitchenPage() {
  return (
    <AuthGate allow={["kitchen", "owner"]}>
      <KitchenInner />
    </AuthGate>
  );
}

function KitchenInner() {
  const { state, bumpKitchenTicket, metrics, ready } = useOps();
  const [tab, setTab] = useState<"board" | "stock">("board");

  const active = useMemo(
    () => state.kitchenTickets.filter((t) => t.status !== "bumped"),
    [state.kitchenTickets],
  );

  const navTabs: NavTab[] = [
    {
      label: "Board",
      active: tab === "board",
      onClick: () => setTab("board"),
    },
    {
      label: "Stock",
      active: tab === "stock",
      onClick: () => setTab("stock"),
    },
    {
      label: "Alerts",
      active: false,
      onClick: () => setTab("stock"),
    },
    { label: "Out", logout: true },
  ];

  if (!ready) {
    return (
      <PhoneShell footer={<PhoneNav tabs={navTabs} />}>
        <p className="flex flex-1 items-center justify-center text-sm opacity-60">
          Loading…
        </p>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell footer={<PhoneNav tabs={navTabs} />}>
      <header className="sticky top-0 z-20 border-b border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
              Kitchen
            </p>
            <p className="text-xs text-[var(--garden-ink)]/50">
              {state.session?.displayName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {metrics.lowStock.length > 0 && (
              <button
                type="button"
                onClick={() => setTab("stock")}
                className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-950"
              >
                {metrics.lowStock.length} low
              </button>
            )}
            <p className="rounded-full bg-[var(--garden-fog)] px-3 py-1 text-xs font-semibold text-[var(--garden-deep)]">
              {active.length} open
            </p>
          </div>
        </div>
      </header>

      <div className="space-y-3 px-4 pb-24 pt-4">
        {tab === "board" &&
          (active.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-[var(--garden-ink)]/50 ring-1 ring-[var(--garden-leaf)]/10">
              Quiet pass — no plates waiting
            </p>
          ) : (
            active.map((ticket) => (
              <article
                key={ticket.id}
                className={cn(
                  "animate-rise rounded-2xl bg-white p-4 ring-1",
                  ticket.status === "ready"
                    ? "bg-emerald-50/40 ring-emerald-300/70"
                    : ticket.status === "queued"
                      ? "ring-[var(--garden-gold)]/50"
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
                      <span className="tabular-nums font-medium">
                        ×{line.qty}
                      </span>
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
          ))}

        {tab === "stock" && (
          <>
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              Stock & alerts
            </h1>
            {metrics.criticalStock.length > 0 && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
                Finishing soon:{" "}
                {metrics.criticalStock.map((s) => s.name).join(", ")}
              </p>
            )}
            {metrics.lowStock.length === 0 ? (
              <p className="rounded-2xl bg-emerald-50 px-4 py-4 text-sm text-emerald-950">
                All stock above thresholds
              </p>
            ) : null}
            {state.stock.map((row) => {
              const level = stockAlertLevel(row);
              return (
                <div
                  key={row.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 ring-1",
                    level === "critical"
                      ? "bg-red-50/50 ring-red-300"
                      : level === "low"
                        ? "bg-amber-50/40 ring-amber-300"
                        : "ring-[var(--garden-leaf)]/10",
                  )}
                >
                  <div>
                    <p className="font-medium text-[var(--garden-deep)]">
                      {row.name}
                    </p>
                    <p className="text-xs text-[var(--garden-ink)]/50">
                      Low at {row.lowAt} {row.unit}
                    </p>
                  </div>
                  <p className="text-lg font-semibold tabular-nums">
                    {row.qty}
                    <span className="ml-1 text-xs font-normal opacity-50">
                      {row.unit}
                    </span>
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </PhoneShell>
  );
}
