"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { restaurant, type PayMethod } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

export default function StaffDeskPage() {
  const {
    state,
    bumpKitchenTicket,
    settleBill,
    payableTotal,
    ready,
  } = useOps();
  const [payFor, setPayFor] = useState<string | null>(null);
  const [method, setMethod] = useState<PayMethod>("cash");

  const openTickets = useMemo(
    () => state.kitchenTickets.filter((t) => t.status !== "bumped"),
    [state.kitchenTickets],
  );

  const openBills = useMemo(
    () =>
      state.orders.filter(
        (o) =>
          o.status !== "paid" &&
          o.status !== "cancelled",
      ),
    [state.orders],
  );

  if (!ready) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-[var(--garden-sand)] text-sm opacity-60">
        Loading desk…
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-[var(--garden-sand)]">
      <header className="sticky top-0 z-20 border-b border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <Link href="/" className="text-sm text-[var(--garden-leaf)]">
            ← Home
          </Link>
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-lg text-[var(--garden-deep)]">
              Staff desk
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
              {restaurant.name}
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-[var(--garden-ink)]/50 hover:text-[var(--garden-leaf)]"
          >
            Admin
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-6 md:px-8">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/order"
            className="flex min-h-14 items-center justify-center rounded-2xl bg-[var(--garden-deep)] px-4 text-center text-sm font-semibold text-white"
          >
            New order
          </Link>
          <div className="flex min-h-14 flex-col items-center justify-center rounded-2xl bg-white px-4 text-center ring-1 ring-[var(--garden-leaf)]/12">
            <p className="text-xs text-[var(--garden-ink)]/55">Open</p>
            <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              {openTickets.length}
            </p>
          </div>
        </div>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
            Kitchen
          </h2>
          <p className="mt-1 text-sm text-[var(--garden-ink)]/60">
            Mark ready, then serve.
          </p>
          <ul className="mt-4 space-y-3">
            {openTickets.length === 0 ? (
              <li className="rounded-2xl bg-white px-4 py-5 text-sm text-[var(--garden-ink)]/55 ring-1 ring-[var(--garden-leaf)]/10">
                No open orders.
              </li>
            ) : (
              openTickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/12"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                        {ticket.table ?? "Walk-in"}
                      </p>
                      <p className="mt-1 text-xs text-[var(--garden-ink)]/55">
                        {ticket.placedAt} · {ticket.guest}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--garden-fog)] px-2.5 py-1 text-xs font-medium capitalize text-[var(--garden-deep)]">
                      {ticket.status === "queued"
                        ? "New"
                        : ticket.status === "preparing"
                          ? "Cooking"
                          : "Ready"}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1 border-t border-[var(--garden-leaf)]/10 pt-3 text-sm">
                    {ticket.lines.map((line, i) => (
                      <li
                        key={`${line.menuItemId}-${i}`}
                        className="flex justify-between gap-2"
                      >
                        <span>{line.name}</span>
                        <span className="tabular-nums">×{line.qty}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ticket.status === "queued" && (
                      <Button
                        className="h-11 rounded-xl"
                        onClick={() =>
                          bumpKitchenTicket(ticket.id, "preparing")
                        }
                      >
                        Start
                      </Button>
                    )}
                    {ticket.status === "preparing" && (
                      <Button
                        className="h-11 rounded-xl"
                        onClick={() => bumpKitchenTicket(ticket.id, "ready")}
                      >
                        Mark ready
                      </Button>
                    )}
                    {ticket.status === "ready" && (
                      <Button
                        variant="secondary"
                        className="h-11 rounded-xl"
                        onClick={() => bumpKitchenTicket(ticket.id, "bumped")}
                      >
                        Served
                      </Button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
            Pay
          </h2>
          <p className="mt-1 text-sm text-[var(--garden-ink)]/60">
            Settle open bills.
          </p>
          <ul className="mt-4 space-y-3">
            {openBills.length === 0 ? (
              <li className="rounded-2xl bg-white px-4 py-5 text-sm text-[var(--garden-ink)]/55 ring-1 ring-[var(--garden-leaf)]/10">
                No open bills.
              </li>
            ) : (
              openBills.map((order) => {
                const due = payableTotal(order);
                const open = payFor === order.id;
                return (
                  <li
                    key={order.id}
                    className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/12"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-[var(--garden-deep)]">
                          {order.table ?? "Walk-in"} · {order.guest}
                        </p>
                        <p className="mt-1 text-xs text-[var(--garden-ink)]/55">
                          {order.id} · {order.status}
                        </p>
                      </div>
                      <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                        {formatNpr(due)}
                      </p>
                    </div>
                    {!open ? (
                      <Button
                        className="mt-3 h-11 rounded-xl"
                        onClick={() => setPayFor(order.id)}
                      >
                        Take payment
                      </Button>
                    ) : (
                      <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {(["cash", "upi", "card"] as PayMethod[]).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMethod(m)}
                              className={cn(
                                "min-h-11 rounded-xl text-sm font-medium capitalize",
                                method === m
                                  ? "bg-[var(--garden-deep)] text-white"
                                  : "bg-[var(--garden-fog)] text-[var(--garden-deep)]",
                              )}
                            >
                              {m === "upi" ? "UPI" : m}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            className="h-11 rounded-xl"
                            onClick={() => {
                              settleBill(order.id, method, 0);
                              setPayFor(null);
                            }}
                          >
                            Confirm {formatNpr(due)}
                          </Button>
                          <Button
                            variant="outline"
                            className="h-11 rounded-xl"
                            onClick={() => setPayFor(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </section>

        <p className="pb-8 text-center text-xs text-[var(--garden-ink)]/45">
          Deep tools (stock, recipes, monthly, CMS) live in{" "}
          <Link href="/admin" className="underline underline-offset-2">
            Admin
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
