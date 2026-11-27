"use client";

import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

const statusLabel: Record<string, string> = {
  queued: "New",
  preparing: "In progress",
  ready: "Ready",
};

export default function KitchenPage() {
  const { state, bumpKitchenTicket } = useOps();
  const active = state.kitchenTickets.filter((t) => t.status !== "bumped");
  const served = state.kitchenTickets
    .filter((t) => t.status === "bumped")
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[var(--garden-sand)] text-[var(--garden-ink)]">
      <SiteNav showRoles={false} />
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-2 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--garden-leaf)]">
              Kitchen pass · Asia/Kathmandu
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
              Dine-in orders
            </h1>
            <p className="mt-2 max-w-lg text-[var(--garden-ink)]/70">
              A quiet pass for patio tables — no rush board, just what needs
              plating next.
            </p>
          </div>
          <p className="rounded-md bg-white px-4 py-2 text-sm ring-1 ring-[var(--garden-leaf)]/15">
            Open · <strong>{active.length}</strong>
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {active.length === 0 ? (
            <p className="text-[var(--garden-ink)]/55 md:col-span-2">
              Nothing on the pass — send a table order from Floor.
            </p>
          ) : (
            active.map((ticket) => (
              <article
                key={ticket.id}
                className={cn(
                  "rounded-xl border bg-white/90 p-5",
                  ticket.status === "queued" &&
                    "border-[var(--garden-leaf)]/20",
                  ticket.status === "preparing" &&
                    "border-[var(--garden-moss)]/40",
                  ticket.status === "ready" &&
                    "border-emerald-300/60 bg-emerald-50/40",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--garden-leaf)]/80">
                      {ticket.id} · {ticket.placedAt}
                    </p>
                    <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
                      {ticket.table ?? "Counter"}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--garden-ink)]/65">
                      {ticket.guest} · {ticket.waiter}
                    </p>
                  </div>
                  <span className="rounded-md bg-[var(--garden-fog)] px-2.5 py-1 text-xs font-medium tracking-wide text-[var(--garden-deep)]">
                    {statusLabel[ticket.status] ?? ticket.status}
                  </span>
                </div>
                <ul className="mt-5 space-y-2 border-y border-[var(--garden-leaf)]/10 py-4">
                  {ticket.lines.map((line, i) => (
                    <li
                      key={`${line.menuItemId}-${i}`}
                      className="flex justify-between gap-3 text-lg text-[var(--garden-deep)]"
                    >
                      <span>{line.name}</span>
                      <span className="tabular-nums font-semibold">
                        ×{line.qty}
                      </span>
                    </li>
                  ))}
                </ul>
                {ticket.notes ? (
                  <p className="mt-3 text-sm text-[var(--garden-ink)]/75">
                    Note: {ticket.notes}
                  </p>
                ) : null}
                <p className="mt-3 text-sm opacity-60">
                  {formatNpr(ticket.total)}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {ticket.status === "queued" && (
                    <Button
                      variant="soft"
                      onClick={() => bumpKitchenTicket(ticket.id, "preparing")}
                    >
                      Start
                    </Button>
                  )}
                  {ticket.status === "preparing" && (
                    <Button
                      variant="soft"
                      onClick={() => bumpKitchenTicket(ticket.id, "ready")}
                    >
                      Ready for table
                    </Button>
                  )}
                  {ticket.status === "ready" && (
                    <Button
                      variant="secondary"
                      onClick={() => bumpKitchenTicket(ticket.id, "bumped")}
                    >
                      Served
                    </Button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {served.length > 0 && (
          <section className="mt-10">
            <h3 className="text-sm uppercase tracking-[0.2em] text-[var(--garden-leaf)]/70">
              Recently served
            </h3>
            <ul className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--garden-ink)]/55">
              {served.map((t) => (
                <li
                  key={t.id}
                  className="rounded-md border border-[var(--garden-leaf)]/12 bg-white px-3 py-1.5"
                >
                  {t.table ?? "Counter"} · {t.placedAt}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
