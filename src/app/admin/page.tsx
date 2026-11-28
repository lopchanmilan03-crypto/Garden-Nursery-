"use client";

import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import {
  CostTargetsDashCard,
  CostTargetsPanel,
} from "@/components/cost-targets-panel";
import { PhoneNav, PhoneShell, type NavTab } from "@/components/phone-nav";
import {
  OPS_TODAY,
  attendanceLabel,
  majorExpenseCategoryIds,
  seedWeekSeries,
  stockAlertLevel,
  type PayMethod,
} from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

const tabs = [
  { id: "dash", label: "Dash" },
  { id: "cost", label: "Cost" },
  { id: "bills", label: "Bills" },
  { id: "pay", label: "Payables" },
  { id: "exp", label: "Expenses" },
  { id: "stock", label: "Stock" },
  { id: "staff", label: "Staff" },
  { id: "reports", label: "Reports" },
  { id: "more", label: "More" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminPage() {
  return (
    <AuthGate allow={["owner"]}>
      <AdminInner />
    </AuthGate>
  );
}

function AdminInner() {
  const {
    state,
    metrics,
    updateStock,
    updateSettings,
    addExpense,
    updateExpense,
    markExpensePaid,
    payVendorDues,
    settleBill,
    payableTotal,
    clockIn,
    clockOut,
    closeDay,
    resetDemo,
    ready,
  } = useOps();
  const [tab, setTab] = useState<TabId>("dash");
  const [payFor, setPayFor] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<PayMethod>("cash");
  const [expForm, setExpForm] = useState({
    label: "",
    amount: "",
    categoryId: "exp-rent",
    vendorId: "",
  });
  const [billSummary, setBillSummary] = useState<string | null>(null);

  const openBills = useMemo(
    () =>
      state.orders.filter(
        (o) => o.status !== "paid" && o.status !== "cancelled",
      ),
    [state.orders],
  );

  const todayAttendance = useMemo(
    () => state.attendance.filter((a) => a.date === OPS_TODAY),
    [state.attendance],
  );

  const navTabs: NavTab[] = [
    {
      label: "Dash",
      active: tab === "dash",
      onClick: () => setTab("dash"),
    },
    {
      label: "Cashier",
      href: "/cashier",
      active: false,
    },
    {
      label: "Stock",
      active: tab === "stock",
      onClick: () => setTab("stock"),
    },
    {
      label: "More",
      active: ["bills", "pay", "exp", "cost", "staff", "reports", "more"].includes(
        tab,
      ),
      onClick: () => setTab("more"),
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

  function addMajorExpense() {
    const amount = Number(expForm.amount);
    if (!expForm.label.trim() || !amount) return;
    addExpense({
      id: `ex-${Date.now()}`,
      categoryId: expForm.categoryId,
      label: expForm.label.trim(),
      amount,
      vendorId: expForm.vendorId || undefined,
      date: OPS_TODAY,
      paid: false,
    });
    setExpForm({
      label: "",
      amount: "",
      categoryId: "exp-rent",
      vendorId: "",
    });
  }

  return (
    <PhoneShell footer={<PhoneNav tabs={navTabs} />}>
      <header className="sticky top-0 z-20 border-b border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
              Owner
            </p>
            <p className="text-xs text-[var(--garden-ink)]/50">
              {state.session?.displayName} · {OPS_TODAY}
            </p>
          </div>
          {metrics.lowStock.length > 0 && (
            <button
              type="button"
              onClick={() => setTab("stock")}
              className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-950"
            >
              {metrics.lowStock.length} low stock
            </button>
          )}
        </div>
        <div className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-0.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "shrink-0 rounded-xl px-3 py-2 text-xs font-semibold",
                tab === t.id
                  ? "bg-[var(--garden-deep)] text-white"
                  : "bg-[var(--garden-fog)] text-[var(--garden-deep)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-3 px-4 pb-24 pt-4">
        {tab === "dash" && (
          <>
            <div className="grid grid-cols-1 gap-2">
              <Stat label="Today sales" value={formatNpr(metrics.sale)} />
              <Stat label="Today expenses" value={formatNpr(metrics.kharcha)} />
              <Stat
                label="Profit · margin"
                value={`${formatNpr(metrics.profit)} · ${metrics.marginPct}%`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Quick
                label="Payables"
                value={formatNpr(metrics.payablesTotal)}
                onClick={() => setTab("pay")}
              />
              <Quick
                label="Cashier"
                value={`${openBills.length} open`}
                onClick={() => {
                  window.location.assign("/cashier");
                }}
              />
              <Quick
                label="Cost / Targets"
                value={`${metrics.monthlyTarget.pct}%`}
                onClick={() => setTab("cost")}
              />
              <Quick
                label="Low stock"
                value={String(metrics.lowStock.length)}
                onClick={() => setTab("stock")}
              />
            </div>

            <CostTargetsDashCard onOpen={() => setTab("cost")} />
            {!state.dayClose.closed ? (
              <button
                type="button"
                onClick={closeDay}
                className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
              >
                Close day
              </button>
            ) : (
              <p className="rounded-2xl bg-emerald-50 px-4 py-4 text-center text-sm text-emerald-950">
                Day closed · {state.dayClose.closedAt}
              </p>
            )}

            <p className="pt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
              At a glance
            </p>

            <SalesExpenseChart
              points={seedWeekSeries.map((d, i) =>
                i === seedWeekSeries.length - 1
                  ? { ...d, sales: metrics.sale, expenses: metrics.kharcha }
                  : d,
              )}
            />

            <ReportBlock title="Top sellers">
              {metrics.topSellers.slice(0, 4).map((row, i) => (
                <RankRow
                  key={row.menuItemId}
                  rank={i + 1}
                  name={row.name}
                  meta={`×${row.qty}`}
                  value={formatNpr(row.revenue)}
                  bar={
                    metrics.topSellers[0]
                      ? (row.qty / metrics.topSellers[0].qty) * 100
                      : 0
                  }
                />
              ))}
              <button
                type="button"
                onClick={() => setTab("reports")}
                className="w-full pt-1 text-left text-xs font-semibold text-[var(--garden-leaf)]"
              >
                Full reports →
              </button>
            </ReportBlock>

            <ExpenseBreakdownChart rows={metrics.expenseHotspots.slice(0, 5)} />

            <ReportBlock title="Profit by product">
              {metrics.profitByProduct.slice(0, 4).map((row, i) => (
                <RankRow
                  key={row.menuItemId}
                  rank={i + 1}
                  name={row.name}
                  meta={`${row.marginPct}%`}
                  value={formatNpr(row.profit)}
                  bar={
                    metrics.profitByProduct[0]?.profit
                      ? (row.profit /
                          Math.max(metrics.profitByProduct[0].profit, 1)) *
                        100
                      : 0
                  }
                />
              ))}
            </ReportBlock>

            <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-[var(--garden-deep)]">
                  Low stock
                </p>
                <button
                  type="button"
                  onClick={() => setTab("stock")}
                  className="text-xs font-semibold text-[var(--garden-leaf)]"
                >
                  Stock →
                </button>
              </div>
              {metrics.lowStock.length === 0 ? (
                <p className="mt-3 text-sm text-[var(--garden-ink)]/50">
                  All items above threshold
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {metrics.lowStock.slice(0, 4).map((row) => {
                    const level = stockAlertLevel(row);
                    return (
                      <li
                        key={row.id}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="min-w-0 truncate font-medium">
                          {row.name}
                        </span>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            level === "critical"
                              ? "bg-red-100 text-red-900"
                              : "bg-amber-100 text-amber-950",
                          )}
                        >
                          {row.qty} {row.unit}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-[var(--garden-deep)]">
                  Pay soon
                </p>
                <button
                  type="button"
                  onClick={() => setTab("pay")}
                  className="text-xs font-semibold text-[var(--garden-leaf)]"
                >
                  Payables →
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {[
                  ...state.vendors
                    .filter((v) => v.dues > 0)
                    .map((v) => ({
                      id: v.id,
                      name: v.name,
                      amount: v.dues,
                      meta: v.category,
                    })),
                  ...state.expenses
                    .filter((e) => !e.paid && !e.vendorId)
                    .map((e) => ({
                      id: e.id,
                      name: e.label,
                      amount: e.amount,
                      meta:
                        state.expenseCategories.find(
                          (c) => c.id === e.categoryId,
                        )?.name ?? e.categoryId,
                    })),
                ]
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 4)
                  .map((row) => (
                    <li
                      key={row.id}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="min-w-0 truncate">
                        <span className="font-medium">{row.name}</span>
                        <span className="ml-1 text-[var(--garden-ink)]/45">
                          {row.meta}
                        </span>
                      </span>
                      <span className="shrink-0 font-semibold">
                        {formatNpr(row.amount)}
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          </>
        )}

        {tab === "cost" && <CostTargetsPanel />}

        {tab === "bills" && (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Billing
            </h2>
            {openBills.length === 0 ? (
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
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[var(--garden-deep)]">
                          {order.table ?? "Walk-in"} · {order.id}
                        </p>
                        <p className="text-xs text-[var(--garden-ink)]/50">
                          {order.status} · {order.placedAt}
                        </p>
                        <ul className="mt-2 space-y-0.5 text-sm text-[var(--garden-ink)]/70">
                          {order.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="font-[family-name:var(--font-display)] text-xl">
                        {formatNpr(due)}
                      </p>
                    </div>
                    {!open ? (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--garden-fog)] text-sm font-semibold"
                          onClick={() =>
                            setBillSummary(
                              [
                                "Garden Restaurant",
                                "————————",
                                order.table ?? "Walk-in",
                                ...order.items,
                                `Total ${formatNpr(due)}`,
                                `VAT ${state.settings.vatEnabled ? state.settings.vatPercent + "%" : "off"}`,
                              ].join("\n"),
                            )
                          }
                        >
                          Summary
                        </button>
                        <button
                          type="button"
                          className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--garden-deep)] text-sm font-semibold text-white"
                          onClick={() => setPayFor(order.id)}
                        >
                          Close bill
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <PayMethods
                          value={payMethod}
                          onChange={setPayMethod}
                        />
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
            {billSummary && (
              <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
                <div className="w-full max-w-md rounded-3xl bg-white p-5">
                  <p className="font-semibold text-[var(--garden-deep)]">
                    Print-style summary
                  </p>
                  <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-[var(--garden-fog)] p-4 font-mono text-xs leading-relaxed">
                    {billSummary}
                  </pre>
                  <button
                    type="button"
                    className="mt-4 flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-sm font-semibold text-white"
                    onClick={() => setBillSummary(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "pay" && (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Payables
            </h2>
            <p className="text-sm text-[var(--garden-ink)]/55">
              Who to pay · how much
            </p>
            {state.vendors
              .filter((v) => v.dues > 0)
              .map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--garden-deep)]">
                      {v.name}
                    </p>
                    <p className="text-xs text-[var(--garden-ink)]/50">
                      {v.category} · {v.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNpr(v.dues)}</p>
                    <button
                      type="button"
                      onClick={() => payVendorDues(v.id)}
                      className="mt-1 text-xs font-semibold text-[var(--garden-leaf)]"
                    >
                      Mark paid
                    </button>
                  </div>
                </div>
              ))}
            {state.expenses
              .filter((e) => !e.paid)
              .map((e) => {
                const cat = state.expenseCategories.find(
                  (c) => c.id === e.categoryId,
                );
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--garden-deep)]">
                        {e.label}
                      </p>
                      <p className="text-xs text-[var(--garden-ink)]/50">
                        {cat?.name ?? e.categoryId} · {e.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNpr(e.amount)}</p>
                      <button
                        type="button"
                        onClick={() => markExpensePaid(e.id)}
                        className="mt-1 text-xs font-semibold text-[var(--garden-leaf)]"
                      >
                        Mark paid
                      </button>
                    </div>
                  </div>
                );
              })}
          </>
        )}

        {tab === "exp" && (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Major expenses
            </h2>
            <p className="text-sm text-[var(--garden-ink)]/55">
              Rent · gas · vendor · salary — admin only
            </p>
            <div className="space-y-2 rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
              <input
                className="h-11 w-full rounded-xl border border-[var(--garden-leaf)]/15 px-3 text-sm"
                placeholder="Label"
                value={expForm.label}
                onChange={(e) =>
                  setExpForm((f) => ({ ...f, label: e.target.value }))
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  className="h-11 rounded-xl border border-[var(--garden-leaf)]/15 px-3 text-sm"
                  placeholder="NPR"
                  value={expForm.amount}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, amount: e.target.value }))
                  }
                />
                <select
                  className="h-11 rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-sm"
                  value={expForm.categoryId}
                  onChange={(e) =>
                    setExpForm((f) => ({ ...f, categoryId: e.target.value }))
                  }
                >
                  {state.expenseCategories
                    .filter((c) =>
                      (majorExpenseCategoryIds as readonly string[]).includes(
                        c.id,
                      ),
                    )
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <select
                className="h-11 w-full rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-sm"
                value={expForm.vendorId}
                onChange={(e) =>
                  setExpForm((f) => ({ ...f, vendorId: e.target.value }))
                }
              >
                <option value="">No vendor</option>
                {state.vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addMajorExpense}
                className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--garden-deep)] text-sm font-semibold text-white"
              >
                Add expense
              </button>
            </div>
            {state.expenses
              .filter((e) =>
                (majorExpenseCategoryIds as readonly string[]).includes(
                  e.categoryId,
                ),
              )
              .map((e) => {
                const cat = state.expenseCategories.find(
                  (c) => c.id === e.categoryId,
                );
                return (
                  <div
                    key={e.id}
                    className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
                  >
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-medium">{e.label}</p>
                        <p className="text-xs text-[var(--garden-ink)]/50">
                          {cat?.name} · {e.date} · {e.paid ? "Paid" : "Due"}
                        </p>
                      </div>
                      <input
                        type="number"
                        className="h-10 w-24 rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-right text-sm font-semibold"
                        value={e.amount}
                        onChange={(ev) =>
                          updateExpense(e.id, {
                            amount: Number(ev.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                );
              })}
          </>
        )}

        {tab === "stock" && (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Live stock
            </h2>
            {metrics.criticalStock.length > 0 && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
                Finishing soon:{" "}
                {metrics.criticalStock.map((s) => s.name).join(", ")}
              </p>
            )}
            {state.stock.map((row) => {
              const level = stockAlertLevel(row);
              return (
                <div
                  key={row.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-white p-4 ring-1",
                    level === "critical"
                      ? "ring-red-300 bg-red-50/50"
                      : level === "low"
                        ? "ring-amber-300 bg-amber-50/40"
                        : "ring-[var(--garden-leaf)]/10",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--garden-deep)]">
                      {row.name}
                    </p>
                    <p className="text-xs text-[var(--garden-ink)]/50">
                      Low at {row.lowAt} {row.unit}
                      {level !== "ok" ? ` · ${level}` : ""}
                    </p>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    className="h-12 w-20 rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-center text-sm font-semibold"
                    value={row.qty}
                    onChange={(e) =>
                      updateStock(row.id, {
                        qty: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              );
            })}
          </>
        )}

        {tab === "staff" && (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Attendance
            </h2>
            <p className="text-sm text-[var(--garden-ink)]/55">
              Who is on time · hours today
            </p>
            {state.staff.map((member) => {
              const att = todayAttendance.find((a) => a.staffId === member.id);
              const hours =
                att?.clockIn && att.clockOut
                  ? (
                      minutesBetweenSafe(att.clockIn, att.clockOut) / 60
                    ).toFixed(1)
                  : att?.clockIn
                    ? "…"
                    : "—";
              return (
                <div
                  key={member.id}
                  className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
                >
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-medium text-[var(--garden-deep)]">
                        {member.name}
                      </p>
                      <p className="text-xs text-[var(--garden-ink)]/50">
                        {member.shift} · {member.role}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "h-fit rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        att?.status === "late"
                          ? "bg-amber-100 text-amber-950"
                          : att?.clockIn
                            ? "bg-emerald-100 text-emerald-950"
                            : "bg-[var(--garden-fog)] text-[var(--garden-ink)]/60",
                      )}
                    >
                      {att ? attendanceLabel(att.status) : "Not in"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--garden-ink)]/55">
                    In {att?.clockIn ?? "—"} · Out {att?.clockOut ?? "—"} ·{" "}
                    {hours}h
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => clockIn(member.id)}
                      className="min-h-11 rounded-xl bg-[var(--garden-fog)] text-sm font-semibold"
                    >
                      Clock in
                    </button>
                    <button
                      type="button"
                      onClick={() => clockOut(member.id)}
                      className="min-h-11 rounded-xl bg-[var(--garden-deep)] text-sm font-semibold text-white"
                    >
                      Clock out
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {tab === "reports" && (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Reports
            </h2>
            <ReportBlock title="Top sellers">
              {metrics.topSellers.map((row, i) => (
                <RankRow
                  key={row.menuItemId}
                  rank={i + 1}
                  name={row.name}
                  meta={`×${row.qty}`}
                  value={formatNpr(row.revenue)}
                  bar={
                    metrics.topSellers[0]
                      ? (row.qty / metrics.topSellers[0].qty) * 100
                      : 0
                  }
                />
              ))}
            </ReportBlock>
            <ReportBlock title="Expense hotspots">
              {metrics.expenseHotspots.map((row, i) => (
                <RankRow
                  key={row.categoryId}
                  rank={i + 1}
                  name={row.name}
                  meta=""
                  value={formatNpr(row.amount)}
                  bar={
                    metrics.expenseHotspots[0]
                      ? (row.amount / metrics.expenseHotspots[0].amount) * 100
                      : 0
                  }
                />
              ))}
            </ReportBlock>
            <ReportBlock title="Profit by product">
              {metrics.profitByProduct.map((row, i) => (
                <RankRow
                  key={row.menuItemId}
                  rank={i + 1}
                  name={row.name}
                  meta={`${row.marginPct}% margin`}
                  value={formatNpr(row.profit)}
                  bar={
                    metrics.profitByProduct[0]?.profit
                      ? (row.profit /
                          Math.max(metrics.profitByProduct[0].profit, 1)) *
                        100
                      : 0
                  }
                />
              ))}
            </ReportBlock>
          </>
        )}

        {tab === "more" && (
          <>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              More
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["cost", "Cost / Targets"],
                  ["pay", "Payables"],
                  ["exp", "Expenses"],
                  ["staff", "Attendance"],
                  ["reports", "Reports"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className="flex min-h-14 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/10"
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--garden-leaf)]/10">
              <span className="text-sm font-medium">
                VAT {state.settings.vatPercent}%
              </span>
              <input
                type="checkbox"
                checked={state.settings.vatEnabled}
                onChange={(e) =>
                  updateSettings({ vatEnabled: e.target.checked })
                }
                className="h-5 w-5"
              />
            </label>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
              <p className="font-semibold text-[var(--garden-deep)]">
                Menu prices
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {state.menuItems.map((m) => (
                  <li key={m.id} className="flex justify-between gap-2">
                    <span className="truncate">{m.name}</span>
                    <span className="font-medium">{formatNpr(m.price)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={resetDemo}
              className="flex min-h-14 w-full items-center justify-center rounded-2xl border border-[var(--garden-leaf)]/20 text-sm font-semibold text-[var(--garden-deep)]"
            >
              Reset demo data
            </button>
          </>
        )}
      </div>
    </PhoneShell>
  );
}

function minutesBetweenSafe(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--garden-leaf)]/10">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
        {value}
      </p>
    </div>
  );
}

function Quick({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-white px-4 py-4 text-left ring-1 ring-[var(--garden-leaf)]/10 active:scale-[0.99]"
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--garden-leaf)]">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-[var(--garden-deep)]">
        {value}
      </p>
    </button>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-[var(--garden-ink)]/50 ring-1 ring-[var(--garden-leaf)]/10">
      {children}
    </p>
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
              : "bg-[var(--garden-fog)]",
          )}
        >
          {m === "upi" ? "UPI" : m}
        </button>
      ))}
    </div>
  );
}

function ReportBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
      <p className="font-semibold text-[var(--garden-deep)]">{title}</p>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

function RankRow({
  rank,
  name,
  meta,
  value,
  bar,
}: {
  rank: number;
  name: string;
  meta: string;
  value: string;
  bar: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="min-w-0 truncate">
          <span className="mr-2 text-[var(--garden-ink)]/40">{rank}.</span>
          {name}
          {meta ? (
            <span className="ml-1 text-[var(--garden-ink)]/45">{meta}</span>
          ) : null}
        </span>
        <span className="shrink-0 font-semibold">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--garden-fog)]">
        <div
          className="h-full rounded-full bg-[var(--garden-leaf)] transition-all"
          style={{ width: `${Math.min(100, Math.max(6, bar))}%` }}
        />
      </div>
    </div>
  );
}

function SalesExpenseChart({
  points,
}: {
  points: { label: string; sales: number; expenses: number }[];
}) {
  const max = Math.max(
    ...points.flatMap((p) => [p.sales, p.expenses]),
    1,
  );
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-[var(--garden-deep)]">
          Sales vs expenses
        </p>
        <p className="text-[11px] text-[var(--garden-ink)]/45">7 days</p>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] font-medium">
        <span className="inline-flex items-center gap-1.5 text-[var(--garden-deep)]">
          <span className="h-2 w-2 rounded-full bg-[var(--garden-deep)]" />
          Sales
        </span>
        <span className="inline-flex items-center gap-1.5 text-[var(--garden-moss)]">
          <span className="h-2 w-2 rounded-full bg-[var(--garden-moss)]" />
          Expenses
        </span>
      </div>
      <div className="mt-4 flex h-36 items-end justify-between gap-1.5">
        {points.map((p) => (
          <div
            key={p.label}
            className="flex min-w-0 flex-1 flex-col items-center gap-1"
          >
            <div className="flex h-28 w-full items-end justify-center gap-0.5">
              <div
                className="w-[42%] rounded-t-md bg-[var(--garden-deep)] transition-all"
                style={{
                  height: `${Math.max(4, (p.sales / max) * 100)}%`,
                }}
                title={`Sales ${formatNpr(p.sales)}`}
              />
              <div
                className="w-[42%] rounded-t-md bg-[var(--garden-moss)]/80 transition-all"
                style={{
                  height: `${Math.max(4, (p.expenses / max) * 100)}%`,
                }}
                title={`Expenses ${formatNpr(p.expenses)}`}
              />
            </div>
            <span className="text-[10px] font-medium text-[var(--garden-ink)]/50">
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExpenseBreakdownChart({
  rows,
}: {
  rows: { categoryId: string; name: string; amount: number }[];
}) {
  const max = rows[0]?.amount || 1;
  const total = rows.reduce((s, r) => s + r.amount, 0) || 1;
  return (
    <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
      <p className="font-semibold text-[var(--garden-deep)]">
        Expense breakdown
      </p>
      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[var(--garden-fog)]">
        {rows.map((row, i) => {
          const tones = [
            "bg-[var(--garden-deep)]",
            "bg-[var(--garden-leaf)]",
            "bg-[var(--garden-moss)]",
            "bg-[var(--garden-gold)]",
            "bg-[var(--garden-fog)]",
          ];
          return (
            <div
              key={row.categoryId}
              className={cn("h-full", tones[i % tones.length])}
              style={{ width: `${(row.amount / total) * 100}%` }}
              title={`${row.name} ${formatNpr(row.amount)}`}
            />
          );
        })}
      </div>
      <ul className="mt-3 space-y-2.5">
        {rows.map((row, i) => (
          <li key={row.categoryId}>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate font-medium">{row.name}</span>
              <span className="shrink-0 font-semibold">
                {formatNpr(row.amount)}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--garden-fog)]">
              <div
                className={cn(
                  "h-full rounded-full",
                  i === 0
                    ? "bg-[var(--garden-deep)]"
                    : i === 1
                      ? "bg-[var(--garden-leaf)]"
                      : "bg-[var(--garden-moss)]",
                )}
                style={{
                  width: `${Math.min(100, Math.max(6, (row.amount / max) * 100))}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
