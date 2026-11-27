import Link from "next/link";
import { restaurant } from "@/lib/demo-data";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--garden-leaf)]/12 bg-[var(--garden-deep)] text-[var(--garden-mist)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:px-10">
        <div>
          <p className="font-[family-name:var(--font-display)] text-3xl text-white">
            {restaurant.name}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--garden-mist)]/75">
            {restaurant.tagline}. Brunch, chiya, and garden plates in Lazimpat.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--garden-gold)]">
            Visit
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--garden-mist)]/85">
            {restaurant.address}
          </p>
          <p className="mt-2 text-sm text-[var(--garden-mist)]/85">
            {restaurant.hoursWeekday}
            <br />
            {restaurant.hoursWeekend}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--garden-gold)]">
            Links
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/menu" className="hover:text-white">
              Menu
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
            <Link href="/contact" className="hover:text-white">
              Reserve a table
            </Link>
            <Link href="/table/t1" className="hover:text-white">
              Guest order
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Staff
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
          <p className="mt-4 text-sm text-[var(--garden-mist)]/75">
            {restaurant.phone}
            <br />
            {restaurant.email}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[var(--garden-mist)]/55 md:px-10">
        © 2026 {restaurant.name}. Demo marketing site · Asia/Kathmandu.
      </div>
    </footer>
  );
}
