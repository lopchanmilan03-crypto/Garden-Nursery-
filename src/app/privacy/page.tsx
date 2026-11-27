import Link from "next/link";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { restaurant } from "@/lib/demo-data";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--garden-paper)]">
      <MarketingNav />
      <article className="mx-auto max-w-3xl px-5 py-14 md:px-10 md:py-20">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--garden-leaf)]">
          Legal
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--garden-deep)] md:text-5xl">
          Privacy policy
        </h1>
        <div className="prose-garden mt-8 space-y-4 text-[var(--garden-ink)]/75 leading-relaxed">
          <p>
            This is a demo privacy notice for {restaurant.name}. The public site
            and cafe ops tools store sample data in your browser (
            <code className="text-sm">localStorage</code>) only. We do not
            operate a real backend for reservations or payments in this MVP.
          </p>
          <p>
            Reservation enquiry fields stay on your device for the demo
            confirmation screen and are not transmitted to a server. Guest QR
            orders and staff ops data sync across tabs in the same browser.
          </p>
          <p>
            If this demo were production, we would describe Nepal-relevant
            contact purposes, retention, and how to request deletion at{" "}
            {restaurant.email}.
          </p>
          <p>
            Questions? Email {restaurant.email} or call {restaurant.phone}.
          </p>
        </div>
        <Link
          href="/"
          className="mt-10 inline-flex text-sm font-semibold text-[var(--garden-leaf)] underline-offset-4 hover:underline"
        >
          ← Back home
        </Link>
      </article>
      <MarketingFooter />
    </main>
  );
}
