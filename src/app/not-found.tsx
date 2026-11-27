import Link from "next/link";
import { PhoneShell } from "@/components/phone-nav";

export default function NotFound() {
  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
          404
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-[var(--garden-ink)]/60">
          Staff tools only — pick a role on home.
        </p>
        <Link
          href="/"
          className="mt-8 flex min-h-14 w-full max-w-xs items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
        >
          Home
        </Link>
      </div>
    </PhoneShell>
  );
}
