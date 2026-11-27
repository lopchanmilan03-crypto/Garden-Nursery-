"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import {
  demoTables,
  menuCategories,
  menuItems,
  paymentMethods,
  tipPresets,
  type MenuItem,
} from "@/lib/demo-data";
import { cn, formatNpr } from "@/lib/utils";

type Step = "browse" | "confirm" | "pay" | "done";
type ServiceType = "dine-in" | "takeaway";
type PayMethod = (typeof paymentMethods)[number]["id"];

type CartLine = { item: MenuItem; qty: number };

export default function DemoOrderPage() {
  const [step, setStep] = useState<Step>("browse");
  const [service, setService] = useState<ServiceType>("dine-in");
  const [tableId, setTableId] = useState(
    () => demoTables.find((t) => t.status === "open")?.id ?? demoTables[0].id,
  );
  const [category, setCategory] = useState<(typeof menuCategories)[number]["id"] | "all">(
    "all",
  );
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [tip, setTip] = useState(50);
  const [payMethod, setPayMethod] = useState<PayMethod>("qr");
  const [orderCode, setOrderCode] = useState("");

  const lines: CartLine[] = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const item = menuItems.find((m) => m.id === id)!;
          return { item, qty };
        }),
    [cart],
  );

  const subtotal = lines.reduce((sum, line) => sum + line.item.price * line.qty, 0);
  const total = subtotal + tip;
  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);

  const filtered =
    category === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === category);

  function bump(id: string, delta: number) {
    setCart((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  }

  function placeOrder() {
    const code = `GR-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderCode(code);
    setStep("done");
  }

  function reset() {
    setStep("browse");
    setCart({});
    setNotes("");
    setTip(50);
    setPayMethod("qr");
    setOrderCode("");
  }

  return (
    <main className="min-h-screen bg-[var(--garden-sand)]">
      <div className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e8f2ea_0%,#f4f8f5_70%)]">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-5 pb-6 pt-1 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
            Core flow · demo only
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
            Order & pay
          </h1>
          <p className="mt-2 max-w-xl text-[var(--garden-ink)]/70">
            Build a table or takeaway order, confirm, then settle with cash, card,
            or QR — no real payments.
          </p>
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
                      "rounded-md border px-4 py-2 text-sm transition",
                      service === opt.id
                        ? "border-[var(--garden-leaf)] bg-[var(--garden-leaf)] text-[var(--garden-mist)]"
                        : "border-[var(--garden-leaf)]/20 bg-white text-[var(--garden-deep)] hover:bg-[var(--garden-fog)]/60",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {service === "dine-in" && (
                <label className="block max-w-sm text-sm">
                  <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
                    Table
                  </span>
                  <select
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                    className="h-11 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-white px-3 text-[var(--garden-deep)] outline-none focus:ring-2 focus:ring-[var(--garden-gold)]"
                  >
                    {demoTables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label} · {t.status}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={category === "all"}
                  onClick={() => setCategory("all")}
                  label="All"
                />
                {menuCategories.map((c) => (
                  <FilterChip
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
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-[var(--garden-deep)]">
                            {item.name}
                          </p>
                          {item.popular ? (
                            <span className="rounded bg-[var(--garden-gold)]/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--garden-deep)]">
                              Popular
                            </span>
                          ) : null}
                        </div>
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
                          aria-label={`Remove one ${item.name}`}
                          onClick={() => bump(item.id, -1)}
                          disabled={qty === 0}
                        >
                          −
                        </Button>
                        <span className="w-6 text-center text-sm font-medium tabular-nums">
                          {qty}
                        </span>
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          aria-label={`Add one ${item.name}`}
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

            <aside className="h-fit rounded-xl border border-[var(--garden-leaf)]/15 bg-white/90 p-5 shadow-[0_12px_40px_-28px_rgba(15,46,31,0.45)] lg:sticky lg:top-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
                Your tray
              </h2>
              <p className="mt-1 text-sm text-[var(--garden-ink)]/60">
                {service === "dine-in"
                  ? demoTables.find((t) => t.id === tableId)?.label
                  : "Takeaway"}{" "}
                · {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>
              {lines.length === 0 ? (
                <p className="mt-6 text-sm text-[var(--garden-ink)]/55">
                  Add dishes from the menu to continue.
                </p>
              ) : (
                <ul className="mt-5 space-y-3">
                  {lines.map(({ item, qty }) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-[var(--garden-ink)]/45">×{qty}</span>
                      </span>
                      <span className="tabular-nums font-medium">
                        {formatNpr(item.price * qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex items-center justify-between border-t border-[var(--garden-leaf)]/10 pt-4">
                <span className="text-sm text-[var(--garden-ink)]/65">Subtotal</span>
                <span className="font-[family-name:var(--font-display)] text-xl text-[var(--garden-deep)]">
                  {formatNpr(subtotal)}
                </span>
              </div>
              <Button
                className="mt-5 w-full"
                size="lg"
                disabled={lines.length === 0}
                onClick={() => setStep("confirm")}
              >
                Review order
              </Button>
            </aside>
          </div>
        )}

        {step === "confirm" && (
          <ConfirmPanel
            service={service}
            tableLabel={demoTables.find((t) => t.id === tableId)?.label ?? ""}
            lines={lines}
            subtotal={subtotal}
            notes={notes}
            onNotes={setNotes}
            onBack={() => setStep("browse")}
            onNext={() => setStep("pay")}
          />
        )}

        {step === "pay" && (
          <PayPanel
            subtotal={subtotal}
            tip={tip}
            total={total}
            payMethod={payMethod}
            onTip={setTip}
            onPayMethod={setPayMethod}
            onBack={() => setStep("confirm")}
            onPay={placeOrder}
          />
        )}

        {step === "done" && (
          <div className="mx-auto max-w-lg rounded-xl border border-[var(--garden-leaf)]/15 bg-white px-6 py-10 text-center shadow-[0_16px_50px_-30px_rgba(15,46,31,0.5)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
              Order placed
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)]">
              {orderCode}
            </h2>
            <p className="mt-3 text-[var(--garden-ink)]/70">
              Kitchen has your ticket. Payment recorded as{" "}
              <strong className="font-medium text-[var(--garden-deep)]">
                {paymentMethods.find((m) => m.id === payMethod)?.label}
              </strong>{" "}
              · {formatNpr(total)}
              {notes ? (
                <>
                  <br />
                  <span className="mt-2 inline-block text-sm">Note: {notes}</span>
                </>
              ) : null}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={reset}>New order</Button>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm font-medium text-[var(--garden-deep)] transition hover:bg-[var(--garden-fog)]/50"
              >
                View staff board
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StepRail({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "browse", label: "Browse" },
    { id: "confirm", label: "Confirm" },
    { id: "pay", label: "Pay" },
    { id: "done", label: "Done" },
  ];
  const idx = steps.findIndex((s) => s.id === step);

  return (
    <ol className="mt-6 flex flex-wrap items-center gap-3">
      {steps.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2 text-sm">
          <span className="step-dot" data-active={i <= idx} />
          <span
            className={cn(
              i <= idx ? "text-[var(--garden-deep)]" : "text-[var(--garden-ink)]/40",
            )}
          >
            {s.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function FilterChip({
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
        "rounded-md px-3 py-1.5 text-sm transition",
        active
          ? "bg-[var(--garden-deep)] text-[var(--garden-mist)]"
          : "bg-white text-[var(--garden-ink)]/70 ring-1 ring-[var(--garden-leaf)]/15 hover:bg-[var(--garden-fog)]/50",
      )}
    >
      {label}
    </button>
  );
}

function ConfirmPanel({
  service,
  tableLabel,
  lines,
  subtotal,
  notes,
  onNotes,
  onBack,
  onNext,
}: {
  service: ServiceType;
  tableLabel: string;
  lines: CartLine[];
  subtotal: number;
  notes: string;
  onNotes: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-[var(--garden-leaf)]/15 bg-white p-6 md:p-8">
      <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
        Confirm order
      </h2>
      <p className="mt-2 text-sm text-[var(--garden-ink)]/65">
        {service === "dine-in" ? tableLabel : "Takeaway"} · kitchen will see this
        ticket next.
      </p>
      <ul className="mt-6 space-y-3 border-y border-[var(--garden-leaf)]/10 py-5">
        {lines.map(({ item, qty }) => (
          <li key={item.id} className="flex justify-between gap-3 text-sm">
            <span>
              {item.name} ×{qty}
            </span>
            <span className="tabular-nums">{formatNpr(item.price * qty)}</span>
          </li>
        ))}
      </ul>
      <label className="mt-5 block text-sm">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
          Kitchen notes
        </span>
        <textarea
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          rows={3}
          placeholder="Less spicy, no onion, allergy note…"
          className="w-full resize-none rounded-md border border-[var(--garden-leaf)]/20 bg-[var(--garden-sand)] px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--garden-gold)]"
        />
      </label>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm text-[var(--garden-ink)]/65">Subtotal</span>
        <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
          {formatNpr(subtotal)}
        </span>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" onClick={onBack}>
          Edit tray
        </Button>
        <Button onClick={onNext}>Continue to payment</Button>
      </div>
    </div>
  );
}

function PayPanel({
  subtotal,
  tip,
  total,
  payMethod,
  onTip,
  onPayMethod,
  onBack,
  onPay,
}: {
  subtotal: number;
  tip: number;
  total: number;
  payMethod: PayMethod;
  onTip: (v: number) => void;
  onPayMethod: (v: PayMethod) => void;
  onBack: () => void;
  onPay: () => void;
}) {
  return (
    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-xl border border-[var(--garden-leaf)]/15 bg-white p-6">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)]">
          Payment
        </h2>
        <p className="mt-2 text-sm text-[var(--garden-ink)]/65">
          Sample checkout — nothing is charged.
        </p>
        <div className="mt-6 space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => onPayMethod(method.id)}
              className={cn(
                "flex w-full items-start justify-between rounded-lg border px-4 py-3 text-left transition",
                payMethod === method.id
                  ? "border-[var(--garden-leaf)] bg-[var(--garden-fog)]/70"
                  : "border-[var(--garden-leaf)]/15 hover:bg-[var(--garden-sand)]",
              )}
            >
              <span>
                <span className="block font-medium text-[var(--garden-deep)]">
                  {method.label}
                </span>
                <span className="mt-0.5 block text-sm text-[var(--garden-ink)]/60">
                  {method.hint}
                </span>
              </span>
              <span
                className={cn(
                  "mt-1 h-4 w-4 rounded-full border",
                  payMethod === method.id
                    ? "border-[var(--garden-leaf)] bg-[var(--garden-leaf)]"
                    : "border-[var(--garden-leaf)]/30",
                )}
              />
            </button>
          ))}
        </div>

        {payMethod === "qr" && (
          <div className="mt-5 flex items-center justify-center rounded-lg border border-dashed border-[var(--garden-leaf)]/30 bg-[var(--garden-sand)] py-8">
            <div className="grid h-28 w-28 grid-cols-5 gap-1 p-2">
              {Array.from({ length: 25 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "rounded-[2px]",
                    [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(i)
                      ? "bg-[var(--garden-deep)]"
                      : "bg-transparent",
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
            Tip (optional)
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tipPresets.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => onTip(amount)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition",
                  tip === amount
                    ? "bg-[var(--garden-gold)] text-[var(--garden-deep)]"
                    : "bg-[var(--garden-fog)]/70 text-[var(--garden-deep)] hover:bg-[var(--garden-fog)]",
                )}
              >
                {amount === 0 ? "No tip" : formatNpr(amount)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-fit rounded-xl border border-[var(--garden-leaf)]/15 bg-[var(--garden-deep)] p-6 text-[var(--garden-mist)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--garden-fog)]/70">
          Total due
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-4xl">
          {formatNpr(total)}
        </p>
        <dl className="mt-6 space-y-2 text-sm text-[var(--garden-mist)]/80">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatNpr(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tip</dt>
            <dd className="tabular-nums">{formatNpr(tip)}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col gap-3">
          <Button variant="soft" size="lg" onClick={onPay}>
            Complete {paymentMethods.find((m) => m.id === payMethod)?.label} payment
          </Button>
          <Button
            variant="ghost"
            className="text-[var(--garden-mist)] hover:bg-white/10"
            onClick={onBack}
          >
            Back to confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
