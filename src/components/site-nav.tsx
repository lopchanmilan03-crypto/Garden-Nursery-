"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { restaurant } from "@/lib/demo-data";

const links = [
  { href: "/", label: "Home" },
  { href: "/employee", label: "Employee" },
  { href: "/kitchen", label: "Kitchen" },
  { href: "/admin", label: "Admin" },
];

export function SiteNav({
  tone = "light",
}: {
  tone?: "light" | "dark";
  showRoles?: boolean;
}) {
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <header
      className={cn(
        "relative z-20 flex items-center justify-between gap-3 px-5 py-4",
        dark ? "text-[var(--garden-mist)]" : "text-[var(--garden-deep)]",
      )}
    >
      <Link href="/" className="font-[family-name:var(--font-display)] text-xl">
        {restaurant.name}
      </Link>
      <nav className="flex flex-wrap justify-end gap-1">
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
                "rounded-md px-2.5 py-1.5 text-sm",
                active
                  ? "bg-[var(--garden-leaf)]/12 text-[var(--garden-deep)]"
                  : "text-[var(--garden-deep)]/70",
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
