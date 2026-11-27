"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  {
    href: "/order",
    label: "Order",
    match: (p: string) => p.startsWith("/order") || p.startsWith("/table"),
  },
  {
    href: "/staff",
    label: "Staff",
    match: (p: string) => p.startsWith("/staff") || p.startsWith("/admin"),
  },
] as const;

export function PhoneNav({
  tone = "light",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md",
        dark
          ? "border-white/10 bg-[var(--garden-deep)]/95"
          : "border-[var(--garden-leaf)]/12 bg-[var(--garden-paper)]/97",
      )}
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold tracking-wide",
                dark
                  ? active
                    ? "text-white"
                    : "text-white/45"
                  : active
                    ? "text-[var(--garden-deep)]"
                    : "text-[var(--garden-ink)]/45",
              )}
            >
              <span
                className={cn(
                  "h-1 w-8 rounded-full",
                  active ? "bg-[var(--garden-gold)]" : "bg-transparent",
                )}
              />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Phone-width shell used across the cafe app. */
export function PhoneShell({
  children,
  footer,
  className,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-[100svh] w-full max-w-md flex-col bg-[var(--garden-sand)] shadow-[0_0_0_1px_rgba(15,46,31,0.06)]",
        className,
      )}
    >
      <div className="relative flex flex-1 flex-col">{children}</div>
      {footer}
    </div>
  );
}
