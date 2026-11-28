"use client";

import {
  useEffect,
  useState,
  type InputHTMLAttributes,
} from "react";
import type { MenuCategory } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

const SCENARIO_QTY = [10, 50, 100] as const;

const fieldClass =
  "h-10 w-full rounded-xl border border-[var(--garden-leaf)]/15 bg-white px-2 text-sm font-semibold text-[var(--garden-deep)]";

/**
 * Number field that allows empty while typing; empty → 0 on blur.
 * Fixes NPR inputs stuck at 0 when backspacing.
 */
function SoftNumberInput({
  value,
  onCommit,
  className,
  ...rest
}: {
  value: number;
  onCommit: (n: number) => void;
  className?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type" | "onCommit"
>) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(String(value));

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  return (
    <input
      {...rest}
      inputMode="decimal"
      className={className}
      value={focused ? text : String(value)}
      onFocus={(e) => {
        setFocused(true);
        setText(String(value));
        rest.onFocus?.(e);
      }}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "" || v === "-" || /^-?\d*\.?\d*$/.test(v)) {
          setText(v);
          if (v !== "" && v !== "-" && v !== "." && v !== "-.") {
            onCommit(Number(v));
          }
        }
      }}
      onBlur={(e) => {
        setFocused(false);
        if (text === "" || text === "-" || text === "." || text === "-.") {
          onCommit(0);
          setText("0");
        } else {
          const n = Number(text);
          onCommit(Number.isFinite(n) ? n : 0);
        }
        rest.onBlur?.(e);
      }}
    />
  );
}

function servingsLabel(yieldLabel: string): string {
  const unit = yieldLabel.trim() || "serving";
  const plural =
    unit.endsWith("s") || unit.endsWith("S") ? unit : `${unit}s`;
  return `${plural} from 1 pack`;
}

