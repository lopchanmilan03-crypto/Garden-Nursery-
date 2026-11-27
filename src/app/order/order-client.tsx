"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { menuCategories, restaurant, type PayMethod } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

type Step = "seat" | "menu" | "done";

export function OrderClient() {
  const searchParams = useSearchParams();
  const { state, placeGuestOrder, settleBill, ready } = useOps();
  const [step, setStep] = useState<Step>("seat");
  const [tableId, setTableId] = useState<string | "walk-in">("walk-in");
  const [prefilled, setPrefilled] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [category, setCategory] = useState("all");
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [paid, setPaid] = useState(false);

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

  useEffect(() => {
    if (!ready || prefilled) return;
    const q = searchParams.get("table");
    if (!q) return;
    const match = state.tables.find(
      (t) =>
        t.id === q ||
        t.label.split(" · ")[0].toLowerCase() === q.toLowerCase(),
    );
    if (match) {
      setTableId(match.id);
      setStep("menu");
      setPrefilled(true);
    }
  }, [ready, prefilled, searchParams, state.tables]);

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
    const id = placeGuestOrder({
      table: tableCode,
      type: "dine-in",
      guest: tableCode ? `Guest · ${tableCode}` : "Walk-in",
      lines: lines.map((l) => ({
        menuItemId: l.item.id,
        name: l.item.name,
        qty: l.qty,
      })),
      total: subtotal,
      source: "guest",
    });
    setOrderId(id);
    setOrderTotal(subtotal);
    setCart({});
    setStep("done");
    setPaid(false);
  }

  function payNow() {
    if (!orderId) return;
    settleBill(orderId, payMethod, 0);
    setPaid(true);
  }

  function reset() {
    setStep("seat");
    setCart({});
    setOrderId("");
    setOrderTotal(0);
    setPaid(false);
    setCategory("all");
  }

  if (!ready) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-[var(--garden-sand)] text-sm text-[var(--garden-ink)]/60">
        Loading menu…
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-[var(--garden-sand)]">
      <header className="sticky top-0 z-20 border-b border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Link href="/" className="text-sm text-[var(--garden-leaf)]">
            ← Home
          </Link>
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-lg text-[var(--garden-deep)]">
              Order
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
              {restaurant.name}
            </p>
          </div>
          <span className="w-12 text-right text-xs text-[var(--garden-ink)]/45">
            {step === "seat" ? "1/2" : step === "menu" ? "2/2" : "✓"}
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pb-28 pt-5 md:px-8">
        {step === "seat" && (
          <section>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
              Where are you?
            </h1>
            <p className="mt-2 text-sm text-[var(--garden-ink)]/65">
              Pick a table or walk-in.
            </p>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={() => setTableId("walk-in")}
                className={cn(
                  "min-h-14 rounded-2xl px-5 text-left text-base font-medium transition",
                  tableId === "walk-in"
                    ? "bg-[var(--garden-deep)] text-white"
                    : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/15",
                )}
              >
                Walk-in / counter
              </button>
              {state.tables.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTableId(t.id)}
                  className={cn(
                    "min-h-14 rounded-2xl px-5 text-left text-base font-medium transition",
                    tableId === t.id
                      ? "bg-[var(--garden-deep)] text-white"
                      : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/15",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button
              size="lg"
              className="mt-8 h-14 w-full rounded-2xl text-base"
              onClick={() => setStep("menu")}
            >
              Continue to menu
            </Button>
          </section>
        )}

        {step === "menu" && (
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
                  Menu
                </h1>
                <p className="mt-1 text-sm text-[var(--garden-ink)]/65">
                  {seatLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep("seat")}
                className="text-sm text-[var(--garden-leaf)] underline-offset-2 hover:underline"
              >
                Change seat
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
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

            <ul className="mt-5 space-y-3">
              {filtered.map((item) => {
                const qty = cart[item.id] ?? 0;
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-[var(--garden-leaf)]/12"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--garden-deep)]">
                        {item.name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--garden-leaf)]">
                        {formatNpr(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-11 w-11 rounded-xl"
                        disabled={!qty}
                        onClick={() => bump(item.id, -1)}
                      >
                        −
                      </Button>
                      <span className="w-7 text-center tabular-nums text-base font-medium">
                        {qty}
                      </span>
                      <Button
                        size="icon"
                        className="h-11 w-11 rounded-xl"
                        onClick={() => bump(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {step === "done" && (
          <section className="text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
              Sent
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
              Kitchen has it
            </h1>
            <p className="mt-2 text-sm text-[var(--garden-ink)]/65">
              Order <strong>{orderId}</strong> · {seatLabel}
            </p>

            {!paid ? (
              <div className="mt-8 rounded-2xl bg-white p-5 text-left ring-1 ring-[var(--garden-leaf)]/12">
                <p className="font-medium text-[var(--garden-deep)]">Pay now</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["cash", "upi", "card"] as PayMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={cn(
                        "min-h-12 rounded-xl text-sm font-medium capitalize",
                        payMethod === m
                          ? "bg-[var(--garden-deep)] text-white"
                          : "bg-[var(--garden-fog)] text-[var(--garden-deep)]",
                      )}
                    >
                      {m === "upi" ? "UPI" : m}
                    </button>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="mt-4 h-14 w-full rounded-2xl"
                  onClick={payNow}
                >
                  Pay {formatNpr(orderTotal)}
                </Button>
                <p className="mt-3 text-center text-xs text-[var(--garden-ink)]/50">
                  Or pay later at the counter.
                </p>
              </div>
            ) : (
              <p className="mt-8 rounded-2xl bg-emerald-50 px-4 py-5 text-sm text-emerald-950 ring-1 ring-emerald-200">
                Paid · thank you. Enjoy the patio.
              </p>
            )}

            <div className="mt-8 grid gap-3">
              <Button
                size="lg"
                className="h-14 w-full rounded-2xl"
                onClick={reset}
              >
                Order again
              </Button>
              <Link
                href="/"
                className="flex min-h-12 items-center justify-center text-sm text-[var(--garden-leaf)]"
              >
                Home
              </Link>
            </div>
          </section>
        )}
      </div>

      {step === "menu" ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-[var(--garden-ink)]/55">
                {itemCount} items
              </p>
              <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                {formatNpr(subtotal)}
              </p>
            </div>
            <Button
              size="lg"
              className="h-14 min-w-[9.5rem] rounded-2xl px-6 text-base"
              disabled={!itemCount}
              onClick={sendOrder}
            >
              Send
            </Button>
          </div>
        </div>
      ) : null}
    </main>
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
        "rounded-full px-3.5 py-2 text-sm transition",
        active
          ? "bg-[var(--garden-deep)] text-white"
          : "bg-white text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/15",
      )}
    >
      {label}
    </button>
  );
}
