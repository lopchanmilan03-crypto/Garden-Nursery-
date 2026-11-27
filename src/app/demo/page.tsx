"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { menuCategories, tipPresets, type PayMethod } from "@/lib/demo-data";
import { useOps } from "@/lib/ops-store";
import { cn, formatNpr } from "@/lib/utils";

type Step = "browse" | "confirm" | "pay" | "done";
type ServiceType = "dine-in" | "takeaway";

export default function WaiterOrderPage() {
  const {
    state,
    setRole,
    setWaiterName,
    placeWaiterOrder,
    settleBill,
  } = useOps();
  const [step, setStep] = useState<Step>("browse");
  const [service, setService] = useState<ServiceType>("dine-in");
  const [tableId, setTableId] = useState(
    () => state.tables.find((t) => t.status === "open")?.id ?? state.tables[0]?.id,
  );
  const [category, setCategory] = useState<string>("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [tip, setTip] = useState(50);
  const [payMethod, setPayMethod] = useState<PayMethod>("upi");
  const [lastOrderId, setLastOrderId] = useState("");

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const item = state.menuItems.find((m) => m.id === id)!;
          return { item, qty };
        }),
    [cart, state.menuItems],
  );

  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const total = subtotal + tip;
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const filtered =
    category === "all"
      ? state.menuItems
      : state.menuItems.filter((i) => i.category === category);

  function bump(id: string, delta: number) {
    setCart((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  function sendToKitchenAndPay() {
    const tableLabel =
      service === "dine-in"
        ? state.tables.find((t) => t.id === tableId)?.label.split(" · ")[0] ??
          null
        : null;
    const orderId = placeWaiterOrder({
      table: tableLabel,
      type: service,
      guest: service === "takeaway" ? "Takeaway guest" : "Table guest",
      lines: lines.map((l) => ({
        menuItemId: l.item.id,
        name: l.item.name,
        qty: l.qty,
      })),
      notes,
      total: subtotal,
    });
    setLastOrderId(orderId);
    setStep("pay");
  }

  function completePay() {
    if (lastOrderId) settleBill(lastOrderId, payMethod, tip);
    setStep("done");
  }

  function reset() {
    setStep("browse");
    setCart({});
    setNotes("");
    setTip(50);
    setLastOrderId("");
  }

  return (
    <main className="min-h-screen bg-[var(--garden-sand)]">
      <div className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e8f2ea_0%,#f4f8f5_70%)]">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-1 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
            Waiter phone · sends to kitchen
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
            Take order
          </h1>
          <p className="mt-2 max-w-xl text-[var(--garden-ink)]/70">
            Build a table or takeaway ticket on phone — kitchen board updates
            live, then settle cash / UPI / card.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm">
              Waiter
              <select
                className="ml-2 h-9 rounded-md border border-[var(--garden-leaf)]/20 bg-white px-2"
                value={state.waiterName}
                onChange={(e) => {
                  setWaiterName(e.target.value);
                  setRole("waiter");
                }}
              >
                {state.staff
                  .filter((s) => s.role === "waiter" || s.role === "owner")
                  .map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </label>
            <Link href="/kitchen" className="text-sm text-[var(--garden-leaf)]">
              Open kitchen board →
            </Link>
          </div>
          <StepRail step={step} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        {step === "browse" && (
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
            <section className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "dine-in", label: "Table" },
                    { id: "takeaway", label: "Takeaway" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setService(opt.id)}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm",
                      service === opt.id
                        ? "border-[var(--garden-leaf)] bg-[var(--garden-leaf)] text-[var(--garden-mist)]"
                        : "border-[var(--garden-leaf)]/20 bg-white",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {service === "dine-in" && (
                <select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="h-11 w-full max-w-sm rounded-md border border-[var(--garden-leaf)]/20 bg-white px-3"
                >
                  {state.tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} · {t.status}
                    </option>
                  ))}
                </select>
              )}
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
              <ul className="space-y-3">
                {filtered.map((item) => {
                  const qty = cart[item.id] ?? 0;
                  return (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--garden-leaf)]/12 bg-white/85 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[var(--garden-deep)]">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-[var(--garden-ink)]/65">
                          {item.description}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[var(--garden-leaf)]">
                          {formatNpr(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => bump(item.id, -1)}
                          disabled={qty === 0}
                        >
                          −
                        </Button>
                        <span className="w-6 text-center text-sm tabular-nums">
                          {qty}
                        </span>
                        <Button
                          type="button"
                          size="icon"
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

            <aside className="h-fit rounded-xl border border-[var(--garden-leaf)]/15 bg-white/90 p-5 lg:sticky lg:top-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Tray
              </h2>
              <p className="mt-1 text-sm opacity-60">
                {service === "dine-in"
                  ? state.tables.find((t) => t.id === tableId)?.label
                  : "Takeaway"}{" "}
                · {itemCount} items
              </p>
              {lines.length === 0 ? (
                <p className="mt-6 text-sm opacity-55">Add dishes to continue.</p>
              ) : (
                <ul className="mt-5 space-y-3 text-sm">
                  {lines.map(({ item, qty }) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span>
                        {item.name} ×{qty}
                      </span>
                      <span className="tabular-nums">
                        {formatNpr(item.price * qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex justify-between border-t border-[var(--garden-leaf)]/10 pt-4">
                <span className="text-sm opacity-65">Subtotal</span>
                <span className="font-[family-name:var(--font-display)] text-xl">
                  {formatNpr(subtotal)}
                </span>
              </div>
              <Button
                className="mt-5 w-full"
                size="lg"
                disabled={lines.length === 0}
                onClick={() => setStep("confirm")}
              >
                Review & send
              </Button>
            </aside>
          </div>
        )}

        {step === "confirm" && (
          <div className="mx-auto max-w-xl rounded-xl border border-[var(--garden-leaf)]/15 bg-white p-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
              Confirm → kitchen
            </h2>
            <ul className="mt-5 space-y-2 border-y border-[var(--garden-leaf)]/10 py-4 text-sm">
              {lines.map(({ item, qty }) => (
                <li key={item.id} className="flex justify-between">
                  <span>
                    {item.name} ×{qty}
                  </span>
                  <span>{formatNpr(item.price * qty)}</span>
                </li>
              ))}
            </ul>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Kitchen notes…"
              className="mt-4 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-[var(--garden-sand)] px-3 py-2 text-sm"
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setStep("browse")}>
                Edit
              </Button>
              <Button onClick={sendToKitchenAndPay}>
                Send to kitchen & bill
              </Button>
            </div>
          </div>
        )}

        {step === "pay" && (
          <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-[var(--garden-leaf)]/15 bg-white p-6">
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
                Billing
              </h2>
              <p className="mt-2 text-sm opacity-65">
                Ticket {lastOrderId} is on the kitchen board.
              </p>
              <div className="mt-5 space-y-3">
                {(
                  [
                    { id: "cash" as const, label: "Cash", hint: "Counter cash" },
                    {
                      id: "card" as const,
                      label: "Card",
                      hint: "Demo tap",
                    },
                    {
                      id: "upi" as const,
                      label: "UPI / QR",
                      hint: "eSewa / Khalti sample",
                    },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={cn(
                      "flex w-full justify-between rounded-lg border px-4 py-3 text-left",
                      payMethod === m.id
                        ? "border-[var(--garden-leaf)] bg-[var(--garden-fog)]/70"
                        : "border-[var(--garden-leaf)]/15",
                    )}
                  >
                    <span>
                      <span className="block font-medium">{m.label}</span>
                      <span className="text-sm opacity-60">{m.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              {payMethod === "upi" && (
                <div className="mt-5 flex justify-center rounded-lg border border-dashed border-[var(--garden-leaf)]/30 py-8">
                  <div className="grid h-28 w-28 grid-cols-5 gap-1 p-2">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "rounded-[2px]",
                          [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(
                            i,
                          )
                            ? "bg-[var(--garden-deep)]"
                            : "bg-transparent",
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-5 flex flex-wrap gap-2">
                {tipPresets.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setTip(amount)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm",
                      tip === amount
                        ? "bg-[var(--garden-gold)]"
                        : "bg-[var(--garden-fog)]/70",
                    )}
                  >
                    {amount === 0 ? "No tip" : formatNpr(amount)}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-fit rounded-xl border border-[var(--garden-leaf)]/15 bg-[var(--garden-deep)] p-6 text-[var(--garden-mist)]">
              <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                Total due
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
                {formatNpr(total)}
              </p>
              <Button variant="soft" size="lg" className="mt-8 w-full" onClick={completePay}>
                Complete {payMethod} payment
              </Button>
              <Button
                variant="ghost"
                className="mt-2 w-full text-[var(--garden-mist)] hover:bg-white/10"
                onClick={() => setStep("confirm")}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="mx-auto max-w-lg rounded-xl border border-[var(--garden-leaf)]/15 bg-white px-6 py-10 text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
              Order placed & billed
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)]">
              {lastOrderId}
            </h2>
            <p className="mt-3 text-[var(--garden-ink)]/70">
              Kitchen has the ticket. Payment: {payMethod.toUpperCase()} ·{" "}
              {formatNpr(total)}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={reset}>New order</Button>
              <Link
                href="/kitchen"
                className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm"
              >
                View kitchen
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm"
              >
                Ops board
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StepRail({ step }: { step: Step }) {
  const steps: Step[] = ["browse", "confirm", "pay", "done"];
  const idx = steps.indexOf(step);
  return (
    <ol className="mt-6 flex flex-wrap gap-3 text-sm">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className="step-dot" data-active={i <= idx} />
          <span className={i <= idx ? "text-[var(--garden-deep)]" : "opacity-40"}>
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm",
        active
          ? "bg-[var(--garden-deep)] text-[var(--garden-mist)]"
          : "bg-white ring-1 ring-[var(--garden-leaf)]/15",
      )}
    >
      {label}
    </button>
  );
}
