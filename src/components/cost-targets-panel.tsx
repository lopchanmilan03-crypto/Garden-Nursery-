"use client";

import { useMemo, useState } from "react";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

const SCENARIO_QTY = [10, 50, 100] as const;

/** Owner-only Cost / Targets — recipe costing, overhead, monthly goal. */
export function CostTargetsPanel() {
  const {
    state,
    metrics,
    updateCostTargets,
    updateMonthlyOverhead,
  } = useOps();
  const [openId, setOpenId] = useState<string | null>("chiya");
  const [targetDraft, setTargetDraft] = useState(
    String(state.costTargets.monthlySalesTarget),
  );

  const tea = useMemo(
    () => metrics.dishCosts.find((d) => d.menuItemId === "chiya"),
    [metrics.dishCosts],
  );

  const target = metrics.monthlyTarget;
  const oh = metrics.overhead;

  function saveTarget() {
    const n = Number(targetDraft.replace(/,/g, ""));
    if (!n || n < 0) return;
    updateCostTargets({ monthlySalesTarget: n });
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
          Cost / Targets
        </h2>
        <p className="mt-1 text-sm text-[var(--garden-ink)]/55">
          True cost = ingredients + overhead · NPR · {target.monthLabel}
        </p>
      </div>

      <section className="rounded-2xl bg-[var(--garden-deep)] px-4 py-4 text-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
              Monthly sales target
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl">
              {formatNpr(target.target)}
            </p>
          </div>
          <p className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            {target.pct}%
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-[var(--garden-gold)] transition-[width]"
            style={{ width: `${target.pct}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-white/55">MTD actual</p>
            <p className="font-semibold">{formatNpr(target.actual)}</p>
          </div>
          <div>
            <p className="text-white/55">Still to earn</p>
            <p className="font-semibold text-[var(--garden-gold)]">
              {formatNpr(target.remaining)}
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            className="min-h-11 flex-1 rounded-xl border-0 bg-white/10 px-3 text-sm text-white placeholder:text-white/40"
            value={targetDraft}
            onChange={(e) => setTargetDraft(e.target.value)}
            aria-label="Monthly sales target NPR"
          />
          <button
            type="button"
            onClick={saveTarget}
            className="min-h-11 rounded-xl bg-[var(--garden-gold)] px-4 text-sm font-semibold text-[var(--garden-deep)]"
          >
            Set
          </button>
        </div>
      </section>

      {tea ? (
        <section className="rounded-2xl bg-white p-4 ring-1 ring-emerald-200/80">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--garden-leaf)]">
            Tea example
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
            {tea.name}
          </p>
          <p className="mt-1 text-sm text-[var(--garden-ink)]/60">
            {tea.note ??
              "Milk NPR 100/packet ≈ 10 cups · true cost auto-totals"}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <MiniStat label="Sell" value={formatNpr(tea.sellPrice)} />
            <MiniStat label="Ingredients" value={formatNpr(tea.ingredientCost)} />
            <MiniStat label="True cost" value={formatNpr(tea.trueCost)} />
            <MiniStat
              label="Profit / cup"
              value={formatNpr(tea.profitPerUnit)}
              strong
            />
          </div>
          <p className="mt-3 text-xs text-[var(--garden-ink)]/50">
            Break-even to cover monthly overhead ≈{" "}
            <span className="font-semibold text-[var(--garden-deep)]">
              {tea.breakEvenUnits.toLocaleString("en-NP")} cups
            </span>
            {" · "}
            50 cups → cash {formatNpr(tea.cashIfSold(50))}, earn{" "}
            {formatNpr(tea.profitIfSold(50))}
          </p>
        </section>
      ) : null}

      <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
        <p className="font-semibold text-[var(--garden-deep)]">
          Monthly overhead
        </p>
        <p className="mt-1 text-xs text-[var(--garden-ink)]/50">
          {formatNpr(oh.monthly)} / mo · ~{formatNpr(oh.daily)} / day · ~
          {formatNpr(oh.perUnit)} / dish (at{" "}
          {state.costTargets.monthlyUnitVolume.toLocaleString("en-NP")} units)
        </p>
        <ul className="mt-3 space-y-2">
          {state.monthlyOverheads.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="min-w-0 truncate">{row.label}</span>
              <input
                type="number"
                className="h-10 w-24 rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-right text-sm font-semibold"
                value={row.monthlyAmount}
                onChange={(e) =>
                  updateMonthlyOverhead(row.id, {
                    monthlyAmount: Number(e.target.value) || 0,
                  })
                }
                aria-label={`${row.label} monthly NPR`}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
        <p className="font-semibold text-[var(--garden-deep)]">
          Ingredient packs
        </p>
        <p className="mt-1 text-xs text-[var(--garden-ink)]/50">
          Pack cost → yield → cost per unit
        </p>
        <ul className="mt-3 space-y-2">
          {state.ingredientPacks.map((pack) => {
            const unit =
              pack.yieldQty > 0
                ? +(pack.packCost / pack.yieldQty).toFixed(2)
                : 0;
            return (
              <li
                key={pack.id}
                className="flex items-baseline justify-between gap-2 text-sm"
              >
                <span className="min-w-0">
                  <span className="font-medium">{pack.name}</span>
                  <span className="mt-0.5 block text-[11px] text-[var(--garden-ink)]/45">
                    {formatNpr(pack.packCost)}/{pack.packLabel} → {pack.yieldQty}{" "}
                    {pack.yieldLabel}s
                  </span>
                </span>
                <span className="shrink-0 tabular-nums font-semibold">
                  {formatNpr(unit)}/{pack.yieldLabel}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
        Per dish
      </p>

      {metrics.dishCosts.map((dish) => {
        const open = openId === dish.menuItemId;
        return (
          <article
            key={dish.menuItemId}
            className={cn(
              "rounded-2xl bg-white ring-1",
              dish.menuItemId === "chiya"
                ? "ring-emerald-200"
                : "ring-[var(--garden-leaf)]/10",
            )}
          >
            <button
              type="button"
              className="flex w-full items-start justify-between gap-2 px-4 py-4 text-left"
              onClick={() =>
                setOpenId(open ? null : dish.menuItemId)
              }
            >
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-lg text-[var(--garden-deep)]">
                  {dish.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--garden-ink)]/50">
                  Sell {formatNpr(dish.sellPrice)} · true{" "}
                  {formatNpr(dish.trueCost)} ·{" "}
                  {dish.contributionMarginPct}% contrib
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 font-[family-name:var(--font-display)] text-lg",
                  dish.profitPerUnit >= 0
                    ? "text-emerald-800"
                    : "text-red-800",
                )}
              >
                {formatNpr(dish.profitPerUnit)}
              </p>
            </button>

            {open ? (
              <div className="space-y-3 border-t border-[var(--garden-leaf)]/10 px-4 pb-4 pt-3">
                {dish.note ? (
                  <p className="text-xs text-[var(--garden-ink)]/55">
                    {dish.note}
                  </p>
                ) : null}
                <ul className="space-y-1.5 text-sm">
                  {dish.lines.map((line) => (
                    <li
                      key={`${dish.menuItemId}-${line.packName}`}
                      className="flex justify-between gap-2"
                    >
                      <span className="min-w-0 truncate text-[var(--garden-ink)]/70">
                        {line.packName} ×{line.unitsPerDish}{" "}
                        <span className="text-[11px] text-[var(--garden-ink)]/40">
                          ({formatNpr(line.packCost)} → {line.yieldQty}{" "}
                          {line.yieldLabel}s)
                        </span>
                      </span>
                      <span className="shrink-0 tabular-nums font-medium">
                        {formatNpr(line.cost)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="space-y-1 rounded-xl bg-[var(--garden-fog)]/70 px-3 py-2.5 text-sm">
                  <CostRow
                    label="Ingredient cost"
                    value={formatNpr(dish.ingredientCost)}
                  />
                  <CostRow
                    label="Overhead share"
                    value={formatNpr(dish.overheadShare)}
                  />
                  <CostRow
                    label="True cost"
                    value={formatNpr(dish.trueCost)}
                    strong
                  />
                  <CostRow
                    label="Sell price"
                    value={formatNpr(dish.sellPrice)}
                  />
                  <CostRow
                    label="Profit / unit"
                    value={formatNpr(dish.profitPerUnit)}
                    strong
                  />
                </div>
                <p className="text-xs text-[var(--garden-ink)]/55">
                  Break-even vs full monthly overhead:{" "}
                  <span className="font-semibold text-[var(--garden-deep)]">
                    {dish.breakEvenUnits.toLocaleString("en-NP")} units
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {SCENARIO_QTY.map((qty) => (
                    <div
                      key={qty}
                      className="rounded-xl bg-[var(--garden-fog)] px-2 py-2 text-center"
                    >
                      <p className="text-[10px] uppercase tracking-wide text-[var(--garden-ink)]/45">
                        {qty} sold
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[var(--garden-deep)]">
                        {formatNpr(dish.cashIfSold(qty))}
                      </p>
                      <p className="text-[10px] text-emerald-800">
                        +{formatNpr(dish.profitIfSold(qty))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

/** Compact monthly target card for Owner Dash. */
export function CostTargetsDashCard({ onOpen }: { onOpen: () => void }) {
  const { metrics } = useOps();
  const t = metrics.monthlyTarget;
  const tea = metrics.dishCosts.find((d) => d.menuItemId === "chiya");

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl bg-white p-4 text-left ring-1 ring-[var(--garden-leaf)]/10 active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-[var(--garden-deep)]">
          Cost / Targets
        </p>
        <span className="text-xs font-semibold text-[var(--garden-leaf)]">
          Open →
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--garden-fog)]">
        <div
          className="h-full rounded-full bg-[var(--garden-deep)]"
          style={{ width: `${t.pct}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-[var(--garden-ink)]/65">
        {t.pct}% of {formatNpr(t.target)} · need{" "}
        <span className="font-semibold text-[var(--garden-deep)]">
          {formatNpr(t.remaining)}
        </span>
      </p>
      {tea ? (
        <p className="mt-1 text-xs text-[var(--garden-ink)]/50">
          Chiya true cost {formatNpr(tea.trueCost)} · profit{" "}
          {formatNpr(tea.profitPerUnit)}/cup
        </p>
      ) : null}
    </button>
  );
}

function MiniStat({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-xl bg-[var(--garden-fog)]/80 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-[var(--garden-ink)]/45">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 tabular-nums",
          strong
            ? "font-semibold text-[var(--garden-deep)]"
            : "font-medium text-[var(--garden-deep)]",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function CostRow({
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
        strong && "pt-0.5 font-semibold text-[var(--garden-deep)]",
      )}
    >
      <span className={strong ? undefined : "text-[var(--garden-ink)]/60"}>
        {label}
      </span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
