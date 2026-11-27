"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { restaurant } from "@/lib/demo-data";

const links = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Order" },
  { href: "/dashboard", label: "Staff" },
];

export function SiteNav({ tone = "light" }: { tone?: "light" | "dark" }) {
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "relative z-20 flex items-center justify-between gap-4 px-5 py-4 md:px-10",
        dark ? "text-[var(--garden-mist)]" : "text-[var(--garden-deep)]",
      )}
    >
      <Link href="/" className="group flex items-baseline gap-2">
        <span
          className={cn(
            "font-[family-name:var(--font-display)] text-xl tracking-tight md:text-2xl",
            dark ? "text-[var(--garden-mist)]" : "text-[var(--garden-deep)]",
          )}
        >
          {restaurant.name}
        </span>
        <span
          className={cn(
            "hidden text-[10px] uppercase tracking-[0.22em] sm:inline",
            dark ? "text-[var(--garden-mist)]/65" : "text-[var(--garden-leaf)]/80",
          )}
        >
          Kathmandu
        </span>
      </Link>
      <nav className="flex items-center gap-1 sm:gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? dark
                    ? "bg-white/15 text-white"
                    : "bg-[var(--garden-leaf)]/12 text-[var(--garden-deep)]"
                  : dark
                    ? "text-[var(--garden-mist)]/80 hover:bg-white/10 hover:text-white"
                    : "text-[var(--garden-deep)]/70 hover:bg-[var(--garden-leaf)]/8 hover:text-[var(--garden-deep)]",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
