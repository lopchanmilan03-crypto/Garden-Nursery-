"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { restaurant } from "@/lib/demo-data";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "relative z-30 px-5 py-4 md:px-10",
        dark ? "text-[var(--garden-mist)]" : "text-[var(--garden-deep)]",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="group flex flex-col leading-none">
          <span
            className={cn(
              "font-[family-name:var(--font-display)] text-2xl tracking-tight md:text-[1.7rem]",
              dark ? "text-white" : "text-[var(--garden-deep)]",
            )}
          >
            {restaurant.name}
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] uppercase tracking-[0.28em]",
              dark ? "text-white/65" : "text-[var(--garden-leaf)]",
            )}
          >
            Lazimpat · Kathmandu
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition",
                  active
                    ? dark
                      ? "bg-white/15 text-white"
                      : "bg-[var(--garden-leaf)]/12 text-[var(--garden-deep)]"
                    : dark
                      ? "text-white/75 hover:bg-white/10 hover:text-white"
                      : "text-[var(--garden-deep)]/70 hover:bg-[var(--garden-leaf)]/8",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/table/t1"
            className={cn(
              "ml-2 inline-flex h-10 items-center rounded-md px-4 text-sm font-semibold transition",
              dark
                ? "bg-[var(--garden-gold)] text-[var(--garden-deep)] hover:brightness-105"
                : "bg-[var(--garden-deep)] text-[var(--garden-mist)] hover:bg-[var(--garden-leaf)]",
            )}
          >
            Order
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "inline-flex h-10 items-center rounded-md border px-4 text-sm font-medium transition",
              dark
                ? "border-white/25 text-white hover:bg-white/10"
                : "border-[var(--garden-leaf)]/25 text-[var(--garden-deep)] hover:bg-[var(--garden-leaf)]/8",
            )}
          >
            Staff
          </Link>
        </nav>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden",
            dark ? "bg-white/10" : "bg-[var(--garden-leaf)]/10",
          )}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={cn("block h-0.5 w-5", dark ? "bg-white" : "bg-[var(--garden-deep)]")} />
            <span className={cn("block h-0.5 w-5", dark ? "bg-white" : "bg-[var(--garden-deep)]")} />
            <span className={cn("block h-0.5 w-5", dark ? "bg-white" : "bg-[var(--garden-deep)]")} />
          </span>
        </button>
      </div>

      {open ? (
        <div
          className={cn(
            "mt-3 rounded-xl p-4 md:hidden",
            dark ? "bg-[var(--garden-deep)]/90 backdrop-blur" : "bg-white shadow-sm ring-1 ring-[var(--garden-leaf)]/10",
          )}
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/table/t1"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-[var(--garden-deep)] px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Order at table
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-md border border-[var(--garden-leaf)]/20 px-3 py-2.5 text-center text-sm"
            >
              Staff ops
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
