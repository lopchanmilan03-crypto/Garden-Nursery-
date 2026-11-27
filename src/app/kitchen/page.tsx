"use client";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

export default function KitchenPage() {
  const { state, bumpKitchenTicket } = useOps();
  const active = state.kitchenTickets.filter((t) => t.status !== "bumped");
  const bumped = state.kitchenTickets.filter((t) => t.status === "bumped").slice(0, 4);

  return (
    <main className="min-h-screen bg-[var(--garden-deep)] text-[var(--garden-mist)]">
      <SiteNav tone="dark" showRoles={false} />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-2 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--garden-fog)]/70">
              Live kitchen · Asia/Kathmandu
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white md:text-5xl">
              Ticket board
            </h1>
            <p className="mt-2 max-w-lg text-[var(--garden-mist)]/75">
              Waiter phone orders land here instantly (demo local sync). Large
              display friendly.
            </p>
          </div>
          <p className="rounded-md bg-white/10 px-4 py-2 text-sm">
            Open tickets: <strong>{active.length}</strong>
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {active.length === 0 ? (
            <p className="text-[var(--garden-fog)]/70 md:col-span-2">
              No active tickets — send one from Waiter.
            </p>
          ) : (
            active.map((ticket) => (
              <article
                key={ticket.id}
                className={cn(
                  "rounded-xl border p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.5)]",
                  ticket.status === "queued" &&
                    "border-amber-300/40 bg-[#1a3d2a]",
                  ticket.status === "preparing" &&
                    "border-[var(--garden-moss)]/50 bg-[#163528]",
                  ticket.status === "ready" &&
                    "border-emerald-300/50 bg-[#12402c]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--garden-fog)]/70">
                      {ticket.id} · {ticket.placedAt}
                    </p>
                    <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-white">
                      {ticket.table ?? "Takeaway"}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--garden-mist)]/70">
                      {ticket.guest} · Waiter {ticket.waiter}
                    </p>
                  </div>
                  <span className="rounded-md bg-black/25 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
                    {ticket.status}
                  </span>
                </div>
                <ul className="mt-5 space-y-2 border-y border-white/10 py-4">
                  {ticket.lines.map((line, i) => (
                    <li
                      key={`${line.menuItemId}-${i}`}
                      className="flex justify-between gap-3 text-lg"
                    >
                      <span>{line.name}</span>
                      <span className="tabular-nums font-semibold">×{line.qty}</span>
                    </li>
                  ))}
                </ul>
                {ticket.notes ? (
                  <p className="mt-3 text-sm text-amber-100/90">Note: {ticket.notes}</p>
                ) : null}
                <p className="mt-3 text-sm opacity-70">{formatNpr(ticket.total)}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {ticket.status === "queued" && (
                    <Button
                      variant="soft"
                      onClick={() => bumpKitchenTicket(ticket.id, "preparing")}
                    >
                      Start preparing
                    </Button>
                  )}
                  {ticket.status === "preparing" && (
                    <Button
                      variant="soft"
                      onClick={() => bumpKitchenTicket(ticket.id, "ready")}
                    >
                      Mark ready
                    </Button>
                  )}
                  {ticket.status === "ready" && (
                    <Button
                      variant="secondary"
                      onClick={() => bumpKitchenTicket(ticket.id, "bumped")}
                    >
                      Bump / served
                    </Button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {bumped.length > 0 && (
          <section className="mt-10">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--garden-fog)]/60">
              Recently bumped
            </h3>
            <ul className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--garden-mist)]/60">
              {bumped.map((t) => (
                <li key={t.id} className="rounded-md border border-white/10 px-3 py-1.5">
                  {t.table ?? "Takeaway"} · {t.placedAt}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
