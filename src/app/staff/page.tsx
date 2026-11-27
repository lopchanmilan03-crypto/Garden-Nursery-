"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { type PayMethod } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

type DeskTab = "kitchen" | "pay";

export default function StaffDeskPage() {
  const { state, bumpKitchenTicket, settleBill, payableTotal, ready } =
    useOps();
  const [tab, setTab] = useState<DeskTab>("kitchen");
  const [payFor, setPayFor] = useState<string | null>(null);
  const [method, setMethod] = useState<PayMethod>("cash");

  const openTickets = useMemo(
    () => state.kitchenTickets.filter((t) => t.status !== "bumped"),
    [state.kitchenTickets],
  );

  const openBills = useMemo(
    () =>
      state.orders.filter(
        (o) => o.status !== "paid" && o.status !== "cancelled",
      ),
    [state.orders],
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
            Staff
          </p>
          <Link
            href="/admin"
            className="min-h-10 px-2 text-sm text-[var(--garden-ink)]/45"
          >
            Admin
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-[var(--garden-fog)] p-1">
          <button
            type="button"
            onClick={() => setTab("kitchen")}
            className={cn(
              "min-h-11 rounded-xl text-sm font-semibold",
              tab === "kitchen"
                ? "bg-[var(--garden-deep)] text-white"
                : "text-[var(--garden-deep)]",
            )}
          >
            Kitchen · {openTickets.length}
          </button>
          <button
            type="button"
            onClick={() => setTab("pay")}
            className={cn(
              "min-h-11 rounded-xl text-sm font-semibold",
              tab === "pay"
                ? "bg-[var(--garden-deep)] text-white"
                : "text-[var(--garden-deep)]",
            )}
          >
            Pay · {openBills.length}
          </button>
        </div>
      </header>

      <div className="space-y-3 px-4 pb-24 pt-4">
        <Link
          href="/order"
          className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-base font-semibold text-[var(--garden-deep)]"
        >
          New order
        </Link>

        {tab === "kitchen" &&
          (openTickets.length === 0 ? (
            <Empty>No kitchen orders</Empty>
          ) : (
            openTickets.map((ticket) => (
              <article
                key={ticket.id}
                className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                      {ticket.table ?? "Walk-in"}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--garden-ink)]/50">
                      {ticket.placedAt}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--garden-fog)] px-2.5 py-1 text-xs font-semibold text-[var(--garden-deep)]">
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
                      <span className="tabular-nums font-medium">
                        ×{line.qty}
                      </span>
                    </li>
                  ))}
                </ul>
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

        {tab === "pay" &&
          (openBills.length === 0 ? (
            <Empty>No open bills</Empty>
          ) : (
            openBills.map((order) => {
              const due = payableTotal(order);
              const open = payFor === order.id;
              return (
                <article
                  key={order.id}
                  className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[var(--garden-deep)]">
                        {order.table ?? "Walk-in"}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--garden-ink)]/50">
                        {order.status}
                      </p>
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                      {formatNpr(due)}
                    </p>
                  </div>
                  {!open ? (
                    <button
                      type="button"
                      className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
                      onClick={() => setPayFor(order.id)}
                    >
                      Take payment
                    </button>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {(["cash", "upi", "card"] as PayMethod[]).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMethod(m)}
                            className={cn(
                              "min-h-12 rounded-xl text-sm font-semibold capitalize",
                              method === m
                                ? "bg-[var(--garden-deep)] text-white"
                                : "bg-[var(--garden-fog)] text-[var(--garden-deep)]",
                            )}
                          >
                            {m === "upi" ? "UPI" : m}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-base font-semibold text-[var(--garden-deep)]"
                        onClick={() => {
                          settleBill(order.id, method, 0);
                          setPayFor(null);
                        }}
                      >
                        Confirm {formatNpr(due)}
                      </button>
                      <button
                        type="button"
                        className="flex min-h-12 w-full items-center justify-center text-sm text-[var(--garden-ink)]/50"
                        onClick={() => setPayFor(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          ))}
      </div>
    </PhoneShell>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-[var(--garden-ink)]/50 ring-1 ring-[var(--garden-leaf)]/10">
      {children}
    </p>
  );
}
