import Image from "next/image";
import Link from "next/link";
import { PhoneNav, PhoneShell } from "@/components/phone-nav";
import { marketingHeroImage, restaurant } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <PhoneShell
      className="relative overflow-hidden text-white"
      footer={<PhoneNav tone="dark" />}
    >
      <Image
        src={marketingHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,46,31,0.45)_0%,rgba(15,46,31,0.88)_62%,rgba(15,46,31,0.96)_100%)]" />

      <div className="relative z-10 flex min-h-[100svh] flex-col px-5 pb-24 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <header className="pt-2">
          <p className="font-[family-name:var(--font-display)] text-[1.65rem] leading-none tracking-tight">
            {restaurant.name}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-white/60">
            {restaurant.location}
          </p>
        </header>

        <div className="mt-auto flex flex-col gap-3 pb-4">
          <p className="text-sm text-white/75">{restaurant.tagline}</p>
          <Link
            href="/order"
            className="flex min-h-[4.25rem] w-full items-center justify-center rounded-2xl bg-[var(--garden-gold)] text-xl font-semibold text-[var(--garden-deep)] active:scale-[0.99]"
          >
            Order
          </Link>
          <Link
            href="/staff"
            className="flex min-h-[4.25rem] w-full items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-xl font-semibold backdrop-blur-sm active:scale-[0.99]"
          >
            Staff
          </Link>
          <Link
            href="/about"
            className="py-2 text-center text-sm text-white/55 underline-offset-4 active:text-white"
          >
            About
          </Link>
        </div>
      </div>
    </PhoneShell>
  );
}
