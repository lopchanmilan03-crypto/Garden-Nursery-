import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { restaurant } from "@/lib/demo-data";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <section className="relative min-h-screen garden-atmosphere text-[var(--garden-mist)]">
        <div className="pointer-events-none absolute inset-0 leaf-veil animate-drift" />
        <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[var(--garden-moss)]/30 blur-3xl animate-glow" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-[var(--garden-gold)]/15 blur-3xl" />

        <SiteNav tone="dark" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-end px-5 pb-16 pt-10 md:justify-center md:px-10 md:pb-24">
          <p className="animate-rise text-xs uppercase tracking-[0.28em] text-[var(--garden-fog)]/80">
            Lazimpat · Asia/Kathmandu
          </p>
          <h1 className="animate-rise-delay-1 mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            {restaurant.name}
          </h1>
          <p className="animate-rise-delay-2 mt-5 max-w-md text-base leading-relaxed text-[var(--garden-mist)]/88 md:text-lg">
            {restaurant.subtitle}
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--garden-gold)] px-7 text-sm font-semibold text-[var(--garden-deep)] transition hover:brightness-105"
            >
              Start an order
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/25 bg-white/5 px-7 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/12"
            >
              Staff floor
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--garden-leaf)]/15 bg-[var(--garden-sand)] px-5 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)] md:text-4xl">
              {restaurant.tagline}
            </h2>
            <p className="mt-3 max-w-lg text-[var(--garden-ink)]/75">
              Browse the menu, send it to the kitchen, and settle with cash, card,
              or QR — sample payments only, ready for guest or staff use.
            </p>
          </div>
          <dl className="grid gap-4 text-sm text-[var(--garden-ink)]/80 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
                Hours
              </dt>
              <dd className="mt-1">{restaurant.hours}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
                Find us
              </dt>
              <dd className="mt-1">{restaurant.location}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
