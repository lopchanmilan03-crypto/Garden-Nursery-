import Image from "next/image";
import Link from "next/link";
import { marketingHeroImage, restaurant } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <main className="relative flex min-h-[100svh] flex-col overflow-hidden text-white">
      <Image
        src={marketingHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,46,31,0.62)_0%,rgba(15,46,31,0.78)_100%)]" />
      <div className="pointer-events-none absolute inset-0 leaf-veil opacity-35" />

      <div className="relative z-10 flex flex-1 flex-col px-5 py-6 md:px-10">
        <header className="mx-auto flex w-full max-w-lg items-center justify-between">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
              {restaurant.name}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/65">
              {restaurant.location}
            </p>
          </div>
          <Link
            href="/about"
            className="text-sm text-white/75 underline-offset-4 hover:text-white hover:underline"
          >
            About
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-10">
          <p className="text-sm text-white/80">{restaurant.tagline}</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
            Coffee & calm plates
          </h1>
          <p className="mt-3 text-base text-white/75">
            Lazimpat garden cafe · short menu · NPR
          </p>

          <div className="mt-10 grid gap-4">
            <Link
              href="/order"
              className="flex min-h-16 items-center justify-center rounded-2xl bg-[var(--garden-gold)] px-6 text-lg font-semibold text-[var(--garden-deep)] transition hover:brightness-105 active:scale-[0.99]"
            >
              Order
            </Link>
            <Link
              href="/staff"
              className="flex min-h-16 items-center justify-center rounded-2xl border border-white/35 bg-white/10 px-6 text-lg font-semibold backdrop-blur-sm transition hover:bg-white/16 active:scale-[0.99]"
            >
              Staff
            </Link>
          </div>

          <p className="mt-8 text-center text-xs text-white/55">
            {restaurant.hoursWeekday}
          </p>
        </div>
      </div>
    </main>
  );
}
