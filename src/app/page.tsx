import Image from "next/image";
import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MenuBrowser } from "@/components/marketing/menu-browser";
import { ReservationForm } from "@/components/marketing/reservation-form";
import { Reveal } from "@/components/marketing/reveal";
import {
  marketingAboutImage,
  marketingGallery,
  marketingHeroImage,
  restaurant,
  testimonials,
} from "@/lib/demo-data";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--garden-paper)]">
      {/* Hero — one composition, brand first, full-bleed image */}
      <section className="relative min-h-[100svh] overflow-hidden text-white">
        <Image
          src={marketingHeroImage}
          alt="Garden Restaurant patio dining"
          fill
          priority
          sizes="100vw"
          className="object-cover animate-kenburns"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,46,31,0.55)_0%,rgba(15,46,31,0.35)_40%,rgba(15,46,31,0.78)_100%)]" />
        <div className="pointer-events-none absolute inset-0 leaf-veil opacity-40 animate-drift" />

        <div className="relative z-10 flex min-h-[100svh] flex-col">
          <MarketingNav tone="dark" />
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-16 pt-10 md:justify-center md:px-10 md:pb-24">
            <p className="animate-rise text-xs uppercase tracking-[0.32em] text-white/70">
              {restaurant.location}
            </p>
            <h1 className="animate-rise-delay-1 mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              {restaurant.name}
            </h1>
            <p className="animate-rise-delay-2 mt-5 max-w-md text-base leading-relaxed text-white/88 md:text-lg">
              {restaurant.heroSupport}
            </p>
            <div className="animate-rise-delay-2 mt-9 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md bg-[var(--garden-gold)] px-7 text-sm font-semibold text-[var(--garden-deep)] transition hover:brightness-105"
              >
                Reserve a table
              </Link>
              <Link
                href="/menu"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 bg-white/5 px-7 text-sm font-medium backdrop-blur-sm transition hover:bg-white/12"
              >
                View menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src={marketingAboutImage}
                alt="Garden Restaurant dining room"
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
              Our story
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
              {restaurant.storyTitle}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--garden-ink)]/80">
              {restaurant.storyLead}
            </p>
            <p className="mt-4 leading-relaxed text-[var(--garden-ink)]/70">
              {restaurant.storyBody}
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex text-sm font-semibold text-[var(--garden-leaf)] underline-offset-4 hover:underline"
            >
              Read more
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Menu preview */}
      <section className="border-y border-[var(--garden-leaf)]/10 bg-[var(--garden-mist)]/60 px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
              From our menu
            </p>
            <h2 className="mt-3 max-w-xl font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
              Plates worth lingering over
            </h2>
            <p className="mt-4 max-w-lg text-[var(--garden-ink)]/70">
              Nepali cafe classics and garden brunch — prices in NPR, editable
              from Admin like a simple CMS.
            </p>
          </Reveal>
          <div className="mt-10">
            <MenuBrowser limit={6} showFilters={false} />
          </div>
          <div className="mt-10">
            <Link
              href="/menu"
              className="inline-flex h-11 items-center rounded-md bg-[var(--garden-deep)] px-6 text-sm font-semibold text-white"
            >
              View full menu
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
              Gallery
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
              The kind of place you stay a little longer
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {marketingGallery.map((img, i) => (
              <Reveal
                key={img.id}
                delay={i * 60}
                className={i === 0 || i === 5 ? "md:row-span-1" : ""}
              >
                <figure className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width:768px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.05]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--garden-deep)]/70 to-transparent px-3 py-3 text-xs text-white/90 opacity-0 transition group-hover:opacity-100">
                    {img.caption}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="garden-atmosphere px-5 py-20 text-[var(--garden-mist)] md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-end">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-gold)]">
              Come visit us
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-white md:text-5xl">
              Come by for chiya. Stay for brunch.
            </h2>
            <p className="mt-4 max-w-md text-white/75">
              Walk-ins welcome. Reserve when you want a quieter corner of the
              patio.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-gold)]">
                  Hours
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/85">
                  {restaurant.hoursWeekday}
                  <br />
                  {restaurant.hoursWeekend}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-gold)]">
                  Find us
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/85">
                  {restaurant.address}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
              Testimonials
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
              Words from our guests
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <blockquote className="h-full border-l-2 border-[var(--garden-moss)] pl-5">
                  <p className="font-[family-name:var(--font-display)] text-xl leading-snug text-[var(--garden-deep)]">
                    “{t.quote}”
                  </p>
                  <footer className="mt-5 text-sm text-[var(--garden-ink)]/65">
                    <span className="font-semibold text-[var(--garden-deep)]">
                      {t.name}
                    </span>
                    <span className="mx-2">·</span>
                    {t.detail}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section className="border-t border-[var(--garden-leaf)]/10 bg-[var(--garden-mist)]/50 px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-start">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
              Save your seat
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
              Your table is waiting
            </h2>
            <p className="mt-4 max-w-md text-[var(--garden-ink)]/70">
              Send a demo enquiry — or order from your table via guest QR.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/table/t1"
                className="inline-flex h-11 items-center rounded-md border border-[var(--garden-leaf)]/25 px-5 text-sm font-medium text-[var(--garden-deep)]"
              >
                Order at table
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center rounded-md px-5 text-sm font-medium text-[var(--garden-leaf)] underline-offset-4 hover:underline"
              >
                Staff login →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <ReservationForm />
          </Reveal>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
