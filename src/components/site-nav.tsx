"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { restaurant } from "@/lib/demo-data";

const links = [
  { href: "/", label: "Home" },
  { href: "/order", label: "Order" },
  { href: "/staff", label: "Desk" },
  { href: "/admin", label: "Admin" },
];

export function SiteNav({
  tone = "light",
}: {
  tone?: "light" | "dark";
  /** @deprecated role switcher hidden on quiet desk */
  showRoles?: boolean;
}) {
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "relative z-20 flex items-center justify-between gap-3 px-5 py-4 md:px-10",
        dark ? "text-[var(--garden-mist)]" : "text-[var(--garden-deep)]",
      )}
    >
      <Link href="/staff" className="flex items-baseline gap-2">
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
          Admin
        </span>
      </Link>
      <nav className="flex flex-wrap items-center justify-end gap-1">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm transition-colors sm:px-3",
                active
                  ? dark
                    ? "bg-white/15 text-white"
                    : "bg-[var(--garden-leaf)]/12 text-[var(--garden-deep)]"
                  : dark
                    ? "text-[var(--garden-mist)]/80 hover:bg-white/10"
                    : "text-[var(--garden-deep)]/70 hover:bg-[var(--garden-leaf)]/8",
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
