import Link from "next/link";
import { restaurant } from "@/lib/demo-data";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--garden-leaf)]/12 bg-[var(--garden-deep)] px-5 py-8 text-center text-sm text-[var(--garden-mist)]/75 md:px-10">
      <p className="font-[family-name:var(--font-display)] text-xl text-white">
        {restaurant.name}
      </p>
      <p className="mt-2">{restaurant.location}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Link href="/order" className="hover:text-white">
          Order
        </Link>
        <Link href="/staff" className="hover:text-white">
          Staff
        </Link>
        <Link href="/about" className="hover:text-white">
          About
        </Link>
        <Link href="/privacy" className="hover:text-white">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-white">
          Terms
        </Link>
      </div>
    </footer>
  );
}
