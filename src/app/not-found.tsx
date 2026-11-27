import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--garden-paper)]">
      <MarketingNav />
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-20 text-center md:px-10">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
          404
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--garden-deep)] md:text-6xl">
          This table is empty
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[var(--garden-ink)]/70">
          That page wandered off the patio. Head home, check the menu, or open
          guest order.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md bg-[var(--garden-deep)] px-5 text-sm font-semibold text-white"
          >
            Home
          </Link>
          <Link
            href="/menu"
            className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm font-medium"
          >
            Menu
          </Link>
          <Link
            href="/table/t1"
            className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm font-medium"
          >
            Order
          </Link>
        </div>
      </div>
      <MarketingFooter />
    </main>
  );
}
