"use client";

import { useState } from "react";
import Link from "next/link";
import { DemoQr } from "@/components/demo-qr";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";
import type { MenuCategory, Role } from "@/lib/demo-data";

const sections = [
  { id: "menu", label: "Menu & prices" },
  { id: "recipes", label: "Recipes → stock" },
  { id: "stock", label: "Stock thresholds" },
  { id: "vat", label: "VAT" },
  { id: "staff", label: "Staff" },
  { id: "expenses", label: "Expense categories" },
  { id: "vendors", label: "Vendors" },
  { id: "qr", label: "Table QR" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export default function AdminPage() {
  const {
    state,
    updateMenuItem,
    updateRecipe,
    addMenuItem,
    updateStock,
    updateStaff,
    addStaff,
    updateExpenseCategory,
    addExpenseCategory,
    addExpense,
    updateVendor,
    addVendor,
    updateSettings,
    resetDemo,
  } = useOps();
  const [section, setSection] = useState<SectionId>("menu");

  if (state.role !== "owner" && state.role !== "cashier") {
    return (
      <main className="min-h-screen bg-[var(--garden-sand)]">
        <SiteNav />
        <div className="mx-auto max-w-lg px-5 py-16 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
            Admin locked
          </h1>
          <p className="mt-3 text-[var(--garden-ink)]/70">
            Switch role to Owner / Admin (or Cashier) using the role switcher
            above to edit demo data.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--garden-sand)]">
      <div className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e8f2ea_0%,#f4f8f5_100%)]">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-1 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
            Admin · editable demo data
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
                Garden settings
              </h1>
              <p className="mt-2 max-w-xl text-[var(--garden-ink)]/70">
                Edit menu prices, stock lows, staff, expense categories, and
                vendors. Changes persist in this browser (demo).
              </p>
            </div>
            <Button variant="outline" onClick={resetDemo}>
              Reset demo data
            </Button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm",
                  section === s.id
                    ? "bg-[var(--garden-deep)] text-[var(--garden-mist)]"
                    : "bg-white ring-1 ring-[var(--garden-leaf)]/15",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        {section === "menu" && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--garden-ink)]/70">
              CMS-style menu for the public site (/menu) and ops. Edit name,
              price, category, description, and image URL — changes sync via
              localStorage.
            </p>
            {state.menuItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-lg border border-[var(--garden-leaf)]/12 bg-white p-4 md:grid-cols-[1.2fr_0.5fr_0.5fr]"
              >
                <label className="text-sm">
                  <span className="text-[11px] uppercase tracking-wide text-[var(--garden-leaf)]">
                    Name
                  </span>
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={item.name}
                    onChange={(e) =>
                      updateMenuItem(item.id, { name: e.target.value })
                    }
                  />
                </label>
                <label className="text-sm">
                  <span className="text-[11px] uppercase tracking-wide text-[var(--garden-leaf)]">
                    Price (NPR)
                  </span>
                  <input
                    type="number"
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={item.price}
                    onChange={(e) =>
                      updateMenuItem(item.id, {
                        price: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label className="text-sm">
                  <span className="text-[11px] uppercase tracking-wide text-[var(--garden-leaf)]">
                    Category
                  </span>
                  <select
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={item.category}
                    onChange={(e) =>
                      updateMenuItem(item.id, {
                        category: e.target.value as MenuCategory,
                      })
                    }
                  >
                    <option value="mains">Mains</option>
                    <option value="sides">Sides</option>
                    <option value="drinks">Drinks</option>
                    <option value="sweets">Sweets</option>
                  </select>
                </label>
                <label className="text-sm md:col-span-3">
                  <span className="text-[11px] uppercase tracking-wide text-[var(--garden-leaf)]">
                    Description
                  </span>
                  <textarea
                    rows={2}
                    className="mt-1 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3 py-2"
                    value={item.description}
                    onChange={(e) =>
                      updateMenuItem(item.id, { description: e.target.value })
                    }
                  />
                </label>
                <label className="text-sm md:col-span-3">
                  <span className="text-[11px] uppercase tracking-wide text-[var(--garden-leaf)]">
                    Image URL (Unsplash / Pexels / own)
                  </span>
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={item.image ?? ""}
                    placeholder="https://images.unsplash.com/..."
                    onChange={(e) =>
                      updateMenuItem(item.id, {
                        image: e.target.value || undefined,
                      })
                    }
                  />
                </label>
              </div>
            ))}
            <Button
              onClick={() =>
                addMenuItem({
                  id: `item-${Date.now()}`,
                  name: "New dish",
                  description: "Describe this plate",
                  price: 200,
                  category: "mains",
                  image:
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
                })
              }
            >
              Add menu item
            </Button>
          </div>
        )}

        {section === "recipes" && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--garden-ink)]/70">
              Confirming an order deducts these ingredient quantities × line qty
              from live stock.
            </p>
            {state.menuItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white p-4"
              >
                <p className="font-medium text-[var(--garden-deep)]">{item.name}</p>
                <div className="mt-3 space-y-2">
                  {(item.recipe ?? []).map((r, idx) => (
                    <div key={`${r.skuId}-${idx}`} className="flex flex-wrap gap-2">
                      <select
                        className="h-9 rounded-md border border-[var(--garden-leaf)]/20 px-2 text-sm"
                        value={r.skuId}
                        onChange={(e) => {
                          const next = [...(item.recipe ?? [])];
                          next[idx] = { ...next[idx], skuId: e.target.value };
                          updateRecipe(item.id, next);
                        }}
                      >
                        {state.stock.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        className="h-9 w-24 rounded-md border border-[var(--garden-leaf)]/20 px-2 text-sm"
                        value={r.qty}
                        onChange={(e) => {
                          const next = [...(item.recipe ?? [])];
                          next[idx] = {
                            ...next[idx],
                            qty: Number(e.target.value) || 0,
                          };
                          updateRecipe(item.id, next);
                        }}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          updateRecipe(
                            item.id,
                            (item.recipe ?? []).filter((_, i) => i !== idx),
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() =>
                    updateRecipe(item.id, [
                      ...(item.recipe ?? []),
                      { skuId: state.stock[0]?.id ?? "sku-dal", qty: 0.1 },
                    ])
                  }
                >
                  Add ingredient
                </Button>
              </div>
            ))}
          </div>
        )}

        {section === "vat" && (
          <div className="max-w-md space-y-4 rounded-xl border border-[var(--garden-leaf)]/12 bg-white p-5">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={state.settings.vatEnabled}
                onChange={(e) =>
                  updateSettings({ vatEnabled: e.target.checked })
                }
              />
              Apply Nepal VAT on bills (demo)
            </label>
            <label className="block text-sm">
              VAT %
              <input
                type="number"
                className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                value={state.settings.vatPercent}
                onChange={(e) =>
                  updateSettings({
                    vatPercent: Number(e.target.value) || 0,
                  })
                }
              />
            </label>
            <p className="text-xs opacity-60">
              Default 13% — toggled on bills in Ops → Billing.
            </p>
          </div>
        )}

        {section === "qr" && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {state.tables.map((t) => (
              <div
                key={t.id}
                className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white p-4 text-center"
              >
                <DemoQr seed={`table-${t.id}`} size={100} className="mx-auto" />
                <p className="mt-3 font-medium">{t.label}</p>
                <Link
                  href={`/table/${t.id}`}
                  className="mt-1 inline-block text-sm text-[var(--garden-leaf)] underline"
                >
                  /table/{t.id}
                </Link>
              </div>
            ))}
          </div>
        )}

        {section === "stock" && (
          <div className="space-y-3">
            {state.stock.map((row) => (
              <div
                key={row.id}
                className="grid gap-3 rounded-lg border border-[var(--garden-leaf)]/12 bg-white p-4 md:grid-cols-4"
              >
                <p className="font-medium self-center">{row.name}</p>
                <label className="text-sm">
                  Qty
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={row.qty}
                    onChange={(e) =>
                      updateStock(row.id, { qty: Number(e.target.value) || 0 })
                    }
                  />
                </label>
                <label className="text-sm">
                  Low at
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={row.lowAt}
                    onChange={(e) =>
                      updateStock(row.id, {
                        lowAt: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <p className="self-center text-sm opacity-60">{row.unit}</p>
              </div>
            ))}
          </div>
        )}

        {section === "staff" && (
          <div className="space-y-3">
            {state.staff.map((s) => (
              <div
                key={s.id}
                className="grid gap-3 rounded-lg border border-[var(--garden-leaf)]/12 bg-white p-4 md:grid-cols-4"
              >
                <label className="text-sm">
                  Name
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={s.name}
                    onChange={(e) =>
                      updateStaff(s.id, { name: e.target.value })
                    }
                  />
                </label>
                <label className="text-sm">
                  Shift
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={s.shift}
                    onChange={(e) =>
                      updateStaff(s.id, { shift: e.target.value })
                    }
                  />
                </label>
                <label className="text-sm">
                  Salary (NPR)
                  <input
                    type="number"
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={s.salary}
                    onChange={(e) =>
                      updateStaff(s.id, {
                        salary: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label className="text-sm">
                  Role
                  <select
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={s.role}
                    onChange={(e) =>
                      updateStaff(s.id, {
                        role: e.target.value as Role | "helper",
                      })
                    }
                  >
                    <option value="owner">owner</option>
                    <option value="waiter">waiter</option>
                    <option value="kitchen">kitchen</option>
                    <option value="cashier">cashier</option>
                    <option value="helper">helper</option>
                  </select>
                </label>
              </div>
            ))}
            <Button
              onClick={() =>
                addStaff({
                  id: `st-${Date.now()}`,
                  name: "New staff",
                  role: "helper",
                  shift: "Morning",
                  salary: 20000,
                  presentToday: true,
                  phone: "9800000000",
                })
              }
            >
              Add staff
            </Button>
          </div>
        )}

        {section === "expenses" && (
          <div className="space-y-6">
            <div className="space-y-3">
              {state.expenseCategories.map((c) => (
                <div
                  key={c.id}
                  className="grid gap-3 rounded-lg border border-[var(--garden-leaf)]/12 bg-white p-4 md:grid-cols-2"
                >
                  <label className="text-sm">
                    Name
                    <input
                      className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                      value={c.name}
                      onChange={(e) =>
                        updateExpenseCategory(c.id, { name: e.target.value })
                      }
                    />
                  </label>
                  <label className="text-sm">
                    Nepali label
                    <input
                      className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                      value={c.nameNp ?? ""}
                      onChange={(e) =>
                        updateExpenseCategory(c.id, { nameNp: e.target.value })
                      }
                    />
                  </label>
                </div>
              ))}
              <Button
                onClick={() =>
                  addExpenseCategory({
                    id: `exp-${Date.now()}`,
                    name: "New category",
                    nameNp: "नयाँ",
                  })
                }
              >
                Add category
              </Button>
            </div>
            <div className="rounded-xl border border-[var(--garden-leaf)]/12 bg-white p-4">
              <h3 className="font-medium text-[var(--garden-deep)]">
                Quick add kharcha
              </h3>
              <QuickExpense
                categories={state.expenseCategories}
                vendors={state.vendors}
                onAdd={addExpense}
              />
            </div>
          </div>
        )}

        {section === "vendors" && (
          <div className="space-y-3">
            {state.vendors.map((v) => (
              <div
                key={v.id}
                className="grid gap-3 rounded-lg border border-[var(--garden-leaf)]/12 bg-white p-4 md:grid-cols-4"
              >
                <label className="text-sm">
                  Name
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={v.name}
                    onChange={(e) =>
                      updateVendor(v.id, { name: e.target.value })
                    }
                  />
                </label>
                <label className="text-sm">
                  Phone
                  <input
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={v.phone}
                    onChange={(e) =>
                      updateVendor(v.id, { phone: e.target.value })
                    }
                  />
                </label>
                <label className="text-sm">
                  Dues (NPR)
                  <input
                    type="number"
                    className="mt-1 h-10 w-full rounded-md border border-[var(--garden-leaf)]/20 px-3"
                    value={v.dues}
                    onChange={(e) =>
                      updateVendor(v.id, {
                        dues: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <p className="self-end text-sm opacity-60 pb-2">
                  {formatNpr(v.dues)} due
                </p>
              </div>
            ))}
            <Button
              onClick={() =>
                addVendor({
                  id: `ven-${Date.now()}`,
                  name: "New vendor",
                  phone: "98xxxxxxxx",
                  dues: 0,
                  category: "Misc",
                })
              }
            >
              Add vendor
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

function QuickExpense({
  categories,
  vendors,
  onAdd,
}: {
  categories: { id: string; name: string }[];
  vendors: { id: string; name: string }[];
  onAdd: (e: {
    id: string;
    categoryId: string;
    label: string;
    amount: number;
    vendorId?: string;
    date: string;
    paid: boolean;
  }) => void;
}) {
  const [label, setLabel] = useState("New expense");
  const [amount, setAmount] = useState(500);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [vendorId, setVendorId] = useState("");
  const [paid, setPaid] = useState(true);

  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      <input
        className="h-10 rounded-md border border-[var(--garden-leaf)]/20 px-3 text-sm"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label"
      />
      <input
        type="number"
        className="h-10 rounded-md border border-[var(--garden-leaf)]/20 px-3 text-sm"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value) || 0)}
      />
      <select
        className="h-10 rounded-md border border-[var(--garden-leaf)]/20 px-3 text-sm"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        className="h-10 rounded-md border border-[var(--garden-leaf)]/20 px-3 text-sm"
        value={vendorId}
        onChange={(e) => setVendorId(e.target.value)}
      >
        <option value="">No vendor</option>
        {vendors.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={paid}
          onChange={(e) => setPaid(e.target.checked)}
        />
        Paid now
      </label>
      <Button
        onClick={() =>
          onAdd({
            id: `ex-${Date.now()}`,
            categoryId,
            label,
            amount,
            vendorId: vendorId || undefined,
            date: "2026-11-27",
            paid,
          })
        }
      >
        Save kharcha
      </Button>
    </div>
  );
}
