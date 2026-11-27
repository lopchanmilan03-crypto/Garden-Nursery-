import Image from "next/image";
import Link from "next/link";
import { marketingAboutImage, restaurant } from "@/lib/demo-data";

export default function AboutPage() {
  return (
    <main className="min-h-[100svh] bg-[var(--garden-paper)]">
      <div className="relative h-48 overflow-hidden text-white sm:h-56">
        <Image
          src={marketingAboutImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--garden-deep)]/55" />
        <div className="relative z-10 flex h-full flex-col justify-between px-5 py-4 md:px-10">
          <Link href="/" className="text-sm text-white/80">
            ← Home
          </Link>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl">
              {restaurant.name}
            </h1>
            <p className="mt-1 text-sm text-white/80">{restaurant.tagline}</p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-lg px-5 py-10 md:px-10">
        <p className="text-base leading-relaxed text-[var(--garden-ink)]/80">
          {restaurant.storyLead} {restaurant.storyBody}
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
              Find us
            </dt>
            <dd className="mt-1 text-[var(--garden-deep)]">{restaurant.address}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
              Hours
            </dt>
            <dd className="mt-1 text-[var(--garden-deep)]">
              {restaurant.hoursWeekday}
              <br />
              {restaurant.hoursWeekend}
            </dd>
          </div>
        </dl>
        <Link
          href="/order"
          className="mt-10 flex min-h-14 items-center justify-center rounded-2xl bg-[var(--garden-deep)] text-base font-semibold text-white"
        >
          Order
        </Link>
      </section>
    </main>
  );
}
