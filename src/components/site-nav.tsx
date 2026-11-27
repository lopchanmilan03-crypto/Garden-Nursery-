"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { restaurant } from "@/lib/demo-data";
import { RoleSwitcher } from "@/components/role-switcher";

const links = [
  { href: "/", label: "Site" },
  { href: "/demo", label: "Waiter" },
  { href: "/table/t1", label: "Guest QR" },
  { href: "/kitchen", label: "Kitchen" },
  { href: "/dashboard", label: "Ops" },
  { href: "/admin", label: "Admin" },
];

export function SiteNav({
  tone = "light",
  showRoles = true,
}: {
  tone?: "light" | "dark";
  showRoles?: boolean;
}) {
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "relative z-20 flex flex-col gap-3 px-5 py-4 md:px-10",
        dark ? "text-[var(--garden-mist)]" : "text-[var(--garden-deep)]",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Link href="/dashboard" className="group flex items-baseline gap-2">
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
            Staff
          </span>
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
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
                  "rounded-md px-2.5 py-1.5 text-sm transition-colors sm:px-3 sm:py-2",
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
      </div>
      {showRoles && !dark ? <RoleSwitcher compact /> : null}
    </header>
  );
}
