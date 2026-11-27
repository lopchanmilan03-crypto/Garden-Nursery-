"use client";

import { useEffect, useState } from "react";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";
import type { MenuCategory } from "@/lib/demo-data";

const tabs = [
  { id: "menu", label: "Menu" },
  { id: "stock", label: "Stock" },
  { id: "today", label: "Today" },
  { id: "more", label: "More" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminPage() {
  const {
    state,
    setRole,
    updateMenuItem,
    updateStock,
    updateSettings,
    resetDemo,
    metrics,
    closeDay,
    ready,
  } = useOps();
  const [tab, setTab] = useState<TabId>("menu");

  useEffect(() => {
    setRole("owner");
  }, [setRole]);

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
        <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
          Admin
        </p>
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-[var(--garden-fog)] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "min-h-10 rounded-xl text-xs font-semibold",
                tab === t.id
                  ? "bg-[var(--garden-deep)] text-white"
                  : "text-[var(--garden-deep)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-3 px-4 pb-24 pt-4">
        {tab === "menu" &&
          state.menuItems.map((item) => (
            <div
              key={item.id}
              className="space-y-2 rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
            >
              <input
                className="h-11 w-full rounded-xl border border-[var(--garden-leaf)]/15 px-3 text-sm font-medium"
                value={item.name}
                onChange={(e) =>
                  updateMenuItem(item.id, { name: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-[var(--garden-leaf)]">
                  NPR
                  <input
                    type="number"
                    className="mt-1 h-11 w-full rounded-xl border border-[var(--garden-leaf)]/15 px-3 text-sm"
                    value={item.price}
                    onChange={(e) =>
                      updateMenuItem(item.id, {
                        price: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label className="text-xs text-[var(--garden-leaf)]">
                  Category
                  <select
                    className="mt-1 h-11 w-full rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-sm"
                    value={item.category}
                    onChange={(e) =>
                      updateMenuItem(item.id, {
                        category: e.target.value as MenuCategory,
                      })
                    }
                  >
                    <option value="mains">Plates</option>
                    <option value="sides">Garden</option>
                    <option value="drinks">Drinks</option>
                    <option value="sweets">Sweet</option>
                  </select>
                </label>
              </div>
            </div>
          ))}

        {tab === "stock" &&
          state.stock.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--garden-deep)]">{row.name}</p>
                <p className="text-xs text-[var(--garden-ink)]/50">
                  Low at {row.lowAt} {row.unit}
                </p>
              </div>
              <input
                type="number"
                step="0.1"
                className="h-12 w-20 rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-center text-sm font-semibold"
                value={row.qty}
                onChange={(e) =>
                  updateStock(row.id, { qty: Number(e.target.value) || 0 })
                }
              />
            </div>
          ))}

        {tab === "today" && (
          <>
            <div className="grid grid-cols-1 gap-2">
              <Stat label="Sale" value={formatNpr(metrics.sale)} />
              <Stat label="Kharcha" value={formatNpr(metrics.kharcha)} />
              <Stat label="Profit" value={formatNpr(metrics.profit)} />
            </div>
            <div className="rounded-2xl bg-white p-4 text-sm ring-1 ring-[var(--garden-leaf)]/10">
              <p className="font-semibold text-[var(--garden-deep)]">
                Payment mix
              </p>
              <p className="mt-2">Cash · {formatNpr(metrics.split.cash)}</p>
              <p>UPI · {formatNpr(metrics.split.upi)}</p>
              <p>Card · {formatNpr(metrics.split.card)}</p>
            </div>
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
                Day closed
              </p>
            )}
          </>
        )}

        {tab === "more" && (
          <>
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
              <p className="font-semibold text-[var(--garden-deep)]">Staff today</p>
              <ul className="mt-3 space-y-2 text-sm">
                {state.staff.map((s) => (
                  <li key={s.id} className="flex justify-between gap-2">
                    <span>{s.name}</span>
                    <span className="text-[var(--garden-ink)]/50">
                      {s.presentToday ? "In" : "Off"} · {s.role}
                    </span>
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
