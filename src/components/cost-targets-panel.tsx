"use client";

import { useMemo, useState } from "react";
import type { MenuCategory } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

const SCENARIO_QTY = [10, 50, 100] as const;

const fieldClass =
  "h-10 w-full rounded-xl border border-[var(--garden-leaf)]/15 bg-white px-2 text-sm font-semibold text-[var(--garden-deep)]";

/** Owner-only Cost / Targets — editable packs, overhead, sell prices. */
export function CostTargetsPanel() {
  const {
    state,
    metrics,
    updateCostTargets,
    updateMonthlyOverhead,
    updateIngredientPack,
    updateDishCostRecipe,
    updateMenuItem,
    addMenuItem,
    removeMenuItem,
  } = useOps();
  const [openId, setOpenId] = useState<string | null>("chiya");
  const [targetDraft, setTargetDraft] = useState(
    String(state.costTargets.monthlySalesTarget),
  );
  const [newDish, setNewDish] = useState({
    name: "",
    price: "",
    packCost: "",
    yieldQty: "10",
  });

  const tea = useMemo(
    () => metrics.dishCosts.find((d) => d.menuItemId === "chiya"),
    [metrics.dishCosts],
  );

  const target = metrics.monthlyTarget;
  const oh = metrics.overhead;
  const shopName =
    state.costTargets.shopName || "Garden Restaurant · Kathmandu";

  function saveTarget() {
    const n = Number(targetDraft.replace(/,/g, ""));
    if (!n || n < 0) return;
    updateCostTargets({ monthlySalesTarget: n });
  }

  function addFoodItem() {
    const name = newDish.name.trim();
    const price = Number(newDish.price);
    if (!name || !price) return;
    const id = `dish-${Date.now()}`;
    const packCost = Number(newDish.packCost) || Math.round(price * 0.35);
    const yieldQty = Number(newDish.yieldQty) || 10;
    addMenuItem(
      {
        id,
        name,
        description: "Owner-added dish",
        price,
        cost: +(packCost / yieldQty).toFixed(2),
        category: "mains" as MenuCategory,
      },
      { packCost, yieldQty },
    );
    setNewDish({ name: "", price: "", packCost: "", yieldQty: "10" });
    setOpenId(id);
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
          Cost / Targets
        </h2>
        <p className="mt-1 text-sm text-[var(--garden-ink)]/55">
          Edit market prices — true cost & profit update live · NPR ·{" "}
          {target.monthLabel}
        </p>
      </div>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--garden-leaf)]">
          Shop name
        </p>
        <input
          className={cn(fieldClass, "mt-2")}
          value={shopName}
          onChange={(e) => updateCostTargets({ shopName: e.target.value })}
          aria-label="Shop name"
        />
      </section>

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
            Edit packs below — milk pack cost & yield drive this live.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <MiniStat label="Sell" value={formatNpr(tea.sellPrice)} />
            <MiniStat
              label="Ingredients"
              value={formatNpr(tea.ingredientCost)}
            />
            <MiniStat label="True cost" value={formatNpr(tea.trueCost)} />
            <MiniStat
              label="Profit / cup"
              value={formatNpr(tea.profitPerUnit)}
              strong
            />
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
        <p className="font-semibold text-[var(--garden-deep)]">
          Monthly overhead
        </p>
        <p className="mt-1 text-xs text-[var(--garden-ink)]/50">
          {formatNpr(oh.monthly)} / mo · ~{formatNpr(oh.daily)} / day · ~
          {formatNpr(oh.perUnit)} / dish
        </p>
        <ul className="mt-3 space-y-3">
          {state.monthlyOverheads.map((row) => {
            if (row.kind === "salary") {
              const count = row.staffCount ?? 0;
              const pay = row.payPerStaff ?? 0;
              const total = count * pay;
              return (
                <li key={row.id} className="space-y-2">
                  <p className="text-sm font-medium text-[var(--garden-deep)]">
                    Salaries · {count} staff
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-[11px] text-[var(--garden-ink)]/50">
                      Staff count
                      <input
                        type="number"
                        min={0}
                        className={cn(fieldClass, "mt-1")}
                        value={count}
                        onChange={(e) =>
                          updateMonthlyOverhead(row.id, {
                            staffCount: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </label>
                    <label className="text-[11px] text-[var(--garden-ink)]/50">
                      Pay / staff
                      <input
                        type="number"
                        min={0}
                        className={cn(fieldClass, "mt-1")}
                        value={pay}
                        onChange={(e) =>
                          updateMonthlyOverhead(row.id, {
                            payPerStaff: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </label>
                  </div>
                  <p className="text-right text-sm font-semibold tabular-nums">
                    = {formatNpr(total)} / mo
                  </p>
                </li>
              );
            }
            const rentLabel =
              row.kind === "rent" ? `Shop rent · ${shopName}` : row.label;
            return (
              <li
                key={row.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="min-w-0 truncate">{rentLabel}</span>
                <input
                  type="number"
                  className="h-10 w-24 rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-right text-sm font-semibold"
                  value={row.monthlyAmount}
                  onChange={(e) =>
                    updateMonthlyOverhead(row.id, {
                      monthlyAmount: Number(e.target.value) || 0,
                    })
                  }
                  aria-label={`${rentLabel} monthly NPR`}
                />
              </li>
            );
          })}
        </ul>
        <label className="mt-3 block text-[11px] text-[var(--garden-ink)]/50">
          Monthly dish volume (for overhead / unit)
          <input
            type="number"
            className={cn(fieldClass, "mt-1")}
            value={state.costTargets.monthlyUnitVolume}
            onChange={(e) =>
              updateCostTargets({
                monthlyUnitVolume: Number(e.target.value) || 1,
              })
            }
          />
        </label>
      </section>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
        <p className="font-semibold text-[var(--garden-deep)]">
          Ingredient packs
        </p>
        <p className="mt-1 text-xs text-[var(--garden-ink)]/50">
          Edit pack cost & yield — cost/unit recalculates
        </p>
        <ul className="mt-3 space-y-3">
          {state.ingredientPacks.map((pack) => {
            const unit =
              pack.yieldQty > 0
                ? +(pack.packCost / pack.yieldQty).toFixed(2)
                : 0;
            return (
              <li
                key={pack.id}
                className="rounded-xl bg-[var(--garden-fog)]/60 p-3"
              >
                <input
                  className={cn(fieldClass, "bg-[var(--garden-fog)]")}
                  value={pack.name}
                  onChange={(e) =>
                    updateIngredientPack(pack.id, { name: e.target.value })
                  }
                  aria-label={`${pack.name} name`}
                />
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <label className="text-[10px] text-[var(--garden-ink)]/45">
                    NPR / {pack.packLabel}
                    <input
                      type="number"
                      className={cn(fieldClass, "mt-1")}
                      value={pack.packCost}
                      onChange={(e) =>
                        updateIngredientPack(pack.id, {
                          packCost: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </label>
                  <label className="text-[10px] text-[var(--garden-ink)]/45">
                    Yield
                    <input
                      type="number"
                      className={cn(fieldClass, "mt-1")}
                      value={pack.yieldQty}
                      onChange={(e) =>
                        updateIngredientPack(pack.id, {
                          yieldQty: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </label>
                  <label className="text-[10px] text-[var(--garden-ink)]/45">
                    Unit
                    <input
                      className={cn(fieldClass, "mt-1")}
                      value={pack.yieldLabel}
                      onChange={(e) =>
                        updateIngredientPack(pack.id, {
                          yieldLabel: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <p className="mt-2 text-right text-sm font-semibold tabular-nums text-[var(--garden-deep)]">
                  {formatNpr(unit)} / {pack.yieldLabel}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
        <p className="font-semibold text-[var(--garden-deep)]">
          Add food item
        </p>
        <p className="mt-1 text-xs text-[var(--garden-ink)]/50">
          Creates a linked ingredient pack + recipe
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <input
            className={cn(fieldClass, "col-span-2")}
            placeholder="Dish name"
            value={newDish.name}
            onChange={(e) =>
              setNewDish((d) => ({ ...d, name: e.target.value }))
            }
          />
          <input
            type="number"
            className={fieldClass}
            placeholder="Sell NPR"
            value={newDish.price}
            onChange={(e) =>
              setNewDish((d) => ({ ...d, price: e.target.value }))
            }
          />
          <input
            type="number"
            className={fieldClass}
            placeholder="Pack cost NPR"
            value={newDish.packCost}
            onChange={(e) =>
              setNewDish((d) => ({ ...d, packCost: e.target.value }))
            }
          />
          <input
            type="number"
            className={cn(fieldClass, "col-span-2")}
            placeholder="Yield portions"
            value={newDish.yieldQty}
            onChange={(e) =>
              setNewDish((d) => ({ ...d, yieldQty: e.target.value }))
            }
          />
        </div>
        <button
          type="button"
          onClick={addFoodItem}
          className="mt-3 flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-sm font-semibold text-white"
        >
          Add dish + pack
        </button>
      </section>

      <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
        Per dish
      </p>

      {metrics.dishCosts.map((dish) => {
        const open = openId === dish.menuItemId;
        const recipe = state.dishCostRecipes.find(
          (r) => r.menuItemId === dish.menuItemId,
        );
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
              onClick={() => setOpenId(open ? null : dish.menuItemId)}
            >
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-lg text-[var(--garden-deep)]">
                  {dish.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--garden-ink)]/50">
                  Sell {formatNpr(dish.sellPrice)} · true{" "}
                  {formatNpr(dish.trueCost)} · {dish.contributionMarginPct}%
                  contrib
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
                <label className="block text-[11px] text-[var(--garden-ink)]/50">
                  Sell price (NPR)
                  <input
                    type="number"
                    className={cn(fieldClass, "mt-1")}
                    value={dish.sellPrice}
                    onChange={(e) =>
                      updateMenuItem(dish.menuItemId, {
                        price: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>

                {dish.lines.map((line) => (
                  <div
                    key={`${dish.menuItemId}-${line.packId}`}
                    className="rounded-xl bg-[var(--garden-fog)]/70 p-3"
                  >
                    <p className="text-sm font-medium text-[var(--garden-deep)]">
                      {line.packName}
                    </p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <label className="text-[10px] text-[var(--garden-ink)]/45">
                        Pack NPR
                        <input
                          type="number"
                          className={cn(fieldClass, "mt-1")}
                          value={line.packCost}
                          onChange={(e) =>
                            updateIngredientPack(line.packId, {
                              packCost: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </label>
                      <label className="text-[10px] text-[var(--garden-ink)]/45">
                        Yield
                        <input
                          type="number"
                          className={cn(fieldClass, "mt-1")}
                          value={line.yieldQty}
                          onChange={(e) =>
                            updateIngredientPack(line.packId, {
                              yieldQty: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </label>
                      <label className="text-[10px] text-[var(--garden-ink)]/45">
                        Use / dish
                        <input
                          type="number"
                          step="0.1"
                          className={cn(fieldClass, "mt-1")}
                          value={line.unitsPerDish}
                          onChange={(e) => {
                            if (!recipe) return;
                            updateDishCostRecipe(dish.menuItemId, {
                              ingredients: recipe.ingredients.map((ing) =>
                                ing.packId === line.packId
                                  ? {
                                      ...ing,
                                      unitsPerDish:
                                        Number(e.target.value) || 0,
                                    }
                                  : ing,
                              ),
                            });
                          }}
                        />
                      </label>
                    </div>
                    <p className="mt-2 text-right text-xs font-semibold">
                      Line cost {formatNpr(line.cost)}
                    </p>
                  </div>
                ))}

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
                <button
                  type="button"
                  onClick={() => {
                    if (
                      typeof window !== "undefined" &&
                      !window.confirm(`Delete ${dish.name} and its packs?`)
                    ) {
                      return;
                    }
                    removeMenuItem(dish.menuItemId);
                    setOpenId(null);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-red-800"
                >
                  Delete dish + packs
                </button>
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
  const { metrics, state } = useOps();
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
          Edit →
        </span>
      </div>
      <p className="mt-1 text-[11px] text-[var(--garden-ink)]/45">
        {state.costTargets.shopName}
      </p>
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
