import Image from "next/image";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { Reveal } from "@/components/marketing/reveal";
import {
  marketingAboutImage,
  marketingGallery,
  restaurant,
} from "@/lib/demo-data";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--garden-paper)]">
      <div className="relative min-h-[52vh] overflow-hidden text-white md:min-h-[60vh]">
        <Image
          src={marketingAboutImage}
          alt="Inside Garden Restaurant"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,46,31,0.5)_0%,rgba(15,46,31,0.75)_100%)]" />
        <div className="relative z-10">
          <MarketingNav tone="dark" />
          <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 md:px-10 md:pb-20">
            <p className="animate-rise text-xs uppercase tracking-[0.28em] text-white/70">
              About us
            </p>
            <h1 className="animate-rise-delay-1 mt-3 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-tight md:text-6xl">
              {restaurant.name}
            </h1>
            <p className="animate-rise-delay-2 mt-4 max-w-xl text-lg text-white/85">
              {restaurant.tagline}
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-5 py-16 md:px-10 md:py-24">
        {restaurant.storyLong.map((para, i) => (
          <Reveal key={i} delay={i * 80}>
            <p
              className={
                i === 0
                  ? "font-[family-name:var(--font-display)] text-2xl leading-snug text-[var(--garden-deep)] md:text-3xl"
                  : "mt-6 leading-relaxed text-[var(--garden-ink)]/75"
              }
            >
              {para}
            </p>
          </Reveal>
        ))}
      </section>

      <section className="border-y border-[var(--garden-leaf)]/10 bg-[var(--garden-mist)]/50 px-5 py-16 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
          {marketingGallery.slice(0, 3).map((img, i) => (
            <Reveal key={img.id} delay={i * 70}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="33vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-10 md:py-20">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--garden-deep)] md:text-4xl">
            Visit the patio
          </h2>
          <p className="mt-3 max-w-lg text-[var(--garden-ink)]/70">
            {restaurant.address} · {restaurant.hoursWeekday}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-md bg-[var(--garden-deep)] px-5 text-sm font-semibold text-white"
            >
              Plan a visit
            </Link>
            <Link
              href="/menu"
              className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm font-medium"
            >
              See the short menu
            </Link>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
