"use client";

import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { PhoneNav, PhoneShell, type NavTab } from "@/components/phone-nav";
import {
  kitchenStatusLabel,
  orderBillBreakdown,
  type PayMethod,
} from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

export default function CashierPage() {
  return (
    <AuthGate allow={["cashier", "staff", "owner"]}>
      <CashierInner />
    </AuthGate>
  );
}

function CashierInner() {
  const { state, settleBill, paySplitPart, ready } = useOps();
  const [payFor, setPayFor] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("cash");
  const [filter, setFilter] = useState<"all" | "ready">("all");

  const openBills = useMemo(() => {
    const list = state.orders.filter(
      (o) => o.status !== "paid" && o.status !== "cancelled",
    );
    if (filter === "ready") {
      return list.filter(
        (o) => o.status === "ready" || o.status === "served",
      );
    }
    return list;
  }, [state.orders, filter]);

  const role = state.session?.role;
  const navTabs: NavTab[] =
    role === "owner"
      ? [
          { href: "/admin", label: "Dash", active: false },
          { href: "/cashier", label: "Cashier", active: true },
          { href: "/employee", label: "Floor", active: false },
          { href: "/kitchen", label: "Kitchen", active: false },
          { label: "Out", logout: true },
        ]
      : role === "cashier"
        ? [
            { href: "/cashier", label: "Cashier", active: true },
            { href: "/employee", label: "Order", active: false },
            { label: "Out", logout: true },
          ]
        : [
            { href: "/employee", label: "Order", active: false },
            { href: "/cashier", label: "Cashier", active: true },
            {
              href: "/employee",
              label: "Stock",
              active: false,
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
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
              Cashier
            </p>
            <p className="text-xs text-[var(--garden-ink)]/50">
              {state.session?.displayName} · auto totals · NPR
            </p>
          </div>
          <p className="rounded-full bg-[var(--garden-fog)] px-3 py-1 text-xs font-semibold">
            {openBills.length} open
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-[var(--garden-fog)] p-1">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "min-h-10 rounded-xl text-xs font-semibold",
              filter === "all"
                ? "bg-[var(--garden-deep)] text-white"
                : "text-[var(--garden-deep)]",
            )}
          >
            All open
          </button>
          <button
            type="button"
            onClick={() => setFilter("ready")}
            className={cn(
              "min-h-10 rounded-xl text-xs font-semibold",
              filter === "ready"
                ? "bg-[var(--garden-deep)] text-white"
                : "text-[var(--garden-deep)]",
            )}
          >
            Ready / served
          </button>
        </div>
      </header>

      <div className="space-y-3 px-4 pb-24 pt-4">
        <p className="text-sm text-[var(--garden-ink)]/60">
          Kitchen items land here automatically — subtotal, VAT, and total
          calculated for you.
        </p>

        {openBills.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-[var(--garden-ink)]/50 ring-1 ring-[var(--garden-leaf)]/10">
            No open tables to bill
          </p>
        ) : (
          openBills.map((order) => {
            const bill = orderBillBreakdown(
              order,
              state.menuItems,
              state.settings,
            );
            const open = payFor === order.id;
            const billable =
              order.status === "ready" ||
              order.status === "served" ||
              order.status === "preparing" ||
              order.status === "new";
            return (
              <article
                key={order.id}
                className={cn(
                  "rounded-2xl bg-white p-4 ring-1",
                  order.status === "ready" || order.status === "served"
                    ? "ring-emerald-300/70 bg-emerald-50/30"
                    : "ring-[var(--garden-leaf)]/10",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                      {order.table ?? "Walk-in"}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--garden-ink)]/50">
                      {order.id} · {order.placedAt} ·{" "}
                      {kitchenStatusLabel(order.status)}
                    </p>
                  </div>
                  <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                    {formatNpr(bill.total)}
                  </p>
                </div>

                <ul className="mt-3 space-y-1.5 border-t border-[var(--garden-leaf)]/10 pt-3 text-sm">
                  {bill.lines.length ? (
                    bill.lines.map((line, i) => (
                      <li
                        key={`${line.name}-${i}`}
                        className="flex items-baseline justify-between gap-2"
                      >
                        <span className="min-w-0 truncate">
                          {line.name}{" "}
                          <span className="text-[var(--garden-ink)]/45">
                            ×{line.qty}
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums font-medium">
                          {formatNpr(line.lineTotal)}
                        </span>
                      </li>
                    ))
                  ) : (
                    order.items.map((item) => (
                      <li key={item} className="text-[var(--garden-ink)]/70">
                        {item}
                      </li>
                    ))
                  )}
                </ul>

                <div className="mt-3 space-y-1 rounded-xl bg-[var(--garden-fog)]/70 px-3 py-2.5 text-sm">
                  <Row label="Subtotal" value={formatNpr(bill.subtotal)} />
                  {bill.discountAmount > 0 ? (
                    <Row
                      label={`Discount ${bill.discountPct}%`}
                      value={`−${formatNpr(bill.discountAmount)}`}
                    />
                  ) : null}
                  {bill.vatAmount > 0 ? (
                    <Row
                      label={`VAT ${bill.vatPercent}%`}
                      value={formatNpr(bill.vatAmount)}
                    />
                  ) : (
                    <Row label="VAT" value="Off" />
                  )}
                  {bill.tip > 0 ? (
                    <Row label="Tip" value={formatNpr(bill.tip)} />
                  ) : null}
                  <Row
                    label="Total"
                    value={formatNpr(bill.total)}
                    strong
                  />
                </div>

                {order.splits?.length ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--garden-leaf)]">
                      Split bill
                    </p>
                    {order.splits.map((sp) => (
                      <div
                        key={sp.id}
                        className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-[var(--garden-leaf)]/10"
                      >
                        <span className="text-sm">
                          {sp.label} · {formatNpr(sp.amount)}
                          {sp.paid ? " · paid" : ""}
                        </span>
                        {!sp.paid ? (
                          <button
                            type="button"
                            className="min-h-10 rounded-xl bg-[var(--garden-deep)] px-3 text-xs font-semibold text-white"
                            onClick={() =>
                              paySplitPart(order.id, sp.id, payMethod)
                            }
                          >
                            Take {payMethod === "upi" ? "UPI" : payMethod}
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {billable && !order.splits?.every((s) => s.paid) ? (
                  !open ? (
                    <button
                      type="button"
                      className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
                      onClick={() => setPayFor(order.id)}
                    >
                      Create bill · Settle
                    </button>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <PayMethods value={payMethod} onChange={setPayMethod} />
                      <button
                        type="button"
                        className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-base font-semibold text-[var(--garden-deep)]"
                        onClick={() => {
                          settleBill(order.id, payMethod, 0);
                          setPayFor(null);
                        }}
                      >
                        Pay {formatNpr(bill.total)}
                      </button>
                      <button
                        type="button"
                        className="w-full py-1 text-center text-sm text-[var(--garden-leaf)]"
                        onClick={() => setPayFor(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  )
                ) : null}
              </article>
            );
          })
        )}
      </div>
    </PhoneShell>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between gap-2",
        strong && "pt-1 font-semibold text-[var(--garden-deep)]",
      )}
    >
      <span className={strong ? undefined : "text-[var(--garden-ink)]/60"}>
        {label}
      </span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function PayMethods({
  value,
  onChange,
}: {
  value: PayMethod;
  onChange: (m: PayMethod) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {(["cash", "upi", "card"] as PayMethod[]).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            "min-h-12 rounded-xl text-sm font-semibold capitalize",
            value === m
              ? "bg-[var(--garden-deep)] text-white"
              : "bg-[var(--garden-fog)] text-[var(--garden-deep)]",
          )}
        >
          {m === "upi" ? "UPI" : m}
        </button>
      ))}
    </div>
  );
}
