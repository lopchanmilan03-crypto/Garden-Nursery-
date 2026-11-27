"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { DemoQr } from "@/components/demo-qr";
import { Button } from "@/components/ui/button";
import { menuCategories, restaurant } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

export function GuestTableClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { state, placeGuestOrder, metrics } = useOps();
  const table = state.tables.find(
    (t) =>
      t.id === id ||
      t.label.split(" · ")[0].toLowerCase() === id.toLowerCase(),
  );
  const tableCode = table?.label.split(" · ")[0] ?? id.toUpperCase();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [sentId, setSentId] = useState("");
  const [category, setCategory] = useState("all");

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
  const filtered =
    category === "all"
      ? state.menuItems
      : state.menuItems.filter((m) => m.category === category);

  function bump(menuItemId: string, delta: number) {
    setCart((prev) => {
      const next = Math.max(0, (prev[menuItemId] ?? 0) + delta);
      const copy = { ...prev };
      if (!next) delete copy[menuItemId];
      else copy[menuItemId] = next;
      return copy;
    });
  }

  function sendOrder() {
    if (!lines.length) return;
    const orderId = placeGuestOrder({
      table: tableCode,
      type: "dine-in",
      guest: `Guest · ${tableCode}`,
      lines: lines.map((l) => ({
        menuItemId: l.item.id,
        name: l.item.name,
        qty: l.qty,
      })),
      notes,
      total: subtotal,
      source: "guest",
    });
    setSentId(orderId);
    setCart({});
    setNotes("");
  }

  if (!table) {
    return (
      <main className="min-h-screen bg-[var(--garden-sand)] px-5 py-16 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
          Unknown table
        </h1>
        <p className="mt-2 text-sm opacity-70">
          Try{" "}
          <Link href="/table/t1" className="underline">
            /table/t1
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--garden-sand)]">
      <header className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e8f2ea_0%,#f4f8f5_100%)] px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-3xl flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
              Guest QR menu · no login
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)]">
              {restaurant.name}
            </h1>
            <p className="mt-1 text-[var(--garden-ink)]/70">
              Ordering for <strong>{table.label}</strong>
            </p>
            {metrics.lowStock.length > 0 ? (
              <p className="mt-2 text-xs text-amber-800">
                Kitchen may substitute low-stock items.
              </p>
            ) : null}
          </div>
          <div className="text-center">
            <DemoQr seed={`table-${table.id}`} size={88} />
            <p className="mt-1 text-[10px] uppercase tracking-wide opacity-55">
              Table QR
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-6 md:px-10">
        {sentId ? (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-950">
            Order <strong>{sentId}</strong> sent to kitchen. You can add more
            anytime.
            <div className="mt-2 flex gap-3">
              <Link href="/kitchen" className="underline">
                Kitchen board
              </Link>
              <button
                type="button"
                className="underline"
                onClick={() => setSentId("")}
              >
                Order more
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm",
              category === "all"
                ? "bg-[var(--garden-deep)] text-[var(--garden-mist)]"
                : "bg-white ring-1 ring-[var(--garden-leaf)]/15",
            )}
          >
            All
          </button>
          {menuCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                category === c.id
                  ? "bg-[var(--garden-deep)] text-[var(--garden-mist)]"
                  : "bg-white ring-1 ring-[var(--garden-leaf)]/15",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="mt-5 space-y-3">
          {filtered.map((item) => {
            const qty = cart[item.id] ?? 0;
            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--garden-leaf)]/12 bg-white px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--garden-deep)]">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm opacity-65">{item.description}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--garden-leaf)]">
                    {formatNpr(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => bump(item.id, -1)}
                    disabled={!qty}
                  >
                    −
                  </Button>
                  <span className="w-6 text-center tabular-nums text-sm">
                    {qty}
                  </span>
                  <Button size="icon" onClick={() => bump(item.id, 1)}>
                    +
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="sticky bottom-4 mt-6 rounded-xl border border-[var(--garden-leaf)]/15 bg-white/95 p-4 shadow-[0_12px_40px_-24px_rgba(15,46,31,0.45)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm opacity-65">
                {lines.reduce((s, l) => s + l.qty, 0)} items
              </p>
              <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                {formatNpr(subtotal)}
              </p>
            </div>
            <Button size="lg" disabled={!lines.length} onClick={sendOrder}>
              Send to kitchen
            </Button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Notes for kitchen (less spicy…)"
            className="mt-3 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-[var(--garden-sand)] px-3 py-2 text-sm"
          />
        </div>
      </div>
    </main>
  );
}
