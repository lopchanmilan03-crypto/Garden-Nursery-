"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { menuCategories, type PayMethod } from "@/lib/demo-data";
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
      <PhoneShell footer={<PhoneNav />}>
        <p className="flex flex-1 items-center justify-center text-sm opacity-60">
          Loading…
        </p>
      </PhoneShell>
    );
  }

  const showCartBar = step === "menu";

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
          <PhoneNav />
        )
      }
    >
      <header className="sticky top-0 z-20 border-b border-[var(--garden-leaf)]/10 bg-[var(--garden-paper)]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
            Order
          </p>
          <p className="text-xs font-medium text-[var(--garden-leaf)]">
            {step === "seat" ? "Seat" : step === "menu" ? "Menu" : "Done"}
          </p>
        </div>
      </header>

      <div className={cn("px-4 pt-4", showCartBar ? "pb-28" : "pb-24")}>
        {step === "seat" && (
          <section>
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              Your seat
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
              Walk-in
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

        {step === "menu" && (
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

        {step === "done" && (
          <section>
            <h1 className="font-[family-name:var(--font-display)] text-[1.75rem] text-[var(--garden-deep)]">
              Sent to kitchen
            </h1>
            <p className="mt-1 text-sm text-[var(--garden-ink)]/60">
              {orderId} · {seatLabel}
            </p>

            {!paid ? (
              <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--garden-leaf)]/10">
                <p className="font-semibold text-[var(--garden-deep)]">Pay</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["cash", "upi", "card"] as PayMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={cn(
                        "min-h-12 rounded-xl text-sm font-semibold capitalize",
                        payMethod === m
                          ? "bg-[var(--garden-deep)] text-white"
                          : "bg-[var(--garden-fog)] text-[var(--garden-deep)]",
                      )}
                    >
                      {m === "upi" ? "UPI" : m}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={payNow}
                  className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-base font-semibold text-[var(--garden-deep)]"
                >
                  Pay {formatNpr(orderTotal)}
                </button>
                <Link
                  href="/staff"
                  className="block py-1 text-center text-sm text-[var(--garden-leaf)]"
                >
                  Pay later at Staff
                </Link>
              </div>
            ) : (
              <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-5 text-center text-sm text-emerald-950 ring-1 ring-emerald-200">
                Paid · enjoy the patio
              </p>
            )}

            <button
              type="button"
              onClick={reset}
              className="mt-4 flex min-h-14 w-full items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
            >
              New order
            </button>
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
