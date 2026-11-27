import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import {
  dashboardStats,
  demoOrders,
  demoTables,
  restaurant,
  type OrderStatus,
  type TableSeat,
} from "@/lib/demo-data";
import { formatNpr } from "@/lib/utils";

const statusLabel: Record<OrderStatus, string> = {
  new: "New",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
  paid: "Paid",
};

const statusTone: Record<OrderStatus, string> = {
  new: "bg-amber-100 text-amber-900",
  preparing: "bg-[var(--garden-fog)] text-[var(--garden-deep)]",
  ready: "bg-emerald-100 text-emerald-900",
  served: "bg-slate-100 text-slate-700",
  paid: "bg-slate-200/80 text-slate-600",
};

const tableTone: Record<TableSeat["status"], string> = {
  open: "border-[var(--garden-moss)]/40 bg-white text-[var(--garden-deep)]",
  seated: "border-amber-300/60 bg-amber-50 text-amber-950",
  ordered: "border-[var(--garden-leaf)]/35 bg-[var(--garden-fog)] text-[var(--garden-deep)]",
  clearing: "border-slate-300 bg-slate-50 text-slate-600",
};

export default function DashboardPage() {
  const stats = dashboardStats();

  return (
    <main className="min-h-screen bg-[var(--garden-sand)]">
      <div className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e8f2ea_0%,#f4f8f5_100%)]">
        <SiteNav />
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-2 md:px-10">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--garden-leaf)]">
            Staff overview · sample data
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
                Today at {restaurant.name}
              </h1>
              <p className="mt-2 max-w-xl text-[var(--garden-ink)]/70">
                Open tables, live orders, and quick status — built for floor staff
                taking guest orders.
              </p>
            </div>
            <Link
              href="/demo"
              className="inline-flex h-11 items-center rounded-md bg-[var(--garden-leaf)] px-5 text-sm font-medium text-[var(--garden-mist)] transition hover:bg-[var(--garden-deep)]"
            >
              New order
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Stat
              label="Open tables"
              value={`${stats.openTables}/${stats.totalTables}`}
            />
            <Stat label="Active tickets" value={String(stats.activeOrders)} />
            <Stat label="Cleared today" value={formatNpr(stats.revenueToday)} />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 md:px-10 lg:grid-cols-[1fr_1.15fr]">
        <section>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Floor tables
            </h2>
            <span className="text-xs text-[var(--garden-ink)]/55">Live demo</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {demoTables.map((table) => (
              <div
                key={table.id}
                className={`rounded-lg border px-4 py-3 transition ${tableTone[table.status]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{table.label}</p>
                  <span className="text-[10px] uppercase tracking-[0.16em] opacity-70">
                    {table.status}
                  </span>
                </div>
                <p className="mt-2 text-sm opacity-75">{table.seats} seats</p>
                {table.orderId ? (
                  <p className="mt-1 font-mono text-xs opacity-60">{table.orderId}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Today&apos;s orders
            </h2>
            <span className="text-xs text-[var(--garden-ink)]/55">
              Newest first
            </span>
          </div>
          <ul className="space-y-3">
            {demoOrders.map((order) => (
              <li
                key={order.id}
                className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white/80 px-4 py-3 shadow-[0_1px_0_rgba(15,46,31,0.04)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[var(--garden-deep)]">
                      {order.guest}
                      <span className="ml-2 font-mono text-xs text-[var(--garden-ink)]/45">
                        {order.id}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-[var(--garden-ink)]/65">
                      {order.type === "dine-in"
                        ? `Table ${order.table}`
                        : "Takeaway"}{" "}
                      · {order.placedAt}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${statusTone[order.status]}`}
                  >
                    {statusLabel[order.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[var(--garden-ink)]/75">
                  {order.items.join(" · ")}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--garden-deep)]">
                  {formatNpr(order.total)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--garden-leaf)]/12 bg-white/70 px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--garden-leaf)]">
        {label}
      </p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
        {value}
      </p>
    </div>
  );
}