/** Owner-only Cost / Targets — editable packs, attach ingredients per dish. */
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
    addIngredientPack,
    removeMenuItem,
  } = useOps();
  const [openId, setOpenId] = useState<string | null>("chiya");
  const [targetDraft, setTargetDraft] = useState(
    String(state.costTargets.monthlySalesTarget),
  );
  const [newDish, setNewDish] = useState({ name: "", price: "" });
  const [newPack, setNewPack] = useState({
    name: "",
    packCost: "",
    yieldQty: "10",
    packLabel: "pack",
    yieldLabel: "portion",
  });
  const [attachFor, setAttachFor] = useState<Record<string, string>>({});

  const target = metrics.monthlyTarget;
  const oh = metrics.overhead;
  const shopName =
    state.costTargets.shopName || "Garden Restaurant · Kathmandu";

  function saveTarget() {
    const n = Number(targetDraft.replace(/,/g, ""));
    if (!Number.isFinite(n) || n < 0) return;
    updateCostTargets({ monthlySalesTarget: n });
  }

  function addFoodItem() {
    const name = newDish.name.trim();
    const price = Number(newDish.price);
    if (!name || !Number.isFinite(price) || price < 0) return;
    const id = `dish-${Date.now()}`;
    addMenuItem(
      {
        id,
        name,
        description: "Owner-added dish",
        price,
        category: "mains" as MenuCategory,
      },
      { createPack: false },
    );
    setNewDish({ name: "", price: "" });
    setOpenId(id);
  }

  function addSharedPack() {
    const name = newPack.name.trim();
    if (!name) return;
    const id = `pack-${Date.now()}`;
    addIngredientPack({
      id,
      name,
      packCost: Number(newPack.packCost) || 0,
      packLabel: newPack.packLabel.trim() || "pack",
      yieldQty: Number(newPack.yieldQty) || 1,
      yieldLabel: newPack.yieldLabel.trim() || "portion",
    });
    setNewPack({
      name: "",
      packCost: "",
      yieldQty: "10",
      packLabel: "pack",
      yieldLabel: "portion",
    });
  }

  function attachIngredient(menuItemId: string, packId: string) {
    if (!packId) return;
    const recipe = state.dishCostRecipes.find(
      (r) => r.menuItemId === menuItemId,
    );
    const ingredients = recipe?.ingredients ?? [];
    if (ingredients.some((i) => i.packId === packId)) return;
    updateDishCostRecipe(menuItemId, {
      ingredients: [...ingredients, { packId, unitsPerDish: 1 }],
    });
    setAttachFor((prev) => ({ ...prev, [menuItemId]: "" }));
  }

  function removeIngredient(menuItemId: string, packId: string) {
    const recipe = state.dishCostRecipes.find(
      (r) => r.menuItemId === menuItemId,
    );
    if (!recipe) return;
    updateDishCostRecipe(menuItemId, {
      ingredients: recipe.ingredients.filter((i) => i.packId !== packId),
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
          Cost / Targets
        </h2>
        <p className="mt-1 text-sm text-[var(--garden-ink)]/55">
          Shared packs · attach ingredients per dish · NPR ·{" "}
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
              return (
                <li key={row.id} className="space-y-2">
                  <p className="text-sm font-medium text-[var(--garden-deep)]">
                    Salaries · {count} staff
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-[11px] text-[var(--garden-ink)]/50">
                      Staff count
                      <SoftNumberInput
                        className={cn(fieldClass, "mt-1")}
                        value={count}
                        onCommit={(n) =>
                          updateMonthlyOverhead(row.id, {
                            staffCount: Math.max(0, Math.round(n)),
                          })
                        }
                      />
                    </label>
                    <label className="text-[11px] text-[var(--garden-ink)]/50">
                      Pay / staff
                      <SoftNumberInput
                        className={cn(fieldClass, "mt-1")}
                        value={pay}
                        onCommit={(n) =>
                          updateMonthlyOverhead(row.id, {
                            payPerStaff: Math.max(0, n),
                          })
                        }
                      />
                    </label>
                  </div>
                  <p className="text-right text-sm font-semibold tabular-nums">
                    = {formatNpr(count * pay)} / mo
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
                <SoftNumberInput
                  className="h-10 w-24 rounded-xl border border-[var(--garden-leaf)]/15 px-2 text-right text-sm font-semibold"
                  value={row.monthlyAmount}
                  onCommit={(n) =>
                    updateMonthlyOverhead(row.id, {
                      monthlyAmount: Math.max(0, n),
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
          <SoftNumberInput
            className={cn(fieldClass, "mt-1")}
            value={state.costTargets.monthlyUnitVolume}
            onCommit={(n) =>
              updateCostTargets({
                monthlyUnitVolume: Math.max(1, Math.round(n) || 1),
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
          Shared list — attach packs to dishes below
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
                  className={cn(fieldClass, "bg-white")}
                  value={pack.name}
                  onChange={(e) =>
                    updateIngredientPack(pack.id, { name: e.target.value })
                  }
                  aria-label={`${pack.name} name`}
                />
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <label className="text-[10px] text-[var(--garden-ink)]/45">
                    NPR / {pack.packLabel}
                    <SoftNumberInput
                      className={cn(fieldClass, "mt-1")}
                      value={pack.packCost}
                      onCommit={(n) =>
                        updateIngredientPack(pack.id, {
                          packCost: Math.max(0, n),
                        })
                      }
                    />
                  </label>
                  <label className="text-[10px] text-[var(--garden-ink)]/45">
                    {servingsLabel(pack.yieldLabel)}
                    <SoftNumberInput
                      className={cn(fieldClass, "mt-1")}
                      value={pack.yieldQty}
                      onCommit={(n) =>
                        updateIngredientPack(pack.id, {
                          yieldQty: Math.max(0, n),
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
        <div className="mt-4 space-y-2 border-t border-[var(--garden-leaf)]/10 pt-3">
          <p className="text-xs font-semibold text-[var(--garden-deep)]">
            Add pack to shared list
          </p>
          <input
            className={fieldClass}
            placeholder="Pack name (e.g. Milk)"
            value={newPack.name}
            onChange={(e) =>
              setNewPack((p) => ({ ...p, name: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className={fieldClass}
              inputMode="decimal"
              placeholder="Pack NPR"
              value={newPack.packCost}
              onChange={(e) =>
                setNewPack((p) => ({ ...p, packCost: e.target.value }))
              }
            />
            <input
              className={fieldClass}
              inputMode="decimal"
              placeholder="Servings from 1 pack"
              value={newPack.yieldQty}
              onChange={(e) =>
                setNewPack((p) => ({ ...p, yieldQty: e.target.value }))
              }
            />
          </div>
          <button
            type="button"
            onClick={addSharedPack}
            className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[var(--garden-fog)] text-sm font-semibold"
          >
            Add pack
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
        <p className="font-semibold text-[var(--garden-deep)]">
          Add food item
        </p>
        <p className="mt-1 text-xs text-[var(--garden-ink)]/50">
          Starts empty — attach ingredients on the dish card
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
            className={cn(fieldClass, "col-span-2")}
            inputMode="decimal"
            placeholder="Sell NPR"
            value={newDish.price}
            onChange={(e) =>
              setNewDish((d) => ({ ...d, price: e.target.value }))
            }
          />
        </div>
        <button
          type="button"
          onClick={addFoodItem}
          className="mt-3 flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-sm font-semibold text-white"
        >
          Add dish
        </button>
      </section>

      <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
        Per dish · tap to expand
      </p>

      {metrics.dishCosts.map((dish) => {
        const open = openId === dish.menuItemId;
        const recipe = state.dishCostRecipes.find(
          (r) => r.menuItemId === dish.menuItemId,
        );
        const attachedIds = new Set(
          recipe?.ingredients.map((i) => i.packId) ?? [],
        );
        const availablePacks = state.ingredientPacks.filter(
          (p) => !attachedIds.has(p.id),
        );
        const profitLabel =
          dish.lines[0]?.yieldLabel === "cup" ? "Profit / cup" : "Profit / unit";

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
              className="w-full px-4 py-4 text-left"
              onClick={() => setOpenId(open ? null : dish.menuItemId)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--garden-leaf)]">
                    {open ? "Tap to close" : "Tap for detail"}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                    {dish.name}
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
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <MiniStat label="Sell" value={formatNpr(dish.sellPrice)} />
                <MiniStat
                  label="Ingredients"
                  value={formatNpr(dish.ingredientCost)}
                />
                <MiniStat label="True cost" value={formatNpr(dish.trueCost)} />
                <MiniStat
                  label={profitLabel}
                  value={formatNpr(dish.profitPerUnit)}
                  strong
                />
              </div>
            </button>

            {open ? (
              <div className="space-y-3 border-t border-[var(--garden-leaf)]/10 px-4 pb-4 pt-3">
                <label className="block text-[11px] text-[var(--garden-ink)]/50">
                  Sell price (NPR)
                  <SoftNumberInput
                    className={cn(fieldClass, "mt-1")}
                    value={dish.sellPrice}
                    onCommit={(n) =>
                      updateMenuItem(dish.menuItemId, {
                        price: Math.max(0, n),
                      })
                    }
                  />
                </label>

                <p className="text-xs font-semibold text-[var(--garden-deep)]">
                  Attached ingredients
                </p>
                {dish.lines.length === 0 ? (
                  <p className="rounded-xl bg-[var(--garden-fog)]/70 px-3 py-4 text-center text-sm text-[var(--garden-ink)]/50">
                    No ingredients yet — add from the shared pack list
                  </p>
                ) : (
                  dish.lines.map((line) => (
                    <div
                      key={`${dish.menuItemId}-${line.packId}`}
                      className="rounded-xl bg-[var(--garden-fog)]/70 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-[var(--garden-deep)]">
                          {line.packName}
                        </p>
                        <button
                          type="button"
                          className="text-xs font-semibold text-red-800"
                          onClick={() =>
                            removeIngredient(dish.menuItemId, line.packId)
                          }
                        >
                          Remove
                        </button>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <label className="text-[10px] text-[var(--garden-ink)]/45">
                          Pack NPR
                          <SoftNumberInput
                            className={cn(fieldClass, "mt-1")}
                            value={line.packCost}
                            onCommit={(n) =>
                              updateIngredientPack(line.packId, {
                                packCost: Math.max(0, n),
                              })
                            }
                          />
                        </label>
                        <label className="text-[10px] text-[var(--garden-ink)]/45">
                          {servingsLabel(line.yieldLabel)}
                          <SoftNumberInput
                            className={cn(fieldClass, "mt-1")}
                            value={line.yieldQty}
                            onCommit={(n) =>
                              updateIngredientPack(line.packId, {
                                yieldQty: Math.max(0, n),
                              })
                            }
                          />
                        </label>
                        <label className="text-[10px] text-[var(--garden-ink)]/45">
                          Use / dish
                          <SoftNumberInput
                            className={cn(fieldClass, "mt-1")}
                            value={line.unitsPerDish}
                            onCommit={(n) => {
                              const ingredients = recipe?.ingredients ?? [];
                              updateDishCostRecipe(dish.menuItemId, {
                                ingredients: ingredients.map((ing) =>
                                  ing.packId === line.packId
                                    ? {
                                        ...ing,
                                        unitsPerDish: Math.max(0, n),
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
                  ))
                )}

                <div className="flex gap-2">
                  <select
                    className={cn(fieldClass, "flex-1")}
                    value={attachFor[dish.menuItemId] ?? ""}
                    onChange={(e) =>
                      setAttachFor((prev) => ({
                        ...prev,
                        [dish.menuItemId]: e.target.value,
                      }))
                    }
                  >
                    <option value="">Pick pack…</option>
                    {availablePacks.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="min-h-10 shrink-0 rounded-xl bg-[var(--garden-deep)] px-3 text-sm font-semibold text-white"
                    onClick={() =>
                      attachIngredient(
                        dish.menuItemId,
                        attachFor[dish.menuItemId] ?? "",
                      )
                    }
                  >
                    Add ingredient
                  </button>
                </div>

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
                      !window.confirm(`Delete ${dish.name}?`)
                    ) {
                      return;
                    }
                    removeMenuItem(dish.menuItemId);
                    setOpenId(null);
                  }}
                  className="w-full py-2 text-center text-sm font-semibold text-red-800"
                >
                  Delete dish
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
