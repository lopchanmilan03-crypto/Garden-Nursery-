import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MenuBrowser } from "@/components/marketing/menu-browser";
import { Reveal } from "@/components/marketing/reveal";
import { restaurant } from "@/lib/demo-data";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[var(--garden-paper)]">
      <div className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e7f0e9_0%,var(--garden-paper)_100%)]">
        <MarketingNav />
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-4 md:px-10 md:pb-16">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
              Limited menu · NPR
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--garden-deep)] md:text-6xl">
              Coffee, plates, peace
            </h1>
            <p className="mt-4 max-w-xl text-[var(--garden-ink)]/70">
              A short mindful menu — filter by category. Prices and photos come
              from demo CMS data; edit them in{" "}
              <Link href="/admin" className="underline underline-offset-2">
                Admin
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16">
        <MenuBrowser />
        <div className="mt-14 flex flex-wrap gap-3 border-t border-[var(--garden-leaf)]/10 pt-10">
          <Link
            href="/table/t1"
            className="inline-flex h-11 items-center rounded-md bg-[var(--garden-deep)] px-5 text-sm font-semibold text-white"
          >
            Table menu
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm font-medium"
          >
            Reserve a table
          </Link>
          <p className="w-full text-sm text-[var(--garden-ink)]/55 md:w-auto md:self-center">
            {restaurant.hours}
          </p>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
