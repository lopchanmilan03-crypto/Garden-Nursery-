import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { ReservationForm } from "@/components/marketing/reservation-form";
import { Reveal } from "@/components/marketing/reveal";
import { restaurant } from "@/lib/demo-data";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--garden-paper)]">
      <div className="border-b border-[var(--garden-leaf)]/10 bg-[linear-gradient(180deg,#e7f0e9_0%,var(--garden-paper)_100%)]">
        <MarketingNav />
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-4 md:px-10 md:pb-16">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
              Contact · reservations
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--garden-deep)] md:text-6xl">
              Your table is waiting
            </h1>
            <p className="mt-4 max-w-xl text-[var(--garden-ink)]/70">
              Send a demo enquiry, call us, or walk in. Guest QR ordering is
              live for tables without a waiter login.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1fr_1.1fr] md:px-10 md:py-20">
        <Reveal>
          <div className="space-y-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
                Address
              </p>
              <p className="mt-2 text-[var(--garden-deep)]">{restaurant.address}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
                Hours
              </p>
              <p className="mt-2 text-[var(--garden-deep)]">
                {restaurant.hoursWeekday}
                <br />
                {restaurant.hoursWeekend}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--garden-leaf)]">
                Phone / email
              </p>
              <p className="mt-2 text-[var(--garden-deep)]">
                {restaurant.phone}
                <br />
                {restaurant.email}
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--garden-deep)] p-6 text-[var(--garden-mist)]">
              <p className="font-[family-name:var(--font-display)] text-2xl text-white">
                Already seated?
              </p>
              <p className="mt-2 text-sm text-white/75">
                Scan the table QR or open guest order — no staff login needed.
              </p>
              <a
                href="/table/t1"
                className="mt-5 inline-flex h-10 items-center rounded-md bg-[var(--garden-gold)] px-4 text-sm font-semibold text-[var(--garden-deep)]"
              >
                Open guest menu
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-[var(--garden-leaf)]/12 md:p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--garden-deep)]">
              Reservation enquiry
            </h2>
            <p className="mt-2 text-sm text-[var(--garden-ink)]/65">
              Demo form — submits locally, no email sent.
            </p>
            <div className="mt-6">
              <ReservationForm />
            </div>
          </div>
        </Reveal>
      </section>

      <MarketingFooter />
    </main>
  );
}
