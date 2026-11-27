"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DemoQr } from "@/components/demo-qr";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";
import type { PayMethod } from "@/lib/demo-data";

const tabs = [
  { id: "today", label: "Aaj ki sale" },
  { id: "billing", label: "Billing" },
  { id: "stock", label: "Stock" },
  { id: "expenses", label: "Kharcha" },
  { id: "staff", label: "Staff" },
  { id: "monthly", label: "Monthly" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function DashboardPage() {
  const {
    state,
    metrics,
    settleBill,
    closeDay,
    reopenDay,
    updateStaff,
    payableTotal,
    applyDiscount,
    voidOrder,
    voidLine,
    splitBill,
    paySplitPart,
  } = useOps();
  const [tab, setTab] = useState<TabId>("today");
  const [expandedBill, setExpandedBill] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState("Guest changed mind");
  const [discountDraft, setDiscountDraft] = useState(10);

  const unpaid = useMemo(
    () =>
      state.orders.filter(
        (o) =>
          o.status !== "paid" &&
          o.status !== "cancelled" &&
          (o.status === "ready" ||
            o.status === "served" ||
            o.status === "new" ||
            o.status === "preparing"),
      ),
    [state.orders],
  );

  return (
    <main className="min-h-screen bg-[var(--garden-sand)]">
      <div className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e8f2ea_0%,#f4f8f5_100%)]">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-1 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
            Cafe ops · role: {state.role} · sample data
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
                Quiet cafe tools
              </h1>
              <p className="mt-2 max-w-xl text-[var(--garden-ink)]/70">
                Sale, kharcha, stock, billing, and staff — kept sparse so the
                patio stays calm.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/demo"
                className="inline-flex h-11 items-center rounded-md bg-[var(--garden-leaf)] px-5 text-sm font-medium text-[var(--garden-mist)]"
              >
                Table order
              </Link>
              <Link
                href="/kitchen"
                className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm font-medium text-[var(--garden-deep)]"
              >
                Kitchen pass
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-[var(--garden-fog)] px-3 py-1 text-xs font-medium text-[var(--garden-deep)]">
              Dine-in garden cafe · limited menu
            </span>
            {state.settings.vatEnabled ? (
              <span className="rounded-md bg-white px-3 py-1 text-xs ring-1 ring-[var(--garden-leaf)]/15">
                VAT {state.settings.vatPercent}% on
              </span>
            ) : null}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Aaj ki sale" value={formatNpr(metrics.sale)} />
            <Metric label="Kharcha (today)" value={formatNpr(metrics.kharcha)} />
            <Metric
              label="Profit"
              value={formatNpr(metrics.profit)}
              tone={metrics.profit >= 0 ? "good" : "warn"}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition",
                  tab === t.id
                    ? "bg-[var(--garden-deep)] text-[var(--garden-mist)]"
                    : "bg-white text-[var(--garden-ink)]/70 ring-1 ring-[var(--garden-leaf)]/15",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        {tab === "today" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-[var(--garden-leaf)]/12 bg-white/90 p-5">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Payment mix
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Cash" value={formatNpr(metrics.split.cash)} />
                <Row label="Card" value={formatNpr(metrics.split.card)} />
                <Row label="UPI / QR" value={formatNpr(metrics.split.upi)} />
              </dl>
            </section>
            <section className="rounded-xl border border-[var(--garden-leaf)]/12 bg-white/90 p-5">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Alerts
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between gap-3">
                  <span>Low stock SKUs</span>
                  <strong>{metrics.lowStock.length}</strong>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Vendor dues</span>
                  <strong>{formatNpr(metrics.vendorDues)}</strong>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Orders on the pass</span>
                  <strong>
                    {
                      state.kitchenTickets.filter((t) => t.status !== "bumped")
                        .length
                    }
                  </strong>
                </li>
                <li className="flex justify-between gap-3">
                  <span>Staff present</span>
                  <strong>
                    {state.staff.filter((s) => s.presentToday).length}/
                    {state.staff.length}
                  </strong>
                </li>
              </ul>
              {metrics.lowStock.length > 0 && (
                <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-950">
                  Low: {metrics.lowStock.map((s) => s.name).join(", ")}
                </p>
              )}
            </section>
            <section className="lg:col-span-2 rounded-xl border border-[var(--garden-leaf)]/12 bg-white/90 p-5">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Patio tables · QR menu
              </h2>
              <p className="mt-1 text-sm opacity-65">
                Share a table link — guests browse the short menu from their seat.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {state.tables.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-lg border border-[var(--garden-leaf)]/15 px-3 py-3 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{t.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-wide opacity-60">
                          {t.status}
                        </p>
                      </div>
                      <DemoQr seed={`table-${t.id}`} size={48} />
                    </div>
                    <Link
                      href={`/table/${t.id}`}
                      className="mt-2 inline-block text-xs text-[var(--garden-leaf)] underline"
                    >
                      /table/{t.id}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "billing" && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="space-y-3">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Open bills · split / void / discount
              </h2>
              {unpaid.length === 0 ? (
                <p className="text-sm text-[var(--garden-ink)]/60">
                  No open bills to settle.
                </p>
              ) : (
                unpaid.map((o) => {
                  const due = payableTotal(o);
                  const open = expandedBill === o.id;
                  return (
                    <div
                      key={o.id}
                      className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white px-4 py-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">
                            {o.guest} · {o.table ?? "Takeaway"}
                            {o.source === "guest" ? (
                              <span className="ml-2 text-xs text-[var(--garden-leaf)]">
                                QR guest
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-1 text-sm text-[var(--garden-ink)]/65">
                            {o.items.join(" · ") || "—"}
                          </p>
                          <p className="mt-2 font-semibold">
                            {formatNpr(due)}
                            {o.discountPct ? (
                              <span className="ml-2 text-xs font-normal opacity-60">
                                (−{o.discountPct}% disc
                                {state.settings.vatEnabled
                                  ? ` · VAT ${state.settings.vatPercent}%`
                                  : ""}
                                )
                              </span>
                            ) : state.settings.vatEnabled ? (
                              <span className="ml-2 text-xs font-normal opacity-60">
                                incl. VAT {state.settings.vatPercent}%
                              </span>
                            ) : null}
                          </p>
                        </div>
                        <span className="rounded-md bg-[var(--garden-fog)] px-2 py-1 text-xs">
                          {o.status}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(["cash", "upi", "card"] as PayMethod[]).map((m) => (
                          <Button
                            key={m}
                            size="sm"
                            variant={m === "upi" ? "soft" : "outline"}
                            disabled={state.dayClose.closed || !!o.splits?.length}
                            onClick={() => settleBill(o.id, m)}
                          >
                            {m === "upi" ? "UPI / QR" : m}
                          </Button>
                        ))}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setExpandedBill(open ? null : o.id)
                          }
                        >
                          {open ? "Hide tools" : "Split / void"}
                        </Button>
                      </div>
                      {open && (
                        <div className="mt-4 space-y-3 border-t border-[var(--garden-leaf)]/10 pt-3 text-sm">
                          <div className="flex flex-wrap items-end gap-2">
                            <label>
                              Discount %
                              <input
                                type="number"
                                className="ml-2 h-9 w-20 rounded-md border border-[var(--garden-leaf)]/20 px-2"
                                value={discountDraft}
                                onChange={(e) =>
                                  setDiscountDraft(Number(e.target.value) || 0)
                                }
                              />
                            </label>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                applyDiscount(o.id, discountDraft)
                              }
                            >
                              Apply
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                splitBill(o.id, "seats", [
                                  { label: "Seat A", seats: 1 },
                                  { label: "Seat B", seats: 1 },
                                ])
                              }
                            >
                              Split 2 seats
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const half = +(due / 2).toFixed(2);
                                splitBill(o.id, "amount", [
                                  { label: "Part 1", amount: half },
                                  { label: "Part 2", amount: +(due - half).toFixed(2) },
                                ]);
                              }}
                            >
                              Split 50/50 amount
                            </Button>
                          </div>
                          {o.splits?.length ? (
                            <ul className="space-y-2">
                              {o.splits.map((sp) => (
                                <li
                                  key={sp.id}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-[var(--garden-sand)] px-3 py-2"
                                >
                                  <span>
                                    {sp.label} · {formatNpr(sp.amount)}
                                    {sp.paid ? " · paid" : ""}
                                  </span>
                                  {!sp.paid ? (
                                    <div className="flex gap-1">
                                      {(["cash", "upi", "card"] as PayMethod[]).map(
                                        (m) => (
                                          <Button
                                            key={m}
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              paySplitPart(o.id, sp.id, m)
                                            }
                                          >
                                            {m}
                                          </Button>
                                        ),
                                      )}
                                    </div>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                          {(o.lines ?? []).length > 0 && (
                            <ul className="space-y-1">
                              {(o.lines ?? []).map((line, idx) => (
                                <li
                                  key={`${line.menuItemId}-${idx}`}
                                  className="flex items-center justify-between gap-2"
                                >
                                  <span
                                    className={cn(
                                      line.voided && "line-through opacity-50",
                                    )}
                                  >
                                    {line.name} ×{line.qty}
                                  </span>
                                  {!line.voided ? (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        voidLine(o.id, idx, voidReason)
                                      }
                                    >
                                      Void line
                                    </Button>
                                  ) : (
                                    <span className="text-xs opacity-50">
                                      {line.voidReason}
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="flex flex-wrap items-end gap-2">
                            <input
                              className="h-9 flex-1 rounded-md border border-[var(--garden-leaf)]/20 px-2"
                              value={voidReason}
                              onChange={(e) => setVoidReason(e.target.value)}
                              placeholder="Void reason"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => voidOrder(o.id, voidReason)}
                            >
                              Void order
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </section>
            <section className="h-fit rounded-xl border border-[var(--garden-leaf)]/12 bg-[var(--garden-deep)] p-5 text-[var(--garden-mist)]">
              <h2 className="font-[family-name:var(--font-display)] text-2xl">
                Day closing
              </h2>
              <p className="mt-1 text-sm text-[var(--garden-fog)]/80">
                {state.dayClose.date} · Asia/Kathmandu
              </p>
              <dl className="mt-5 space-y-2 text-sm">
                <Row label="Cash drawer" value={formatNpr(state.dayClose.cash)} light />
                <Row label="Card" value={formatNpr(state.dayClose.card)} light />
                <Row label="UPI" value={formatNpr(state.dayClose.upi)} light />
                <Row
                  label="Kharcha logged"
                  value={formatNpr(state.dayClose.expenses)}
                  light
                />
              </dl>
              <p className="mt-4 text-sm">
                Status:{" "}
                <strong>
                  {state.dayClose.closed
                    ? `Closed ${state.dayClose.closedAt ?? ""}`
                    : "Open"}
                </strong>
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {!state.dayClose.closed ? (
                  <Button variant="soft" onClick={closeDay}>
                    Close day
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-[var(--garden-mist)] hover:bg-white/10"
                    onClick={reopenDay}
                  >
                    Reopen (demo)
                  </Button>
                )}
              </div>
            </section>
          </div>
        )}

        {tab === "stock" && (
          <section>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Live stock
              </h2>
              <Link href="/admin" className="text-sm text-[var(--garden-leaf)]">
                Edit thresholds →
              </Link>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[var(--garden-leaf)]/12 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--garden-leaf)]/10 text-xs uppercase tracking-wide text-[var(--garden-leaf)]">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Low at</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.stock.map((row) => {
                    const low = row.qty <= row.lowAt;
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-[var(--garden-leaf)]/8"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium">{row.name}</p>
                          <p className="text-xs opacity-55">{row.category}</p>
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                          {row.qty} {row.unit}
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                          {row.lowAt} {row.unit}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "rounded-md px-2 py-1 text-xs font-medium",
                              low
                                ? "bg-amber-100 text-amber-950"
                                : "bg-emerald-50 text-emerald-900",
                            )}
                          >
                            {low ? "Low stock" : "OK"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "expenses" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Kharcha by category
              </h2>
              <ul className="mt-4 space-y-2">
                {state.expenseCategories.map((cat) => {
                  const sum = state.expenses
                    .filter((e) => e.categoryId === cat.id)
                    .reduce((s, e) => s + e.amount, 0);
                  return (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--garden-leaf)]/12 bg-white px-4 py-3 text-sm"
                    >
                      <span>
                        {cat.name}
                        {cat.nameNp ? (
                          <span className="ml-2 opacity-50">{cat.nameNp}</span>
                        ) : null}
                      </span>
                      <strong>{formatNpr(sum)}</strong>
                    </li>
                  );
                })}
              </ul>
              <h3 className="mt-6 font-medium text-[var(--garden-deep)]">
                Recent entries
              </h3>
              <ul className="mt-2 space-y-2">
                {state.expenses.slice(0, 6).map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg border border-[var(--garden-leaf)]/10 bg-white/80 px-3 py-2 text-sm"
                  >
                    <div className="flex justify-between gap-2">
                      <span>{e.label}</span>
                      <span className="font-medium">{formatNpr(e.amount)}</span>
                    </div>
                    <p className="mt-1 text-xs opacity-55">
                      {e.date} · {e.paid ? "Paid" : "Due"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Vendor dues
              </h2>
              <ul className="mt-4 space-y-3">
                {state.vendors.map((v) => (
                  <li
                    key={v.id}
                    className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white px-4 py-3"
                  >
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <p className="text-xs opacity-55">
                          {v.category} · {v.phone}
                        </p>
                      </div>
                      <p
                        className={cn(
                          "font-semibold",
                          v.dues > 0
                            ? "text-amber-800"
                            : "text-[var(--garden-leaf)]",
                        )}
                      >
                        {formatNpr(v.dues)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {tab === "staff" && (
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Attendance · shift · salary
            </h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--garden-leaf)]/12 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-[var(--garden-leaf)]/10 text-xs uppercase tracking-wide text-[var(--garden-leaf)]">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Salary</th>
                    <th className="px-4 py-3">Today</th>
                  </tr>
                </thead>
                <tbody>
                  {state.staff.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-[var(--garden-leaf)]/8"
                    >
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 capitalize">{s.role}</td>
                      <td className="px-4 py-3">{s.shift}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {s.salary ? formatNpr(s.salary) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateStaff(s.id, {
                              presentToday: !s.presentToday,
                            })
                          }
                          className={cn(
                            "rounded-md px-2.5 py-1 text-xs font-medium",
                            s.presentToday
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-slate-100 text-slate-600",
                          )}
                        >
                          {s.presentToday ? "Present" : "Absent"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "monthly" && (
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Monthly report
            </h2>
            <p className="mt-1 text-sm text-[var(--garden-ink)]/65">
              Sales vs kharcha vs profit (NPR demo).
            </p>
            <div className="mt-6 space-y-3">
              {state.monthly.map((m) => {
                const max = Math.max(...state.monthly.map((x) => x.sales));
                const pct = Math.round((m.sales / max) * 100);
                return (
                  <div
                    key={m.month}
                    className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-medium w-10">{m.month}</span>
                      <span>Sale {formatNpr(m.sales)}</span>
                      <span>Kharcha {formatNpr(m.kharcha)}</span>
                      <span className="font-semibold text-[var(--garden-deep)]">
                        Profit {formatNpr(m.profit)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--garden-fog)]">
                      <div
                        className="h-full rounded-full bg-[var(--garden-leaf)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "warn";
}) {
  return (
    <div className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white/70 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-[family-name:var(--font-display)] text-2xl",
          tone === "good" && "text-emerald-800",
          tone === "warn" && "text-amber-800",
          tone === "default" && "text-[var(--garden-deep)]",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  light,
}: {
  label: string;
  value: string;
  light?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className={light ? "text-[var(--garden-fog)]/80" : "opacity-70"}>
        {label}
      </dt>
      <dd className="tabular-nums font-medium">{value}</dd>
    </div>
  );
}
