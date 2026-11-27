"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ReservationForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-[var(--garden-leaf)]/10 p-6 text-[var(--garden-deep)] ring-1 ring-[var(--garden-leaf)]/15">
        <p className="font-[family-name:var(--font-display)] text-2xl">
          Enquiry received
        </p>
        <p className="mt-2 text-sm text-[var(--garden-ink)]/75">
          Demo only — we&apos;ll pretend to hold your table. Call{" "}
          <span className="font-medium">+977-1-4001234</span> for a real booking.
        </p>
        <button
          type="button"
          className="mt-4 text-sm text-[var(--garden-leaf)] underline"
          onClick={() => setSent(false)}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        compact
          ? "grid gap-3"
          : "grid gap-4 sm:grid-cols-2"
      }
    >
      <label className="text-sm sm:col-span-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
          Name
        </span>
        <input
          required
          name="name"
          className="mt-1 h-11 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-white px-3"
          placeholder="Your name"
        />
      </label>
      <label className="text-sm">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
          Phone
        </span>
        <input
          required
          name="phone"
          className="mt-1 h-11 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-white px-3"
          placeholder="98…"
        />
      </label>
      <label className="text-sm">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
          Date
        </span>
        <input
          required
          type="date"
          name="date"
          className="mt-1 h-11 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-white px-3"
        />
      </label>
      <label className="text-sm">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
          Guests
        </span>
        <input
          required
          type="number"
          min={1}
          max={12}
          defaultValue={2}
          name="guests"
          className="mt-1 h-11 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-white px-3"
        />
      </label>
      <label className="text-sm sm:col-span-2">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
          Note
        </span>
        <textarea
          name="note"
          rows={3}
          className="mt-1 w-full rounded-md border border-[var(--garden-leaf)]/20 bg-white px-3 py-2"
          placeholder="Patio seat, birthday, dietary…"
        />
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" className="h-11 px-6">
          Reserve a table
        </Button>
      </div>
    </form>
  );
}
