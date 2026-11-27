"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { restaurant } from "@/lib/demo-data";

/** Minimal top bar for legal / leftover marketing pages. */
export function MarketingNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "relative z-30 flex items-center justify-between px-5 py-4 md:px-10",
        dark ? "text-white" : "text-[var(--garden-deep)]",
      )}
    >
      <Link href="/" className="font-[family-name:var(--font-display)] text-xl">
        {restaurant.name}
      </Link>
      <div className="flex gap-3 text-sm">
        <Link href="/order" className="font-semibold">
          Order
        </Link>
        <Link href="/staff">Staff</Link>
      </div>
    </header>
  );
}
