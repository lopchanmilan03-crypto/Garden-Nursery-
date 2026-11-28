"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useOps } from "@/lib/ops-store";
import { cn } from "@/lib/utils";
import type { AuthRole } from "@/lib/demo-data";

export type NavTab = {
  href?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  logout?: boolean;
};

function defaultTabs(role: AuthRole | null, pathname: string): NavTab[] {
  if (role === "kitchen") {
    return [
      {
        href: "/kitchen",
        label: "Board",
        active: pathname.startsWith("/kitchen"),
      },
      { href: "/kitchen", label: "Stock", active: false },
      { label: "Out", logout: true },
    ];
  }
  if (role === "cashier") {
    return [
      {
        href: "/cashier",
        label: "Cashier",
        active: pathname.startsWith("/cashier"),
      },
      {
        href: "/employee",
        label: "Order",
        active: pathname.startsWith("/employee"),
      },
      { label: "Out", logout: true },
    ];
  }
  if (role === "staff") {
    return [
      {
        href: "/employee",
        label: "Order",
        active:
          pathname.startsWith("/employee") ||
          pathname.startsWith("/order") ||
          pathname.startsWith("/staff"),
      },
      {
        href: "/cashier",
        label: "Cashier",
        active: pathname.startsWith("/cashier"),
      },
      { href: "/employee", label: "Stock", active: false },
      { label: "Out", logout: true },
    ];
  }
  return [
    {
      href: "/admin",
      label: "Dash",
      active: pathname.startsWith("/admin") || pathname.startsWith("/dashboard"),
    },
    {
      href: "/cashier",
      label: "Cashier",
      active: pathname.startsWith("/cashier"),
    },
    {
      href: "/employee",
      label: "Floor",
      active:
        pathname.startsWith("/employee") ||
        pathname.startsWith("/order") ||
        pathname.startsWith("/staff"),
    },
    {
      href: "/kitchen",
      label: "Kitchen",
      active: pathname.startsWith("/kitchen"),
    },
    { label: "Out", logout: true },
  ];
}

export function PhoneNav({
  tone = "light",
  tabs: tabsOverride,
}: {
  tone?: "light" | "dark";
  tabs?: NavTab[];
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useOps();
  const role = state.session?.role ?? null;
  const dark = tone === "dark";
  const tabs = tabsOverride ?? defaultTabs(role, pathname);

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md",
        dark
          ? "border-white/10 bg-[var(--garden-deep)]/95"
          : "border-[var(--garden-leaf)]/12 bg-[var(--garden-paper)]/97",
      )}
    >
      <div
        className={cn(
          "mx-auto grid max-w-md",
          tabs.length === 3
            ? "grid-cols-3"
            : tabs.length === 5
              ? "grid-cols-5"
              : "grid-cols-4",
        )}
      >
        {tabs.map((tab) => {
          if (tab.logout) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={handleLogout}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold tracking-wide",
                  dark ? "text-white/45" : "text-[var(--garden-ink)]/45",
                )}
              >
                <span className="h-1 w-7 rounded-full bg-transparent" />
                {tab.label}
              </button>
            );
          }
          if (tab.onClick) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={tab.onClick}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold tracking-wide",
                  dark
                    ? tab.active
                      ? "text-white"
                      : "text-white/45"
                    : tab.active
                      ? "text-[var(--garden-deep)]"
                      : "text-[var(--garden-ink)]/45",
                )}
              >
                <span
                  className={cn(
                    "h-1 w-7 rounded-full",
                    tab.active ? "bg-[var(--garden-gold)]" : "bg-transparent",
                  )}
                />
                {tab.label}
              </button>
            );
          }
          return (
            <Link
              key={`${tab.href}-${tab.label}`}
              href={tab.href ?? "/"}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold tracking-wide",
                dark
                  ? tab.active
                    ? "text-white"
                    : "text-white/45"
                  : tab.active
                    ? "text-[var(--garden-deep)]"
                    : "text-[var(--garden-ink)]/45",
              )}
            >
              <span
                className={cn(
                  "h-1 w-7 rounded-full",
                  tab.active ? "bg-[var(--garden-gold)]" : "bg-transparent",
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

/** Phone-width shell for the staff app. */
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
