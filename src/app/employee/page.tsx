"use client";

import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { PhoneNav, PhoneShell, type NavTab } from "@/components/phone-nav";
import {
  OPS_TODAY,
  attendanceLabel,
  menuCategories,
  stockAlertLevel,
  type PayMethod,
} from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

type Tab = "order" | "stock" | "shift" | "bills";
type Step = "seat" | "menu" | "done";

export default function EmployeePage() {
  return (
    <AuthGate allow={["staff", "owner"]}>
      <EmployeeInner />
    </AuthGate>
  );
}

function EmployeeInner() {
  const {
    state,
    placeWaiterOrder,
    settleBill,
    payableTotal,
    clockIn,
    clockOut,
    metrics,
    ready,
  } = useOps();
  const [tab, setTab] = useState<Tab>("order");
  const [step, setStep] = useState<Step>("seat");
  const [tableId, setTableId] = useState<string | "walk-in">("walk-in");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [category, setCategory] = useState("all");
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [payMethod, setPayMethod] = useState<PayMethod>("cash");
  const [paid, setPaid] = useState(false);
  const [payFor, setPayFor] = useState<string | null>(null);

  const staffId = state.session?.staffId ?? "st-sita";
  const myAttendance = state.attendance.find(
    (a) => a.staffId === staffId && a.date === OPS_TODAY,
  );

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([menuItemId, qty]) => {
          const item = state.menuItems.find((m) => m.id === menuItemId)!;
          return { item, qty };
        }),
    [cart, state.menuItems],
  );
  const subtotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const filtered =
    category === "all"
      ? state.menuItems
      : state.menuItems.filter((m) => m.category === category);

  const seatLabel =
    tableId === "walk-in"
      ? "Walk-in"
      : (state.tables.find((t) => t.id === tableId)?.label ?? tableId);

  const openBills = useMemo(
    () =>
      state.orders.filter(
        (o) => o.status !== "paid" && o.status !== "cancelled",
      ),
    [state.orders],
  );

  const onShift = state.attendance.filter(
    (a) =>
      a.date === OPS_TODAY &&
      a.clockIn &&
      !a.clockOut &&
      (a.status === "working" || a.status === "late"),
  );

  const navTabs: NavTab[] = [
    {
      label: "Order",
      active: tab === "order",
      onClick: () => setTab("order"),
    },
    {
      label: "Stock",
      active: tab === "stock",
      onClick: () => setTab("stock"),
    },
    {
      label: "Shift",
      active: tab === "shift",
      onClick: () => setTab("shift"),
    },
    {
      label: "Bills",
      active: tab === "bills",
      onClick: () => setTab("bills"),
    },
    { label: "Out", logout: true },
  ];

  function bump(id: string, delta: number) {
    setCart((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const copy = { ...prev };
      if (!next) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  function sendOrder() {
    if (!lines.length) return;
    const tableCode =
      tableId === "walk-in"
        ? null
        : (state.tables.find((t) => t.id === tableId)?.label.split(" · ")[0] ??
          null);
    const id = placeWaiterOrder({
      table: tableCode,
      type: "dine-in",
      guest: tableCode ? `Table · ${tableCode}` : "Walk-in",
      lines: lines.map((l) => ({
        menuItemId: l.item.id,
        name: l.item.name,
        qty: l.qty,
      })),
      total: subtotal,
      source: "waiter",
      waiter: state.session?.displayName,
    });
    setOrderId(id);
    setOrderTotal(subtotal);
    setCart({});
    setStep("done");
    setPaid(false);
  }

  function resetOrder() {
    setStep("seat");
    setCart({});
    setOrderId("");
    setOrderTotal(0);
    setPaid(false);
    setCategory("all");
  }

  if (!ready) {
    return (
      <PhoneShell footer={<PhoneNav tabs={navTabs} />}>
        <p className="flex flex-1 items-center justify-center text-sm opacity-60">
          Loading…
        </p>
      </PhoneShell>
    );
  }

  const showCartBar = tab === "order" && step === "menu";

  return (
    <PhoneShell
      footer={
        showCartBar ? (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--garden-leaf)]/12 bg-[var(--garden-paper)]/97 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
            <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--garden-ink)]/50">
                  {itemCount} items · {seatLabel}
                </p>
                <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                  {formatNpr(subtotal)}
                </p>
              </div>
              <button
                type="button"
                disabled={!itemCount}
                onClick={sendOrder}
                className="flex h-14 min-w-[8.5rem] items-center justify-center rounded-2xl bg-[var(--garden-deep)] px-5 text-base font-semibold text-white disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <PhoneNav tabs={navTabs} />
        )
      }
    >
      <header className="sticky top-0 z-20 border-b border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
              Staff
            </p>
            <p className="text-xs text-[var(--garden-ink)]/50">
              {state.session?.displayName}
            </p>
          </div>
          {metrics.lowStock.length > 0 && tab !== "stock" && (
            <button
              type="button"
              onClick={() => setTab("stock")}
              className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-950"
            >
              {metrics.lowStock.length} finishing
            </button>
          )}
        </div>
      </header>

      <div className={cn("px-4 pt-4", showCartBar ? "pb-28" : "pb-24")}>
        {tab === "order" && step === "seat" && (
          <section>
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              Table
            </h1>
            <button
              type="button"
              onClick={() => setTableId("walk-in")}
              className={cn(
                "mt-4 flex min-h-14 w-full items-center rounded-2xl px-4 text-left text-base font-semibold",
                tableId === "walk-in"
                  ? "bg-[var(--garden-deep)] text-white"
                  : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/12",
              )}
            >
              Walk-in / counter
            </button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {state.tables.map((t) => {
                const short = t.label.split(" · ")[0];
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTableId(t.id)}
                    className={cn(
                      "flex min-h-14 items-center justify-center rounded-2xl px-3 text-base font-semibold",
                      tableId === t.id
                        ? "bg-[var(--garden-deep)] text-white"
                        : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/12",
                    )}
                  >
                    {short}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setStep("menu")}
              className="mt-6 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-base font-semibold text-[var(--garden-deep)]"
            >
              Next · Menu
            </button>
          </section>
        )}

        {tab === "order" && step === "menu" && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
                Menu
              </h1>
              <button
                type="button"
                onClick={() => setStep("seat")}
                className="min-h-10 rounded-xl px-3 text-sm font-medium text-[var(--garden-leaf)]"
              >
                {seatLabel} ✎
              </button>
            </div>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              <Chip
                active={category === "all"}
                onClick={() => setCategory("all")}
                label="All"
              />
              {menuCategories.map((c) => (
                <Chip
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(c.id)}
                  label={c.label}
                />
              ))}
            </div>
            <ul className="mt-3 space-y-2">
              {filtered.map((item) => {
                const qty = cart[item.id] ?? 0;
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 ring-1 ring-[var(--garden-leaf)]/10"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[var(--garden-deep)]">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--garden-leaf)]">
                        {formatNpr(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={!qty}
                        onClick={() => bump(item.id, -1)}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--garden-fog)] text-xl font-medium disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="w-6 text-center tabular-nums text-base font-semibold">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => bump(item.id, 1)}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--garden-deep)] text-xl font-medium text-white"
                      >
                        +
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {tab === "order" && step === "done" && (
          <section>
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              Sent to kitchen
            </h1>
            <p className="mt-1 text-sm text-[var(--garden-ink)]/60">
              {orderId} · {seatLabel} — live on kitchen board
            </p>
            {!paid ? (
              <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
                <p className="font-semibold text-[var(--garden-deep)]">
                  Collect now? (or hand to admin)
                </p>
                <PayMethods value={payMethod} onChange={setPayMethod} />
                <button
                  type="button"
                  onClick={() => {
                    if (!orderId) return;
                    settleBill(orderId, payMethod, 0);
                    setPaid(true);
                  }}
                  className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-base font-semibold text-[var(--garden-deep)]"
                >
                  Pay {formatNpr(orderTotal)}
                </button>
                <button
                  type="button"
                  onClick={() => setTab("bills")}
                  className="block w-full py-1 text-center text-sm text-[var(--garden-leaf)]"
                >
                  Leave as open bill
                </button>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-5 text-center text-sm text-emerald-950 ring-1 ring-emerald-200">
                Paid
              </p>
            )}
            <button
              type="button"
              onClick={resetOrder}
              className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
            >
              New order
            </button>
          </section>
        )}

        {tab === "stock" && (
          <section className="space-y-3">
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              Inventory
            </h1>
            {metrics.criticalStock.length > 0 && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
                Finishing: {metrics.criticalStock.map((s) => s.name).join(", ")}
              </p>
            )}
            {state.stock.map((row) => {
              const level = stockAlertLevel(row);
              return (
                <div
                  key={row.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 ring-1",
                    level === "critical"
                      ? "ring-red-300 bg-red-50/50"
                      : level === "low"
                        ? "ring-amber-300 bg-amber-50/40"
                        : "ring-[var(--garden-leaf)]/10",
                  )}
                >
                  <div>
                    <p className="font-medium text-[var(--garden-deep)]">
                      {row.name}
                    </p>
                    <p className="text-xs text-[var(--garden-ink)]/50">
                      {level === "ok"
                        ? "OK"
                        : level === "low"
                          ? "Low"
                          : "Finishing"}
                    </p>
                  </div>
                  <p className="text-lg font-semibold tabular-nums">
                    {row.qty}{" "}
                    <span className="text-xs font-normal opacity-50">
                      {row.unit}
                    </span>
                  </p>
                </div>
              );
            })}
          </section>
        )}

        {tab === "shift" && (
          <section className="space-y-3">
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              My shift
            </h1>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
              <p className="font-semibold text-[var(--garden-deep)]">
                {state.session?.displayName}
              </p>
              <p className="mt-1 text-sm text-[var(--garden-ink)]/55">
                {myAttendance
                  ? attendanceLabel(myAttendance.status)
                  : "Not clocked in"}
                {myAttendance?.clockIn
                  ? ` · in ${myAttendance.clockIn}`
                  : ""}
                {myAttendance?.clockOut
                  ? ` · out ${myAttendance.clockOut}`
                  : ""}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => clockIn(staffId)}
                  className="min-h-14 rounded-2xl bg-[var(--garden-fog)] text-sm font-semibold"
                >
                  Clock in
                </button>
                <button
                  type="button"
                  onClick={() => clockOut(staffId)}
                  className="min-h-14 rounded-2xl bg-[var(--garden-deep)] text-sm font-semibold text-white"
                >
                  Clock out
                </button>
              </div>
            </div>
            <p className="text-sm font-medium text-[var(--garden-leaf)]">
              On shift now
            </p>
            {onShift.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-[var(--garden-ink)]/50 ring-1 ring-[var(--garden-leaf)]/10">
                Nobody clocked in
              </p>
            ) : (
              onShift.map((a) => {
                const member = state.staff.find((s) => s.id === a.staffId);
                return (
                  <div
                    key={a.id}
                    className="flex justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-[var(--garden-leaf)]/10"
                  >
                    <span className="font-medium">
                      {member?.name ?? a.staffId}
                    </span>
                    <span className="text-sm text-[var(--garden-ink)]/50">
                      {a.clockIn} · {attendanceLabel(a.status)}
                    </span>
                  </div>
                );
              })
            )}
          </section>
        )}

        {tab === "bills" && (
          <section className="space-y-3">
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              Open bills
            </h1>
            {openBills.length === 0 ? (
              <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-[var(--garden-ink)]/50 ring-1 ring-[var(--garden-leaf)]/10">
                No open bills
              </p>
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
                        <p className="text-xs text-[var(--garden-ink)]/50">
                          {order.status}
                        </p>
                      </div>
                      <p className="font-[family-name:var(--font-display)] text-xl">
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
                        <PayMethods value={payMethod} onChange={setPayMethod} />
                        <button
                          type="button"
                          className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-base font-semibold text-[var(--garden-deep)]"
                          onClick={() => {
                            settleBill(order.id, payMethod, 0);
                            setPayFor(null);
                          }}
                        >
                          Confirm {formatNpr(due)}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </section>
        )}
      </div>
    </PhoneShell>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-2.5 text-sm font-medium",
        active
          ? "bg-[var(--garden-deep)] text-white"
          : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/12",
      )}
    >
      {label}
    </button>
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
